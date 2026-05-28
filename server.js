const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const root = __dirname;
const dataDir = process.env.DATA_DIR || root;
const dataFile = path.join(dataDir, "data.json");
const port = Number(process.env.PORT || 8787);
const syncToken = process.env.SYNC_TOKEN || "";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/api/data") {
      if (!isAuthorized(req)) {
        sendJson(res, 401, { error: "unauthorized" });
        return;
      }

      if (req.method === "GET") {
        sendJson(res, 200, readData());
        return;
      }

      if (req.method === "POST") {
        const body = await readBody(req);
        const parsed = JSON.parse(body || "{}");
        if (!Array.isArray(parsed.phones) || !Array.isArray(parsed.records)) {
          sendJson(res, 400, { error: "bad data" });
          return;
        }
        fs.writeFileSync(dataFile, JSON.stringify(parsed, null, 2), "utf8");
        sendJson(res, 200, { ok: true });
        return;
      }

      sendJson(res, 405, { error: "method not allowed" });
      return;
    }

    serveStatic(url.pathname, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

server.listen(port, "0.0.0.0", () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Sync server running: http://localhost:${port}`);
  for (const address of localAddresses()) {
    console.log(`LAN address: http://${address}:${port}`);
  }
  if (!syncToken) {
    console.log("Warning: SYNC_TOKEN is not set. Set it before exposing this server to the internet.");
  }
});

function isAuthorized(req) {
  if (!syncToken) return true;
  return req.headers["x-sync-token"] === syncToken;
}

function readData() {
  if (!fs.existsSync(dataFile)) return {};
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        reject(new Error("body too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function serveStatic(pathname, res) {
  const cleanPath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const filePath = path.normalize(path.join(root, cleanPath));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

function sendJson(res, status, value) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(value));
}

function localAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === "IPv4" && !item.internal)
    .map((item) => item.address);
}
