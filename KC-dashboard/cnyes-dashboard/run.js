// run.js
import fs from "fs";
import dayjs from "dayjs";
import { fetchRankingPage } from "./fetcher.js";
import { parseRanking } from "./parser.js";

async function run() {
  console.log("KC-WebTrace | Fetching cnyes ranking...");

  const html = await fetchRankingPage();
  const ranking = parseRanking(html);

  const today = dayjs().format("YYYY-MM-DD");

  const output = {
    source: "cnyes_ranking",
    date: today,
    count: ranking.length,
    items: ranking
  };

  fs.mkdirSync("./data", { recursive: true });
  fs.writeFileSync(
    `./data/${today}.json`,
    JSON.stringify(output, null, 2),
    "utf-8"
  );

  console.log(`Saved ./data/${today}.json`);
}

run().catch(err => {
  console.error("ERROR:", err);
});
