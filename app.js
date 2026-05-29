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
  { value: "sold_blocked", label: "\u5df2\u552e\u5df2\u5c01\u7981", tone: "sold-blocked" },
  { value: "sold_verify", label: "\u5df2\u552e\u8df3\u9a8c\u8bc1", tone: "review" },
  { value: "sold_realname", label: "\u5df2\u552e\u88ab\u5b9e\u540d", tone: "realname-blocked" },
  { value: "testing", label: "\u5f85\u6d4b\u8bd5", tone: "review" },
  { value: "cancelled_pending_register", label: "\u5df2\u6ce8\u9500\u5f85\u6ce8\u518c", tone: "available" },
  { value: "cancelled_registerable", label: "\u5df2\u6ce8\u9500\u53ef\u6ce8\u518c", tone: "registerable" },
  { value: "cancelled_registered", label: "\u5df2\u6ce8\u9500\u5df2\u6ce8\u518c", tone: "registered" },
  { value: "own", label: "\u81ea\u7528", tone: "own" },
  { value: "own_blocked", label: "\u81ea\u7528\u5df2\u5c01\u7981", tone: "own-blocked" },
  { value: "cannot_register", label: "\u65e0\u6cd5\u6ce8\u518c", tone: "cannot-register" },
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
    { id: makeId(), number: "13294936354", cardFee: 0, initialRecharge: 0, monthlyRent: 39, personName: "", personCost: 0, carrier: "\u8054\u901a", deviceNo: "A01", slotNo: "1" },
    { id: makeId(), number: "13294931680", cardFee: 0, initialRecharge: 0, monthlyRent: 10, personName: "", personCost: 0, carrier: "\u8054\u901a", deviceNo: "A01", slotNo: "2" },
    { id: makeId(), number: "13187442010", cardFee: 0, initialRecharge: 0, monthlyRent: 19, personName: "", personCost: 0, carrier: "\u8054\u901a", deviceNo: "A02", slotNo: "1" },
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
let copiedRecord = null;
let selectedPhoneLookupId = "";
const undoStack = [];

const form = document.querySelector("#recordForm");
const els = {
  phoneCount: document.querySelector("#phoneCount"),
  recordCount: document.querySelector("#recordCount"),
  soldTotal: document.querySelector("#soldTotal"),
  availableCount: document.querySelector("#availableCount"),
  blockedCount: document.querySelector("#blockedCount"),
  costTotal: document.querySelector("#costTotal"),
  loginCheckDueCount: document.querySelector("#loginCheckDueCount"),
  cancelDueCount: document.querySelector("#cancelDueCount"),
  formTotalCost: document.querySelector("#formTotalCost"),
  priceLabel: document.querySelector("#priceLabel"),
  formLoginCheckHint: document.querySelector("#formLoginCheckHint"),
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
  peopleStats: document.querySelector("#peopleStats"),
  archivedPhoneList: document.querySelector("#archivedPhoneList"),
  financeCost: document.querySelector("#financeCost"),
  financeSold: document.querySelector("#financeSold"),
  financeProfit: document.querySelector("#financeProfit"),
  monthFinanceTable: document.querySelector("#monthFinanceTable"),
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
    actualCancelDate: "",
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
  pushUndo();
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
  pushUndo();
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
    pushUndo();
    data = { ...cloneData(demoData), platforms: [...platforms] };
    persist();
    fillOptions();
    clearForm();
    render();
  });
  document.querySelector("#exportBtn").addEventListener("click", exportData);
  document.querySelector("#importFile").addEventListener("change", importData);
  ["cardFee", "initialRecharge", "monthlyRent", "personCost"].forEach((name) => {
    form.elements[name].addEventListener("input", renderFormCost);
  });
  form.elements.carrier.addEventListener("input", applyCarrierCategory);
  form.elements.date.addEventListener("input", renderReminderHints);
  form.elements.loginCheckAfterDays.addEventListener("input", renderFormLoginCheckHint);
  form.elements.cancelAfterDays.addEventListener("input", renderFormCancelHint);
  form.elements.status.addEventListener("change", updatePriceLabel);
  form.elements.phone.addEventListener("change", () => selectPhoneProfile(form.elements.phone.value));
  form.elements.phone.addEventListener("blur", () => selectPhoneProfile(form.elements.phone.value));
  els.searchInput.addEventListener("input", render);
  els.platformFilter.addEventListener("change", render);
  els.statusFilter.addEventListener("change", render);
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });
  document.addEventListener("keydown", handleUndoShortcut);
}

