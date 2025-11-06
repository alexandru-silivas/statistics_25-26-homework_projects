// mean_variance_online.js — Interactive Online Mean and Variance Demo

let count = 0;
let mean = 0;
let M2 = 0;
let dataPoints = [];
let meanHistory = [];
let varianceHistory = [];

const ctx = document.getElementById("onlineStatsChart").getContext("2d");
let statsChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Mean",
        data: meanHistory,
        borderColor: "rgba(78, 163, 255, 0.85)",
        tension: 0.3,
      },
      {
        label: "Variance",
        data: varianceHistory,
        borderColor: "rgba(255, 165, 0, 0.8)",
        tension: 0.3,
      },
    ],
  },
  options: {
    scales: {
      y: { beginAtZero: true, ticks: { color: "#cfd9e6" } },
      x: { ticks: { color: "#cfd9e6" } },
    },
    plugins: {
      legend: { labels: { color: "#e6eef8" } },
    },
  },
});

function addRandomValue() {
  const newValue = Math.random() * 10; // random value between 0 and 10
  count++;
  const delta = newValue - mean;
  mean += delta / count;
  M2 += delta * (newValue - mean);
  const variance = count > 1 ? M2 / count : 0;

  dataPoints.push(newValue);
  meanHistory.push(mean);
  varianceHistory.push(variance);

  statsChart.data.labels.push(count);
  statsChart.update();

  document.getElementById("statsDisplay").textContent =
    `n=${count}, Latest value=${newValue.toFixed(2)}, Mean=${mean.toFixed(2)}, Variance=${variance.toFixed(2)}`;
}

function resetData() {
  count = 0;
  mean = 0;
  M2 = 0;
  dataPoints = [];
  meanHistory = [];
  varianceHistory = [];

  statsChart.data.labels = [];
  statsChart.data.datasets[0].data = [];
  statsChart.data.datasets[1].data = [];
  statsChart.update();

  document.getElementById("statsDisplay").textContent = "No data yet.";
}
