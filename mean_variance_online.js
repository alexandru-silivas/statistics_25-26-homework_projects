// homework_5.js - Online mean and variance visualization

let n = 0;
let mean = 0;
let M2 = 0;
let means = [];

const ctx = document.getElementById("meanVarChart").getContext("2d");
const meanVarChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Online Mean",
        data: [],
        borderColor: "#4ea3ff",
        fill: false,
      }
    ]
  },
  options: {
    scales: {
      x: { title: { display: true, text: "Data Point #", color: "#cfd9e6" }, ticks: { color: "#cfd9e6" } },
      y: { title: { display: true, text: "Mean", color: "#cfd9e6" }, ticks: { color: "#cfd9e6" } }
    },
    plugins: {
      legend: { labels: { color: "#e6eef8" } }
    }
  }
});

function addValue() {
  const input = document.getElementById("newValue");
  const x = parseFloat(input.value);
  if (isNaN(x)) return;

  n++;
  const delta = x - mean;
  mean += delta / n;
  M2 += delta * (x - mean);
  const variance = n > 1 ? M2 / (n - 1) : 0;

  document.getElementById("countDisplay").textContent = `Count: ${n}`;
  document.getElementById("meanDisplay").textContent = `Mean: ${mean.toFixed(4)}`;
  document.getElementById("varianceDisplay").textContent = `Variance: ${variance.toFixed(4)}`;

  meanVarChart.data.labels.push(n);
  meanVarChart.data.datasets[0].data.push(mean);
  meanVarChart.update();

  input.value = "";
}