function saveRecord(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());
  const contacts = contactRowsFromForm(formData);
  const phoneNumber = values.phone.trim();
  const carrier = values.carrier.trim();
  const cardCategory = values.cardCategory || inferCardCategory(carrier);
  if (carrier && !cardCategory) {
    alert("\u65b0\u8fd0\u8425\u5546\u5fc5\u987b\u9009\u62e9\u5361\u7c7b\u578b\uff1a\u4e09\u7f51\u5385\u5361\u6216\u6ce8\u518c\u5361\u3002");
    form.elements.cardCategory.focus();
    return;
  }
  let phone = data.phones.find((item) => item.number === phoneNumber);

  if (!phone) {
    phone = {
      id: makeId(),
      number: phoneNumber,
      cardFee: moneyValue(values.cardFee),
      initialRecharge: moneyValue(values.initialRecharge),
      monthlyRent: moneyValue(values.monthlyRent),
      personName: values.personName.trim(),
      personCost: moneyValue(values.personCost),
      carrier,
      cardCategory,
      deviceNo: values.deviceNo.trim(),
      slotNo: values.slotNo.trim(),
    };
    data.phones.push(phone);
  } else {
    phone.cardFee = moneyField(values.cardFee, phone.cardFee);
    phone.initialRecharge = moneyField(values.initialRecharge, phone.initialRecharge);
    phone.monthlyRent = moneyField(values.monthlyRent, phone.monthlyRent);
    phone.personName = values.personName.trim() || phone.personName || "";
    phone.personCost = moneyField(values.personCost, phone.personCost);
    phone.carrier = carrier || phone.carrier || "";
    phone.cardCategory = cardCategory || phone.cardCategory || inferCardCategory(phone.carrier);
    phone.deviceNo = values.deviceNo.trim() || phone.deviceNo || "";
    phone.slotNo = values.slotNo.trim() || phone.slotNo || "";
  }

  if (isBlockedPhonePlatform(phone, values.platform)) {
    alert(blockedPlatformText(phone, values.platform) + "\uff0c\u8fd9\u4e2a\u77e9\u9635\u683c\u65e0\u6cd5\u9009\u62e9\u3002");
    return;
  }

  const nextRecord = {
    id: editingId || makeId(),
    phoneId: phone.id,
    platform: values.platform,
    status: values.status,
    price: values.status === "testing" ? 0 : Number(values.price || 0),
    statusNote: values.status === "testing" ? values.price.trim() : "",
    contacts,
    contactPlatforms: contacts.map((item) => item.platform),
    contactPlatform: contacts[0]?.platform || "",
    nickname: contacts[0]?.nickname || "",
    date: values.date,
    loginCheckAfterDays: wholeNumber(values.loginCheckAfterDays),
    cancelAfterDays: wholeNumber(values.cancelAfterDays),
    registerableDate: values.registerableDate,
    actualCancelDate: values.actualCancelDate,
    note: values.note.trim(),
    loginCheckLogs: editingId ? cloneData(data.records.find((item) => item.id === editingId)?.loginCheckLogs || []) : [],
    updatedAt: new Date().toISOString(),
  };

  const index = data.records.findIndex((item) => item.id === editingId);
  pushUndo();
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
  renderPeopleStats();
  renderArchivedPhones(visible);
  renderFinance();
}

function renderStats() {
  els.phoneCount.textContent = data.phones.filter(isActivePhone).length;
  els.soldTotal.textContent = cancelDueRecords().length;
  els.availableCount.textContent = loginCheckDueRecords().length;
  els.blockedCount.textContent = currency(monthSoldTotal());
  els.costTotal.textContent = currency(sum(data.phones.map(phoneTotalCost)));
  els.loginCheckDueCount.textContent = loginCheckDueRecords().length;
  els.cancelDueCount.textContent = cancelDueRecords().length;
}

function renderFinance() {
  const totalCost = totalPhoneCost();
  const soldTotal = recordsTotal(paidRecords());
  const profit = soldTotal - totalCost;
  els.financeCost.textContent = currency(totalCost);
  els.financeSold.textContent = currency(soldTotal);
  els.financeProfit.textContent = currency(profit);
  els.financeProfit.classList.toggle("negative", profit < 0);
  renderMonthFinance();
  renderAppFinance();
  renderPhoneFinance();
}

function renderMonthFinance() {
  const monthMap = new Map();
  const firstRecordMonthByPhone = new Map();

  data.records.forEach((item) => {
    const month = recordMonth(item);
    if (!month) return;
    if (!firstRecordMonthByPhone.has(item.phoneId) || month < firstRecordMonthByPhone.get(item.phoneId)) {
      firstRecordMonthByPhone.set(item.phoneId, month);
    }
    const row = ensureMonthRow(monthMap, month);
    row.records += 1;
    if (hasRecordPrice(item)) {
      row.sold += 1;
      row.income += Number(item.price || 0);
    }
  });

  data.phones.forEach((phone) => {
    const month = firstRecordMonthByPhone.get(phone.id);
    if (!month) return;
    ensureMonthRow(monthMap, month).cost += phoneTotalCost(phone);
  });

  const rows = [...monthMap.values()]
    .map((row) => ({ ...row, profit: row.income - row.cost }))
    .sort((a, b) => b.month.localeCompare(a.month));

  els.monthFinanceTable.innerHTML = financeTable(
    ["\u6708\u4efd", "\u8bb0\u5f55", "\u5df2\u552e", "\u6210\u672c", "\u5df2\u552e\u91d1\u989d", "\u5229\u6da6"],
    rows.map((row) => [
      row.month,
      row.records,
      row.sold,
      currency(row.cost),
      currency(row.income),
      { html: `<span class="${row.profit < 0 ? "negative" : ""}">${currency(row.profit)}</span>` },
    ]),
    6,
  );
}

function renderAppFinance() {
  const rows = platforms.map((platform) => {
    const records = data.records.filter((item) => item.platform === platform);
    const sold = records.filter(hasRecordPrice);
    const income = platformSoldIncome(platform);
    return {
      name: platform,
      records: records.length,
      sold: sold.length,
      income,
    };
  }).filter((row) => row.records || row.income)
    .sort((a, b) => b.income - a.income);

  els.appFinanceTable.innerHTML = financeTable(
    ["APP", "\u8bb0\u5f55", "\u5df2\u552e", "\u5df2\u552e\u91d1\u989d"],
    rows.map((row) => [row.name, row.records, row.sold, currency(row.income)]),
    4,
  );
}

