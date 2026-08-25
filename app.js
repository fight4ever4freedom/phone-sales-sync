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
  { value: "sold_verify", label: "\u5df2\u552e\u8df3\u9a8c\u8bc1", tone: "verify-blocked" },
  { value: "sold_realname", label: "\u5df2\u552e\u88ab\u5b9e\u540d", tone: "realname-blocked" },
  { value: "testing", label: "\u5f85\u6d4b\u8bd5", tone: "review" },
  { value: "cancelled_pending_register", label: "\u5df2\u6ce8\u9500\u5f85\u6ce8\u518c", tone: "available" },
  { value: "cancelled_registerable", label: "\u5df2\u6ce8\u9500\u53ef\u6ce8\u518c", tone: "registerable" },
  { value: "own", label: "\u81ea\u7528", tone: "own" },
  { value: "own_blocked", label: "\u81ea\u7528\u5df2\u5c01\u7981", tone: "own-blocked" },
  { value: "cannot_register", label: "\u65e0\u6cd5\u6ce8\u518c", tone: "cannot-register" },
];

const contactPlatforms = ["\u95f2\u9c7c", "QQ", "\u5fae\u4fe1", "TG"];
const defaultAppSaleChannels = ["自己厅卡", "自己虚拟卡", "接码平台", "接码群"];

const storageKey = "phone-sales-manager-v1";
const syncEnabled = location.protocol === "http:" || location.protocol === "https:";
const githubSyncKey = `${storageKey}-github-sync`;

const makeId = () => {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const demoData = {
  phones: [
    { id: makeId(), number: "13294936354", cardFee: 0, initialRecharge: 0, monthlyRent: 39, personName: "", personCost: 0, carrier: "\u8054\u901a", deviceNo: "A01", slotNo: "1", registrationDate: "2026-05-30", simRole: "", dataPlan: "" },
    { id: makeId(), number: "13294931680", cardFee: 0, initialRecharge: 0, monthlyRent: 10, personName: "", personCost: 0, carrier: "\u8054\u901a", deviceNo: "A01", slotNo: "2", registrationDate: "2026-05-23", simRole: "", dataPlan: "" },
    { id: makeId(), number: "13187442010", cardFee: 0, initialRecharge: 0, monthlyRent: 19, personName: "", personCost: 0, carrier: "\u8054\u901a", deviceNo: "A02", slotNo: "1", registrationDate: "2026-05-25", simRole: "", dataPlan: "" },
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
let appSaleChannels = data.appSaleChannels || [...defaultAppSaleChannels];
let editingId = null;
let copiedRecord = null;
let selectedPhoneLookupId = "";
let githubSyncTimer = null;
let matrixQuickFilter = "";
let editingAppSaleDetailId = null;
let appSaleDetailFilterValue = "all";
const undoStack = [];

const form = document.querySelector("#recordForm");
const channelSaleForm = document.querySelector("#channelSaleForm");
const appSaleDetailForm = document.querySelector("#appSaleDetailForm");
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
  priceLabel: document.querySelector("#priceLabel"),  phoneOptions: document.querySelector("#phoneOptions"),
  quickPhoneList: document.querySelector("#quickPhoneList"),
  platformSelect: form.elements.platform,
  statusSelect: form.elements.status,
  platformFilter: document.querySelector("#platformFilter"),
  platformFilterOptions: document.querySelector("#platformFilterOptions"),
  phoneFilter: document.querySelector("#phoneFilter"),
  phoneFilterOptions: document.querySelector("#phoneFilterOptions"),
  carrierFilter: document.querySelector("#carrierFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  syncStatus: document.querySelector("#syncStatus"),
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
  dayFinanceTable: document.querySelector("#dayFinanceTable"),
  appFinanceTable: document.querySelector("#appFinanceTable"),
  phoneFinanceTable: document.querySelector("#phoneFinanceTable"),
  customerCount: document.querySelector("#customerCount"),
  customerPurchaseCount: document.querySelector("#customerPurchaseCount"),
  customerTotalAmount: document.querySelector("#customerTotalAmount"),
  customerAnalysisTable: document.querySelector("#customerAnalysisTable"),
  channelSaleCount: document.querySelector("#channelSaleCount"),
  channelSaleAmount: document.querySelector("#channelSaleAmount"),
  channelSaleProfit: document.querySelector("#channelSaleProfit"),
  channelProductTable: document.querySelector("#channelProductTable"),
  channelSaleTable: document.querySelector("#channelSaleTable"),
  channelConversionTable: document.querySelector("#channelConversionTable"),
  appSaleDetailTable: document.querySelector("#appSaleDetailTable"),
  appSaleDetailFilter: document.querySelector("#appSaleDetailFilter"),
  appSaleChannelRows: document.querySelector("#appSaleChannelRows"),
  appSaleChannelOptionSelect: document.querySelector("#appSaleChannelOptionSelect"),
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
  clearChannelSaleForm();
  clearAppSaleDetailForm();
  render();
}

async function boot() {
  data = await loadData();
  platforms = data.platforms || [...defaultPlatforms];
  appSaleChannels = data.appSaleChannels || [...defaultAppSaleChannels];
  init();
  persistLocalOnly();
}

function fillOptions() {
  els.platformSelect.innerHTML = platforms.map((name) => option(name)).join("");
  els.statusSelect.innerHTML = statuses.map((item) => option(item.label, item.value)).join("");
  els.platformFilterOptions.innerHTML = platforms.map((name) => `<option value="${escapeAttr(name)}"></option>`).join("");
  els.phoneFilterOptions.innerHTML = data.phones.map((phone) => `<option value="${escapeAttr(phone.number)}">${escapeHtml(matrixPhoneSummary(phone))}</option>`).join("");
  renderCarrierFilterOptions();
  els.statusFilter.innerHTML = option("\u5168\u90e8\u72b6\u6001", "all") + statuses.map((item) => option(item.label, item.value)).join("");
  renderAppSaleChannelOptions();
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
  els.platformFilter.value = "";
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
  els.platformFilter.value = "";
  render();
}

function bindEvents() {
  form.addEventListener("submit", saveRecord);
  if (channelSaleForm) channelSaleForm.addEventListener("submit", saveChannelSale);
  if (appSaleDetailForm) {
    appSaleDetailForm.addEventListener("submit", saveAppSaleDetail);
    appSaleDetailForm.elements.app.addEventListener("input", fillAppSaleDetailFromSelectedApp);
    appSaleDetailForm.elements.app.addEventListener("change", fillAppSaleDetailFromSelectedApp);
    document.querySelector("#addAppSaleChannelOptionBtn")?.addEventListener("click", addAppSaleChannelOption);
    document.querySelector("#deleteAppSaleChannelOptionBtn")?.addEventListener("click", deleteAppSaleChannelOption);
    els.appSaleChannelOptionSelect?.addEventListener("change", fillSelectedAppSaleChannelDetail);
    els.appSaleDetailFilter?.addEventListener("change", () => {
      appSaleDetailFilterValue = els.appSaleDetailFilter.value || "all";
      renderAppSaleDetails();
    });
  }
  document.querySelector("#clearFormBtn").addEventListener("click", clearForm);
  document.querySelector("#clearChannelSaleBtn")?.addEventListener("click", clearChannelSaleForm);
  document.querySelector("#clearAppSaleDetailBtn")?.addEventListener("click", clearAppSaleDetailForm);
  document.querySelector("#addAppBtn").addEventListener("click", addAppOption);
  document.querySelector("#deleteAppBtn").addEventListener("click", deleteAppOption);
  document.querySelector("#githubSyncBtn").addEventListener("click", setupGitHubSync);

  document.querySelector("#exportBtn").addEventListener("click", exportData);
  document.querySelector("#importFile").addEventListener("change", importData);
  ["cardFee", "initialRecharge", "monthlyRent", "personCost"].forEach((name) => {
    form.elements[name].addEventListener("input", renderFormCost);
  });
  form.elements.carrier.addEventListener("input", applyCarrierCategory);  form.elements.status.addEventListener("change", updatePriceLabel);
  form.elements.phone.addEventListener("change", () => selectPhoneProfile(form.elements.phone.value));
  form.elements.phone.addEventListener("blur", () => selectPhoneProfile(form.elements.phone.value));
  els.searchInput.addEventListener("input", render);
  els.phoneFilter.addEventListener("input", render);
  els.phoneFilter.addEventListener("change", render);
  els.carrierFilter.addEventListener("change", render);
  els.platformFilter.addEventListener("input", render);
  els.platformFilter.addEventListener("change", render);
  els.statusFilter.addEventListener("change", render);
  document.querySelectorAll("[data-quick-filter]").forEach((item) => {
    item.addEventListener("click", () => toggleMatrixQuickFilter(item.dataset.quickFilter));
    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleMatrixQuickFilter(item.dataset.quickFilter);
    });
  });
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
      registrationDate: values.registrationDate,
      carrier,
      cardCategory,
      deviceNo: values.deviceNo.trim(),
      slotNo: values.slotNo.trim(),
      simRole: values.simRole || "",
      dataPlan: values.dataPlan.trim(),
      monthlyRecharges: {},
    };
    data.phones.push(phone);
  } else {
    phone.cardFee = moneyField(values.cardFee, phone.cardFee);
    phone.initialRecharge = moneyField(values.initialRecharge, phone.initialRecharge);
    phone.monthlyRent = moneyField(values.monthlyRent, phone.monthlyRent);
    phone.personName = values.personName.trim() || phone.personName || "";
    phone.personCost = moneyField(values.personCost, phone.personCost);
    phone.registrationDate = values.registrationDate || phone.registrationDate || "";
    phone.carrier = carrier || phone.carrier || "";
    phone.cardCategory = cardCategory || phone.cardCategory || inferCardCategory(phone.carrier);
    phone.deviceNo = values.deviceNo.trim() || phone.deviceNo || "";
    phone.slotNo = values.slotNo.trim() || phone.slotNo || "";
    phone.simRole = values.simRole || phone.simRole || "";
    phone.dataPlan = values.dataPlan.trim() || phone.dataPlan || "";
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
    date: values.date,    registerableDate: values.registerableDate,
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
  renderCarrierFilterOptions();
  renderPhoneOptions();
  renderQuickPhoneList();
  renderMatrix(visible);
  renderRecords(visible);
  renderPhones(visible);
  renderPeopleStats();
  renderArchivedPhones(visible);
  renderFinance();
  renderCustomerAnalysis();
  renderChannelSales();
  renderAppSaleDetails();
}

