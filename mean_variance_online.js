// mean_variance_online.js — Online mean and variance with live chart visualization

// -----------------------------
// Global variables
// -----------------------------
let count = 0;
let mean = 0;
let M2 = 0;
let meanHistory = [];
let varHistory = [];
let indexHistory = [];

// -----------------------------
// Chart initialization
// -----------------------------
const ctx = document.getElementById("onlineStatsChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Mean (μ)",
        data: [],
        borderColor: "rgba(78,163,255,1)",
        borderWidth: 2,
        fill: false,
        tension: 0.2
      },
      {
        label: "Variance (σ²)",
        data: [],
        borderColor: "rgba(255,180,70,0.9)",
        borderWidth: 2,
        fill: false,
        tension: 0.2
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#e6eef8", font: { size: 13 } }
      }
    },
    scales: {
      x: {
        title: { display: true, text: "Observation index", color: "#cfd9e6" },
        ticks: { color: "#cfd9e6" },
        grid: { color: "rgba(255,255,255,0.05)" }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Value", color: "#cfd9e6" },
        ticks: { color: "#cfd9e6" },
        grid: { color: "rgba(255,255,255,0.05)" }
      }
    }
  }
});

// -----------------------------
// Core update algorithm
// -----------------------------
function addValue(x) {
  count++;
  const delta = x - mean;
  mean += delta / count;
  M2 += delta * (x - mean);

  const variance = count > 1 ? M2 / count : 0;

  meanHistory.push(mean);
  varHistory.push(variance);
  indexHistory.push(count);

  // Update chart
  chart.data.labels = indexHistory;
  chart.data.datasets[0].data = meanHistory;
  chart.data.datasets[1].data = varHistory;
  chart.update();

  // Update text info
  document.getElementById("statsDisplay").textContent =
    `n = ${count} | Mean μ = ${mean.toFixed(3)} | Variance σ² = ${variance.toFixed(3)}`;
}

// -----------------------------
// Add random value (simulated streaming data)
// -----------------------------
function addRandomValue() {
  // Mix mostly small values + some larger outliers
  const random = Math.random() < 0.9 ? Math.random() * 10 : Math.random() * 50;
  addValue(random);
}

// -----------------------------
// Reset all data
// -----------------------------
function resetData() {
  count = 0;
  mean = 0;
  M2 = 0;
  meanHistory = [];
  varHistory = [];
  indexHistory = [];
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.data.datasets[1].data = [];
  chart.update();
  document.getElementById("statsDisplay").textContent = "No data yet.";
}

// -----------------------------
// Initialize empty chart display
// -----------------------------
resetData();
