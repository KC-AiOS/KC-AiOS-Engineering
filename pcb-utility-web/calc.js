// PCB Utility Rate calculation core
// Purpose: engineering estimation only

function calc(pcb_w, pcb_h, panel_w, panel_h, edge, gap) {
  const eff_w = panel_w - 2 * edge;
  const eff_h = panel_h - 2 * edge;

  if (eff_w <= 0 || eff_h <= 0) return { nx: 0, ny: 0, total: 0, util: 0 };

  const nx = Math.floor((eff_w + gap) / (pcb_w + gap));
  const ny = Math.floor((eff_h + gap) / (pcb_h + gap));

  if (nx <= 0 || ny <= 0) return { nx: 0, ny: 0, total: 0, util: 0 };

  const total = nx * ny;
  const util = (pcb_w * pcb_h * total) / (panel_w * panel_h) * 100;

  return { nx, ny, total, util };
}

function runCalc() {
  const pcb_w = Number(document.getElementById("pcb_w").value);
  const pcb_h = Number(document.getElementById("pcb_h").value);
  const panel_w = Number(document.getElementById("panel_w").value);
  const panel_h = Number(document.getElementById("panel_h").value);
  const edge = Number(document.getElementById("edge").value);
  const gap = Number(document.getElementById("gap").value);
  const resultDiv = document.getElementById("result");

  if (!pcb_w || !pcb_h || !panel_w || !panel_h) {
    resultDiv.innerHTML = `<p class="err">Please fill PCB and Panel sizes.</p>`;
    return;
  }

  const r1 = calc(pcb_w, pcb_h, panel_w, panel_h, edge, gap);
  const r2 = calc(pcb_h, pcb_w, panel_w, panel_h, edge, gap);

  const better =
    r2.util > r1.util ? "Rotated 90°" :
    r2.util < r1.util ? "Original" :
    "Same Utility";

  resultDiv.innerHTML = `
    <p><b>Original:</b> ${r1.nx} × ${r1.ny}, Total ${r1.total}, Utility ${r1.util.toFixed(1)}%</p>
    <p><b>Rotated 90°:</b> ${r2.nx} × ${r2.ny}, Total ${r2.total}, Utility ${r2.util.toFixed(1)}%</p>
    <p><b>Better Option:</b> ${better}</p>
    <p class="note">Assumption: Edge=${edge}mm, Gap=${gap}mm</p>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnCalc");
  if (btn) btn.addEventListener("click", runCalc);
});