function renderStats() {
  els.phoneCount.textContent = data.phones.filter(isActivePhone).length;
  els.soldTotal.textContent = cancelableRecords().length;
  els.availableCount.textContent = loginCheckDueRecords().length;
  els.blockedCount.textContent = currency(monthSoldTotal());
  els.costTotal.textContent = currency(sum(data.phones.map(phoneTotalCost)));
  els.loginCheckDueCount.textContent = loginCheckDueRecords().length;
  els.cancelDueCount.textContent = 0;
  document.querySelectorAll("[data-quick-filter]").forEach((item) => {
    item.classList.toggle("active", matrixQuickFilter === item.dataset.quickFilter);
  });
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
  renderDayFinance();
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

function renderDayFinance() {
  const dayMap = new Map();
  paidRecords().forEach((item) => {
    const day = recordDate(item);
    if (!day) return;
    if (!dayMap.has(day)) {
      dayMap.set(day, {
        day,
        count: 0,
        income: 0,
      });
    }
    const row = dayMap.get(day);
    row.count += 1;
    row.income += Number(item.price || 0);
  });

  const rows = [...dayMap.values()].sort((a, b) => b.day.localeCompare(a.day));
  els.dayFinanceTable.innerHTML = financeTable(
    ["\u65e5\u671f", "\u9500\u552e\u6b21\u6570", "\u9500\u552e\u989d"],
    rows.map((row) => [
      row.day,
      row.count,
      currency(row.income),
    ]),
    3,
    "\u6682\u65e0\u6bcf\u65e5\u9500\u552e\u6570\u636e",
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
      `${row.phone.number}${row.phone.carrier ? ` 路 ${row.phone.carrier}` : ""}${row.phone.personName ? ` 路 ${row.phone.personName}` : ""}`,
      row.records,
      data.records.filter((item) => item.phoneId === row.phone.id && hasRecordPrice(item)).length,
      currency(row.cost),
      currency(row.income),
      { html: `<span class="${row.profit < 0 ? "negative" : ""}">${currency(row.profit)}</span>` },
    ]),
    6,
  );
}

function renderCustomerAnalysis() {
  const rows = customerAnalysisRows();
  const purchaseCount = sum(rows.map((row) => row.count));
  const totalAmount = sum(rows.map((row) => row.total));

  els.customerCount.textContent = rows.length;
  els.customerPurchaseCount.textContent = purchaseCount;
  els.customerTotalAmount.textContent = currency(totalAmount);
  els.customerAnalysisTable.innerHTML = financeTable(
    ["\u5ba2\u6237\u6635\u79f0", "\u6210\u4ea4\u5e73\u53f0", "\u9996\u6b21\u6d88\u8d39", "\u6700\u540e\u6d88\u8d39", "\u65f6\u95f4\u8de8\u5ea6", "\u6b21\u6570", "\u6d88\u8d39\u9891\u7387", "\u6d88\u8d39\u603b\u91d1\u989d"],
    rows.map((row) => [
      row.nickname,
      row.platforms.join(" / "),
      row.firstDate || "\u672a\u586b\u5199",
      row.lastDate || "\u672a\u586b\u5199",
      customerPeriodText(row),
      row.count,
      customerFrequencyText(row),
      currency(row.total),
    ]),
    8,
    "\u6682\u65e0\u5ba2\u6237\u6d88\u8d39\u6570\u636e",
  );
}

function saveChannelSale(event) {
  event.preventDefault();
  const formData = new FormData(channelSaleForm);
  const values = Object.fromEntries(formData.entries());
  const product = String(values.product || "").trim();
  const contacts = channelSaleContactsFromForm(formData);
  const tradeContacts = channelSaleTradeContactsFromForm(formData);
  const payments = channelSalePaymentsFromForm(formData);
  const amount = moneyValue(values.amount);
  if (!product) {
    alert("请填写渠道产品。");
    channelSaleForm.elements.product.focus();
    return;
  }
  if (!amount) {
    alert("请填写渠道售卖金额。");
    channelSaleForm.elements.amount.focus();
    return;
  }
  pushUndo();
  if (!Array.isArray(data.channelSales)) data.channelSales = [];
  data.channelSales.push({
    id: makeId(),
    date: values.date || formatDate(startOfToday()),
    product,
    contacts,
    tradeContacts,
    payments,
    contactPlatforms: contacts.map((item) => item.platform),
    tradePlatforms: tradeContacts.map((item) => item.platform),
    customer: contacts.map((item) => item.nickname).filter(Boolean).join(" + "),
    platform: contacts.map((item) => item.platform).filter(Boolean).join(" + "),
    tradeCustomer: tradeContacts.map((item) => item.nickname).filter(Boolean).join(" + "),
    tradePlatform: tradeContacts.map((item) => item.platform).filter(Boolean).join(" + "),
    paymentText: channelSalePaymentText({ payments }),
    amount,
    cost: moneyValue(values.cost),
    note: String(values.note || "").trim(),
    updatedAt: new Date().toISOString(),
  });
  persist();
  clearChannelSaleForm();
  render();
  toast("已记录渠道售卖情况");
}

function channelSaleContactsFromForm(formData) {
  return ["微信", "QQ", "TG", "闲鱼"]
    .filter((platform) => formData.getAll("contactPlatform").includes(platform))
    .map((platform) => ({
      platform,
      nickname: String(formData.get(contactNicknameField(platform)) || "").trim(),
    }));
}

function channelSaleTradeContactsFromForm(formData) {
  return ["微信", "QQ", "TG", "闲鱼"]
    .filter((platform) => formData.getAll("tradePlatform").includes(platform))
    .map((platform) => ({
      platform,
      nickname: String(formData.get(tradeNicknameField(platform)) || "").trim(),
    }));
}

function channelSalePaymentsFromForm(formData) {
  const method = String(formData.get("paymentMethod") || "").trim();
  const note = String(formData.get("paymentNote") || "").trim();
  if (!method && !note) return [];
  return [{ method, note }];
}

function channelSaleContacts(item) {
  if (Array.isArray(item?.contacts)) return item.contacts.filter((contact) => contact.platform);
  if (Array.isArray(item?.contactPlatforms)) {
    return item.contactPlatforms.filter(Boolean).map((platform, index) => ({
      platform,
      nickname: index === 0 ? (item.customer || item.nickname || "") : "",
    }));
  }
  if (item?.platform || item?.customer || item?.nickname) {
    return [{ platform: item.platform || "", nickname: item.customer || item.nickname || "" }].filter((contact) => contact.platform || contact.nickname);
  }
  return [];
}

function channelSaleTradeContacts(item) {
  if (Array.isArray(item?.tradeContacts)) return item.tradeContacts.filter((contact) => contact.platform);
  if (Array.isArray(item?.tradePlatforms)) {
    return item.tradePlatforms.filter(Boolean).map((platform, index) => ({
      platform,
      nickname: index === 0 ? (item.tradeCustomer || item.tradeNickname || "") : "",
    }));
  }
  if (item?.tradePlatform || item?.tradeCustomer || item?.tradeNickname) {
    return [{ platform: item.tradePlatform || "", nickname: item.tradeCustomer || item.tradeNickname || "" }].filter((contact) => contact.platform || contact.nickname);
  }
  return [];
}

