const defaultPlatforms = [
  "\u6296\u97f3",
  "\u5fae\u4fe1",
  "\u652f\u4ed8\u5b9d",
  "\u9489\u9489",
  "\u95f2\u9c7c",
  "\u6dd8\u5b9d",
  "\u963f\u91cc\u62cd\u5356",
  "\u4eac\u4e1c",
  "\u5c0f\u7ea2\u4e66",
  "\u8fde\u4fe1",
  "\u5fae\u4fe1\u5c0f\u7a0b\u5e8f",
  "blued",
  "soul",
  "\u63a2\u63a2",
];

const statuses = [
  { value: "sold_pending_cancel", label: "\u5df2\u552e\u5f85\u6ce8\u9500", tone: "sold" },
  { value: "sold_blocked", label: "\u5df2\u552e\u5df2\u5c01\u7981", tone: "blocked" },
  { value: "sold_verify", label: "\u5df2\u552e\u8df3\u9a8c\u8bc1", tone: "review" },
  { value: "sold_realname", label: "\u5df2\u552e\u88ab\u5b9e\u540d", tone: "review" },
  { value: "cancelled_pending_register", label: "\u5df2\u6ce8\u9500\u5f85\u6ce8\u518c", tone: "available" },
  { value: "cancelled_registerable", label: "\u5df2\u6ce8\u9500\u53ef\u6ce8\u518c", tone: "available" },
  { value: "own", label: "\u81ea\u7528", tone: "own" },
  { value: "cannot_register", label: "\u65e0\u6cd5\u6ce8\u518c", tone: "blocked" },
];

const contactPlatforms = ["\u95f2\u9c7c", "QQ", "\u5fae\u4fe1"];

const storageKey = "phone-sales-manager-v1";
const syncEnabled = location.protocol === "http:" || location.protocol === "https:";
const githubSyncKey = `${storageKey}-github-sync`;