function renderPhoneFinance() {
  const rows = data.phones.map((phone) => {
    const records = data.records.filter((item) => item.phoneId === phone.id);
    const sold = records.filter(hasRecordPrice);
    const income = recordsTotal(sold);
    const cost = phoneTotalCost(phone);
    return {
      phone,
      records: records.length,
      income,
      cost,
      profit: income - cost,
    };
  }).filter((row) => row.records || row.cost || row.income)
    .sort((a, b) => b.profit - a.profit);

  els.phoneFinanceTable.innerHTML = financeTable(
    ["\u624b\u673a\u53f7", "\u8bb0\u5f55", "\u5df2\u552e", "\u6210\u672c", "\u5df2\u552e\u91d1\u989d", "\u5229\u6da6"],
    rows.map((row) => [
      `${row.phone.number}${row.phone.carrier ? ` · ${row.phone.carrier}` : ""}${row.phone.personName ? ` · ${row.phone.personName}` : ""}`,
      row.records,
      data.records.filter((item) => item.phoneId === row.phone.id && hasRecordPrice(item)).length,
      currency(row.cost),
      currency(row.income),
      { html: `<span class="${row.profit < 0 ? "negative" : ""}">${currency(row.profit)}</span>` },
    ]),
    6,
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

function ensureMonthRow(map, month) {
  if (!map.has(month)) {
    map.set(month, {
      month,
      records: 0,
      sold: 0,
      cost: 0,
      income: 0,
    });
  }
  return map.get(month);
}

function recordMonth(item) {
  if (item?.date) return String(item.date).slice(0, 7);
  if (item?.updatedAt) return String(item.updatedAt).slice(0, 7);
  return "";
}

function currentMonth() {
  return formatDate(startOfToday()).slice(0, 7);
}

function monthSoldTotal() {
  const month = currentMonth();
  return recordsTotal(data.records.filter((item) => hasRecordPrice(item) && recordMonth(item) === month));
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
  const matrixPlatforms = sortedMatrixPlatforms();
  const header = `<tr><th>\u624b\u673a\u53f7</th>${matrixPlatforms.map((name) => `<th>
    <div class="matrix-head">
      <span>${escapeHtml(name)}</span>
    </div>
  </th>`).join("")}</tr>`;
  const visiblePhones = groupedMatrixPhones(data.phones.filter((phone) => isActivePhone(phone) && phoneMatches(phone, records)));
  const rows = visiblePhones
    .map((phone) => {
      if (phone.__group) return `<tr class="matrix-group-row"><td colspan="${matrixPlatforms.length + 1}">${escapeHtml(phone.label)}</td></tr>`;
      const cells = matrixPlatforms.map((platform) => {
        const items = recordsByPhonePlatform.get(`${phone.id}-${platform}`) || [];
        const blockedPlatform = isBlockedPhonePlatform(phone, platform);
        if (!items.length) {
          if (blockedPlatform) {
            return `<td><div class="cell blocked-platform"><strong>\u6ce8\u518c\u5361</strong><span>${escapeHtml(blockedPlatformText(phone, platform))}</span></div></td>`;
          }
          return `<td><div class="cell empty" data-phone="${escapeAttr(phone.number)}" data-platform="${escapeAttr(platform)}"><button class="cell-paste" type="button" data-phone="${escapeAttr(phone.number)}" data-platform="${escapeAttr(platform)}">\u7c98\u8d34</button><span>+</span></div></td>`;
        }
        const entries = items.map((item) => `<div class="cell-entry ${statusTone(item.status)}" data-record="${item.id}">
            <button class="entry-copy" type="button" data-record="${item.id}" title="\u590d\u5236\u8fd9\u6761\u8bb0\u5f55">\u590d\u5236</button>
            <button class="entry-delete" type="button" data-record="${item.id}" title="\u5220\u9664\u8fd9\u6761\u8bb0\u5f55">\u5220\u9664</button>
            ${loginCheckNeedsAction(item) ? `<button class="entry-login-check" type="button" data-record="${item.id}" title="\u586b\u5199\u767b\u5f55\u540e\u60c5\u51b5">\u53ef\u767b\u5f55</button>` : ""}
            <strong>${escapeHtml(statusLabel(item.status))}${item.price ? ` · ${currency(item.price)}` : ""}</strong>
            <span>${escapeHtml([contactText(item), item.date].filter(Boolean).join(" / "))}</span>
            <span>${escapeHtml(loginCheckText(item))}</span>
            <span>${escapeHtml(cancelText(item))}</span>
            <span>${escapeHtml(registerableText(item))}</span>
            <span>${escapeHtml(actualCancelText(item))}</span>
            <span class="manual-note">${escapeHtml(statusNoteText(item))}</span>
            <span class="manual-note">${escapeHtml(item.note || "")}</span>
          </div>`).join("");
        const actions = blockedPlatform ? "" : `<div class="cell-actions"><button class="cell-add" type="button" data-phone="${escapeAttr(phone.number)}" data-platform="${escapeAttr(platform)}">+ \u8ffd\u52a0</button><button class="cell-paste" type="button" data-phone="${escapeAttr(phone.number)}" data-platform="${escapeAttr(platform)}">\u7c98\u8d34</button></div>`;
        return `<td><div class="cell filled">${entries}${actions}</div></td>`;
      });
      return `<tr><td><div class="phone-cell-actions"><button class="phone-copy" type="button" data-phone="${escapeAttr(phone.number)}">\u590d\u5236</button><button class="phone-row-move" type="button" data-phone-id="${escapeAttr(phone.id)}" data-direction="-1" title="\u4e0a\u79fb">\u4e0a\u79fb</button><button class="phone-row-move" type="button" data-phone-id="${escapeAttr(phone.id)}" data-direction="1" title="\u4e0b\u79fb">\u4e0b\u79fb</button><button class="phone-archive" type="button" data-phone-id="${escapeAttr(phone.id)}" data-status="cancelled">\u6ce8\u9500</button><button class="phone-archive" type="button" data-phone-id="${escapeAttr(phone.id)}" data-status="blocked">\u5c01\u7981</button></div>${escapeHtml(phone.number)}<br><span>${escapeHtml(matrixPhoneSummary(phone))}</span></td>${cells.join("")}</tr>`;
    })
    .join("");

  els.matrixTable.innerHTML = header + (rows || `<tr><td colspan="${matrixPlatforms.length + 1}" class="empty-state">\u6ca1\u6709\u5339\u914d\u8bb0\u5f55</td></tr>`);
  els.matrixTable.querySelectorAll("[data-record]").forEach((cell) => {
    cell.addEventListener("click", () => editRecord(cell.dataset.record));
  });
  els.matrixTable.querySelectorAll(".entry-copy").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      copyRecordTemplate(button.dataset.record);
    });
  });
  els.matrixTable.querySelectorAll(".entry-delete").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteRecord(button.dataset.record);
    });
  });
  els.matrixTable.querySelectorAll(".entry-login-check").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addLoginCheckLog(button.dataset.record);
    });
  });
  els.matrixTable.querySelectorAll(".cell-paste").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      pasteRecordTemplate(button.dataset.phone, button.dataset.platform);
    });
  });
  els.matrixTable.querySelectorAll(".phone-copy").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      copyPhoneNumber(button.dataset.phone);
    });
  });
  els.matrixTable.querySelectorAll(".phone-archive").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      archivePhone(button.dataset.phoneId, button.dataset.status);
    });
  });
  els.matrixTable.querySelectorAll(".phone-row-move").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      movePhoneRow(button.dataset.phoneId, Number(button.dataset.direction));
    });
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
        loginCheckText(item),
        cancelText(item),
        registerableText(item),
        actualCancelText(item),
        statusNoteText(item),
      ].filter(Boolean).join(" / ");
      node.querySelector(".record-note").textContent = item.note || "\u65e0\u5907\u6ce8";
      const badge = node.querySelector(".badge");
      badge.textContent = statusLabel(item.status);
      badge.classList.add(statusTone(item.status));
      if (loginCheckNeedsAction(item) || cancelState(item).isDue) node.querySelector(".record-card").classList.add("cancel-due");
      node.querySelector(".edit-record").addEventListener("click", () => editRecord(item.id));
      node.querySelector(".delete-record").addEventListener("click", () => deleteRecord(item.id));
      els.recordList.appendChild(node);
    });
}

