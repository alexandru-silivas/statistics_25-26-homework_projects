let coinChart = null;
let llnSmallChart = null;
let llnLargeChart = null;

// Initialize empty charts when page loads
window.addEventListener("DOMContentLoaded", initializeCharts);

// ----------- Initialize Empty Chart Skeletons -----------
function initializeCharts() {
  const ctxCoin = document.getElementById("coinChart").getContext("2d");
  coinChart = new Chart(ctxCoin, {
    type: "line",
    data: {
      labels: Array.from({ length: 200 }, (_, i) => i + 1),
      datasets: [
        { label: "Observed Frequency of Heads", data: [], borderColor: "#4ea3ff", fill: false },
        { label: "Expected Probability (0.5)", data: Array(200).fill(0.5), borderColor: "red", borderDash: [5, 5], fill: false }
      ]
    },
    options: { scales: { y: { beginAtZero: true, max: 1 } }, plugins: { legend: { labels: { color: "#e6eef8" } } } }
  });

  const ctxSmall = document.getElementById("llnSmallChart").getContext("2d");
  llnSmallChart = new Chart(ctxSmall, {
    type: "line",
    data: {
      labels: Array.from({ length: 50 }, (_, i) => i + 1),
      datasets: [
        { label: "Running Average", data: [], borderColor: "#00cc66", fill: false },
        { label: "Expected Value (3.5)", data: Array(50).fill(3.5), borderColor: "red", borderDash: [5, 5], fill: false }
      ]
    },
    options: { scales: { y: { beginAtZero: true, max: 6 } }, plugins: { legend: { labels: { color: "#e6eef8" } } } }
  });

  const ctxLarge = document.getElementById("llnLargeChart").getContext("2d");
  llnLargeChart = new Chart(ctxLarge, {
    type: "line",
    data: {
      labels: Array.from({ length: 1000 }, (_, i) => i + 1),
      datasets: [
        { label: "Running Average", data: [], borderColor: "#00cc66", fill: false },
        { label: "Expected Value (3.5)", data: Array(1000).fill(3.5), borderColor: "red", borderDash: [5, 5], fill: false }
      ]
    },
    options: { scales: { y: { beginAtZero: true, max: 6 } }, plugins: { legend: { labels: { color: "#e6eef8" } } } }
  });
}

// ----------- Coin Toss Simulation (Animated) -----------
function simulateCoinTosses() {
  let headsCount = 0;
  const frequencies = [];
  const numTosses = 200;

  document.getElementById("coinStatus").textContent = "Simulating...";

  let i = 0;
  const interval = setInterval(() => {
    i++;
    if (Math.random() < 0.5) headsCount++;
    frequencies.push(headsCount / i);
    coinChart.data.datasets[0].data = frequencies;
    coinChart.update();

    if (i >= numTosses) {
      clearInterval(interval);
      document.getElementById("coinStatus").textContent =
        "Simulation complete — frequency converges to probability 0.5.";
    }
  }, 20);
}

function resetCoinChart() {
  coinChart.data.datasets[0].data = [];
  coinChart.update();
  document.getElementById("coinStatus").textContent = "Status: Waiting to simulate.";
}

// ----------- Law of Large Numbers Simulation (Animated) -----------
function simulateLLN(numRolls) {
  const statusId = numRolls === 50 ? "llnSmallStatus" : "llnLargeStatus";
  const chart = numRolls === 50 ? llnSmallChart : llnLargeChart;

  let i = 0;
  let sum = 0;
  const averages = [];

  document.getElementById(statusId).textContent = "Simulating...";

  const interval = setInterval(() => {
    i++;
    const roll = Math.floor(Math.random() * 6) + 1;
    sum += roll;
    averages.push(sum / i);

    chart.data.datasets[0].data = averages;
    chart.update();

    if (i >= numRolls) {
      clearInterval(interval);
      document.getElementById(statusId).textContent = `Simulation complete — ${numRolls} rolls.`;
    }
  }, numRolls === 50 ? 100 : 10);
}

function resetLLN(size) {
  if (size === "small") {
    llnSmallChart.data.datasets[0].data = [];
    llnSmallChart.update();
    document.getElementById("llnSmallStatus").textContent = "Status: Waiting to simulate.";
  } else if (size === "large") {
    llnLargeChart.data.datasets[0].data = [];
    llnLargeChart.update();
    document.getElementById("llnLargeStatus").textContent = "Status: Waiting to simulate.";
  }
}