const makeId = () => {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const demoData = {
  phones: [
    { id: makeId(), number: "13294936354", cardFee: 0, initialRecharge: 0, monthlyRent: 39, laborCost: 0, carrier: "\u8054\u901a", cardOwner: "", deviceNo: "A01", slotNo: "1" },
    { id: makeId(), number: "13294931680", cardFee: 0, initialRecharge: 0, monthlyRent: 10, laborCost: 0, carrier: "\u8054\u901a", cardOwner: "", deviceNo: "A01", slotNo: "2" },
    { id: makeId(), number: "13187442010", cardFee: 0, initialRecharge: 0, monthlyRent: 19, laborCost: 0, carrier: "\u8054\u901a", cardOwner: "", deviceNo: "A02", slotNo: "1" },
  ],
  records: [],
};

demoData.records = [
  record(demoData.phones[0], "\u6296\u97f3", "sold_pending_cancel", 70, "\u5fae\u4fe1", "\u5927\u5e08", "2026-05-30", "\u5df2\u6ce8\u9500"),
  record(demoData.phones[0], "\u5fae\u4fe1", "own", 0, "\u5fae\u4fe1", "\u9ad8\u624b", "", "\u81ea\u7528"),
  record(demoData.phones[0], "\u6dd8\u5b9d", "cancelled_registerable", 25, "QQ", "And", "2026-04-26", "\u5df2\u6ce8\u9500"),
  record(demoData.phones[0], "\u5c0f\u7ea2\u4e66", "sold_blocked", 20, "\u95f2\u9c7c", "", "", "\u5df2\u5c01"),
  record(demoData.phones[1], "\u6296\u97f3", "cancelled_registerable", 50, "\u95f2\u9c7c", "", "2026-05-03", "\u5df2\u6ce8\u9500\uff0c\u53ef\u6ce8\u518c"),
  record(demoData.phones[1], "\u5fae\u4fe1", "sold_realname", 60, "QQ", "\u54ed", "", "\u88ab\u5b9e\u540d"),
  record(demoData.phones[1], "\u963f\u91cc\u62cd\u5356", "sold_pending_cancel", 25, "\u5fae\u4fe1", "\u4e45\u946b", "", ""),
  record(demoData.phones[1], "\u5c0f\u7ea2\u4e66", "cancelled_registerable", 25, "QQ", "\u547d\u4e2d\u6709\u6728", "2026-05-08", "\u53ef\u6ce8\u518c"),
  record(demoData.phones[2], "\u6296\u97f3", "cancelled_registerable", 60, "QQ", "\u5947\u602a", "2026-05-25", "\u53ef\u6ce8\u518c"),
  record(demoData.phones[2], "\u5fae\u4fe1", "sold_realname", 60, "QQ", "\u54ed", "", "\u88ab\u5b9e\u540d"),
  record(demoData.phones[2], "\u95f2\u9c7c", "own", 0, "\u95f2\u9c7c", "", "", "\u81ea\u5df1\u5c01\u7981"),
  record(demoData.phones[2], "\u4eac\u4e1c", "sold_verify", 0, "\u95f2\u9c7c", "", "", "\u8df3\u9a8c\u8bc1"),
];

let data = normalizeData({ ...cloneData(demoData), platforms: [...defaultPlatforms] });
let platforms = data.platforms || [...defaultPlatforms];
let editingId = null;

const form = document.querySelector("#recordForm");
const els = {
  phoneCount: document.querySelector("#phoneCount"),
  recordCount: document.querySelector("#recordCount"),
  soldTotal: document.querySelector("#soldTotal"),
  availableCount: document.querySelector("#availableCount"),
  blockedCount: document.querySelector("#blockedCount"),
  costTotal: document.querySelector("#costTotal"),
  cancelDueCount: document.querySelector("#cancelDueCount"),
  formTotalCost: document.querySelector("#formTotalCost"),
  formCancelHint: document.querySelector("#formCancelHint"),
  phoneOptions: document.querySelector("#phoneOptions"),
  quickPhoneList: document.querySelector("#quickPhoneList"),
  platformSelect: form.elements.platform,
  statusSelect: form.elements.status,
  platformFilter: document.querySelector("#platformFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  searchInput: document.querySelector("#searchInput"),
  matrixTable: document.querySelector("#matrixTable"),
  recordList: document.querySelector("#recordList"),
  phoneList: document.querySelector("#phoneList"),
  financeCost: document.querySelector("#financeCost"),
  financeSold: document.querySelector("#financeSold"),
  financeProfit: document.querySelector("#financeProfit"),
  appFinanceTable: document.querySelector("#appFinanceTable"),
  phoneFinanceTable: document.querySelector("#phoneFinanceTable"),
  template: document.querySelector("#recordTemplate"),
};

boot();

function record(phone, platform, status, price, contactPlatform, nickname, date, note) {
  return {
    id: makeId(),
    phoneId: phone.id,
    platform,
    status,
    price,
    contacts: contactPlatform ? [{ platform: contactPlatform, nickname }] : [],
    contactPlatforms: contactPlatform ? [contactPlatform] : [],
    contactPlatform,
    nickname,
    date,
    note,
    updatedAt: new Date().toISOString(),
  };
}

function init() {
  fillOptions();
  bindEvents();
  clearForm();
  render();
}

async function boot() {
  data = await loadData();
  platforms = data.platforms || [...defaultPlatforms];
  init();
  if (syncEnabled) persist();
}

function fillOptions() {
  els.platformSelect.innerHTML = platforms.map((name) => option(name)).join("");
  els.statusSelect.innerHTML = statuses.map((item) => option(item.label, item.value)).join("");
  els.platformFilter.innerHTML = option("\u5168\u90e8APP", "all") + platforms.map((name) => option(name)).join("");
  els.statusFilter.innerHTML = option("\u5168\u90e8\u72b6\u6001", "all") + statuses.map((item) => option(item.label, item.value)).join("");
}

function option(label, value = label) {
  return `<option value="${escapeAttr(value)}">${escapeHtml(label)}</option>`;
}

function addAppOption() {
  const name = prompt("\u8f93\u5165\u65b0APP\u540d\u79f0");
  const appName = String(name || "").trim();
  if (!appName) return;
  if (platforms.includes(appName)) {
    form.elements.platform.value = appName;
    return;
  }
  platforms.push(appName);
  data.platforms = platforms;
  persist();
  fillOptions();
  form.elements.platform.value = appName;
  els.platformFilter.value = "all";
  render();
}

function deleteAppOption() {
  const appName = form.elements.platform.value;
  if (!appName) return;
  const recordCount = data.records.filter((item) => item.platform === appName).length;
  const message = recordCount
    ? `\u786e\u5b9a\u5220\u9664 APP\u300c${appName}\u300d\u5417\uff1f\u8fd9\u4f1a\u540c\u65f6\u5220\u9664 ${recordCount} \u6761\u8be5 APP \u7684\u8bb0\u5f55\u3002`
    : `\u786e\u5b9a\u5220\u9664 APP\u300c${appName}\u300d\u5417\uff1f`;
  if (!confirm(message)) return;
  platforms = platforms.filter((item) => item !== appName);
  data.records = data.records.filter((item) => item.platform !== appName);
  data.platforms = platforms;
  persist();
  fillOptions();
  form.elements.platform.value = platforms[0] || "";
  els.platformFilter.value = "all";
  render();
}

function bindEvents() {
  form.addEventListener("submit", saveRecord);
  document.querySelector("#clearFormBtn").addEventListener("click", clearForm);
  document.querySelector("#addAppBtn").addEventListener("click", addAppOption);
  document.querySelector("#deleteAppBtn").addEventListener("click", deleteAppOption);
  document.querySelector("#githubSyncBtn").addEventListener("click", setupGitHubSync);
  document.querySelector("#resetDemoBtn").addEventListener("click", () => {
    data = { ...cloneData(demoData), platforms: [...platforms] };
    persist();
    fillOptions();
    clearForm();
    render();
  });
  document.querySelector("#exportBtn").addEventListener("click", exportData);
  document.querySelector("#importFile").addEventListener("change", importData);
  ["cardFee", "initialRecharge", "monthlyRent", "laborCost"].forEach((name) => {
    form.elements[name].addEventListener("input", renderFormCost);
  });
  ["date", "cancelAfterDays"].forEach((name) => {
    form.elements[name].addEventListener("input", renderFormCancelHint);
  });
  form.elements.phone.addEventListener("change", () => selectPhoneProfile(form.elements.phone.value));
  form.elements.phone.addEventListener("blur", () => selectPhoneProfile(form.elements.phone.value));
  els.searchInput.addEventListener("input", render);
  els.platformFilter.addEventListener("change", render);
  els.statusFilter.addEventListener("change", render);
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });
}

