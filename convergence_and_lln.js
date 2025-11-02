let coinChart = null;
let llnSmallChart = null;
let llnLargeChart = null;

// ----------- Coin Toss Simulation -----------
function simulateCoinTosses() {
  const numTosses = 200;
  let headsCount = 0;
  const frequencies = [];
  for (let i = 1; i <= numTosses; i++) {
    if (Math.random() < 0.5) headsCount++;
    frequencies.push(headsCount / i);
  }

  const ctx = document.getElementById("coinChart").getContext("2d");
  if (coinChart) coinChart.destroy();
  coinChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: numTosses }, (_, i) => i + 1),
      datasets: [
        { label: "Observed Frequency of Heads", data: frequencies, borderColor: "#4ea3ff", fill: false },
        { label: "Expected Probability (0.5)", data: Array(numTosses).fill(0.5), borderColor: "red", borderDash: [5, 5], fill: false }
      ]
    },
    options: {
      scales: { y: { beginAtZero: true, max: 1 } },
      plugins: { legend: { labels: { color: "#e6eef8" } } }
    }
  });
  document.getElementById("coinStatus").textContent = "Simulation complete — frequency converges to probability 0.5.";
}

function resetCoinChart() {
  if (coinChart) coinChart.destroy();
  document.getElementById("coinStatus").textContent = "Status: Waiting to simulate.";
}

// ----------- Law of Large Numbers Simulation -----------
function simulateLLN(numRolls) {
  const statusId = numRolls === 50 ? "llnSmallStatus" : "llnLargeStatus";
  const containerId = numRolls === 50 ? "llnSmallChartContainer" : "llnLargeChartContainer";
  const chartId = numRolls === 50 ? "llnSmallChart" : "llnLargeChart";
  const chartRef = numRolls === 50 ? "llnSmallChart" : "llnLargeChart";

  let sum = 0;
  const averages = [];

  for (let i = 1; i <= numRolls; i++) {
    const roll = Math.floor(Math.random() * 6) + 1;
    sum += roll;
    averages.push(sum / i);
  }

  const ctx = document.getElementById(chartId).getContext("2d");
  if (numRolls === 50 && llnSmallChart) llnSmallChart.destroy();
  if (numRolls === 1000 && llnLargeChart) llnLargeChart.destroy();

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: numRolls }, (_, i) => i + 1),
      datasets: [
        { label: "Running Average", data: averages, borderColor: "#00cc66", fill: false },
        { label: "Expected Value (3.5)", data: Array(numRolls).fill(3.5), borderColor: "red", borderDash: [5, 5], fill: false }
      ]
    },
    options: {
      scales: { y: { beginAtZero: true, max: 6 } },
      plugins: { legend: { labels: { color: "#e6eef8" } } }
    }
  });

  if (numRolls === 50) llnSmallChart = chart;
  if (numRolls === 1000) llnLargeChart = chart;
  document.getElementById(statusId).textContent = `Simulation complete — ${numRolls} rolls.`;
}

function resetLLN(size) {
  if (size === "small" && llnSmallChart) {
    llnSmallChart.destroy();
    document.getElementById("llnSmallStatus").textContent = "Status: Waiting to simulate.";
  }
  if (size === "large" && llnLargeChart) {
    llnLargeChart.destroy();
    document.getElementById("llnLargeStatus").textContent = "Status: Waiting to simulate.";
  }
}