function renderPhones(records) {
  const counts = new Map();
  records.forEach((item) => counts.set(item.phoneId, (counts.get(item.phoneId) || 0) + 1));
  const phones = data.phones.filter((phone) => isActivePhone(phone) && phoneMatches(phone, records));
  if (!phones.length) {
    selectedPhoneLookupId = "";
    els.phoneList.innerHTML = `<p class="empty-state">\u6ca1\u6709\u5339\u914d\u624b\u673a\u53f7</p>`;
    return;
  }

  if (!phones.some((phone) => phone.id === selectedPhoneLookupId)) selectedPhoneLookupId = phones[0].id;
  const selected = phoneById(selectedPhoneLookupId) || phones[0];
  const options = phones
    .map((phone) => `<option value="${escapeAttr(phone.id)}" ${phone.id === selected.id ? "selected" : ""}>${escapeHtml(phoneLookupLabel(phone))}</option>`)
    .join("");
  els.phoneList.innerHTML = `<section class="phone-lookup">
      <label>
        \u67e5\u8be2\u624b\u673a\u53f7
        <select id="phoneLookupSelect">${options}</select>
      </label>
      ${phoneLookupDetail(selected, counts.get(selected.id) || 0)}
    </section>`;

  document.querySelector("#phoneLookupSelect").addEventListener("change", (event) => {
    selectedPhoneLookupId = event.target.value;
    renderPhones(records);
  });

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

function phoneLookupDetail(phone, recordCount) {
  return `<article class="phone-card phone-lookup-card">
      <div class="phone-lookup-title">
        <strong>${escapeHtml(phone.number)}</strong>
        <span>${escapeHtml(phone.carrier || "\u672a\u586b\u5199\u8fd0\u8425\u5546")}</span>
      </div>
      <div class="device-grid">
        <article>
          <span>\u8bbe\u5907\u7f16\u53f7</span>
          <strong>${escapeHtml(phone.deviceNo || "\u672a\u586b\u5199")}</strong>
        </article>
        <article>
          <span>\u5361\u69fd\u7f16\u53f7</span>
          <strong>${escapeHtml(phone.slotNo || "\u672a\u586b\u5199")}</strong>
        </article>
      </div>
      <dl class="phone-detail-list">
        <div><dt>\u59d3\u540d</dt><dd>${escapeHtml(phone.personName || "\u672a\u586b\u5199")}</dd></div>
        <div><dt>\u8fd0\u8425\u5546</dt><dd>${escapeHtml(phone.carrier || "\u672a\u586b\u5199")}</dd></div>
        <div><dt>\u5361\u7c7b\u578b</dt><dd>${escapeHtml(cardCategoryLabel(phone.cardCategory || inferCardCategory(phone.carrier)))}</dd></div>
        <div><dt>\u6210\u672c\u660e\u7ec6</dt><dd>${escapeHtml(costBreakdown(phone))}</dd></div>
        <div><dt>\u603b\u6210\u672c</dt><dd>${currency(phoneTotalCost(phone))}</dd></div>
        <div><dt>\u5e73\u53f0\u8bb0\u5f55</dt><dd>\u5f53\u524d\u7b5b\u9009\u4e0b ${recordCount} \u6761</dd></div>
      </dl>
      <div class="card-actions">
        <button class="text-button select-phone" type="button" data-phone-id="${escapeAttr(phone.id)}">\u586b\u5165\u5feb\u901f\u5f55\u5165</button>
        <button class="danger-button delete-phone" type="button" data-phone-id="${escapeAttr(phone.id)}">\u5220\u9664\u624b\u673a\u53f7</button>
      </div>
    </article>`;
}

function phoneLookupLabel(phone) {
  return [phone.number, phone.deviceNo ? `\u8bbe\u5907 ${phone.deviceNo}` : "", phone.slotNo ? `\u5361\u69fd ${phone.slotNo}` : "", phone.carrier].filter(Boolean).join(" / ");
}

function renderPeopleStats() {
  const people = new Map();
  data.phones.forEach((phone) => {
    const name = phone.personName || "\u672a\u586b\u5199";
    const carrier = phone.carrier || "\u672a\u586b\u5199\u8fd0\u8425\u5546";
    if (!people.has(name)) people.set(name, new Map());
    const carrierMap = people.get(name);
    if (!carrierMap.has(carrier)) carrierMap.set(carrier, []);
    carrierMap.get(carrier).push(phone);
  });

  els.peopleStats.innerHTML = [...people.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "zh-CN"))
    .map(([name, carrierMap]) => {
      const phones = [...carrierMap.values()].flat();
      const personCost = sum(phones.map((phone) => phone.personCost));
      const carrierBlocks = [...carrierMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b, "zh-CN"))
        .map(([carrier, carrierPhones]) => `<div class="person-carrier">
          <strong>${escapeHtml(carrier)} · ${carrierPhones.length} \u5f20\u5361</strong>
          <p>${escapeHtml(carrierPhones.map((phone) => `${phone.number}${phone.deviceNo ? ` / \u8bbe\u5907${phone.deviceNo}` : ""}${phone.slotNo ? ` / \u5361\u69fd${phone.slotNo}` : ""}`).join("；"))}</p>
        </div>`).join("");
      return `<article class="person-card">
        <h2>${escapeHtml(name)} · ${phones.length} \u5f20\u5361 · \u4eba\u5458\u6210\u672c ${currency(personCost)}</h2>
        ${carrierBlocks}
      </article>`;
    }).join("") || `<p class="empty-state">\u6682\u65e0\u59d3\u540d\u7edf\u8ba1</p>`;
}