function saveRecord(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());
  const contacts = contactRowsFromForm(formData);
  const phoneNumber = values.phone.trim();
  let phone = data.phones.find((item) => item.number === phoneNumber);

  if (!phone) {
    phone = {
      id: makeId(),
      number: phoneNumber,
      cardFee: moneyValue(values.cardFee),
      initialRecharge: moneyValue(values.initialRecharge),
      monthlyRent: moneyValue(values.monthlyRent),
      laborCost: moneyValue(values.laborCost),
      carrier: values.carrier.trim(),
      cardOwner: values.cardOwner.trim(),
      deviceNo: values.deviceNo.trim(),
      slotNo: values.slotNo.trim(),
    };
    data.phones.push(phone);
  } else {
    phone.cardFee = moneyField(values.cardFee, phone.cardFee);
    phone.initialRecharge = moneyField(values.initialRecharge, phone.initialRecharge);
    phone.monthlyRent = moneyField(values.monthlyRent, phone.monthlyRent);
    phone.laborCost = moneyField(values.laborCost, phone.laborCost);
    phone.carrier = values.carrier.trim() || phone.carrier || "";
    phone.cardOwner = values.cardOwner.trim() || phone.cardOwner || "";
    phone.deviceNo = values.deviceNo.trim() || phone.deviceNo || "";
    phone.slotNo = values.slotNo.trim() || phone.slotNo || "";
  }

  const nextRecord = {
    id: editingId || makeId(),
    phoneId: phone.id,
    platform: values.platform,
    status: values.status,
    price: Number(values.price || 0),
    contacts,
    contactPlatforms: contacts.map((item) => item.platform),
    contactPlatform: contacts[0]?.platform || "",
    nickname: contacts[0]?.nickname || "",
    date: values.date,
    cancelAfterDays: wholeNumber(values.cancelAfterDays),
    note: values.note.trim(),
    updatedAt: new Date().toISOString(),
  };

  const index = data.records.findIndex((item) => item.id === editingId);
  if (index >= 0) {
    data.records[index] = nextRecord;
  } else {
    data.records.push(nextRecord);
  }

  persist();
  clearForm();
  render();
}

function render() {
  const visible = filteredRecords();
  renderStats();
  renderPhoneOptions();
  renderQuickPhoneList();
  renderMatrix(visible);
  renderRecords(visible);
  renderPhones(visible);
  renderFinance();
}

function renderStats() {
  const sold = soldRecords();
  els.phoneCount.textContent = data.phones.length;
  els.recordCount.textContent = data.records.length;
  els.soldTotal.textContent = currency(recordsTotal(sold));
  els.availableCount.textContent = data.records.filter((item) => normalizeStatus(item.status) === "cancelled_registerable").length;
  els.blockedCount.textContent = data.records.filter((item) => normalizeStatus(item.status) === "cannot_register").length;
  els.costTotal.textContent = currency(sum(data.phones.map(phoneTotalCost)));
  els.cancelDueCount.textContent = cancelDueRecords().length;
}

function renderFinance() {
  const totalCost = totalPhoneCost();
  const soldTotal = recordsTotal(soldRecords());
  const profit = soldTotal - totalCost;
  els.financeCost.textContent = currency(totalCost);
  els.financeSold.textContent = currency(soldTotal);
  els.financeProfit.textContent = currency(profit);
  els.financeProfit.classList.toggle("negative", profit < 0);
  renderAppFinance();
  renderPhoneFinance();
}

function renderAppFinance() {
  const rows = platforms.map((platform) => {
    const records = data.records.filter((item) => item.platform === platform);
    const sold = records.filter(isSoldRecord);
    const income = recordsTotal(sold);
    return {
      name: platform,
      records: records.length,
      sold: sold.length,
      income,
    };
  }).filter((row) => row.records || row.income);

  els.appFinanceTable.innerHTML = financeTable(
    ["APP", "\u8bb0\u5f55", "\u5df2\u552e", "\u5df2\u552e\u91d1\u989d"],
    rows.map((row) => [row.name, row.records, row.sold, currency(row.income)]),
    4,
  );
}

function renderPhoneFinance() {
  const rows = data.phones.map((phone) => {
    const records = data.records.filter((item) => item.phoneId === phone.id);
    const sold = records.filter(isSoldRecord);
    const income = recordsTotal(sold);
    const cost = phoneTotalCost(phone);
    return {
      phone,
      records: records.length,
      income,
      cost,
      profit: income - cost,
    };
  }).filter((row) => row.records || row.cost || row.income);

  els.phoneFinanceTable.innerHTML = financeTable(
    ["\u624b\u673a\u53f7", "\u6210\u672c", "\u5df2\u552e\u91d1\u989d", "\u5229\u6da6"],
    rows.map((row) => [
      `${row.phone.number}${row.phone.carrier ? ` · ${row.phone.carrier}` : ""}${row.phone.cardOwner ? ` · ${row.phone.cardOwner}` : ""}`,
      currency(row.cost),
      currency(row.income),
      { html: `<span class="${row.profit < 0 ? "negative" : ""}">${currency(row.profit)}</span>` },
    ]),
    4,
  );
}

