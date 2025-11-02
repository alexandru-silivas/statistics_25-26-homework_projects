let coinChart = null;
let llnSmallChart = null;
let llnLargeChart = null;

// ----------- Coin Toss Simulation (Animated) -----------
function simulateCoinTosses() {
  const numTosses = 200;
  let headsCount = 0;
  const frequencies = [];
  const labels = Array.from({ length: numTosses }, (_, i) => i + 1);

  const ctx = document.getElementById("coinChart").getContext("2d");
  if (coinChart) coinChart.destroy();

  coinChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Observed Frequency of Heads",
          data: [],
          borderColor: "#4ea3ff",
          fill: false,
        },
        {
          label: "Expected Probability (0.5)",
          data: Array(numTosses).fill(0.5),
          borderColor: "red",
          borderDash: [5, 5],
          fill: false,
        },
      ],
    },
    options: {
      animation: false,
      scales: { y: { beginAtZero: true, max: 1 } },
      plugins: { legend: { labels: { color: "#e6eef8" } } },
    },
  });

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
  if (coinChart) coinChart.destroy();
  document.getElementById("coinStatus").textContent = "Status: Waiting to simulate.";
}

// ----------- Law of Large Numbers Simulation (Animated) -----------
function simulateLLN(numRolls) {
  const statusId = numRolls === 50 ? "llnSmallStatus" : "llnLargeStatus";
  const chartId = numRolls === 50 ? "llnSmallChart" : "llnLargeChart";

  const ctx = document.getElementById(chartId).getContext("2d");
  if (numRolls === 50 && llnSmallChart) llnSmallChart.destroy();
  if (numRolls === 1000 && llnLargeChart) llnLargeChart.destroy();

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: numRolls }, (_, i) => i + 1),
      datasets: [
        {
          label: "Running Average",
          data: [],
          borderColor: "#00cc66",
          fill: false,
        },
        {
          label: "Expected Value (3.5)",
          data: Array(numRolls).fill(3.5),
          borderColor: "red",
          borderDash: [5, 5],
          fill: false,
        },
      ],
    },
    options: {
      animation: false,
      scales: { y: { beginAtZero: true, max: 6 } },
      plugins: { legend: { labels: { color: "#e6eef8" } } },
    },
  });

  if (numRolls === 50) llnSmallChart = chart;
  if (numRolls === 1000) llnLargeChart = chart;

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
  }, numRolls === 50 ? 100 : 10); // slower for short sample, faster for long one
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