function renderArchivedPhones(records) {
  const counts = new Map();
  records.forEach((item) => counts.set(item.phoneId, (counts.get(item.phoneId) || 0) + 1));
  const phones = data.phones.filter((phone) => !isActivePhone(phone) && phoneMatches(phone, records));
  els.archivedPhoneList.innerHTML = phones.length
    ? phones.map((phone) => `<article class="phone-card archived">
        <strong>${escapeHtml(phone.number)} · ${escapeHtml(phoneArchiveLabel(phone))}</strong>
        <p>${escapeHtml(phone.blockReason ? `\u5c01\u7981\u539f\u56e0\uff1a${phone.blockReason}` : "\u65e0\u5c01\u7981\u539f\u56e0")}</p>
        <p>${escapeHtml(phone.archivedAt ? `\u5904\u7406\u65f6\u95f4\uff1a${phone.archivedAt.slice(0, 10)}` : "")}</p>
        <p>${escapeHtml(phoneSummary(phone))}</p>
        <p>\u5386\u53f2\u8bb0\u5f55\uff1a${counts.get(phone.id) || 0} \u6761\uff0c\u8d22\u52a1\u7ee7\u7eed\u7edf\u8ba1</p>
        <div class="card-actions">
          <button class="text-button restore-phone" type="button" data-phone-id="${escapeAttr(phone.id)}">\u6062\u590d\u5230\u77e9\u9635</button>
        </div>
      </article>`).join("")
    : `<p class="empty-state">\u6682\u65e0\u6ce8\u9500\u6216\u5c01\u7981\u624b\u673a\u53f7</p>`;

  els.archivedPhoneList.querySelectorAll(".restore-phone").forEach((button) => {
    button.addEventListener("click", () => restorePhone(button.dataset.phoneId));
  });
}

