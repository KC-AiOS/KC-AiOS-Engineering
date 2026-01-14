// parser.js
import cheerio from "cheerio";

export function parseRanking(html) {
  const $ = cheerio.load(html);

  const result = [];
  let rank = 1;

  // 鉅亨排行表的 tbody
  $("table tbody tr").each((_, tr) => {
    const tds = $(tr).find("td");

    if (tds.length < 5) return;

    const code = $(tds[0]).text().trim();
    const name = $(tds[1]).text().trim();
    const close = parseFloat($(tds[2]).text().replace(",", ""));
    const changePct = parseFloat($(tds[4]).text().replace("%", ""));

    if (!code || isNaN(changePct)) return;

    result.push({
      rank,
      code,
      name,
      close,
      changePct
    });

    rank++;
  });

  return result;
}