function financeTable(headers, rows, colspan) {
  const head = `<tr>${headers.map((item) => `<th>${escapeHtml(item)}</th>`).join("")}</tr>`;
  if (!rows.length) return `${head}<tr><td colspan="${colspan}" class="empty-state">\u6682\u65e0\u8d22\u52a1\u6570\u636e</td></tr>`;
  return head + rows.map((row) => `<tr>${row.map((item) => {
    if (typeof item === "object" && item.html) return `<td>${item.html}</td>`;
    return `<td>${escapeHtml(item)}</td>`;
  }).join("")}</tr>`).join("");
}

function renderPhoneOptions() {
  els.phoneOptions.innerHTML = data.phones
    .map((phone) => `<option value="${escapeAttr(phone.number)}">${escapeHtml(phoneSummary(phone))}</option>`)
    .join("");
}

function renderQuickPhoneList() {
  const phones = data.phones.slice(0, 8);
  els.quickPhoneList.innerHTML = phones.length
    ? phones.map((phone) => `<button type="button" class="quick-phone" data-phone="${escapeAttr(phone.number)}">${escapeHtml(phone.number)}</button>`).join("")
    : `<span>\u6682\u65e0\u5df2\u5b58\u624b\u673a\u53f7</span>`;
  els.quickPhoneList.querySelectorAll(".quick-phone").forEach((button) => {
    button.addEventListener("click", () => selectPhoneProfile(button.dataset.phone));
  });
}

function renderMatrix(records) {
  const recordsByPhonePlatform = new Map();
  records.forEach((item) => {
    const key = `${item.phoneId}-${item.platform}`;
    if (!recordsByPhonePlatform.has(key)) recordsByPhonePlatform.set(key, []);
    recordsByPhonePlatform.get(key).push(item);
  });
  const header = `<tr><th>\u624b\u673a\u53f7</th>${platforms.map((name) => `<th>${escapeHtml(name)}</th>`).join("")}</tr>`;
  const rows = data.phones
    .filter((phone) => phoneMatches(phone, records))
    .map((phone) => {
      const cells = platforms.map((platform) => {
        const items = recordsByPhonePlatform.get(`${phone.id}-${platform}`) || [];
        if (!items.length) {
          return `<td><div class="cell empty" data-phone="${escapeAttr(phone.number)}" data-platform="${escapeAttr(platform)}">+</div></td>`;
        }
        const entries = items.map((item) => `<div class="cell-entry ${statusTone(item.status)}" data-record="${item.id}">
            <strong>${escapeHtml(statusLabel(item.status))}${item.price ? ` · ${currency(item.price)}` : ""}</strong>
            <span>${escapeHtml([contactText(item), item.date].filter(Boolean).join(" / "))}</span>
            <span>${escapeHtml(cancelText(item))}</span>
            <span>${escapeHtml(item.note || "")}</span>
          </div>`).join("");
        return `<td><div class="cell filled">${entries}<button class="cell-add" type="button" data-phone="${escapeAttr(phone.number)}" data-platform="${escapeAttr(platform)}">+ \u8ffd\u52a0</button></div></td>`;
      });
      return `<tr><td>${escapeHtml(phone.number)}<br><span>${escapeHtml(phoneSummary(phone))}</span></td>${cells.join("")}</tr>`;
    })
    .join("");

  els.matrixTable.innerHTML = header + (rows || `<tr><td colspan="${platforms.length + 1}" class="empty-state">\u6ca1\u6709\u5339\u914d\u8bb0\u5f55</td></tr>`);
  els.matrixTable.querySelectorAll("[data-record]").forEach((cell) => {
    cell.addEventListener("click", () => editRecord(cell.dataset.record));
  });
  els.matrixTable.querySelectorAll(".cell.empty").forEach((cell) => {
    cell.addEventListener("click", () => {
      selectPhoneProfile(cell.dataset.phone);
      form.elements.platform.value = cell.dataset.platform;
      form.elements.status.value = "cancelled_registerable";
      form.elements.price.focus();
    });
  });
  els.matrixTable.querySelectorAll(".cell-add").forEach((button) => {
    button.addEventListener("click", () => {
      editingId = null;
      selectPhoneProfile(button.dataset.phone);
      form.elements.platform.value = button.dataset.platform;
      form.elements.status.value = "cancelled_registerable";
      form.elements.price.focus();
    });
  });
}

function renderRecords(records) {
  els.recordList.innerHTML = "";
  if (!records.length) {
    els.recordList.innerHTML = `<p class="empty-state">\u6ca1\u6709\u5339\u914d\u8bb0\u5f55</p>`;
    return;
  }

  records
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .forEach((item) => {
      const phone = phoneById(item.phoneId);
      const node = els.template.content.cloneNode(true);
      node.querySelector(".record-title").textContent = `${phone?.number || "\u672a\u77e5\u624b\u673a\u53f7"} · ${item.platform}`;
      node.querySelector(".record-meta").textContent = [
        item.price ? currency(item.price) : "",
        contactText(item),
        item.date,
        cancelText(item),
      ].filter(Boolean).join(" / ");
      node.querySelector(".record-note").textContent = item.note || "\u65e0\u5907\u6ce8";
      const badge = node.querySelector(".badge");
      badge.textContent = statusLabel(item.status);
      badge.classList.add(statusTone(item.status));
      if (cancelState(item).isDue) node.querySelector(".record-card").classList.add("cancel-due");
      node.querySelector(".edit-record").addEventListener("click", () => editRecord(item.id));
      node.querySelector(".delete-record").addEventListener("click", () => deleteRecord(item.id));
      els.recordList.appendChild(node);
    });
}