function filteredRecords() {
  const text = els.searchInput.value.trim().toLowerCase();
  const platform = els.platformFilter.value;
  const status = els.statusFilter.value;
  return data.records.filter((item) => {
    const phone = phoneById(item.phoneId);
    const haystack = [phone?.number, phoneSummary(phone), phone?.personName, phone?.carrier, phone?.deviceNo, phone?.slotNo, item.platform, contactText(item), item.date, loginCheckText(item), registerableText(item), item.actualCancelDate, statusNoteText(item), item.note, statusLabel(item.status)]
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
  return [phone.number, phoneSummary(phone), phone.personName, phone.carrier, phone.deviceNo, phone.slotNo].filter(Boolean).join(" ").toLowerCase().includes(text) ||
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
  form.elements.price.value = normalizeStatus(item.status) === "testing" ? item.statusNote || "" : item.price || "";
  setContactRows(contactEntries(item));
  form.elements.date.value = item.date || "";
  form.elements.loginCheckAfterDays.value = item.loginCheckAfterDays || "";
  form.elements.cancelAfterDays.value = item.cancelAfterDays || "";
  form.elements.registerableDate.value = item.registerableDate || "";
  form.elements.actualCancelDate.value = item.actualCancelDate || "";
  form.elements.note.value = item.note || "";
  form.querySelector(".primary-button").textContent = "\u66f4\u65b0\u8bb0\u5f55";
  renderFormCost();
  renderReminderHints();
  updatePriceLabel();
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
  form.elements.personName.value = phone.personName || "";
  form.elements.personCost.value = displayNumber(phone.personCost);
  form.elements.carrier.value = phone.carrier || "";
  form.elements.cardCategory.value = phone.cardCategory || inferCardCategory(phone.carrier) || "";
  form.elements.deviceNo.value = phone.deviceNo || "";
  form.elements.slotNo.value = phone.slotNo || "";
  renderFormCost();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteRecord(id) {
  if (!confirm("\u786e\u5b9a\u5220\u9664\u8fd9\u6761\u77e9\u9635\u8bb0\u5f55\uff1f")) return;
  pushUndo();
  data.records = data.records.filter((item) => item.id !== id);
  persist();
  render();
}

function movePhoneRow(id, direction) {
  const index = data.phones.findIndex((phone) => phone.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= data.phones.length) return;
  pushUndo();
  [data.phones[index], data.phones[target]] = [data.phones[target], data.phones[index]];
  persist();
  render();
}

function sortedMatrixPlatforms() {
  return platforms
    .map((platform, index) => ({
      name: platform,
      index,
      income: platformSoldIncome(platform),
    }))
    .sort((a, b) => (b.income - a.income) || (a.index - b.index))
    .map((item) => item.name);
}

function groupedMatrixPhones(phones) {
  const groups = [
    { label: "\u4e09\u7f51\u5385\u5361", items: [] },
    { label: "\u6ce8\u518c\u5361", items: [] },
    { label: "\u672a\u5206\u7c7b", items: [] },
  ];
  phones.forEach((phone) => {
    const category = phone.cardCategory || inferCardCategory(phone.carrier);
    if (category === "hall") groups[0].items.push(phone);
    else if (category === "registration") groups[1].items.push(phone);
    else groups[2].items.push(phone);
  });
  return groups.flatMap((group) => group.items.length ? [{ __group: true, label: group.label }, ...group.items] : []);
}

function platformSoldIncome(platform) {
  return recordsTotal(data.records.filter((item) => item.platform === platform && hasRecordPrice(item)));
}

function copyRecordTemplate(id) {
  const item = data.records.find((recordItem) => recordItem.id === id);
  if (!item) return;
  copiedRecord = {
    status: normalizeStatus(item.status),
    price: item.price,
    statusNote: item.statusNote || "",
    contacts: cloneData(contactEntries(item)),
    contactPlatforms: cloneData(contactEntries(item).map((contact) => contact.platform)),
    contactPlatform: contactEntries(item)[0]?.platform || "",
    nickname: contactEntries(item)[0]?.nickname || "",
    date: item.date,
    loginCheckAfterDays: item.loginCheckAfterDays,
    cancelAfterDays: item.cancelAfterDays,
    registerableDate: item.registerableDate,
    actualCancelDate: item.actualCancelDate,
    note: item.note,
    loginCheckLogs: cloneData(item.loginCheckLogs || []),
  };
  toast("\u5df2\u590d\u5236\u8bb0\u5f55\uff0c\u53ef\u7c98\u8d34\u5230\u5176\u4ed6\u5355\u5143\u683c");
}

function addLoginCheckLog(id) {
  const item = data.records.find((recordItem) => recordItem.id === id);
  if (!item) return;
  const result = prompt("\u586b\u5199\u767b\u5f55\u540e\u60c5\u51b5");
  if (result === null) return;
  const text = result.trim();
  if (!text) {
    toast("\u672a\u586b\u5199\u5185\u5bb9");
    return;
  }
  const log = `${formatDate(startOfToday())} \u767b\u5f55\u67e5\u770b\uff1a${text}`;
  pushUndo();
  item.loginCheckLogs = [...(Array.isArray(item.loginCheckLogs) ? item.loginCheckLogs : []), log];
  item.note = [item.note, log].filter(Boolean).join("\n");
  item.updatedAt = new Date().toISOString();
  persist();
  render();
  toast("\u5df2\u8bb0\u5f55\u767b\u5f55\u540e\u60c5\u51b5");
}

function pasteRecordTemplate(phoneNumber, platform) {
  if (!copiedRecord) {
    toast("\u8bf7\u5148\u590d\u5236\u4e00\u6761\u5355\u5143\u683c\u8bb0\u5f55");
    return;
  }
  const phone = phoneByNumber(phoneNumber);
  if (!phone) return;
  if (isBlockedPhonePlatform(phone, platform)) {
    toast(blockedPlatformText(phone, platform));
    return;
  }
  pushUndo();
  data.records.push({
    ...cloneData(copiedRecord),
    id: makeId(),
    phoneId: phone.id,
    platform,
    updatedAt: new Date().toISOString(),
  });
  persist();
  render();
  toast("\u5df2\u7c98\u8d34\u5230\u76ee\u6807\u5355\u5143\u683c");
}

async function copyPhoneNumber(number) {
  try {
    await navigator.clipboard.writeText(number);
    toast("\u624b\u673a\u53f7\u5df2\u590d\u5236");
  } catch {
    prompt("\u590d\u5236\u624b\u673a\u53f7", number);
  }
}

function toast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 1800);
}

function deletePhone(id) {
  const phone = phoneById(id);
  if (!phone) return;
  const recordCount = data.records.filter((item) => item.phoneId === id).length;
  const message = `\u786e\u5b9a\u5220\u9664\u624b\u673a\u53f7 ${phone.number} \u5417\uff1f\u8fd9\u4f1a\u540c\u65f6\u5220\u9664 ${recordCount} \u6761\u5e73\u53f0\u8bb0\u5f55\u3002`;
  if (!confirm(message)) return;
  pushUndo();
  data.phones = data.phones.filter((item) => item.id !== id);
  data.records = data.records.filter((item) => item.phoneId !== id);
  if (form.elements.phone.value === phone.number) clearForm();
  persist();
  render();
}

function archivePhone(id, status) {
  const phone = phoneById(id);
  if (!phone) return;
  let blockReason = "";
  if (status === "blocked") {
    blockReason = prompt("\u586b\u5199\u5c01\u7981\u539f\u56e0", phone.blockReason || "") || "";
    if (!blockReason.trim()) return;
  } else if (!confirm(`\u786e\u5b9a\u5c06\u624b\u673a\u53f7 ${phone.number} \u6807\u8bb0\u4e3a\u5df2\u6ce8\u9500\uff1f`)) {
    return;
  }
  pushUndo();
  phone.phoneStatus = status;
  phone.blockReason = status === "blocked" ? blockReason.trim() : "";
  phone.archivedAt = new Date().toISOString();
  persist();
  render();
  toast(status === "blocked" ? "\u5df2\u79fb\u5165\u6ce8\u9500\u624b\u673a\u53f7\uff08\u5c01\u7981\uff09" : "\u5df2\u79fb\u5165\u6ce8\u9500\u624b\u673a\u53f7");
}

function restorePhone(id) {
  const phone = phoneById(id);
  if (!phone) return;
  pushUndo();
  phone.phoneStatus = "active";
  phone.blockReason = "";
  phone.archivedAt = "";
  persist();
  render();
  toast("\u5df2\u6062\u590d\u5230\u77e9\u9635");
}

function isActivePhone(phone) {
  return !phone?.phoneStatus || phone.phoneStatus === "active";
}

function phoneArchiveLabel(phone) {
  if (phone?.phoneStatus === "blocked") return "\u5df2\u5c01\u7981";
  if (phone?.phoneStatus === "cancelled") return "\u5df2\u6ce8\u9500";
  return "\u6b63\u5e38";
}

function clearForm() {
  editingId = null;
  form.reset();
  setContactRows([]);
  form.elements.date.valueAsDate = new Date();
  form.elements.registerableDate.value = "";
  form.elements.actualCancelDate.value = "";
  form.querySelector(".primary-button").textContent = "\u4fdd\u5b58\u8bb0\u5f55";
  renderFormCost();
  renderReminderHints();
  updatePriceLabel();
}

function pushUndo() {
  undoStack.push({
    data: cloneData(data),
    platforms: cloneData(platforms),
    editingId,
  });
  if (undoStack.length > 50) undoStack.shift();
}

function undoLastAction() {
  const snapshot = undoStack.pop();
  if (!snapshot) {
    toast("\u6ca1\u6709\u53ef\u64a4\u9500\u7684\u64cd\u4f5c");
    return;
  }
  data = normalizeData(snapshot.data);
  platforms = cloneData(snapshot.platforms);
  data.platforms = platforms;
  editingId = snapshot.editingId;
  fillOptions();
  persist();
  clearForm();
  render();
  toast("\u5df2\u64a4\u9500\u4e0a\u4e00\u6b65");
}

function handleUndoShortcut(event) {
  const key = event.key.toLowerCase();
  if (!(event.ctrlKey || event.metaKey) || key !== "z" || event.shiftKey || event.altKey) return;
  if (isTypingTarget(event.target)) return;
  event.preventDefault();
  undoLastAction();
}

function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
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
      pushUndo();
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
      pushUndo();
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

function hasRecordPrice(item) {
  return Number(item?.price || 0) > 0;
}

function paidRecords() {
  return data.records.filter(hasRecordPrice);
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
  const rentMonths = phoneBillingMonths(phone);
  return sum([
    phone?.cardFee,
    phone?.initialRecharge,
    moneyValue(phone?.monthlyRent) * rentMonths,
    phone?.personCost,
  ]);
}

function costBreakdown(phone) {
  if (!phone) return "";
  if (phone.sim && !phone.cardFee && !phone.initialRecharge && !phone.monthlyRent) {
    return phone.sim;
  }
  return [
    `\u5361\u8d39 ${currency(phone.cardFee)}`,
    `\u9996\u5145 ${currency(phone.initialRecharge)}`,
    `\u6708\u79df ${currency(phone.monthlyRent)} \u00d7 ${phoneBillingMonths(phone)}\u4e2a\u6708 = ${currency(moneyValue(phone.monthlyRent) * phoneBillingMonths(phone))}`,
    `\u4eba\u5458\u6210\u672c ${currency(phone.personCost)}`,
  ].join(" / ");
}

function phoneBillingMonths(phone) {
  if (!phone || !moneyValue(phone.monthlyRent)) return 0;
  const start = parseDateSafe(phoneActivationDate(phone));
  if (!start) return 1;
  const end = parseDateSafe(phoneCancelDate(phone) || formatDate(startOfToday())) || start;
  if (end.getTime() < start.getTime()) return 1;
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
}

function phoneActivationDate(phone) {
  return data.records
    .filter((item) => item.phoneId === phone?.id && item.date)
    .map((item) => item.date)
    .sort()[0] || "";
}

function phoneCancelDate(phone) {
  const actualDates = data.records
    .filter((item) => item.phoneId === phone?.id && item.actualCancelDate)
    .map((item) => item.actualCancelDate)
    .sort();
  if (actualDates.length) return actualDates[actualDates.length - 1];
  if (phone?.phoneStatus === "cancelled" && phone.archivedAt) return String(phone.archivedAt).slice(0, 10);
  return "";
}

function phoneSummary(phone) {
  return [phone?.personName ? `\u59d3\u540d ${phone.personName}` : "", cardCategoryLabel(phone?.cardCategory || inferCardCategory(phone?.carrier)), phone?.carrier, deviceSummary(phone), `\u6210\u672c ${currency(phoneTotalCost(phone))}`].filter(Boolean).join(" · ");
}

function matrixPhoneSummary(phone) {
  return [phone?.personName || "", phone?.carrier || ""].filter(Boolean).join(" · ");
}

function applyCarrierCategory() {
  const inferred = inferCardCategory(form.elements.carrier.value);
  if (inferred) form.elements.cardCategory.value = inferred;
}

function isRegistrationCard(phone) {
  return (phone?.cardCategory || inferCardCategory(phone?.carrier)) === "registration";
}

function inferCardCategory(carrierValue = "") {
  const carrier = String(carrierValue || "");
  if (carrier.includes("\u957f\u57ce\u79fb\u52a8") || carrier.includes("\u6c11\u751f\u7535\u4fe1")) return "registration";
  if (carrier.includes("\u4e2d\u56fd\u8054\u901a") || carrier.includes("\u8054\u901a")) return "hall";
  return "";
}

function cardCategoryLabel(value) {
  if (value === "registration") return "\u6ce8\u518c\u5361";
  if (value === "hall") return "\u4e09\u7f51\u5385\u5361";
  return "";
}

function isRegistrationCardBlockedPlatform(platform) {
  const name = String(platform || "").trim().toLowerCase();
  return name === "qq" || name === "\u5c0f\u7ea2\u4e66";
}

function isBlockedPhonePlatform(phone, platform) {
  return isRegistrationCard(phone) && isRegistrationCardBlockedPlatform(platform);
}

function blockedPlatformText(phone, platform) {
  if (isBlockedPhonePlatform(phone, platform)) return `\u6ce8\u518c\u5361\u9ed8\u8ba4\u4e0d\u80fd\u6ce8\u518c ${platform}`;
  return "";
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

function loginCheckDueRecords() {
  return data.records.filter(loginCheckNeedsAction);
}

function loginCheckNeedsAction(item) {
  return loginCheckState(item).isDue && !hasLoginCheckLog(item);
}

function hasLoginCheckLog(item) {
  return Array.isArray(item?.loginCheckLogs) && item.loginCheckLogs.length > 0;
}

function cancelDueRecords() {
  return data.records.filter((item) => cancelState(item).isDue);
}

function loginCheckText(item) {
  const state = loginCheckState(item);
  if (!state.dueDate) return "";
  if (state.isDue) return `\u53ef\u767b\u5f55\u67e5\u770b\uff1a${state.dueDate}`;
  return `\u5f85\u767b\u5f55\u67e5\u770b\uff1a${state.dueDate}`;
}

function cancelText(item) {
  const state = cancelState(item);
  if (!state.dueDate) return "";
  if (state.isDue) return `\u53ef\u6ce8\u9500\uff1a${state.dueDate}`;
  return `\u5f85\u6ce8\u9500\uff1a${state.dueDate}`;
}

function actualCancelText(item) {
  return item?.actualCancelDate ? `\u5b9e\u9645\u6ce8\u9500\uff1a${item.actualCancelDate}` : "";
}

function statusNoteText(item) {
  return item?.statusNote ? `\u5907\u6ce8\uff1a${item.statusNote}` : "";
}

function registerableText(item) {
  return item?.registerableDate ? `\u53ef\u6ce8\u518c\uff1a${item.registerableDate}` : "";
}

function loginCheckState(item) {
  const days = wholeNumber(item?.loginCheckAfterDays);
  if (!item?.date || !days) return { dueDate: "", isDue: false };
  const due = addDays(item.date, days);
  const dueDate = formatDate(due);
  return {
    dueDate,
    isDue: due.getTime() <= startOfToday().getTime(),
  };
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

function parseDateSafe(dateText) {
  if (!dateText) return null;
  const date = parseDate(dateText);
  return Number.isNaN(date.getTime()) ? null : date;
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

function renderReminderHints() {
  renderFormLoginCheckHint();
  renderFormCancelHint();
}

function renderFormLoginCheckHint() {
  const date = form.elements.date.value;
  const days = wholeNumber(form.elements.loginCheckAfterDays.value);
  if (!date || !days) {
    els.formLoginCheckHint.textContent = "\u672a\u8bbe\u7f6e\u767b\u5f55\u67e5\u770b\u63d0\u9192";
    els.formLoginCheckHint.classList.remove("due");
    return;
  }
  const state = loginCheckState({ date, loginCheckAfterDays: days });
  els.formLoginCheckHint.textContent = state.isDue
    ? `\u5df2\u5230\u53ef\u767b\u5f55\u67e5\u770b\u65f6\u95f4\uff1a${state.dueDate}`
    : `\u53ef\u767b\u5f55\u67e5\u770b\u65f6\u95f4\uff1a${state.dueDate}`;
  els.formLoginCheckHint.classList.toggle("due", state.isDue);
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
  const total = ["cardFee", "initialRecharge", "monthlyRent", "personCost"]
    .map((name) => moneyValue(form.elements[name].value))
    .reduce((next, item) => next + item, 0);
  els.formTotalCost.textContent = currency(total);
}

function updatePriceLabel() {
  const isTesting = form.elements.status.value === "testing";
  els.priceLabel.textContent = isTesting ? "\u5907\u6ce8" : "\u91d1\u989d";
  form.elements.price.placeholder = isTesting ? "\u586b\u5199\u6d4b\u8bd5\u5907\u6ce8" : "70";
  form.elements.price.inputMode = isTesting ? "text" : "decimal";
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
      personName: phone.personName || phone.cardOwner || "",
      personCost: moneyValue(phone.personCost ?? phone.laborCost),
      carrier: phone.carrier || phone.tag || "",
      cardCategory: phone.cardCategory || inferCardCategory(phone.carrier || phone.tag || ""),
      deviceNo: phone.deviceNo || "",
      slotNo: phone.slotNo || "",
      phoneStatus: phone.phoneStatus || "active",
      blockReason: phone.blockReason || "",
      archivedAt: phone.archivedAt || "",
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
      statusNote: item.statusNote || "",
      loginCheckLogs: Array.isArray(item.loginCheckLogs) ? item.loginCheckLogs : [],
      loginCheckAfterDays: wholeNumber(item.loginCheckAfterDays),
      cancelAfterDays: wholeNumber(item.cancelAfterDays),
      registerableDate: item.registerableDate || "",
      actualCancelDate: item.actualCancelDate || "",
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
