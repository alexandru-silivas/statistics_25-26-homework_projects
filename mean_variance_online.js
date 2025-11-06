// mean_variance_online.js — Interactive Online Mean & Variance demo + test harness

// Online accumulators (Welford's algorithm)
let count = 0;
let mean = 0;
let M2 = 0;

// Histories for charting
const means = [];
const variances = [];
const labels = [];

// Chart setup (single chart: mean + variance)
const ctx = document.getElementById("onlineStatsChart").getContext("2d");
const onlineChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Mean",
        data: means,
        borderColor: "rgba(78,163,255,0.95)",
        fill: false,
        tension: 0.15
      },
      {
        label: "Variance (population)",
        data: variances,
        borderColor: "rgba(255,159,64,0.95)",
        fill: false,
        tension: 0.15,
        yAxisID: "yVar"
      }
    ]
  },
  options: {
    animation: { duration: 300 },
    scales: {
      x: { title: { display: true, text: "n (sample index)" } },
      y: { beginAtZero: true, title: { display: true, text: "Mean / Variance" } },
      yVar: {
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Variance (right axis)" }
      }
    },
    plugins: { legend: { labels: { color: "#e6eef8" } } }
  }
});

// --- Online update function (Welford) ---
function updateOnline(newValue) {
  // newValue: Number
  count++;
  const delta = newValue - mean;
  mean += delta / count;
  const delta2 = newValue - mean; // x - new mean
  M2 += delta * delta2;

  const variance = count > 0 ? M2 / count : 0; // population variance
  // Save history for chart
  labels.push(count);
  means.push(+mean.toFixed(6));
  variances.push(+variance.toFixed(6));
  onlineChart.update();

  document.getElementById("statsDisplay").textContent =
    `n=${count}, latest=${newValue.toFixed(4)}, mean=${mean.toFixed(6)}, variance=${variance.toFixed(6)}`;
}

// --- UI helpers ---
function addRandomValue() {
  // generate a random value from a mixture distribution to make tests interesting
  const r = Math.random();
  const val = r < 0.7 ? Math.random() * 10 : 50 + Math.random() * 50; // mostly 0..10, sometimes large outlier
  updateOnline(val);
}

function resetData() {
  count = 0; mean = 0; M2 = 0;
  labels.length = 0; means.length = 0; variances.length = 0;
  onlineChart.data.labels = labels;
  onlineChart.data.datasets[0].data = means;
  onlineChart.data.datasets[1].data = variances;
  onlineChart.update();
  document.getElementById("statsDisplay").textContent = "No data yet.";
  document.getElementById("testResults").innerHTML = "";
}

// --- Batch (reference) computations ---
function batchMeanVariance(arr) {
  const n = arr.length;
  if (n === 0) return { mean: 0, variance: 0 };
  let s = 0;
  for (let v of arr) s += v;
  const mean = s / n;
  let m2 = 0;
  for (let v of arr) {
    const d = v - mean;
    m2 += d * d;
  }
  return { mean: mean, variance: m2 / n };
}

// --- Test harness: runs multiple randomized tests comparing online vs batch ---
async function runTests() {
  const resultsDiv = document.getElementById("testResults");
  resultsDiv.innerHTML = "Running tests...";
  // We'll run a set of tests of different sizes & distributions
  const testConfigs = [
    { name: "small (n=10)", n: 10, dist: "uniform" },
    { name: "medium (n=100)", n: 100, dist: "uniform" },
    { name: "large (n=1000)", n: 1000, dist: "uniform" },
    { name: "with outliers (n=200)", n: 200, dist: "outliers" },
    { name: "mixture (n=500)", n: 500, dist: "mixture" }
  ];

  let summary = [];
  for (const cfg of testConfigs) {
    // generate data
    const arr = [];
    for (let i = 0; i < cfg.n; i++) {
      if (cfg.dist === "uniform") arr.push(Math.random() * 100 - 50); // -50..50
      else if (cfg.dist === "outliers") {
        if (Math.random() < 0.02) arr.push(1e6 * (Math.random() - 0.5)); // rare huge outliers
        else arr.push(Math.random() * 20);
      } else if (cfg.dist === "mixture") {
        const r = Math.random();
        arr.push(r < 0.8 ? Math.random() * 20 : 200 + Math.random() * 100);
      }
    }

    // compute batch reference
    const batch = batchMeanVariance(arr);

    // run online
    let onCount = 0, onMean = 0, onM2 = 0;
    for (const x of arr) {
      onCount++;
      const d = x - onMean;
      onMean += d / onCount;
      const d2 = x - onMean;
      onM2 += d * d2;
    }
    const onVar = onCount > 0 ? onM2 / onCount : 0;

    const meanErr = Math.abs(onMean - batch.mean);
    const varErr = Math.abs(onVar - batch.variance);

    summary.push({ name: cfg.name, n: cfg.n, meanErr, varErr });
    // allow rendering updates for very large tests
    await new Promise(r => setTimeout(r, 20));
  }

  // format results
  let out = "<strong>Test results (abs errors)</strong><ul>";
  for (const s of summary) {
    out += `<li>${s.name} (n=${s.n}): mean err = ${s.meanErr.toExponential(3)}, variance err = ${s.varErr.toExponential(3)}</li>`;
  }
  out += "</ul>";
  out += "<p style='color:#9aa6b1;font-size:0.92rem;'>Notes: Errors should be close to machine epsilon scale for reasonable inputs. Large outliers may produce larger numeric differences but Welford remains accurate and stable compared to naive two-pass methods.</p>";
  resultsDiv.innerHTML = out;
}

// Expose functions for console debugging if needed
window.updateOnline = updateOnline;
window.addRandomValue = addRandomValue;
window.resetData = resetData;
window.runTests = runTests;
