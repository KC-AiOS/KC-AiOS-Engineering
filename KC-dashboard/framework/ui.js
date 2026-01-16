export function setupRangeSelector(selector, callback) {
  const buttons = selector.querySelectorAll(".range-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      callback(Number(btn.dataset.range));
    });
  });
}
