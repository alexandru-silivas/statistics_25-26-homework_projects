// mean_variance_online.js — Online mean and variance demo (Welford’s algorithm)

// State variables
let n = 0;
let mean = 0;
let M2 = 0;

// Chart setup
const ctx = document.getElementById("onlineChart").getContext("2d");
let chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Mean (μ)",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
        tension: 0.2,
      },
      {
        label: "Variance (σ²)",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
        tension: 0.2,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#cfd9e6" },
      },
      x: {
        ticks: { color: "#cfd9e6" },
      },
    },
    plugins: {
      legend: { labels: { color: "#e6eef8" } },
    },
  },
});

// Update displayed stats
function updateDisplay() {
  document.getElementById("count").textContent = n;
  document.getElementById("mean").textContent = mean.toFixed(4);
  document.getElementById("variance").textContent = n > 1 ? (M2 / n).toFixed(4) : "0.0000";
}

// Add new value and update mean/variance
function addValue() {
  const input = document.getElementById("newValue");
  const x = parseFloat(input.value);
  if (isNaN(x)) return;

  n++;
  const delta = x - mean;
  mean += delta / n;
  const delta2 = x - mean;
  M2 += delta * delta2;

  // Update chart
  chart.data.labels.push(n);
  chart.data.datasets[0].data.push(mean);
  chart.data.datasets[1].data.push(M2 / n);
  chart.update();

  // Update stats display
  updateDisplay();
  input.value = "";
}

// Reset everything
function resetValues() {
  n = 0;
  mean = 0;
  M2 = 0;
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.data.datasets[1].data = [];
  chart.update();
  updateDisplay();
}