function channelSaleCustomerText(item) {
  return channelSaleContacts(item).map((contact) => contact.nickname).filter(Boolean).join(" + ");
}

function channelSalePlatformText(item) {
  return channelSaleContacts(item).map((contact) => contact.platform).filter(Boolean).join(" + ");
}

function channelSaleTradeCustomerText(item) {
  return channelSaleTradeContacts(item).map((contact) => contact.nickname).filter(Boolean).join(" + ");
}

function channelSaleTradePlatformText(item) {
  return channelSaleTradeContacts(item).map((contact) => contact.platform).filter(Boolean).join(" + ");
}

function channelSalePayments(item) {
  if (Array.isArray(item?.payments)) return item.payments.filter((payment) => payment.method);
  if (Array.isArray(item?.paymentMethods)) {
    return item.paymentMethods.filter(Boolean).map((method, index) => ({
      method,
      note: index === 0 ? (item.paymentNote || "") : "",
    }));
  }
  if (item?.paymentMethod || item?.paymentNote) {
    return [{ method: item.paymentMethod || "", note: item.paymentNote || "" }].filter((payment) => payment.method || payment.note);
  }
  return [];
}

function channelSalePaymentText(item) {
  return channelSalePayments(item)
    .map((payment) => [payment.method, payment.note].filter(Boolean).join(" / "))
    .filter(Boolean)
    .join(" + ");
}
function tradeNicknameField(platform) {
  if (platform === "闲鱼") return "tradeNickname_xianyu";
  if (platform === "QQ") return "tradeNickname_qq";
  if (platform === "TG") return "tradeNickname_tg";
  return "tradeNickname_wechat";
}
function clearChannelSaleForm() {
  if (!channelSaleForm) return;
  channelSaleForm.reset();
  channelSaleForm.elements.date.value = formatDate(startOfToday());
}

function renderChannelSales() {
  if (!els.channelSaleTable) return;
  const rows = data.channelSales || [];
  const totalAmount = sum(rows.map((item) => item.amount));
  const totalCost = sum(rows.map((item) => item.cost));
  const profit = totalAmount - totalCost;
  els.channelSaleCount.textContent = rows.length;
  els.channelSaleAmount.textContent = currency(totalAmount);
  els.channelSaleProfit.textContent = currency(profit);
  els.channelSaleProfit.classList.toggle("negative", profit < 0);

  const productMap = new Map();
  rows.forEach((item) => {
    const product = item.product || "未填写产品";
    if (!productMap.has(product)) {
      productMap.set(product, { product, count: 0, amount: 0, cost: 0 });
    }
    const row = productMap.get(product);
    row.count += 1;
    row.amount += Number(item.amount || 0);
    row.cost += Number(item.cost || 0);
  });
  const productRows = [...productMap.values()]
    .map((row) => ({ ...row, profit: row.amount - row.cost }))
    .sort((a, b) => b.amount - a.amount || b.count - a.count || a.product.localeCompare(b.product, "zh-CN"));

  els.channelProductTable.innerHTML = financeTable(
    ["产品", "成交次数", "销售金额", "成本", "利润"],
    productRows.map((row) => [
      row.product,
      row.count,
      currency(row.amount),
      currency(row.cost),
      { html: `<span class="${row.profit < 0 ? "negative" : ""}">${currency(row.profit)}</span>` },
    ]),
    5,
    "暂无渠道产品销售数据",
  );

  const detailRows = [...rows].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
  els.channelSaleTable.innerHTML = financeTable(
    ["日期", "产品", "客户", "成交平台", "交易昵称", "交易平台", "金额", "支付方式", "成本", "利润", "备注", "操作"],
    detailRows.map((item) => {
      const itemProfit = Number(item.amount || 0) - Number(item.cost || 0);
      return [
        item.date || "未填写",
        item.product || "未填写产品",
        channelSaleCustomerText(item) || "未填写",
        channelSalePlatformText(item) || "未填写",
        channelSaleTradeCustomerText(item) || "未填写",
        channelSaleTradePlatformText(item) || "未填写",
        currency(item.amount),
        channelSalePaymentText(item) || "未填写",
        currency(item.cost),
        { html: `<span class="${itemProfit < 0 ? "negative" : ""}">${currency(itemProfit)}</span>` },
        item.note || "",
        { html: `<button class="danger-button delete-channel-sale" type="button" data-id="${escapeAttr(item.id)}">删除</button>` },
      ];
    }),
    12,
    "暂无渠道售卖明细",
  );

  els.channelSaleTable.querySelectorAll(".delete-channel-sale").forEach((button) => {
    button.addEventListener("click", () => deleteChannelSale(button.dataset.id));
  });
  renderChannelConversionTable();
}

function renderChannelConversionTable() {
  if (!els.channelConversionTable) return;
  const rows = channelConversionRows();
  els.channelConversionTable.innerHTML = financeTable(
    ["月份", "产品", "转化次数", "接码用户人数", "转化率", "销售金额"],
    rows.map((row) => [
      row.month,
      row.product,
      row.conversions,
      row.userCount,
      formatPercent(row.rate),
      currency(row.amount),
    ]),
    6,
    "暂无产品转化率数据",
  );
}

function channelConversionRows() {
  const usersByMonth = new Map();
  paidRecords().forEach((item) => {
    const month = recordMonth(item);
    if (!month) return;
    if (!usersByMonth.has(month)) usersByMonth.set(month, new Set());
    usersByMonth.get(month).add(channelConversionRecordUserKey(item));
  });

  const productMonthMap = new Map();
  (data.channelSales || []).forEach((item) => {
    const month = recordMonth(item);
    if (!month) return;
    const product = item.product || "未填写产品";
    const key = `${month}||${product}`;
    if (!productMonthMap.has(key)) {
      productMonthMap.set(key, { month, product, conversions: 0, amount: 0 });
    }
    const row = productMonthMap.get(key);
    row.conversions += 1;
    row.amount += Number(item.amount || 0);
  });

  return [...productMonthMap.values()]
    .map((row) => {
      const userCount = usersByMonth.get(row.month)?.size || 0;
      return {
        ...row,
        userCount,
        rate: userCount ? row.conversions / userCount : 0,
      };
    })
    .sort((a, b) => b.month.localeCompare(a.month) || b.conversions - a.conversions || b.amount - a.amount);
}

function channelConversionRecordUserKey(item) {
  const contacts = customerContacts(item);
  const nicknames = contacts.map((contact) => String(contact?.nickname || "").trim()).filter(Boolean);
  if (nicknames.length) return nicknames[0].toLowerCase();
  return `record:${item.id}`;
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}
function deleteChannelSale(id) {
  if (!confirm("确定删除这条渠道售卖记录？")) return;
  pushUndo();
  data.channelSales = (data.channelSales || []).filter((item) => item.id !== id);
  persist();
  render();
  toast("已删除渠道售卖记录");
}
function sameAppName(left, right) {
  return String(left || "").trim().toLowerCase() === String(right || "").trim().toLowerCase();
}

function uniqueAppSaleDetails(items) {
  const byApp = new Map();
  (Array.isArray(items) ? items : []).forEach((item) => {
    const key = String(item.app || "").trim().toLowerCase();
    if (!key) return;
    const current = byApp.get(key);
    if (!current || String(item.updatedAt || "") >= String(current.updatedAt || "")) byApp.set(key, item);
  });
  return [...byApp.values()];
}

function renderAppSaleChannelOptions() {
  appSaleChannels = uniqueList(Array.isArray(appSaleChannels) && appSaleChannels.length ? appSaleChannels : [...defaultAppSaleChannels]);
  if (els.appSaleChannelOptionSelect) {
    const current = els.appSaleChannelOptionSelect.value;
    els.appSaleChannelOptionSelect.innerHTML = appSaleChannels.map((name) => option(name)).join("");
    if (current && appSaleChannels.includes(current)) els.appSaleChannelOptionSelect.value = current;
  }
  syncVisibleAppSaleChannelSelect();
}

function syncVisibleAppSaleChannelSelect() {
  const select = els.appSaleChannelRows?.querySelector(".app-sale-channel-select");
  if (!select) return;
  const channel = els.appSaleChannelOptionSelect?.value || select.value || appSaleChannels[0] || "";
  select.innerHTML = appSaleChannels.map((name) => option(name)).join("");
  if (channel && appSaleChannels.includes(channel)) select.value = channel;
}

