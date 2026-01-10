// PCB Utility Rate calculation core
// Purpose: engineering estimation only

function calc(pcb_w, pcb_h, panel_w, panel_h, edge, gap) {

  // effective panel size
  let eff_w = panel_w - 2 * edge;
  let eff_h = panel_h - 2 * edge;

  if (eff_w <= 0 || eff_h <= 0) {
    return null;
  }

  // PCB count in each direction
  let nx = Math.floor((eff_w + gap) / (pcb_w + gap));
  let ny = Math.floor((eff_h + gap) / (pcb_h + gap));

  if (nx <= 0 || ny <= 0) {
    return {
      nx: 0,
      ny: 0,
      total: 0,
      util: 0
    };
  }

  // total PCB count
  let total = nx * ny;

  // area calculation
  let pcb_area = pcb_w * pcb_h;
  let panel_area = panel_w * panel_h;

  let util = (pcb_area * total) / panel_area * 100;

  return {
    nx: nx,
    ny: ny,
    total: total,
    util: util
  };
}

function runCalc() {

  let pcb_w = Number(document.getElementById("pcb_w").value);
  let pcb_h = Number(document.getElementById("pcb_h").value);
  let panel_w = Number(document.getElementById("panel_w").value);
  let panel_h = Number(document.getElementById("panel_h").value);
  let edge = Number(document.getElementById("edge").value);
  let gap = Number(document.getElementById("gap").value);

  let resultDiv = document.getElementById("result");

  if (!pcb_w || !pcb_h || !panel_w || !panel_h) {
    resultDiv.innerHTML = "<p style='color:red'>Please fill all required fields.</p>";
    return;
  }

  // original orientation
  let r1 = calc(pcb_w, pcb_h, panel_w, panel_h, edge, gap);

  // rotated 90 degrees
  let r2 = calc(pcb_h, pcb_w, panel_w, panel_h, edge, gap);

  if (!r1 || !r2) {
    resultDiv.innerHTML = "<p style='color:red'>Invalid geometry input.</p>";
    return;
  }

  let better =
    r2.util > r1.util ? "Rotated 90°" :
    r2.util < r1.util ? "Original" :
    "Same Utility";

  resultDiv.innerHTML = `
    <p><b>Original:</b> ${r1.nx} × ${r1.ny}, Total ${r1.total}, Utility ${r1.util.toFixed(1)}%</p>
    <p><b>Rotated 90°:</b> ${r2.nx} × ${r2.ny}, Total ${r2.total}, Utility ${r2.util.toFixed(1)}%</p>
    <p><b>Better Option:</b> ${better}</p>
  `;
}
