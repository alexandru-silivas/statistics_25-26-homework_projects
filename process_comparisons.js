// =============================================================
// HOMEWORK 8 — Bernoulli, Random Walk, Pascal Triangle, Fibonacci
// =============================================================

// ---------- GLOBAL CHART REFERENCES ----------
let chartBernoulliVsRW = null;
let chartFibonacciRelation = null;
let chartInteractive = null;

// =============================================================
// Bernoulli vs Random Walk chart
// =============================================================
function drawBernoulliVsRandomWalk() {
  const ctx = document.getElementById("chartBernoulliVsRandomWalk").getContext("2d");

  const n = 50;
  const p = 0.5;

  let bernoulli = [];
  let walk = [];
  let cumulative = 0;

  for (let i = 0; i < n; i++) {
    const val = Math.random() < p ? 1 : 0;
    bernoulli.push(val);

    cumulative += val === 1 ? 1 : -1;
    walk.push(cumulative);
  }

  if (chartBernoulliVsRW) chartBernoulliVsRW.destroy();

  chartBernoulliVsRW = new Chart(ctx, {
    type: "line",
    data: {
      labels: [...Array(n).keys()],
      datasets: [
        {
          label: "Random Walk",
          data: walk,
          borderWidth: 2,
          borderColor: "rgba(80,150,255,0.9)",
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { title: { display: true, text: "Score (+/-)" } },
        x: { title: { display: true, text: "Step" } }
      }
    }
  });
}

// =============================================================
// Tartaglia / Pascal Triangle
// =============================================================
function generateTartaglia() {
  const rows = parseInt(document.getElementById("rowsInput").value);
  if (!rows || rows < 1) return;

  let triangle = [];

  for (let r = 0; r < rows; r++) {
    triangle[r] = [];
    for (let c = 0; c <= r; c++) {
      if (c === 0 || c === r) triangle[r][c] = 1;
      else triangle[r][c] = triangle[r - 1][c - 1] + triangle[r - 1][c];
    }
  }

  let output = "";
  for (let r = 0; r < rows; r++) {
    output += triangle[r].join(" ") + "\n";
  }

  const target = document.getElementById("tartagliaTriangle");
  target.textContent = output;
}

// =============================================================
// Fibonacci Relation Chart
// =============================================================
function drawFibonacciRelation() {
  const ctx = document.getElementById("chartFibonacciRelation").getContext("2d");

  const fib = [1, 1];
  for (let i = 2; i < 12; i++) fib.push(fib[i - 1] + fib[i - 2]);

  if (chartFibonacciRelation) chartFibonacciRelation.destroy();

  chartFibonacciRelation = new Chart(ctx, {
    type: "bar",
    data: {
      labels: fib.map((_, i) => `F${i + 1}`),
      datasets: [
        {
          label: "Fibonacci Numbers",
          data: fib,
          backgroundColor: "rgba(255,180,80,0.8)"
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Value" }
        },
        x: { title: { display: true, text: "Index" } }
      }
    }
  });
}

// =============================================================
// Interactive Bernoulli / Walk Simulator
// =============================================================
function runInteractiveSimulation() {
  const p = parseFloat(document.getElementById("inputP").value);
  const n = parseInt(document.getElementById("inputN").value);

  let walk = [];
  let cumulative = 0;

  for (let i = 0; i < n; i++) {
    const success = Math.random() < p;
    cumulative += success ? 1 : -1;
    walk.push(cumulative);
  }

  const ctx = document.getElementById("interactiveGraph").getContext("2d");

  if (chartInteractive) chartInteractive.destroy();

  chartInteractive = new Chart(ctx, {
    type: "line",
    data: {
      labels: [...Array(n).keys()],
      datasets: [
        {
          label: "Random Walk",
          data: walk,
          borderColor: "rgba(255,120,120,0.9)",
          borderWidth: 2,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { title: { display: true, text: "Score" } },
        x: { title: { display: true, text: "Trial" } }
      }
    }
  });
}

function resetInteractive() {
  if (chartInteractive) {
    chartInteractive.destroy();
    chartInteractive = null;
  }
}

// =============================================================
// INITIAL LOAD
// =============================================================
window.onload = () => {
  drawBernoulliVsRandomWalk();
  drawFibonacciRelation();
  generateTartaglia();
};