function fillSelectedAppSaleChannelDetail() {
  if (!appSaleDetailForm) return;
  const app = String(appSaleDetailForm.elements.app.value || "").trim();
  const channel = els.appSaleChannelOptionSelect?.value || appSaleChannels[0] || "";
  const item = (data.appSaleDetails || []).find((detail) => sameAppName(detail.app, app));
  const detail = normalizeAppSaleChannelDetails(item || {}).find((entry) => sameChannelName(entry.channel, channel)) || { channel };
  renderAppSaleChannelRows([detail]);
}

function sameChannelName(left, right) {
  return String(left || "").trim().toLowerCase() === String(right || "").trim().toLowerCase();
}
function addAppSaleChannelOption() {
  const name = prompt("输入新的购买渠道名称");
  const channelName = String(name || "").trim();
  if (!channelName) return;
  if (appSaleChannels.includes(channelName)) {
    alert("这个渠道已经存在。");
    return;
  }
  pushUndo();
  appSaleChannels = uniqueList([...appSaleChannels, channelName]);
  data.appSaleChannels = appSaleChannels;
  persist();
  renderAppSaleChannelOptions();
  if (els.appSaleChannelOptionSelect) els.appSaleChannelOptionSelect.value = channelName;
  toast("已增加购买渠道");
}

function deleteAppSaleChannelOption() {
  const channelName = els.appSaleChannelOptionSelect?.value;
  if (!channelName) return;
  if (!confirm(`确定删除购买渠道「${channelName}」吗？已保存明细不会被删除，只是不再出现在下拉菜单里。`)) return;
  pushUndo();
  appSaleChannels = appSaleChannels.filter((item) => item !== channelName);
  data.appSaleChannels = appSaleChannels;
  persist();
  renderAppSaleChannelOptions();
  toast("已删除购买渠道选项");
}

function emptyAppSaleChannelDetail() {
  return {
    id: makeId(),
    channel: appSaleChannels[0] || defaultAppSaleChannels[0],
    costRange: "",
    priceRange: "",
    safeCancelTime: "",
    reregisterTime: "",
    deliveryPoints: "",
    cancelPoints: "",
    reregisterPoints: "",
    afterSaleBoundary: "",
  };
}

function addAppSaleChannelRow(detail = emptyAppSaleChannelDetail()) {
  if (!els.appSaleChannelRows) return;
  const item = normalizeAppSaleChannelDetail(detail);
  const row = document.createElement("section");
  row.className = "app-sale-channel-row";
  row.dataset.id = item.id || makeId();
  row.innerHTML = `
    <div class="channel-row-head">
      <label>购买渠道
        <select class="app-sale-channel-select" data-field="channel">${appSaleChannels.map((name) => option(name)).join("")}</select>
      </label>
      <button class="danger-button delete-app-sale-channel-row" type="button">删除本条</button>
    </div>
    <div class="split">
      <label>成本区间<input data-field="costRange" placeholder="例如：8-10" /></label>
      <label>售卖区间<input data-field="priceRange" placeholder="例如：12.5-18" /></label>
    </div>
    <div class="split">
      <label>安全注销时间<input data-field="safeCancelTime" placeholder="例如：3天 / 7天" /></label>
      <label>重新注册时间<input data-field="reregisterTime" placeholder="例如：24小时 / 3天" /></label>
    </div>
    <label>交付要点<textarea data-field="deliveryPoints" rows="2"></textarea></label>
    <label>注销要点<textarea data-field="cancelPoints" rows="2"></textarea></label>
    <label>再次注册要点<textarea data-field="reregisterPoints" rows="2"></textarea></label>
    <label>售后边界<textarea data-field="afterSaleBoundary" rows="2"></textarea></label>
  `;
  els.appSaleChannelRows.appendChild(row);
  row.querySelector('[data-field="channel"]').value = item.channel || appSaleChannels[0] || "";
  ["costRange", "priceRange", "safeCancelTime", "reregisterTime", "deliveryPoints", "cancelPoints", "reregisterPoints", "afterSaleBoundary"].forEach((field) => {
    const input = row.querySelector(`[data-field="${field}"]`);
    if (input) input.value = item[field] || "";
  });
  row.querySelector(".delete-app-sale-channel-row").addEventListener("click", () => {
    row.remove();
    if (!els.appSaleChannelRows.children.length) addAppSaleChannelRow();
  });
}

function renderAppSaleChannelRows(details = []) {
  if (!els.appSaleChannelRows) return;
  els.appSaleChannelRows.innerHTML = "";
  const selectedChannel = els.appSaleChannelOptionSelect?.value || appSaleChannels[0] || defaultAppSaleChannels[0];
  const detail = details.find((item) => sameChannelName(item.channel, selectedChannel)) || details[0] || { ...emptyAppSaleChannelDetail(), channel: selectedChannel };
  addAppSaleChannelRow({ ...detail, channel: detail.channel || selectedChannel });
  syncVisibleAppSaleChannelSelect();
}

function collectAppSaleChannelDetails() {
  if (!els.appSaleChannelRows) return [];
  return [...els.appSaleChannelRows.querySelectorAll(".app-sale-channel-row")]
    .map((row) => {
      const value = (field) => String(row.querySelector(`[data-field="${field}"]`)?.value || "").trim();
      return normalizeAppSaleChannelDetail({
        id: row.dataset.id || makeId(),
        channel: els.appSaleChannelOptionSelect?.value || value("channel"),
        costRange: value("costRange"),
        priceRange: value("priceRange"),
        safeCancelTime: value("safeCancelTime"),
        reregisterTime: value("reregisterTime"),
        deliveryPoints: value("deliveryPoints"),
        cancelPoints: value("cancelPoints"),
        reregisterPoints: value("reregisterPoints"),
        afterSaleBoundary: value("afterSaleBoundary"),
      });
    })
    .filter((item) => item.channel || item.costRange || item.priceRange || item.safeCancelTime || item.reregisterTime || item.deliveryPoints || item.cancelPoints || item.reregisterPoints || item.afterSaleBoundary);
}

function appSaleChannelSummary(item) {
  const details = normalizeAppSaleChannelDetails(item);
  return details.map((detail) => detail.channel).filter(Boolean).join("\n") || item.purchaseChannels || "";
}

function appSalePricingSummary(item) {
  const details = normalizeAppSaleChannelDetails(item);
  return details.map((detail) => {
    const parts = [];
    if (detail.costRange) parts.push(`成本：${detail.costRange}`);
    if (detail.priceRange) parts.push(`售卖：${detail.priceRange}`);
    return parts.length ? `${detail.channel || "渠道"}：${parts.join("，")}` : "";
  }).filter(Boolean).join("\n") || item.channelPricing || "";
}

function appSaleFieldSummary(item, field) {
  const details = normalizeAppSaleChannelDetails(item);
  return details.map((detail) => detail[field] ? `${detail.channel || "渠道"}：${detail[field]}` : "").filter(Boolean).join("\n") || item[field] || "";
}

function saveAppSaleDetail(event) {
  event.preventDefault();
  const app = String(appSaleDetailForm.elements.app.value || "").trim();
  if (!app) {
    alert("请填写 APP 名称。");
    appSaleDetailForm.elements.app.focus();
    return;
  }
  const channelDetails = collectAppSaleChannelDetails();
  if (!channelDetails.length) {
    alert("请至少填写一条购买渠道明细。");
    addAppSaleChannelRow();
    return;
  }
  if (!Array.isArray(data.appSaleDetails)) data.appSaleDetails = [];
  const existing = data.appSaleDetails.find((item) => item.id === editingAppSaleDetailId) || data.appSaleDetails.find((item) => sameAppName(item.app, app));
  const mergedByChannel = new Map();
  normalizeAppSaleChannelDetails(existing || {}).forEach((item) => {
    const key = String(item.channel || "").trim().toLowerCase();
    if (key) mergedByChannel.set(key, item);
  });
  channelDetails.forEach((item) => {
    const key = String(item.channel || "").trim().toLowerCase();
    if (key) mergedByChannel.set(key, item);
  });
  const mergedChannelDetails = [...mergedByChannel.values()];
  const detail = {
    id: existing?.id || makeId(),
    app,
    channelDetails: mergedChannelDetails,
    purchaseChannels: mergedChannelDetails.map((item) => item.channel).filter(Boolean).join("\n"),
    channelPricing: mergedChannelDetails.map((item) => [item.channel, item.costRange ? `成本：${item.costRange}` : "", item.priceRange ? `售卖：${item.priceRange}` : ""].filter(Boolean).join(" / ")).filter(Boolean).join("\n"),
    safeCancelTime: appSaleFieldSummary({ channelDetails: mergedChannelDetails }, "safeCancelTime"),
    reregisterTime: appSaleFieldSummary({ channelDetails: mergedChannelDetails }, "reregisterTime"),
    deliveryPoints: appSaleFieldSummary({ channelDetails: mergedChannelDetails }, "deliveryPoints"),
    cancelPoints: appSaleFieldSummary({ channelDetails: mergedChannelDetails }, "cancelPoints"),
    reregisterPoints: appSaleFieldSummary({ channelDetails: mergedChannelDetails }, "reregisterPoints"),
    afterSaleBoundary: appSaleFieldSummary({ channelDetails: mergedChannelDetails }, "afterSaleBoundary"),
    updatedAt: new Date().toISOString(),
  };
  pushUndo();
  appSaleChannels = uniqueList([...appSaleChannels, ...mergedChannelDetails.map((item) => item.channel)]);
  data.appSaleChannels = appSaleChannels;
  const index = data.appSaleDetails.findIndex((item) => item.id === detail.id || sameAppName(item.app, app));
  if (index >= 0) data.appSaleDetails[index] = detail;
  else data.appSaleDetails.push(detail);
  data.appSaleDetails = uniqueAppSaleDetails(data.appSaleDetails);
  persist();
  clearAppSaleDetailForm();
  render();
  toast("已保存 APP 售卖要点");
}

