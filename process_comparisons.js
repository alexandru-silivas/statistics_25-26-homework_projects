// process_comparisons.js — corrected version (no forced heights)
// Pascal Triangle + Random Walks + Interactive Simulator

// ---------- Pascal Triangle ----------
function generatePascal(n) {
  const tri = [];
  for (let r = 0; r < n; r++) {
    const row = [];
    for (let k = 0; k <= r; k++) {
      if (k === 0 || k === r) row.push(1);
      else row.push(tri[r - 1][k - 1] + tri[r - 1][k]);
    }
    tri.push(row);
  }
  return tri;
}

function getPascalRowsInput() {
  return document.getElementById("pascalRows") ||
         document.getElementById("ptRows") ||
         document.getElementById("pascalRowsInput");
}

function renderPascal() {
  const input = getPascalRowsInput();
  const rows = input ? Math.max(1, Math.min(30, parseInt(input.value))) : 12;

  const container = document.getElementById("pascalContainer");
  if (!container) return;

  const tri = generatePascal(rows);

  container.innerHTML = "";
  tri.forEach(row => {
    const div = document.createElement("div");
    div.className = "pascal-row";
    div.textContent = row.join("   ");
    container.appendChild(div);
  });
}

// ---------- Random Walk Simulation ----------
function bernoulliStep(p) {
  return Math.random() < p ? 1 : -1;
}

function randomWalk(steps, p) {
  let pos = 0;
  const arr = [0];
  for (let i = 0; i < steps; i++) {
    pos += bernoulliStep(p);
    arr.push(pos);
  }
  return arr;
}

// ---------- Chart Utility ----------
let chart_rw1 = null;
let chart_rw2 = null;
let chart_interactive = null;

function destroyChart(c) {
  if (c && typeof c.destroy === "function") c.destroy();
}

function createWalkChart(canvasId, arr, label) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: arr.map((_, i) => i),
      datasets: [{
        label,
        data: arr,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.15,
        borderColor: "rgba(78,163,255,1)"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // CSS controls size
      scales: {
        x: {
          title: { display: true, text: "Step" },
          ticks: { color: "#d0d8e6" }
        },
        y: {
          title: { display: true, text: "Score" },
          ticks: { color: "#d0d8e6" }
        }
      },
      plugins: {
        legend: { labels: { color: "#e6eef8" } }
      }
    }
  });
}

// ---------- Initialize Example Charts ----------
function initExampleWalks() {
  destroyChart(chart_rw1);
  destroyChart(chart_rw2);

  chart_rw1 = createWalkChart("rw1", randomWalk(50, 0.5), "Random Walk (p=0.5)");
  chart_rw2 = createWalkChart("rw2", randomWalk(50, 0.7), "Random Walk (p=0.7)");
}

// ---------- Interactive Walk ----------
function simulateInteractiveWalk() {
  const p = parseFloat(document.getElementById("pInput").value) || 0.5;
  const steps = parseInt(document.getElementById("stepsInput").value) || 50;

  destroyChart(chart_interactive);

  const arr = randomWalk(steps, Math.max(0, Math.min(1, p)));

  chart_interactive = createWalkChart(
    "interactiveRandomWalk",
    arr,
    `Interactive Walk (p=${p})`
  );
}

function resetInteractiveWalk() {
  destroyChart(chart_interactive);
  chart_interactive = null;

  const canvas = document.getElementById("interactiveRandomWalk");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------- On Page Load ----------
window.addEventListener("DOMContentLoaded", () => {
  const input = getPascalRowsInput();
  if (input) {
    input.addEventListener("input", renderPascal);
  }

  renderPascal();
  setTimeout(initExampleWalks, 50);
});