function renderPhones(records) {
  const counts = new Map();
  records.forEach((item) => counts.set(item.phoneId, (counts.get(item.phoneId) || 0) + 1));
  const phones = data.phones.filter((phone) => phoneMatches(phone, records));
  els.phoneList.innerHTML = phones.length
    ? phones.map((phone) => `<article class="phone-card">
        <strong>${escapeHtml(phone.number)} ${phone.carrier ? `· ${escapeHtml(phone.carrier)}` : ""}</strong>
        <p>${escapeHtml(phone.cardOwner ? `\u5f00\u5361\u4eba\uff1a${phone.cardOwner}` : "\u672a\u586b\u5199\u5f00\u5361\u4eba")}</p>
        <p>${escapeHtml(costBreakdown(phone))}</p>
        <p>\u603b\u6210\u672c\uff1a${currency(phoneTotalCost(phone))}</p>
        <p>${escapeHtml(deviceSummary(phone))}</p>
        <p>\u5f53\u524d\u7b5b\u9009\u4e0b ${counts.get(phone.id) || 0} \u6761\u5e73\u53f0\u8bb0\u5f55</p>
        <div class="card-actions">
          <button class="text-button select-phone" type="button" data-phone-id="${escapeAttr(phone.id)}">\u9009\u62e9</button>
          <button class="danger-button delete-phone" type="button" data-phone-id="${escapeAttr(phone.id)}">\u5220\u9664\u624b\u673a\u53f7</button>
        </div>
      </article>`).join("")
    : `<p class="empty-state">\u6ca1\u6709\u5339\u914d\u624b\u673a\u53f7</p>`;

  els.phoneList.querySelectorAll(".select-phone").forEach((button) => {
    button.addEventListener("click", () => {
      const phone = phoneById(button.dataset.phoneId);
      if (phone) fillPhoneFields(phone);
    });
  });
  els.phoneList.querySelectorAll(".delete-phone").forEach((button) => {
    button.addEventListener("click", () => deletePhone(button.dataset.phoneId));
  });
}

