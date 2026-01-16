export async function loadJSON(basePath, file) {
  try {
    const url = `${basePath}/data/${file}.json?t=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function loadToday(basePath) {
  const latest = await loadJSON(basePath, "latest");
  if (latest) return latest;

  const today = new Date().toISOString().slice(0, 10);
  return await loadJSON(basePath, today);
}

export async function loadYesterday(basePath) {
  return await loadJSON(basePath, "yesterday");
}
