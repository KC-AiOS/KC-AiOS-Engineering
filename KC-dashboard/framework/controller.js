import { State } from "./state.js";
import { loadToday, loadYesterday } from "./loader.js";
import { renderMeta, renderTableRange } from "./renderer.js";

export async function run(basePath) {
  const today = await loadToday(basePath);
  const yesterday = await loadYesterday(basePath);

  State.todayData = today;
  State.yesterdayData = yesterday;
  State.yesterdayMap = buildMap(yesterday);

  renderMeta(
    document.querySelector("#meta"),
    today,
    yesterday
  );

  renderTableRange(
    document.querySelector("#content"),
    today.items,
    State.yesterdayMap,
    State.currentRange
  );
}
