/* =========================================
   KC-AiOS Dashboard Framework v1
   全站共用核心 (core.js)
   ========================================= */

window.KCAiOS = (() => {

  /* -----------------------------
     1. 讀取 JSON（含完整防呆）
  ----------------------------- */
  async function loadJSON(basePath, file) {
    const url = `${basePath}/${file}.json?t=${Date.now()}`;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        console.warn(`[KC AiOS] 無法讀取：${file}.json (${res.status})`);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error(`[KC AiOS] JSON 載入失敗：${file}.json`, err);
      return null;
    }
  }

  /* -----------------------------
     2. 讀取今日資料（latest → 今日）
  ----------------------------- */
  async function loadToday(basePath) {
    let data = await loadJSON(basePath, "latest");
    if (data) return data;

    const today = new Date().toISOString().slice(0, 10);
    return await loadJSON(basePath, today);
  }

  /* -----------------------------
     3. 讀取昨日資料（可有可無）
  ----------------------------- */
  async function loadYesterday(basePath) {
    return await loadJSON(basePath, "yesterday");
  }

  /* -----------------------------
     4. 計算名次變化
  ----------------------------- */
  function calcDelta(item, yMap) {
    const yRank = yMap[item.code];
    if (yRank === undefined) return { label: "🆕 新進榜", cls: "delta-new" };
    if (yRank > item.rank) return { label: `⬆ +${yRank - item.rank}`, cls: "delta-up" };
    if (yRank < item.rank) return { label: `⬇ -${item.rank - yRank}`, cls: "delta-down" };
    return { label: "⏸", cls: "delta-same" };
  }

  /* -----------------------------
     5. 渲染 Meta 區塊
  ----------------------------- */
  function renderMeta(metaDOM, todayData, yData) {
    const date = todayData.date || "N/A";
    const count = todayData.items?.length ?? 0;
    const y = yData ? yData.date : "無";

    metaDOM.textContent = `日期：${date} ｜ 筆數：${count} ｜ 昨日：${y}`;
  }

  /* -----------------------------
     6. 渲染表格
  ----------------------------- */
  function renderTable(container, todayData, yMap, range) {
    if (!todayData?.items) {
      container.innerHTML = `<div class="error">❌ 無法載入資料 data/</div>`;
      return;
    }

    const items = todayData.items.slice(0, range);

    let html = `
      <table>
        <thead>
          <tr>
            <th>Rank</th><th>變化</th>
            <th>代碼</th><th>名稱</th>
            <th>收盤價</th><th>漲跌幅 (%)</th>
          </tr>
        </thead><tbody>
    `;

    items.forEach(item => {
      const delta = calcDelta(item, yMap);
      const close = Number(item.close);
      const pct = Number(item.changePct);
      const cls = pct >= 0 ? "up" : "down";

      html += `
        <tr>
          <td>${item.rank}</td>
          <td class="${delta.cls}">${delta.label}</td>
          <td>${item.code}</td>
          <td>${item.name}</td>
          <td>${close.toFixed(2)}</td>
          <td class="${cls}">${pct.toFixed(2)}</td>
        </tr>
      `;
    });

    html += "</tbody></table>";
    container.innerHTML = html;
  }

  return {
    loadToday,
    loadYesterday,
    renderMeta,
    renderTable
  };

})();
