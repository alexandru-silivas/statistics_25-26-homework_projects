// process_comparisons.js
// Bernoulli Process, Random Walks, Pascal Triangle, Fibonacci, etc.

// -------------------------------------------------------------
// Utility functions
// -------------------------------------------------------------

// Binomial coefficient (n choose k)
function nCk(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = res * (n - (k - i)) / i;
  }
  return Math.round(res);
}

// Generate Bernoulli trial (1 = success, 0 = fail)
function bernoulli(p) {
  return Math.random() < p ? 1 : 0;
}

// -------------------------------------------------------------
// Bernoulli process simulator for interactive section
// -------------------------------------------------------------
let interactiveChart = null;

function runInteractiveSimulation() {
  const trials = parseInt(document.getElementById("intTrials").value);
  const p = parseFloat(document.getElementById("intP").value);

  if (!trials || p < 0 || p > 1) {
    alert("Please enter valid input.");
    return;
  }

  // Run Bernoulli process
  const results = [];
  let sum = 0;
  for (let i = 0; i < trials; i++) {
    const x = bernoulli(p);
    results.push(x);
    sum += x;
  }

  // Plot empirical frequency convergence
  const cumulative = [];
  let running = 0;
  for (let i = 0; i < results.length; i++) {
    running += results[i];
    cumulative.push(running / (i + 1));
  }

  // Prepare chart container
  const ctx = document.getElementById("interactiveBernoulliChart").getContext("2d");

  if (interactiveChart) interactiveChart.destroy();

  interactiveChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: cumulative.map((_, i) => i + 1),
      datasets: [
        {
          label: "Empirical Frequency",
          data: cumulative,
          fill: false,
          borderColor: "rgba(78,163,255,0.9)",
          tension: 0.15,
        },
        {
          label: "Theoretical Probability p",
          data: Array(cumulative.length).fill(p),
          borderColor: "rgba(255,99,132,0.7)",
          borderDash: [6, 6],
          pointRadius: 0,
          tension: 0,
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          title: {
            display: true,
            text: "Frequency"
          }
        },
        x: {
          title: {
            display: true,
            text: "Trials"
          }
        }
      }
    }
  });
}

// Reset button
function resetInteractive() {
  if (interactiveChart) {
    interactiveChart.destroy();
    interactiveChart = null;
  }
  const ctx = document.getElementById("interactiveBernoulliChart").getContext("2d");

  // draw blank skeleton chart
  interactiveChart = new Chart(ctx, {
    type: "line",
    data: { labels: [], datasets: [] },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          title: { display: true, text: "Frequency" }
        },
        x: {
          title: { display: true, text: "Trials" }
        }
      }
    }
  });
}



// -------------------------------------------------------------
// Pascal's Triangle (Tartaglia) — Fully auto-expanding version
// -------------------------------------------------------------
function renderPascal() {
  const rows = Math.max(3, Math.min(25,
    parseInt(document.getElementById("ptRows").value, 10) || 10
  ));

  const container = document.getElementById("pascalContainer");
  container.innerHTML = "";

  // compute triangle
  const tri = [];
  for (let r = 0; r < rows; r++) {
    tri[r] = [];
    for (let c = 0; c <= r; c++) {
      tri[r][c] = nCk(r, c);
    }
  }

  // render rows (no fixed height, expands naturally)
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


// -------------------------------------------------------------
// Initialize on page load
// -------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  // Draw empty Bernoulli chart skeleton
  resetInteractive();

  // Draw initial Pascal triangle
  renderPascal();
});