function filteredRecords() {
  const text = els.searchInput.value.trim().toLowerCase();
  const platform = els.platformFilter.value;
  const status = els.statusFilter.value;
  return data.records.filter((item) => {
    const phone = phoneById(item.phoneId);
    const haystack = [phone?.number, phoneSummary(phone), phone?.carrier, phone?.cardOwner, phone?.deviceNo, phone?.slotNo, item.platform, contactText(item), item.note, statusLabel(item.status)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return (!text || haystack.includes(text)) &&
      (platform === "all" || item.platform === platform) &&
      (status === "all" || item.status === status);
  });
}

function phoneMatches(phone, records) {
  const text = els.searchInput.value.trim().toLowerCase();
  if (!text) return true;
  return [phone.number, phoneSummary(phone), phone.carrier, phone.cardOwner, phone.deviceNo, phone.slotNo].filter(Boolean).join(" ").toLowerCase().includes(text) ||
    records.some((item) => item.phoneId === phone.id);
}

function editRecord(id) {
  const item = data.records.find((recordItem) => recordItem.id === id);
  if (!item) return;
  const phone = phoneById(item.phoneId);
  editingId = id;
  fillPhoneFields(phone);
  form.elements.platform.value = item.platform;
  form.elements.status.value = normalizeStatus(item.status);
  form.elements.price.value = item.price || "";
  setContactRows(contactEntries(item));
  form.elements.date.value = item.date || "";
  form.elements.cancelAfterDays.value = item.cancelAfterDays || "";
  form.elements.note.value = item.note || "";
  form.querySelector(".primary-button").textContent = "\u66f4\u65b0\u8bb0\u5f55";
  renderFormCost();
  renderFormCancelHint();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectPhoneProfile(phoneNumber) {
  const phone = phoneByNumber(phoneNumber.trim());
  if (!phone) return;
  fillPhoneFields(phone);
}

function fillPhoneFields(phone) {
  if (!phone) return;
  form.elements.phone.value = phone.number || "";
  form.elements.cardFee.value = displayNumber(phone.cardFee);
  form.elements.initialRecharge.value = displayNumber(phone.initialRecharge);
  form.elements.monthlyRent.value = displayNumber(phone.monthlyRent);
  form.elements.laborCost.value = displayNumber(phone.laborCost);
  form.elements.carrier.value = phone.carrier || "";
  form.elements.cardOwner.value = phone.cardOwner || "";
  form.elements.deviceNo.value = phone.deviceNo || "";
  form.elements.slotNo.value = phone.slotNo || "";
  renderFormCost();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteRecord(id) {
  data.records = data.records.filter((item) => item.id !== id);
  persist();
  render();
}

function deletePhone(id) {
  const phone = phoneById(id);
  if (!phone) return;
  const recordCount = data.records.filter((item) => item.phoneId === id).length;
  const message = `\u786e\u5b9a\u5220\u9664\u624b\u673a\u53f7 ${phone.number} \u5417\uff1f\u8fd9\u4f1a\u540c\u65f6\u5220\u9664 ${recordCount} \u6761\u5e73\u53f0\u8bb0\u5f55\u3002`;
  if (!confirm(message)) return;
  data.phones = data.phones.filter((item) => item.id !== id);
  data.records = data.records.filter((item) => item.phoneId !== id);
  if (form.elements.phone.value === phone.number) clearForm();
  persist();
  render();
}

function clearForm() {
  editingId = null;
  form.reset();
  setContactRows([]);
  form.elements.date.valueAsDate = new Date();
  form.querySelector(".primary-button").textContent = "\u4fdd\u5b58\u8bb0\u5f55";
  renderFormCost();
  renderFormCancelHint();
}

function switchView(view) {
  document.querySelectorAll(".tab").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  document.querySelectorAll(".view").forEach((item) => item.classList.toggle("active", item.id === `${view}View`));
}

async function loadData() {
  if (syncEnabled) {
    const remote = await loadRemoteData();
    if (remote) return remote;
  }
  const githubRemote = await loadGitHubData();
  if (githubRemote) return githubRemote;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return normalizeData({ ...cloneData(demoData), platforms: [...defaultPlatforms] });
  try {
    const parsed = JSON.parse(raw);
    return parsed.phones && parsed.records ? normalizeData(parsed) : normalizeData({ ...cloneData(demoData), platforms: [...defaultPlatforms] });
  } catch {
    return normalizeData({ ...cloneData(demoData), platforms: [...defaultPlatforms] });
  }
}

function persist() {
  data.platforms = platforms;
  localStorage.setItem(storageKey, JSON.stringify(data));
  if (syncEnabled) saveRemoteData();
  saveGitHubData();
}

async function setupGitHubSync() {
  const current = getGitHubConfig();
  const repo = prompt("GitHub\u4ed3\u5e93\uff0c\u683c\u5f0f\uff1a\u7528\u6237\u540d/\u4ed3\u5e93\u540d", current.repo || "fight4ever4freedom/phone-sales-sync");
  if (!repo) return;
  const branch = prompt("\u5206\u652f\u540d", current.branch || "main") || "main";
  const token = prompt("GitHub Token\uff08\u53ea\u9700\u8981\u8fd9\u4e2a\u4ed3\u5e93\u7684 Contents \u8bfb\u5199\u6743\u9650\uff09", current.token || "");
  if (!token) return;
  localStorage.setItem(githubSyncKey, JSON.stringify({
    repo: repo.trim(),
    branch: branch.trim(),
    token: token.trim(),
    path: "data.json",
  }));
  const remote = await loadGitHubData();
  if (remote) {
    if (confirm("\u5df2\u627e\u5230 GitHub \u4e0a\u7684\u6570\u636e\uff0c\u662f\u5426\u62c9\u53d6\u5e76\u8986\u76d6\u5f53\u524d\u9875\u9762\u6570\u636e\uff1f")) {
      data = remote;
      platforms = data.platforms || [...defaultPlatforms];
      fillOptions();
      persist();
      render();
    }
  } else if (confirm("GitHub \u4e0a\u8fd8\u6ca1\u6709 data.json\uff0c\u662f\u5426\u628a\u5f53\u524d\u6570\u636e\u4e0a\u4f20\uff1f")) {
    await saveGitHubData(true);
    alert("\u5df2\u4e0a\u4f20\u5230 GitHub\u3002");
  }
}

function getGitHubConfig() {
  try {
    return JSON.parse(localStorage.getItem(githubSyncKey) || "{}");
  } catch {
    return {};
  }
}

async function loadGitHubData() {
  const config = getGitHubConfig();
  if (!config.repo || !config.token) return null;
  try {
    const response = await fetch(gitHubContentUrl(config), {
      cache: "no-store",
      headers: gitHubHeaders(config),
    });
    if (response.status === 404) return null;
    if (!response.ok) return null;
    const file = await response.json();
    const parsed = JSON.parse(decodeBase64(file.content || ""));
    return parsed.phones && parsed.records ? normalizeData(parsed) : null;
  } catch {
    return null;
  }
}

async function saveGitHubData(showErrors = false) {
  const config = getGitHubConfig();
  if (!config.repo || !config.token) return;
  try {
    const current = await fetch(gitHubContentUrl(config), {
      cache: "no-store",
      headers: gitHubHeaders(config),
    });
    const body = {
      message: `sync data ${new Date().toISOString()}`,
      content: encodeBase64(JSON.stringify(data, null, 2)),
      branch: config.branch || "main",
    };
    if (current.ok) {
      const file = await current.json();
      body.sha = file.sha;
    }
    const response = await fetch(gitHubContentUrl(config), {
      method: "PUT",
      headers: {
        ...gitHubHeaders(config),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok && showErrors) alert("\u4e0a\u4f20 GitHub \u5931\u8d25\uff0c\u8bf7\u68c0\u67e5 Token \u6743\u9650\u3002");
  } catch {
    if (showErrors) alert("\u4e0a\u4f20 GitHub \u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u3002");
  }
}

function gitHubContentUrl(config) {
  const path = config.path || "data.json";
  const branch = encodeURIComponent(config.branch || "main");
  return `https://api.github.com/repos/${config.repo}/contents/${path}?ref=${branch}`;
}

function gitHubHeaders(config) {
  return {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${config.token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeBase64(value) {
  const binary = atob(String(value).replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function loadRemoteData() {
  try {
    let response = await fetch("/api/data", {
      cache: "no-store",
      headers: syncHeaders(),
    });
    if (response.status === 401) {
      askSyncToken();
      response = await fetch("/api/data", {
        cache: "no-store",
        headers: syncHeaders(),
      });
    }
    if (!response.ok) return null;
    const remote = await response.json();
    return remote.phones && remote.records ? normalizeData(remote) : null;
  } catch {
    return null;
  }
}

async function saveRemoteData() {
  try {
    let response = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...syncHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      askSyncToken();
      await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...syncHeaders(),
        },
        body: JSON.stringify(data),
      });
    }
  } catch {
    // Keep localStorage as an offline fallback. The next successful save will sync.
  }
}

function syncHeaders() {
  const token = localStorage.getItem(`${storageKey}-sync-token`);
  return token ? { "X-Sync-Token": token } : {};
}

function askSyncToken() {
  const token = prompt("\u8bf7\u8f93\u5165\u540c\u6b65\u5bc6\u7801");
  if (token) localStorage.setItem(`${storageKey}-sync-token`, token.trim());
}

function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `phone-sales-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const next = JSON.parse(reader.result);
      if (!Array.isArray(next.phones) || !Array.isArray(next.records)) throw new Error("bad data");
      data = normalizeData(next);
      platforms = data.platforms;
      fillOptions();
      persist();
      render();
    } catch {
      alert("\u5bfc\u5165\u5931\u8d25\uff1a\u8bf7\u9009\u62e9\u672c\u5de5\u5177\u5bfc\u51fa\u7684 JSON \u6587\u4ef6\u3002");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function phoneById(id) {
  return data.phones.find((phone) => phone.id === id);
}

function phoneByNumber(number) {
  return data.phones.find((phone) => phone.number === number);
}

function statusLabel(value) {
  const normalized = normalizeStatus(value);
  return statuses.find((item) => item.value === normalized)?.label || value;
}

function statusTone(value) {
  const normalized = normalizeStatus(value);
  return statuses.find((item) => item.value === normalized)?.tone || "review";
}

function normalizeStatus(value) {
  const legacy = {
    sold: "sold_pending_cancel",
    available: "cancelled_registerable",
    blocked: "cannot_register",
    review: "sold_verify",
  };
  return legacy[value] || value;
}

function sum(items) {
  return items.reduce((total, item) => total + Number(item || 0), 0);
}

function isSoldRecord(item) {
  return normalizeStatus(item.status).startsWith("sold_");
}

function soldRecords() {
  return data.records.filter(isSoldRecord);
}

function recordsTotal(records) {
  return sum(records.map((item) => item.price));
}

function totalPhoneCost() {
  return sum(data.phones.map(phoneTotalCost));
}

function moneyValue(value) {
  return Number(value || 0) || 0;
}

function moneyField(value, fallback) {
  if (String(value ?? "").trim() === "") return moneyValue(fallback);
  return moneyValue(value);
}

function displayNumber(value) {
  return Number(value || 0) ? String(Number(value)) : "";
}

function wholeNumber(value) {
  return Math.max(0, Math.floor(Number(value || 0) || 0));
}

function phoneTotalCost(phone) {
  return sum([
    phone?.cardFee,
    phone?.initialRecharge,
    phone?.monthlyRent,
    phone?.laborCost,
  ]);
}

function costBreakdown(phone) {
  if (!phone) return "";
  if (phone.sim && !phone.cardFee && !phone.initialRecharge && !phone.monthlyRent && !phone.laborCost) {
    return phone.sim;
  }
  return [
    `\u5361\u8d39 ${currency(phone.cardFee)}`,
    `\u9996\u5145 ${currency(phone.initialRecharge)}`,
    `\u6708\u79df ${currency(phone.monthlyRent)}`,
    `\u4eba\u5de5 ${currency(phone.laborCost)}`,
  ].join(" / ");
}

function phoneSummary(phone) {
  return [phone?.carrier, phone?.cardOwner ? `\u5f00\u5361\u4eba ${phone.cardOwner}` : "", deviceSummary(phone), `\u6210\u672c ${currency(phoneTotalCost(phone))}`].filter(Boolean).join(" · ");
}

function contactText(item) {
  return contactEntries(item)
    .map((contact) => [contact.platform, contact.nickname].filter(Boolean).join(" / "))
    .join(" + ");
}

function contactEntries(item) {
  if (Array.isArray(item?.contacts)) {
    return item.contacts.filter((contact) => contact.platform);
  }
  if (Array.isArray(item?.contactPlatforms)) {
    return item.contactPlatforms
      .filter(Boolean)
      .map((platform, index) => ({
        platform,
        nickname: index === 0 ? (item.nickname || stripLegacyContact(item.buyer)) : "",
      }));
  }
  if (item?.contactPlatform) {
    return [{ platform: item.contactPlatform, nickname: item.nickname || stripLegacyContact(item.buyer) }];
  }
  if (item?.buyer) {
    return [{ platform: inferContactPlatform(item.buyer), nickname: stripLegacyContact(item.buyer) }];
  }
  return [];
}

function contactRowsFromForm(formData) {
  return contactPlatforms
    .filter((platform) => formData.getAll("contactPlatform").includes(platform))
    .map((platform) => ({
      platform,
      nickname: String(formData.get(contactNicknameField(platform)) || "").trim(),
    }));
}

function setContactRows(contacts) {
  const byPlatform = new Map(contacts.map((contact) => [contact.platform, contact.nickname || ""]));
  contactPlatforms.forEach((platform) => {
    const checkbox = Array.from(form.querySelectorAll('input[name="contactPlatform"]'))
      .find((input) => input.value === platform);
    const nicknameInput = form.elements[contactNicknameField(platform)];
    if (checkbox) checkbox.checked = byPlatform.has(platform);
    if (nicknameInput) nicknameInput.value = byPlatform.get(platform) || "";
  });
}

function contactNicknameField(platform) {
  if (platform === "\u95f2\u9c7c") return "contactNickname_xianyu";
  if (platform === "QQ") return "contactNickname_qq";
  return "contactNickname_wechat";
}

function cancelDueRecords() {
  return data.records.filter((item) => cancelState(item).isDue);
}

function cancelText(item) {
  const state = cancelState(item);
  if (!state.dueDate) return "";
  if (state.isDue) return `\u53ef\u6ce8\u9500\uff1a${state.dueDate}`;
  return `\u5f85\u6ce8\u9500\uff1a${state.dueDate}`;
}

function cancelState(item) {
  const days = wholeNumber(item?.cancelAfterDays);
  if (!item?.date || !days) return { dueDate: "", isDue: false };
  const due = addDays(item.date, days);
  const dueDate = formatDate(due);
  return {
    dueDate,
    isDue: due.getTime() <= startOfToday().getTime(),
  };
}

function addDays(dateText, days) {
  const date = parseDate(dateText);
  date.setDate(date.getDate() + days);
  return date;
}

function parseDate(dateText) {
  const [year, month, day] = String(dateText).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderFormCancelHint() {
  const date = form.elements.date.value;
  const days = wholeNumber(form.elements.cancelAfterDays.value);
  if (!date || !days) {
    els.formCancelHint.textContent = "\u672a\u8bbe\u7f6e\u6ce8\u9500\u63d0\u9192";
    els.formCancelHint.classList.remove("due");
    return;
  }
  const state = cancelState({ date, cancelAfterDays: days });
  els.formCancelHint.textContent = state.isDue
    ? `\u5df2\u5230\u53ef\u6ce8\u9500\u65f6\u95f4\uff1a${state.dueDate}`
    : `\u53ef\u6ce8\u9500\u65f6\u95f4\uff1a${state.dueDate}`;
  els.formCancelHint.classList.toggle("due", state.isDue);
}

function inferContactPlatform(value = "") {
  const text = String(value).toLowerCase();
  if (text.includes("qq") || text.includes("(q)") || text.includes("\uff08q\uff09")) return "QQ";
  if (text.includes("wx") || text.includes("\u5fae\u4fe1")) return "\u5fae\u4fe1";
  if (text.includes("\u95f2\u9c7c") || text.includes("xy")) return "\u95f2\u9c7c";
  return "\u95f2\u9c7c";
}

function stripLegacyContact(value = "") {
  return String(value)
    .replace(/\((wx|qq|q|xy)\)/gi, "")
    .replace(/\uff08(wx|qq|q|xy)\uff09/gi, "")
    .replace(/wx|qq|\u5fae\u4fe1|\u95f2\u9c7c/gi, "")
    .trim();
}

function deviceSummary(phone) {
  const parts = [];
  if (phone?.deviceNo) parts.push(`\u8bbe\u5907 ${phone.deviceNo}`);
  if (phone?.slotNo) parts.push(`\u5361\u69fd ${phone.slotNo}`);
  return parts.join(" / ");
}

function renderFormCost() {
  const total = ["cardFee", "initialRecharge", "monthlyRent", "laborCost"]
    .map((name) => moneyValue(form.elements[name].value))
    .reduce((next, item) => next + item, 0);
  els.formTotalCost.textContent = currency(total);
}

function normalizeData(next) {
  const mergedPlatforms = uniqueList([
    ...defaultPlatforms,
    ...(Array.isArray(next.platforms) ? next.platforms : []),
    ...(Array.isArray(next.records) ? next.records.map((item) => item.platform) : []),
  ].filter(Boolean));
  return {
    platforms: mergedPlatforms,
    phones: next.phones.map((phone) => ({
      ...phone,
      cardFee: moneyValue(phone.cardFee),
      initialRecharge: moneyValue(phone.initialRecharge),
      monthlyRent: moneyValue(phone.monthlyRent),
      laborCost: moneyValue(phone.laborCost),
      carrier: phone.carrier || phone.tag || "",
      cardOwner: phone.cardOwner || "",
      deviceNo: phone.deviceNo || "",
      slotNo: phone.slotNo || "",
    })),
    records: next.records.map((item) => ({
      ...item,
      status: normalizeStatus(item.status),
      contacts: contactEntries(item),
      contactPlatforms: Array.isArray(item.contactPlatforms)
        ? item.contactPlatforms
        : item.contactPlatform
          ? [item.contactPlatform]
          : item.buyer
            ? [inferContactPlatform(item.buyer)]
            : [],
      contactPlatform: item.contactPlatform || (item.buyer ? inferContactPlatform(item.buyer) : ""),
      nickname: item.nickname || stripLegacyContact(item.buyer),
      cancelAfterDays: wholeNumber(item.cancelAfterDays),
    })),
  };
}

function uniqueList(items) {
  return [...new Set(items.map((item) => String(item).trim()).filter(Boolean))];
}

function currency(value) {
  return `¥${Number(value || 0).toLocaleString("zh-CN")}`;
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}
