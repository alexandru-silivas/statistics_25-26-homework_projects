// --- Binomial coefficient -------------------------------------------------
function nCk(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = res * (n - i + 1) / i;
  }
  return Math.round(res);
}

// --- Render Pascal Triangle ----------------------------------------------
function renderPascal() {
  const rows = Math.max(3, Math.min(25,
    parseInt(document.getElementById("ptRows").value, 10) || 10
  ));

  const container = document.getElementById("pascalContainer");
  container.innerHTML = "";

  // auto-adjust height so no scrolling needed
  const rowHeight = 32;
  container.style.height = (rows * rowHeight + 60) + "px";

  // compute triangle
  const tri = [];
  for (let r = 0; r < rows; r++) {
    tri[r] = [];
    for (let c = 0; c <= r; c++) {
      tri[r][c] = nCk(r, c);
    }
  }

  // render rows
  for (let r = 0; r < rows; r++) {
    const rowDiv = document.createElement("div");
    rowDiv.style.display = "flex";
    rowDiv.style.justifyContent = "center";
    rowDiv.style.gap = "10px";
    rowDiv.style.marginBottom = "6px";

    for (let c = 0; c <= r; c++) {
      const cell = document.createElement("div");
      cell.textContent = tri[r][c];
      cell.style.padding = "6px 10px";
      cell.style.borderRadius = "6px";
      cell.style.background = "rgba(255,255,255,0.05)";
      cell.style.color = "#cfd9e6";
      cell.style.minWidth = "38px";
      cell.style.textAlign = "center";
      rowDiv.appendChild(cell);
    }
    container.appendChild(rowDiv);
  }

  // Fibonacci diagonal demonstration
  const fibs = [];
  for (let start = 0; start < rows; start++) {
    let sum = 0, r = start, c = 0;
    while (r >= 0 && c <= r) {
      sum += tri[r][c];
      r--; c++;
    }
    fibs.push(sum);
    if (fibs.length >= 10) break;
  }

  const fibDiv = document.createElement("div");
  fibDiv.style.marginTop = "10px";
  fibDiv.innerHTML = `
    <strong>Diagonal sums:</strong> ${fibs.join(", ")}
    <div style="color:#9aa6b1; font-size:0.95rem; margin-top:4px;">
      These diagonal sums mirror early Fibonacci numbers.
    </div>
  `;
  container.appendChild(fibDiv);
}

// render once on load
window.addEventListener("DOMContentLoaded", renderPascal);
