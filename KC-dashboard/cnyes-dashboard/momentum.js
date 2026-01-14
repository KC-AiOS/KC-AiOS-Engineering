async function calcMomentum(code, dates) {
  let streak = 0;

  for (let i = dates.length - 1; i >= 0; i--) {
    const date = dates[i];
    const data = await loadJSON(date);
    if (!data) break;

    const exists = data.items.some(item => item.code === code);
    if (exists) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