function clearAppSaleDetailForm() {
  editingAppSaleDetailId = null;
  if (!appSaleDetailForm) return;
  appSaleDetailForm.reset();
  renderAppSaleChannelRows();
}

function fillAppSaleDetailForm(item) {
  if (!item || !appSaleDetailForm) return;
  editingAppSaleDetailId = item.id;
  appSaleDetailForm.elements.app.value = item.app || "";
  renderAppSaleChannelRows(normalizeAppSaleChannelDetails(item));
}

function fillAppSaleDetailFromSelectedApp() {
  if (!appSaleDetailForm) return;
  const app = String(appSaleDetailForm.elements.app.value || "").trim();
  const item = (data.appSaleDetails || []).find((detail) => sameAppName(detail.app, app));
  if (!item) {
    editingAppSaleDetailId = null;
    return;
  }
  fillAppSaleDetailForm(item);
}

function renderAppSaleDetails() {
  if (!els.appSaleDetailTable) return;
  const appItems = [...(data.appSaleDetails || [])]
    .sort((a, b) => String(a.app || "").localeCompare(String(b.app || ""), "zh-CN"));
  renderAppSaleDetailFilter(appItems);
  const selectedApp = appSaleDetailFilterValue === "all" ? "" : appSaleDetailFilterValue;
  const rows = appItems
    .filter((item) => !selectedApp || sameAppName(item.app, selectedApp))
    .flatMap((item) => {
      const details = normalizeAppSaleChannelDetails(item);
      return (details.length ? details : [emptyAppSaleChannelDetail()]).map((detail) => ({ item, detail }));
    });
  els.appSaleDetailTable.innerHTML = financeTable(
    ["APP", "购买渠道", "成本区间", "售卖区间", "安全注销", "重新注册", "交付要点", "注销要点", "再次注册", "售后边界", "操作"],
    rows.map(({ item, detail }) => [
      item.app || "未填写",
      detail.channel || "未填写",
      detail.costRange || "",
      detail.priceRange || "",
      detail.safeCancelTime || "",
      detail.reregisterTime || "",
      detail.deliveryPoints || "",
      detail.cancelPoints || "",
      detail.reregisterPoints || "",
      detail.afterSaleBoundary || "",
      { html: `<button class="text-button edit-app-sale-detail" type="button" data-id="${escapeAttr(item.id)}" data-channel="${escapeAttr(detail.channel || "")}">编辑</button><button class="danger-button delete-app-sale-detail" type="button" data-id="${escapeAttr(item.id)}">删除APP</button>` },
    ]),
    11,
    selectedApp ? "这个 APP 暂无售卖要点数据" : "暂无 APP 售卖要点数据",
  );
  els.appSaleDetailTable.querySelectorAll(".edit-app-sale-detail").forEach((button) => {
    button.addEventListener("click", () => editAppSaleDetail(button.dataset.id, button.dataset.channel));
  });
  els.appSaleDetailTable.querySelectorAll(".delete-app-sale-detail").forEach((button) => {
    button.addEventListener("click", () => deleteAppSaleDetail(button.dataset.id));
  });
}

function renderAppSaleDetailFilter(items) {
  if (!els.appSaleDetailFilter) return;
  const apps = uniqueList(items.map((item) => item.app));
  if (appSaleDetailFilterValue !== "all" && !apps.some((app) => sameAppName(app, appSaleDetailFilterValue))) {
    appSaleDetailFilterValue = "all";
  }
  els.appSaleDetailFilter.innerHTML = option("全部APP", "all") + apps.map((app) => option(app)).join("");
  els.appSaleDetailFilter.value = appSaleDetailFilterValue;
}
function editAppSaleDetail(id, channel = "") {
  const item = (data.appSaleDetails || []).find((detail) => detail.id === id);
  if (!item || !appSaleDetailForm) return;
  if (channel && els.appSaleChannelOptionSelect) els.appSaleChannelOptionSelect.value = channel;
  fillAppSaleDetailForm(item);
  appSaleDetailForm.scrollIntoView({ behavior: "smooth", block: "start" });
}
function deleteAppSaleDetail(id) {
  if (!confirm("确定删除这个 APP 售卖要点？")) return;
  pushUndo();
  data.appSaleDetails = (data.appSaleDetails || []).filter((item) => item.id !== id);
  persist();
  clearAppSaleDetailForm();
  render();
  toast("已删除 APP 售卖要点");
}
function customerAnalysisRows() {
  const customers = new Map();
  paidRecords().forEach((item) => {
    const contacts = customerContacts(item);
    contacts.forEach((contact) => {
      const nickname = contact.nickname || "\u672a\u586b\u5199\u6635\u79f0";
      if (!customers.has(nickname)) {
        customers.set(nickname, {
          nickname,
          platforms: new Set(),
          dates: [],
          count: 0,
          total: 0,
        });
      }
      const row = customers.get(nickname);
      if (contact.platform) row.platforms.add(contact.platform);
      const date = recordDate(item);
      if (date) row.dates.push(date);
      row.count += 1;
      row.total += Number(item.price || 0);
    });
  });

  return [...customers.values()]
    .map((row) => {
      const dates = row.dates.sort();
      return {
        ...row,
        platforms: [...row.platforms].sort((a, b) => a.localeCompare(b, "zh-CN")),
        firstDate: dates[0] || "",
        lastDate: dates[dates.length - 1] || "",
      };
    })
    .sort((a, b) => b.total - a.total || b.count - a.count || a.nickname.localeCompare(b.nickname, "zh-CN"));
}

function customerContacts(item) {
  const contacts = contactEntries(item).filter((contact) => contact.nickname || contact.platform);
  if (contacts.length) return contacts;
  return [{ platform: item.contactPlatform || "", nickname: item.nickname || "" }];
}

function customerPeriodText(row) {
  if (!row.firstDate || !row.lastDate) return "\u672a\u586b\u5199\u65e5\u671f";
  const days = daysBetween(row.firstDate, row.lastDate) + 1;
  if (days <= 1) return "\u540c\u4e00\u5929";
  return `${days}\u5929`;
}

function customerFrequencyText(row) {
  if (!row.count) return "-";
  if (!row.firstDate || !row.lastDate) return `${row.count}\u6b21`;
  const days = daysBetween(row.firstDate, row.lastDate) + 1;
  if (row.count === 1) return "\u9996\u6b21\u6d88\u8d39";
  const averageDays = Math.max(1, days / row.count);
  const monthlyAverage = row.count / Math.max(days / 30, 1);
  return `\u7ea6${formatDecimal(averageDays)}\u5929/\u6b21 \u00b7 \u6708\u5747${formatDecimal(monthlyAverage)}\u6b21`;
}

function recordDate(item) {
  if (item?.date) return item.date;
  if (item?.updatedAt) return String(item.updatedAt).slice(0, 10);
  return "";
}

function daysBetween(startDate, endDate) {
  const start = parseDateSafe(startDate);
  const end = parseDateSafe(endDate);
  if (!start || !end) return 0;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
}

