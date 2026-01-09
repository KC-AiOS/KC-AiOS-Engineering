const tbody = document.querySelector("#dataTable tbody");

function addRow(time = "", value = "", isR = false) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="number" value="${time}"></td>
    <td><input type="number" value="${value}"></td>
    <td><input type="checkbox" ${isR ? "checked" : ""}></td>
  `;
  tbody.appendChild(tr);
}

// default rows
[0,1000,2000,3000,4000,5000,6000].forEach(t => addRow(t));

function calculate() {
  const rows = Array.from(tbody.children);
  const data = rows.map(r => ({
    time: Number(r.children[0].firstChild.value),
    value: Number(r.children[1].firstChild.value),
    isR: r.children[2].firstChild.checked
  })).filter(d => !isNaN(d.time) && !isNaN(d.value));

  const options = {
    sampleSize: Number(document.getElementById("sampleSize").value),
    testHours: Number(document.getElementById("testHours").value),
    fitMode: document.getElementById("fitMode").value
  };

  const result = computeTM21(data, options);
  document.getElementById("output").textContent =
    JSON.stringify(result, null, 2);
}
