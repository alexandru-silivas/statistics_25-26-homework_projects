// brownian_motion.js
// Brownian motion simulation using Box-Muller normals and Chart.js

let bmPathsChart = null;
let bmHistChart = null;

// small seeded RNG (Park-Miller) so user can optionally provide reproducible seed
function makeSeededRng(seedStr) {
  if (!seedStr) return Math.random;
  // simple hash to integer
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = (h >>> 0) || 1;
  return function() {
    // Park-Miller minimal standard
    state = (Math.imul(48271, state) % 2147483647) >>> 0;
    return (state & 0x7fffffff) / 2147483647;
  };
}

// Box-Muller producing two independent normals
function boxMuller(u, v) {
  const r = Math.sqrt(-2 * Math.log(u));
  const theta = 2 * Math.PI * v;
  const z0 = r * Math.cos(theta);
  const z1 = r * Math.sin(theta);
  return [z0, z1];
}

function simulateBrownian() {
  const T = parseFloat(document.getElementById('bm_T').value) || 1.0;
  const n = Math.max(50, parseInt(document.getElementById('bm_n').value) || 2000);
  const paths = Math.max(1, parseInt(document.getElementById('bm_paths').value) || 1);
  const seed = document.getElementById('bm_seed').value.trim();
  const rng = makeSeededRng(seed);

  const statusEl = document.getElementById('bmStatus');
  statusEl.textContent = `Simulating ${paths} path(s), ${n} steps, T=${T}...`;

  const dt = T / n;
  const sqrtDt = Math.sqrt(dt);

  // labels: time points 0, dt, 2dt, ... T
  const labels = Array.from({length: n + 1}, (_, i) => (i * dt).toFixed(4));

  // generate paths
  const allIncrements = []; // collect increments across all paths for histogram
  const datasets = [];
  for (let p = 0; p < paths; p++) {
    const path = [0];
    let W = 0;
    // generate normals in pairs for speed
    for (let i = 0; i < n; i += 2) {
      const u1 = rng();
      const u2 = rng();
      const [z0, z1] = boxMuller(u1 || Math.random(), u2 || Math.random());
      const dW0 = sqrtDt * z0;
      W += dW0;
      path.push(W);
      allIncrements.push(dW0);

      if (i + 1 < n) {
        const dW1 = sqrtDt * z1;
        W += dW1;
        path.push(W);
        allIncrements.push(dW1);
      }
    }

    // trim path length in case of odd n (we might have pushed one extra)
    if (path.length > n + 1) path.length = n + 1;

    // color (semi-transparent) for multiple paths
    const color = `rgba(${40 + (p*60)%200}, ${120 + (p*30)%120}, ${200 - (p*20)%120}, 0.95)`;
    datasets.push({
      label: `Path ${p+1}`,
      data: path,
      borderColor: color,
      borderWidth: 1.6,
      pointRadius: 0,
      tension: 0.15,
      fill: false
    });
  }

  // plot paths
  const ctxPaths = document.getElementById('bmPathsChart').getContext('2d');
  if (bmPathsChart) bmPathsChart.destroy();
  bmPathsChart = new Chart(ctxPaths, {
    type: 'line',
    data: { labels: labels, datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { title: { display: true, text: 'Time t' }, ticks: { color: '#cfd9e6' } },
        y: { title: { display: true, text: 'W(t)' }, ticks: { color: '#cfd9e6' } }
      },
      plugins: {
        legend: { labels: { color: '#e6eef8' } }
      }
    }
  });

  // prepare increments histogram (density)
  // compute bins (use Freedman–Diaconis-ish or simple)
  const m = allIncrements.length;
  // if m small, choose small bins
  let binCount = Math.min(60, Math.max(12, Math.round(Math.sqrt(m))));
  // compute min and max
  const min = Math.min(...allIncrements);
  const max = Math.max(...allIncrements);
  const range = max - min || 1e-6;
  const binWidth = range / binCount;
  const bins = Array.from({length: binCount}, (_, i) => min + (i + 0.5) * binWidth);
  const counts = new Array(binCount).fill(0);
  for (const v of allIncrements) {
    let idx = Math.floor((v - min) / binWidth);
    if (idx < 0) idx = 0;
    if (idx >= binCount) idx = binCount - 1;
    counts[idx] += 1;
  }
  // convert to probabilities (density)
  const densities = counts.map(c => (c / m) / binWidth);

  // theoretical normal density N(0, dt)
  function normalPdf(x, mean, varx) {
    const s = Math.sqrt(varx);
    return (1 / (Math.sqrt(2 * Math.PI) * s)) * Math.exp(-0.5 * ((x - mean) / s) ** 2);
  }
  const theoretical = bins.map(x => normalPdf(x, 0, dt));

  // plot histogram + theoretical line
  const ctxHist = document.getElementById('bmIncrementsHist').getContext('2d');
  if (bmHistChart) bmHistChart.destroy();
  bmHistChart = new Chart(ctxHist, {
    type: 'bar',
    data: {
      labels: bins.map(b => b.toFixed(4)),
      datasets: [
        {
          type: 'bar',
          label: 'Empirical density',
          data: densities,
          backgroundColor: 'rgba(78,163,255,0.75)',
          barPercentage: 1,
          categoryPercentage: 1
        },
        {
          type: 'line',
          label: 'Theoretical N(0,Δt) density',
          data: theoretical,
          borderColor: 'rgba(255,100,100,0.95)',
          borderWidth: 2,
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Increment value' }, ticks: { color: '#cfd9e6' } },
        y: { title: { display: true, text: 'Density' }, ticks: { color: '#cfd9e6' } }
      },
      plugins: {
        legend: { labels: { color: '#e6eef8' } }
      }
    }
  });

  // stats update
  const meanInc = (allIncrements.reduce((a,b)=>a+b,0)) / allIncrements.length;
  const varInc = allIncrements.reduce((a,b)=>a + (b-meanInc)**2, 0) / allIncrements.length;

  statusEl.textContent = `Done — simulated ${paths} path(s), n=${n}, dt=${dt.toExponential(2)}. Increment mean≈${meanInc.toExponential(2)}, var≈${varInc.toExponential(2)} (theoretical var=dt=${dt.toExponential(2)}).`;
}

function resetBrownian() {
  if (bmPathsChart) { bmPathsChart.destroy(); bmPathsChart = null; }
  if (bmHistChart) { bmHistChart.destroy(); bmHistChart = null; }
  document.getElementById('bmStatus').textContent = 'Reset complete.';
}
