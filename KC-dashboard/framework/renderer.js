export function renderMeta(metaEl, today, yesterday) {
  const date = today?.date ?? "N/A";
  const count = today?.items?.length ?? 0;
  const y = yesterday?.date ?? "無";
  metaEl.textContent = `日期：${date} ｜ 筆數：${count} ｜ 昨日：${y}`;
}

export function renderTableRange(container, items, yesterdayMap, range) {
  const slice = items.slice(0, range);
  let html = `<table>…`;

  // (省略生成表格的迴圈)

  container.innerHTML = html;
}
