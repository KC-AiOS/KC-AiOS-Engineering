// app.js - single entrypoint (UI Contract driven)

function $(key){
  return document.querySelector(`[data-kc="${key}"]`);
}
function $all(key){
  return document.querySelectorAll(`[data-kc="${key}"]`);
}

function safeText(el, text){
  if(!el) return;
  el.textContent = String(text);
}

function setStatus(s){
  safeText($("status"), s);
}

function rowTemplate(t="", r="", isR=true){
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input data-kc="lm80-time" value="${t}"></td>
    <td><input data-kc="lm80-flux" value="${r}"></td>
    <td style="text-align:center"><input type="checkbox" data-kc="lm80-isr" ${isR ? "checked": ""}></td>
    <td style="text-align:center"><button data-kc="btn-del-row">Del</button></td>
  `;
  return tr;
}

function addRow(t="", r="", isR=true){
  const body = $("lm80-body");
  if(!body){
    console.warn("lm80-body not found");
    return;
  }
  const tr = rowTemplate(t, r, isR);
  tr.querySelector(`[data-kc="btn-del-row"]`).addEventListener("click", ()=>{
    tr.remove();
  });
  body.appendChild(tr);
}

function seedExample(){
  // 清掉現有
  const body = $("lm80-body");
  if(body) body.innerHTML = "";
  // 放一組可跑回歸的範例（可自行替換）
  addRow(0, 1.0, true);
  addRow(1000, 0.97, true);
  addRow(2000, 0.945, true);
  addRow(3000, 0.92, true);
  addRow(4000, 0.90, true);
  addRow(5000, 0.89, true);
  addRow(6000, 0.88, true);
}

function collectLM80(){
  const times = document.querySelectorAll(`[data-kc="lm80-time"]`);
  const fluxs = document.querySelectorAll(`[data-kc="lm80-flux"]`);
  const isrs  = document.querySelectorAll(`[data-kc="lm80-isr"]`);

  const points = [];
  for(let i=0;i<times.length;i++){
    const t = parseFloat(times[i].value);
    const v = parseFloat(fluxs[i].value);
    const isR = !!isrs[i].checked;
    if(Number.isFinite(t) && Number.isFinite(v)){
      points.push({ time: t, value: v, isR });
    }
  }
  // sort by time
  points.sort((a,b)=>a.time-b.time);
  return points;
}

function collectSettings(){
  return {
    sampleSize: parseInt($("sample-size")?.value || "0", 10),
    testHours:  parseFloat($("test-hours")?.value || "0"),
    fitMode:    $("fit-mode")?.value || "LAST_5000H",
    duty:       parseFloat($("duty")?.value || "1"),
    brightness: parseFloat($("brightness")?.value || "1"),
    env:        $("env")?.value || "INDUSTRIAL"
  };
}

// 你原本 tm21-core.js 的函式名稱我無法在這裡假設一定是什麼
// 所以做一個「探測式呼叫」：優先找 window.tm21Project / window.tm21_core / window.computeTM21
function runTM21(points, opt){
  if(typeof window.tm21Project === "function"){
    return window.tm21Project(points, opt);
  }
  if(typeof window.computeTM21 === "function"){
    return window.computeTM21(points, opt);
  }
  if(typeof window.tm21_core === "function"){
    return window.tm21_core(points, opt);
  }
  throw new Error("TM-21 core function not found. Please export one of: tm21Project / computeTM21 / tm21_core");
}

function applyUsageFactor(result, opt){
  // 這裡只是示範：你可依 KC-SYS-LIFE-STACK 的模型替換
  // duty / brightness / env → life scaling
  const K_duty = Math.max(0.01, Math.min(1, opt.duty));
  const K_bri  = Math.max(0.01, Math.min(1, opt.brightness));

  const envMap = {
    INDUSTRIAL: 1.2,
    AUTOMOTIVE: 1.5,
    AEROSPACE:  1.1
  };
  const K_env = envMap[opt.env] ?? 1.2;

  // lifeCap 以 / (duty*bri*K_env) 示意（你可換成你既有 sys-life-stack.js）
  const scale = (K_duty * K_bri * K_env);
  const scaled = { ...result };
  if(Number.isFinite(result.lifeCap)){
    scaled.lifeCap = result.lifeCap / scale;
  }
  if(Number.isFinite(result.L70_report)){
    scaled.L70_sys = result.L70_report / scale;
  }
  scaled.factors = { K_duty, K_brightness: K_bri, K_environment: K_env };
  return scaled;
}

function updateResultUI(obj){
  setStatus(obj.valid ? "OK" : "FAIL");
  safeText($("l70"), obj.L70_sys ?? obj.L70_report ?? obj.L70_raw ?? "--");
  safeText($("cap"), obj.lifeCap ?? "--");
  safeText($("claim"), obj.claimLevel ?? obj.claim ?? "--");
  safeText($("output"), JSON.stringify(obj, null, 2));
}

function exportJSON(){
  const text = $("output")?.textContent || "{}";
  const blob = new Blob([text], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "kc-led-life-result.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportText(){
  const text = $("output")?.textContent || "";
  const blob = new Blob([text], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "kc-led-life-project.txt";
  a.click();
  URL.revokeObjectURL(a.href);
}

function calculate(){
  try{
    setStatus("RUN");
    const points = collectLM80();
    const opt = collectSettings();

    if(points.length < 3){
      updateResultUI({ valid:false, reason:"Need >= 3 data points", points: points.length });
      return;
    }

    // 先算 TM-21
    const tm21 = runTM21(points, opt);

    // 再套 usage/environment（可替換成你的 sys-life-stack）
    const sys = applyUsageFactor(tm21, opt);

    updateResultUI({ valid:true, ...tm21, ...sys });
  }catch(err){
    updateResultUI({ valid:false, reason: String(err?.message || err) });
  }
}

function bind(){
  $("btn-add-row")?.addEventListener("click", ()=>addRow());
  $("btn-seed")?.addEventListener("click", seedExample);
  $("btn-calc")?.addEventListener("click", calculate);
  $("btn-export-json")?.addEventListener("click", exportJSON);
  $("btn-export-text")?.addEventListener("click", exportText);

  // 初始給一行，避免空表
  addRow(0, 1.0, true);
  addRow(6000, 0.88, true);

  setStatus("WAIT");
  safeText($("output"), JSON.stringify({ hint:"Press Calculate" }, null, 2));
}

// expose for inline calls if needed
window.addRow = addRow;
window.calculate = calculate;
window.exportJSON = exportJSON;
window.exportText = exportText;

document.addEventListener("DOMContentLoaded", bind);