function formatDecimal(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function financeTable(headers, rows, colspan, emptyText = "\u6682\u65e0\u8d22\u52a1\u6570\u636e") {
  const head = `<tr>${headers.map((item) => `<th>${escapeHtml(item)}</th>`).join("")}</tr>`;
  if (!rows.length) return `${head}<tr><td colspan="${colspan}" class="empty-state">${escapeHtml(emptyText)}</td></tr>`;
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
  const matrixPlatforms = matrixVisiblePlatforms();
  const header = `<tr><th>\u624b\u673a\u53f7</th>${matrixPlatforms.map((name) => `<th>
    <div class="matrix-head">
      <span>${escapeHtml(name)}</span>
    </div>
  </th>`).join("")}</tr>`;
  const selectedPhone = selectedPhoneFilter();
  const visiblePhones = groupedMatrixPhones(data.phones.filter((phone) =>
    isActivePhone(phone) &&
    (!selectedPhone || phone.id === selectedPhone.id) &&
    matrixPhoneMatches(phone, records)
  ));
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
            <strong>${escapeHtml(statusLabel(item.status))}${item.price ? ` 路 ${currency(item.price)}` : ""}</strong>
            <span>${escapeHtml([contactText(item), item.date].filter(Boolean).join(" / "))}</span>
            <span>${escapeHtml(loginCheckText(item))}</span>
            <span>${escapeHtml(registerableText(item))}</span>
            <span>${escapeHtml(actualCancelText(item))}</span>
            <span class="manual-note">${escapeHtml(statusNoteText(item))}</span>
            <span class="manual-note">${escapeHtml(item.note || "")}</span>
          </div>`).join("");
        const actions = blockedPlatform ? "" : `<div class="cell-actions"><button class="cell-add" type="button" data-phone="${escapeAttr(phone.number)}" data-platform="${escapeAttr(platform)}">+ \u8ffd\u52a0</button><button class="cell-paste" type="button" data-phone="${escapeAttr(phone.number)}" data-platform="${escapeAttr(platform)}">\u7c98\u8d34</button></div>`;
        return `<td><div class="cell filled">${entries}${actions}</div></td>`;
      });
      return `<tr><td><div class="phone-cell-actions"><button class="phone-copy" type="button" data-phone="${escapeAttr(phone.number)}">\u590d\u5236</button><button class="phone-row-move" type="button" data-phone-id="${escapeAttr(phone.id)}" data-direction="-1" title="\u4e0a\u79fb">\u4e0a\u79fb</button><button class="phone-row-move" type="button" data-phone-id="${escapeAttr(phone.id)}" data-direction="1" title="\u4e0b\u79fb">\u4e0b\u79fb</button><button class="phone-archive" type="button" data-phone-id="${escapeAttr(phone.id)}" data-status="cancelled">\u6ce8\u9500</button><button class="phone-archive" type="button" data-phone-id="${escapeAttr(phone.id)}" data-status="blocked">\u5c01\u7981</button></div><div class="matrix-phone-line"><strong class="matrix-phone-number">${escapeHtml(phone.number)}</strong>${matrixDeviceTags(phone)}</div><span>${escapeHtml(matrixPhoneSummary(phone))}</span><span class="${phoneProfit(phone) < 0 ? "negative" : "profit"}">${escapeHtml(matrixPhoneProfitText(phone))}</span>${matrixRechargeControl(phone)}</td>${cells.join("")}</tr>`;
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
  els.matrixTable.querySelectorAll(".phone-recharge-status").forEach((select) => {
    select.addEventListener("click", (event) => event.stopPropagation());
    select.addEventListener("change", (event) => {
      event.stopPropagation();
      updatePhoneRechargeStatus(select.dataset.phoneId, select.value);
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
      node.querySelector(".record-title").textContent = `${phone?.number || "\u672a\u77e5\u624b\u673a\u53f7"} 路 ${item.platform}`;
      node.querySelector(".record-meta").textContent = [
        item.price ? currency(item.price) : "",
        contactText(item),
        item.date,
        loginCheckText(item),
        registerableText(item),
        actualCancelText(item),
        statusNoteText(item),
      ].filter(Boolean).join(" / ");
      node.querySelector(".record-note").textContent = item.note || "\u65e0\u5907\u6ce8";
      const badge = node.querySelector(".badge");
      badge.textContent = statusLabel(item.status);
      badge.classList.add(statusTone(item.status));
      if (loginCheckNeedsAction(item)) node.querySelector(".record-card").classList.add("cancel-due");
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
        <div><dt>\u6ce8\u518c\u65f6\u95f4</dt><dd>${escapeHtml(phone.registrationDate || "\u672a\u586b\u5199")}</dd></div>
        <div><dt>\u8fd0\u8425\u5546</dt><dd>${escapeHtml(phone.carrier || "\u672a\u586b\u5199")}</dd></div>
        <div><dt>\u5361\u7c7b\u578b</dt><dd>${escapeHtml(cardCategoryLabel(phone.cardCategory || inferCardCategory(phone.carrier)))}</dd></div>
        <div><dt>\u4e3b\u526f\u5361</dt><dd>${escapeHtml(phone.simRole || "\u672a\u586b\u5199")}</dd></div>
        <div><dt>\u5957\u9910\u6d41\u91cf</dt><dd>${escapeHtml(phone.dataPlan || "\u672a\u586b\u5199")}</dd></div>
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
  return [phone.number, phone.deviceNo ? `\u8bbe\u5907 ${phone.deviceNo}` : "", phone.slotNo ? `\u5361\u69fd ${phone.slotNo}` : "", phone.simRole, phone.dataPlan, phone.carrier].filter(Boolean).join(" / ");
}

function matrixRechargeControl(phone) {
  if (!isRegistrationCard(phone)) return "";
  const rechargeMonth = currentMonth();
  const rechargeStatus = monthlyRechargeStatus(phone, rechargeMonth);
  return `<label class="recharge-control matrix-recharge">
    <span>\u672c\u6708\u5145\u503c</span>
    <select class="phone-recharge-status" data-phone-id="${escapeAttr(phone.id)}">
      ${rechargeStatusOption("", "\u672a\u8bb0\u5f55", rechargeStatus)}
      ${rechargeStatusOption("unpaid", "\u672a\u5145\u503c", rechargeStatus)}
      ${rechargeStatusOption("paid", "\u5df2\u5145\u503c", rechargeStatus)}
    </select>
  </label>`;
}

function matrixDeviceTags(phone) {
  return [
    phone?.registrationDate ? `\u6ce8\u518c ${phone.registrationDate}` : "",
    phone?.deviceNo ? `\u8bbe\u5907 ${phone.deviceNo}` : "",
    phone?.slotNo ? `\u5361\u69fd ${phone.slotNo}` : "",
    phone?.simRole || "",
    phone?.dataPlan ? `\u6d41\u91cf ${phone.dataPlan}` : "",
  ].filter(Boolean).map((item) => `<span class="matrix-phone-tag">${escapeHtml(item)}</span>`).join("");
}

function rechargeStatusOption(value, label, selected) {
  return `<option value="${escapeAttr(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
}

function updatePhoneRechargeStatus(phoneId, status) {
  const phone = phoneById(phoneId);
  if (!phone) return;
  pushUndo();
  const month = currentMonth();
  phone.monthlyRecharges = normalizeMonthlyRecharges(phone.monthlyRecharges);
  if (status) {
    phone.monthlyRecharges[month] = {
      status,
      updatedAt: new Date().toISOString(),
    };
  } else {
    delete phone.monthlyRecharges[month];
  }
  persist();
  render();
  toast(status ? `\u5df2\u8bb0\u5f55${month}\u5145\u503c\u72b6\u6001` : `\u5df2\u6e05\u9664${month}\u5145\u503c\u72b6\u6001`);
}

function monthlyRechargeStatus(phone, month = currentMonth()) {
  return normalizeMonthlyRecharges(phone?.monthlyRecharges)[month]?.status || "";
}

function monthlyRechargeLabel(status) {
  if (status === "paid") return "\u5df2\u5145\u503c";
  if (status === "unpaid") return "\u672a\u5145\u503c";
  return "\u672a\u8bb0\u5f55";
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
          <strong>${escapeHtml(carrier)} 路 ${carrierPhones.length} \u5f20\u5361</strong>
          <p>${escapeHtml(carrierPhones.map((phone) => `${phone.number}${phone.deviceNo ? ` / \u8bbe\u5907${phone.deviceNo}` : ""}${phone.slotNo ? ` / \u5361\u69fd${phone.slotNo}` : ""}`).join("\uff1b"))}</p>
        </div>`).join("");
      return `<article class="person-card">
        <h2>${escapeHtml(name)} 路 ${phones.length} \u5f20\u5361 路 \u4eba\u5458\u6210\u672c ${currency(personCost)}</h2>
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
        <strong>${escapeHtml(phone.number)} 路 ${escapeHtml(phoneArchiveLabel(phone))}</strong>
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
  const platform = selectedPlatformFilter();
  const phoneFilter = selectedPhoneFilter();
  const carrier = selectedCarrierFilter();
  const status = selectedStatusFilter();
  return data.records.filter((item) => {
    const phone = phoneById(item.phoneId);
    const haystack = [phone?.number, phoneSummary(phone), phone?.registrationDate, phone?.personName, phone?.carrier, phone?.deviceNo, phone?.slotNo, phone?.simRole, phone?.dataPlan, item.platform, contactText(item), item.date, loginCheckText(item), registerableText(item), item.actualCancelDate, statusNoteText(item), item.note, statusLabel(item.status)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return (!text || haystack.includes(text)) &&
      (!phoneFilter || item.phoneId === phoneFilter.id) &&
      (!carrier || phone?.carrier === carrier) &&
      (!platform || item.platform === platform) &&
      (status === "all" || item.status === status) &&
      recordMatchesMatrixQuickFilter(item);
  });
}

function phoneMatches(phone, records) {
  const text = els.searchInput.value.trim().toLowerCase();
  const carrier = selectedCarrierFilter();
  if (carrier && phone?.carrier !== carrier) return false;
  const recordFilterActive = Boolean(matrixQuickFilter || selectedStatusFilter() !== "all");
  const hasVisibleRecord = records.some((item) => item.phoneId === phone.id);
  const phoneTextMatches = [phone.number, phoneSummary(phone), phone.registrationDate, phone.personName, phone.carrier, phone.deviceNo, phone.slotNo, phone.simRole, phone.dataPlan]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(text);
  if (recordFilterActive && !hasVisibleRecord) return false;
  if (!text) return true;
  return phoneTextMatches || hasVisibleRecord;
}

function matrixPhoneMatches(phone, records) {
  if (shouldShowAllPhonesForSelectedApp()) {
    const carrier = selectedCarrierFilter();
    return !carrier || phone?.carrier === carrier;
  }
  return phoneMatches(phone, records);
}

function shouldShowAllPhonesForSelectedApp() {
  return Boolean(selectedPlatformFilter()) &&
    !els.searchInput.value.trim() &&
    !matrixQuickFilter &&
    selectedStatusFilter() === "all";
}

function toggleMatrixQuickFilter(filter) {
  matrixQuickFilter = matrixQuickFilter === filter ? "" : filter;
  if (matrixQuickFilter) {
    els.searchInput.value = "";
    els.phoneFilter.value = "";
    els.platformFilter.value = "";
    els.statusFilter.value = "all";
  }
  switchView("matrix");
  render();
  const label = matrixQuickFilter === "cancelable" ? "\u53ef\u6ce8\u9500" : matrixQuickFilter === "login" ? "\u53ef\u767b\u5f55" : "";
  toast(label ? `\u5df2\u5728\u77e9\u9635\u663e\u793a${label}\u8d26\u53f7` : "\u5df2\u53d6\u6d88\u5feb\u6377\u7b5b\u9009");
}

function recordMatchesMatrixQuickFilter(item) {
  if (matrixQuickFilter === "cancelable") return isCancelableRecord(item);
  if (matrixQuickFilter === "login") return loginCheckNeedsAction(item);
  return true;
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
  form.elements.date.value = item.date || "";  form.elements.registerableDate.value = item.registerableDate || "";
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
  form.elements.registrationDate.value = phone.registrationDate || phoneActivationDate(phone) || "";
  form.elements.carrier.value = phone.carrier || "";
  form.elements.cardCategory.value = phone.cardCategory || inferCardCategory(phone.carrier) || "";
  form.elements.deviceNo.value = phone.deviceNo || "";
  form.elements.slotNo.value = phone.slotNo || "";
  form.elements.simRole.value = phone.simRole || "";
  form.elements.dataPlan.value = phone.dataPlan || "";
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

function matrixVisiblePlatforms() {
  const selected = selectedPlatformFilter();
  if (selected) return [selected];
  return sortedMatrixPlatforms();
}

function selectedPlatformFilter() {
  const value = els.platformFilter.value.trim();
  return platforms.includes(value) ? value : "";
}

function selectedPhoneFilter() {
  const value = els.phoneFilter.value.trim();
  return data.phones.find((phone) => phone.number === value) || null;
}

function selectedCarrierFilter() {
  const value = els.carrierFilter.value;
  return value === "all" ? "" : value;
}

function selectedStatusFilter() {
  return els.statusFilter.value || "all";
}

function renderCarrierFilterOptions() {
  const selected = els.carrierFilter.value || "all";
  const carriers = uniqueList(data.phones.map((phone) => phone.carrier)).sort((a, b) => a.localeCompare(b, "zh-CN"));
  els.carrierFilter.innerHTML = option("\u5168\u90e8\u8fd0\u8425\u5546", "all") + carriers.map((carrier) => option(carrier)).join("");
  els.carrierFilter.value = carriers.includes(selected) ? selected : "all";
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
    date: item.date,    registerableDate: item.registerableDate,
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
    date: formatDate(startOfToday()),
    loginCheckLogs: [],
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
    appSaleChannels: cloneData(appSaleChannels),
    editingId,
    editingAppSaleDetailId,
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
  appSaleChannels = cloneData(snapshot.appSaleChannels || data.appSaleChannels || defaultAppSaleChannels);
  data.platforms = platforms;
  data.appSaleChannels = appSaleChannels;
  editingId = snapshot.editingId;
  editingAppSaleDetailId = snapshot.editingAppSaleDetailId || null;
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
  persistLocalOnly();
  setSyncStatus("\u672c\u5730\u5df2\u4fdd\u5b58");
  if (syncEnabled) saveRemoteData();
  scheduleGitHubSync();
}

function persistLocalOnly() {
  data.platforms = platforms;
  data.appSaleChannels = appSaleChannels;
  localStorage.setItem(storageKey, JSON.stringify(data));
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
  setSyncStatus("\u5df2\u914d\u7f6e\u540c\u6b65", "ok");
  const remote = await loadGitHubData();
  if (remote) {
    if (confirm("\u5df2\u627e\u5230 GitHub \u4e0a\u7684\u6570\u636e\uff0c\u662f\u5426\u62c9\u53d6\u5e76\u8986\u76d6\u5f53\u524d\u9875\u9762\u6570\u636e\uff1f")) {
      pushUndo();
      data = remote;
      platforms = data.platforms || [...defaultPlatforms];
      appSaleChannels = data.appSaleChannels || [...defaultAppSaleChannels];
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

function setSyncStatus(message, tone = "") {
  if (!els.syncStatus) return;
  els.syncStatus.textContent = message;
  els.syncStatus.className = `sync-status ${tone}`.trim();
}

function scheduleGitHubSync() {
  const config = getGitHubConfig();
  if (!config.repo || !config.token) {
    setSyncStatus("\u672c\u5730\u5df2\u4fdd\u5b58\uff0c\u672a\u914d\u7f6e\u540c\u6b65", "warn");
    return;
  }
  clearTimeout(githubSyncTimer);
  setSyncStatus("3\u79d2\u540e\u81ea\u52a8\u540c\u6b65", "pending");
  githubSyncTimer = setTimeout(() => saveGitHubData(false), 3000);
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
  if (!config.repo || !config.token) {
    setSyncStatus("\u672c\u5730\u5df2\u4fdd\u5b58\uff0c\u672a\u914d\u7f6e\u540c\u6b65", "warn");
    return false;
  }
  try {
    clearTimeout(githubSyncTimer);
    setSyncStatus("\u6b63\u5728\u540c\u6b65", "pending");
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
    if (!response.ok) {
      setSyncStatus("\u540c\u6b65\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5Token", "error");
      if (showErrors) alert("\u4e0a\u4f20 GitHub \u5931\u8d25\uff0c\u8bf7\u68c0\u67e5 Token \u6743\u9650\u3002");
      return false;
    }
    setSyncStatus(`\u5df2\u540c\u6b65 ${new Date().toLocaleTimeString("zh-CN", { hour12: false })}`, "ok");
    return true;
  } catch {
    setSyncStatus("\u540c\u6b65\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u6216Token", "error");
    if (showErrors) alert("\u4e0a\u4f20 GitHub \u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u3002");
    return false;
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
      appSaleChannels = data.appSaleChannels || [...defaultAppSaleChannels];
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
  if (phone?.registrationDate) return phone.registrationDate;
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
  return [phone?.personName ? `\u59d3\u540d ${phone.personName}` : "", cardCategoryLabel(phone?.cardCategory || inferCardCategory(phone?.carrier)), phone?.carrier, phone?.simRole, phone?.dataPlan, deviceSummary(phone), `\u6210\u672c ${currency(phoneTotalCost(phone))}`].filter(Boolean).join(" 路 ");
}

function matrixPhoneSummary(phone) {
  return [phone?.personName || "", phone?.carrier || ""].filter(Boolean).join(" 路 ");
}

function phoneProfit(phone) {
  const income = recordsTotal(data.records.filter((item) => item.phoneId === phone?.id && hasRecordPrice(item)));
  return income - phoneTotalCost(phone);
}

function matrixPhoneProfitText(phone) {
  return `\u5229\u6da6 ${currency(phoneProfit(phone))}`;
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
  return name === "qq" || name === "\u5c0f\u7ea2\u4e66" || name === "\u5fae\u535a";
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
  if (platform === "TG") return "contactNickname_tg";
  return "contactNickname_wechat";
}

function loginCheckDueRecords() {
  return data.records.filter(loginCheckNeedsAction);
}

function cancelableRecords() {
  return data.records.filter(isCancelableRecord);
}

function isCancelableRecord(item) {
  return normalizeStatus(item?.status) === "sold_pending_cancel";
}

function loginCheckNeedsAction(item) {
  return loginCheckState(item).isDue && !hasLoginCheckLog(item);
}

function hasLoginCheckLog(item) {
  return Array.isArray(item?.loginCheckLogs) && item.loginCheckLogs.length > 0;
}

function loginCheckText(item) {
  const state = loginCheckState(item);
  if (!state.dueDate) return "";
  if (state.isDue) return `\u53ef\u767b\u5f55\u67e5\u770b\uff1a${state.dueDate}`;
  return `\u5f85\u767b\u5f55\u67e5\u770b\uff1a${state.dueDate}`;
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

function renderReminderHints() {}

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
  const mergedAppSaleChannels = uniqueList([
    ...(Array.isArray(next.appSaleChannels) ? next.appSaleChannels : [...defaultAppSaleChannels]),
    ...(Array.isArray(next.appSaleDetails) ? next.appSaleDetails.flatMap((item) => normalizeAppSaleChannelDetails(item).map((detail) => detail.channel)) : []),
  ]);
  return {
    platforms: mergedPlatforms,
    appSaleChannels: mergedAppSaleChannels,
    phones: next.phones.map((phone) => ({
      ...phone,
      cardFee: moneyValue(phone.cardFee),
      initialRecharge: moneyValue(phone.initialRecharge),
      monthlyRent: moneyValue(phone.monthlyRent),
      personName: phone.personName || phone.cardOwner || "",
      personCost: moneyValue(phone.personCost ?? phone.laborCost),
      registrationDate: phone.registrationDate || phone.activationDate || earliestPhoneRecordDate(next.records, phone.id),
      carrier: phone.carrier || phone.tag || "",
      cardCategory: phone.cardCategory || inferCardCategory(phone.carrier || phone.tag || ""),
      deviceNo: phone.deviceNo || "",
      slotNo: phone.slotNo || "",
      simRole: phone.simRole || "",
      dataPlan: phone.dataPlan || phone.packageFlow || phone.trafficPlan || "",
      phoneStatus: phone.phoneStatus || "active",
      blockReason: phone.blockReason || "",
      archivedAt: phone.archivedAt || "",
      monthlyRecharges: normalizeMonthlyRecharges(phone.monthlyRecharges || phone.rechargeMonths),
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
      registerableDate: item.registerableDate || "",
      actualCancelDate: item.actualCancelDate || "",
    })),
    channelSales: (Array.isArray(next.channelSales) ? next.channelSales : []).map((item) => ({
      ...item,
      id: item.id || makeId(),
      date: item.date || formatDate(startOfToday()),
      product: item.product || "",
      contacts: channelSaleContacts(item),
      tradeContacts: channelSaleTradeContacts(item),
      payments: channelSalePayments(item),
      paymentMethods: channelSalePayments(item).map((payment) => payment.method),
      paymentText: channelSalePaymentText(item),
      contactPlatforms: channelSaleContacts(item).map((contact) => contact.platform),
      tradePlatforms: channelSaleTradeContacts(item).map((contact) => contact.platform),
      customer: channelSaleCustomerText(item),
      platform: channelSalePlatformText(item),
      tradeCustomer: channelSaleTradeCustomerText(item),
      tradePlatform: channelSaleTradePlatformText(item),
      amount: moneyValue(item.amount ?? item.price),
      cost: moneyValue(item.cost),
      note: item.note || "",
      updatedAt: item.updatedAt || new Date().toISOString(),
    })),
    appSaleDetails: uniqueAppSaleDetails((Array.isArray(next.appSaleDetails) ? next.appSaleDetails : []).map((item) => {
      const channelDetails = normalizeAppSaleChannelDetails(item);
      return {
        ...item,
        id: item.id || makeId(),
        app: item.app || item.platform || "",
        channelDetails,
        purchaseChannels: channelDetails.map((detail) => detail.channel).filter(Boolean).join("\n") || item.purchaseChannels || legacyPurchaseChannels(item),
        channelPricing: channelDetails.map((detail) => [detail.channel, detail.costRange ? `成本：${detail.costRange}` : "", detail.priceRange ? `售卖：${detail.priceRange}` : ""].filter(Boolean).join(" / ")).filter(Boolean).join("\n") || item.channelPricing || legacyChannelPricing(item),
        safeCancelTime: item.safeCancelTime || appSaleFieldSummary({ channelDetails }, "safeCancelTime"),
        reregisterTime: item.reregisterTime || appSaleFieldSummary({ channelDetails }, "reregisterTime"),
        deliveryPoints: item.deliveryPoints || appSaleFieldSummary({ channelDetails }, "deliveryPoints"),
        cancelPoints: item.cancelPoints || appSaleFieldSummary({ channelDetails }, "cancelPoints"),
        reregisterPoints: item.reregisterPoints || appSaleFieldSummary({ channelDetails }, "reregisterPoints"),
        afterSaleBoundary: item.afterSaleBoundary || item.riskNotes || appSaleFieldSummary({ channelDetails }, "afterSaleBoundary"),
        updatedAt: item.updatedAt || new Date().toISOString(),
      };
    })),
  };
}

function normalizeAppSaleChannelDetail(item = {}) {
  return {
    id: item.id || makeId(),
    channel: item.channel || item.name || item.purchaseChannel || defaultAppSaleChannels[0],
    costRange: item.costRange || item.cost || "",
    priceRange: item.priceRange || item.price || "",
    safeCancelTime: item.safeCancelTime || "",
    reregisterTime: item.reregisterTime || "",
    deliveryPoints: item.deliveryPoints || "",
    cancelPoints: item.cancelPoints || "",
    reregisterPoints: item.reregisterPoints || "",
    afterSaleBoundary: item.afterSaleBoundary || item.riskNotes || "",
  };
}

function normalizeAppSaleChannelDetails(item = {}) {
  if (Array.isArray(item.channelDetails) && item.channelDetails.length) {
    return item.channelDetails.map(normalizeAppSaleChannelDetail);
  }
  const legacyText = [item.purchaseChannels || legacyPurchaseChannels(item), item.channelPricing || legacyChannelPricing(item)].filter(Boolean).join("\n");
  if (!legacyText && !item.safeCancelTime && !item.reregisterTime && !item.deliveryPoints && !item.cancelPoints && !item.reregisterPoints && !item.afterSaleBoundary && !item.riskNotes) return [];
  const firstLine = String(item.purchaseChannels || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean)[0] || "";
  const channel = firstLine.includes("：") ? firstLine.split("：")[0].trim() : firstLine.includes(":") ? firstLine.split(":")[0].trim() : defaultAppSaleChannels[0];
  return [normalizeAppSaleChannelDetail({
    channel,
    costRange: item.costRange || "",
    priceRange: item.priceRange || "",
    safeCancelTime: item.safeCancelTime || "",
    reregisterTime: item.reregisterTime || "",
    deliveryPoints: [item.purchaseChannels || legacyPurchaseChannels(item), item.channelPricing || legacyChannelPricing(item), item.deliveryPoints].filter(Boolean).join("\n"),
    cancelPoints: item.cancelPoints || "",
    reregisterPoints: item.reregisterPoints || "",
    afterSaleBoundary: item.afterSaleBoundary || item.riskNotes || "",
  })];
}
function legacyPurchaseChannels(item) {
  return [item.customerType ? `适合客户：${item.customerType}` : "", item.sellingPoints ? `原售卖要点：${item.sellingPoints}` : ""]
    .filter(Boolean)
    .join("\n");
}

function legacyChannelPricing(item) {
  return [item.costRange ? `成本区间：${item.costRange}` : "", item.priceRange ? `售价区间：${item.priceRange}` : ""]
    .filter(Boolean)
    .join("\n");
}
function earliestPhoneRecordDate(records, phoneId) {
  return (Array.isArray(records) ? records : [])
    .filter((item) => item.phoneId === phoneId && item.date)
    .map((item) => item.date)
    .sort()[0] || "";
}

function uniqueList(items) {
  return [...new Set(items.map((item) => String(item).trim()).filter(Boolean))];
}

function normalizeMonthlyRecharges(value) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(Object.entries(value).map(([month, item]) => {
    const rawStatus = typeof item === "string" ? item : item?.status;
    const status = rawStatus === "paid" || rawStatus === "unpaid" ? rawStatus : "";
    return [month, {
      status,
      updatedAt: typeof item === "object" && item?.updatedAt ? item.updatedAt : "",
    }];
  }).filter(([, item]) => item.status));
}

function currency(value) {
  return `\u00a5${Number(value || 0).toLocaleString("zh-CN")}`;
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

