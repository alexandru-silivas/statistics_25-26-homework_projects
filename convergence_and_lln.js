// convergence_and_lln.js — Simulations for Homework 4
// Demonstrates convergence and the Law of Large Numbers using Chart.js

// ===== Assignment 1: Frequency Convergence (Coin Toss) =====
let coinChart, tosses = 0, heads = 0;

function initCoinChart() {
  const ctx = document.getElementById("coinChart").getContext("2d");
  coinChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Observed Frequency of Heads",
          data: [],
          borderColor: "rgba(78,163,255,1)",
          backgroundColor: "rgba(78,163,255,0.2)",
          borderWidth: 2,
          tension: 0.25,
        },
        {
          label: "Theoretical Probability (0.5)",
          data: [],
          borderColor: "rgba(255,99,132,0.8)",
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      scales: {
        y: { min: 0, max: 1, ticks: { color: "#cfd9e6" } },
        x: { ticks: { color: "#cfd9e6" } },
      },
      plugins: { legend: { labels: { color: "#e6eef8" } } },
    },
  });
}

function simulateCoinTosses() {
  if (!coinChart) initCoinChart();
  for (let i = 0; i < 100; i++) {
    tosses++;
    if (Math.random() < 0.5) heads++;
    coinChart.data.labels.push(tosses);
    coinChart.data.datasets[0].data.push(heads / tosses);
    coinChart.data.datasets[1].data.push(0.5);
  }
  coinChart.update();
  document.getElementById("coinStatus").textContent =
    `Simulated ${tosses} tosses — Heads frequency: ${(heads / tosses).toFixed(3)}`;
}

function resetCoinChart() {
  if (coinChart) coinChart.destroy();
  tosses = 0;
  heads = 0;
  coinChart = null;
  document.getElementById("coinStatus").textContent = "Status: Chart reset.";
}

// ===== Assignment 2: Law of Large Numbers (LLN) =====

// Die roll LLN simulation
let llnChart, trials = 0, total = 0;

function initLLNChart() {
  const ctx = document.getElementById("llnChart").getContext("2d");
  llnChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Running Average of Die Rolls",
          data: [],
          borderColor: "rgba(78,255,163,1)",
          backgroundColor: "rgba(78,255,163,0.2)",
          borderWidth: 2,
          tension: 0.25,
        },
        {
          label: "Expected Value (3.5)",
          data: [],
          borderColor: "rgba(255,99,132,0.8)",
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      scales: {
        y: { min: 1, max: 6, ticks: { color: "#cfd9e6" } },
        x: { ticks: { color: "#cfd9e6" } },
      },
      plugins: { legend: { labels: { color: "#e6eef8" } } },
    },
  });
}

function simulateLLN() {
  if (!llnChart) initLLNChart();
  for (let i = 0; i < 500; i++) {
    const r = Math.floor(Math.random() * 6) + 1;
    trials++;
    total += r;
    const avg = total / trials;
    llnChart.data.labels.push(trials);
    llnChart.data.datasets[0].data.push(avg);
    llnChart.data.datasets[1].data.push(3.5);
  }
  llnChart.update();
  document.getElementById("llnStatus").textContent =
    `Simulated ${trials} rolls — Current average: ${(total / trials).toFixed(3)}`;
}

function resetLLN() {
  if (llnChart) llnChart.destroy();
  trials = 0;
  total = 0;
  llnChart = null;
  document.getElementById("llnStatus").textContent = "Status: Chart reset.";
}

// Average of random numbers [0,1]
let avgChart, samples = 0, sum = 0;

function initAvgChart() {
  const ctx = document.getElementById("avgChart").getContext("2d");
  avgChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Running Average [0–1]",
          data: [],
          borderColor: "rgba(255,220,78,1)",
          backgroundColor: "rgba(255,220,78,0.2)",
          borderWidth: 2,
          tension: 0.25,
        },
        {
          label: "Expected Value (0.5)",
          data: [],
          borderColor: "rgba(255,99,132,0.8)",
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      scales: {
        y: { min: 0, max: 1, ticks: { color: "#cfd9e6" } },
        x: { ticks: { color: "#cfd9e6" } },
      },
      plugins: { legend: { labels: { color: "#e6eef8" } } },
    },
  });
}

function simulateAverage() {
  if (!avgChart) initAvgChart();
  for (let i = 0; i < 1000; i++) {
    samples++;
    sum += Math.random();
    const avg = sum / samples;
    avgChart.data.labels.push(samples);
    avgChart.data.datasets[0].data.push(avg);
    avgChart.data.datasets[1].data.push(0.5);
  }
  avgChart.update();
  document.getElementById("avgStatus").textContent =
    `Simulated ${samples} samples — Current average: ${(sum / samples).toFixed(3)}`;
}

function resetAverage() {
  if (avgChart) avgChart.destroy();
  samples = 0;
  sum = 0;
  avgChart = null;
  document.getElementById("avgStatus").textContent = "Status: Chart reset.";
}

// Coin toss LLN simulation
let llnCoinChart, coinTrials = 0, coinHeads = 0;

function initLLNCoinChart() {
  const ctx = document.getElementById("llnCoinChart").getContext("2d");
  llnCoinChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Observed Probability of Heads",
          data: [],
          borderColor: "rgba(78,163,255,1)",
          backgroundColor: "rgba(78,163,255,0.2)",
          borderWidth: 2,
          tension: 0.25,
        },
        {
          label: "True Probability (0.5)",
          data: [],
          borderColor: "rgba(255,99,132,0.8)",
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      scales: {
        y: { min: 0, max: 1, ticks: { color: "#cfd9e6" } },
        x: { ticks: { color: "#cfd9e6" } },
      },
      plugins: { legend: { labels: { color: "#e6eef8" } } },
    },
  });
}

function simulateLLNCoin() {
  if (!llnCoinChart) initLLNCoinChart();
  for (let i = 0; i < 1000; i++) {
    coinTrials++;
    if (Math.random() < 0.5) coinHeads++;
    llnCoinChart.data.labels.push(coinTrials);
    llnCoinChart.data.datasets[0].data.push(coinHeads / coinTrials);
    llnCoinChart.data.datasets[1].data.push(0.5);
  }
  llnCoinChart.update();
  document.getElementById("llnCoinStatus").textContent =
    `Simulated ${coinTrials} tosses — Estimated P(Heads): ${(coinHeads / coinTrials).toFixed(3)}`;
}

function resetLLNCoin() {
  if (llnCoinChart) llnCoinChart.destroy();
  coinTrials = 0;
  coinHeads = 0;
  llnCoinChart = null;
  document.getElementById("llnCoinStatus").textContent = "Status: Chart reset.";
}

// Initialize all charts on load
window.onload = function () {
  initCoinChart();
  initLLNChart();
  initAvgChart();
  initLLNCoinChart();
};
