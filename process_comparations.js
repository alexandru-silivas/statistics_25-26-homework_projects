// process_comparations.js - Moderate-depth HW8: Bernoulli vs random walk, Pascal triangle
// Requires Chart.js (already included in HTML)

// ---------- helpers ----------
function rand() { return Math.random(); }

// Simulate a Bernoulli sequence of length n with prob p, return array of 0/1
function bernoulliSeq(n, p) {
  const out = new Array(n);
  for (let i = 0; i < n; i++) out[i] = (Math.random() < p) ? 1 : 0;
  return out;
}

// cumulative success frequency series from a bernoulli 0/1 array
function runningFreq(seq) {
  const out = [];
  let count = 0;
  for (let i = 0; i < seq.length; i++) {
    count += seq[i];
    out.push(count / (i + 1));
  }
  return out;
}

// convert bernoulli sequence to random-walk steps (+1/-1 cumulative)
function toRandomWalk(seq) {
  const out = [];
  let s = 0;
  for (let i = 0; i < seq.length; i++) {
    s += seq[i] ? 1 : -1;
    out.push(s);
  }
  return out;
}

// fixed bins for final score (-n .. n step 2)
function fixedBins(n) {
  const bins = [];
  for (let s = -n; s <= n; s += 2) bins.push(s);
  return bins;
}

// compute binomial coefficient nCk (small n)
function nCk(n, k) {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let num = 1, den = 1;
  for (let i = 1; i <= k; i++) {
    num *= (n - (k - i));
    den *= i;
  }
  return Math.round(num / den);
}

// compute binomial PMF array for k=0..n
function binomialPMF(n, p) {
  const pmf = [];
  for (let k = 0; k <= n; k++) {
    pmf.push(nCk(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k));
  }
  return pmf;
}

// ---------- Chart utilities ----------
let convChart = null;
let rwTrajChart = null;
let rwHistChart = null;

function destroyIfExists(obj) { if (obj) try { obj.destroy(); } catch (e) {} }

// ---------- 1) Bernoulli convergence ----------
function runConvergence() {
  const n = Math.max(10, parseInt(document.getElementById('convN').value, 10) || 1000);
  let p = parseFloat(document.getElementById('convP').value);
  const runs = Math.max(1, parseInt(document.getElementById('convRuns').value, 10) || 1);
  if (isNaN(p) || p < 0) p = 0;
  if (p > 1) p = 1;

  // run 'runs' sequences and plot them (overlay)
  const labels = Array.from({length: n}, (_, i) => i + 1);
  const datasets = [];
  for (let r = 0; r < runs; r++) {
    const seq = bernoulliSeq(n, p);
    const freq = runningFreq(seq);
    datasets.push({
      label: `run ${r+1}`,
      data: freq,
      borderColor: r === 0 ? 'rgba(78,163,255,0.95)' : `rgba(78,163,255,${0.35 - r*0.06})`,
      fill: false,
      tension: 0.2,
      pointRadius: 0
    });
  }

  // destroy previous
  destroyIfExists(convChart);

  const ctx = document.getElementById('convChart').getContext('2d');
  convChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      animation: false,
      scales: {
        x: { title: { display: true, text: 'Trial index' }, ticks: { color: '#cfd9e6' } },
        y: { title: { display: true, text: 'Empirical success frequency' }, min: 0, max: 1, ticks: { color: '#cfd9e6' } }
      },
      plugins: { legend: { display: runs > 1 } }
    }
  });

  // draw horizontal line = true p
  // Chart.js ability: add a dataset with constant values
  convChart.data.datasets.push({
    label: `p = ${p}`,
    data: Array.from({length: n}, () => p),
    borderColor: 'rgba(255,99,132,0.95)',
    borderDash: [6, 4],
    borderWidth: 2,
    fill: false,
    pointRadius: 0
  });
  convChart.update();
}

function resetConvergence() {
  document.getElementById('convN').value = 1000;
  document.getElementById('convP').value = 0.3;
  document.getElementById('convRuns').value = 1;
  if (convChart) { convChart.destroy(); convChart = null; }
  const ctx = document.getElementById('convChart').getContext('2d');
  ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
}

// ---------- 2) Random walk trajectories + histogram + theoretical overlay ----------
function runRandomWalk() {
  const n = Math.max(1, parseInt(document.getElementById('rwN').value, 10) || 50);
  let p = parseFloat(document.getElementById('rwP').value);
  const sims = Math.max(1, parseInt(document.getElementById('rwSims').value, 10) || 200);
  if (isNaN(p) || p < 0) p = 0; if (p > 1) p = 1;

  // simulate sims trajectories
  const trajs = [];
  const finals = [];
  for (let i = 0; i < sims; i++) {
    const seq = bernoulliSeq(n, p);
    const walk = toRandomWalk(seq);
    trajs.push(walk);
    finals.push(walk[walk.length-1]);
  }

  // draw trajectories (limited plotted lines)
  const maxPlot = Math.min(trajs.length, 80); // cap
  const labels = Array.from({length: n}, (_, i) => i + 1);
  const datasets = [];
  for (let i = 0; i < maxPlot; i++) {
    datasets.push({
      data: trajs[i],
      borderColor: 'rgba(78,163,255,0.35)',
      fill: false,
      pointRadius: 0,
      tension: 0.2
    });
  }
  destroyIfExists(rwTrajChart);
  const ctx1 = document.getElementById('rwTraj').getContext('2d');
  rwTrajChart = new Chart(ctx1, {
    type: 'line',
    data: { labels, datasets },
    options: {
      animation: false,
      scales: {
        x: { title: { display: true, text: 'Step (trial)' }, ticks: { color: '#cfd9e6' } },
        y: { title: { display: true, text: 'Cumulative score (±1 steps)' }, min: -n, max: n, ticks: { color: '#cfd9e6' } }
      },
      plugins: { legend: { display: false } }
    }
  });

  // build histogram counts aligned with fixed bins -n..n step 2
  const bins = fixedBins(n);
  const countsMap = {}; bins.forEach(b => countsMap[b]=0);
  finals.forEach(f => { if (countsMap.hasOwnProperty(f)) countsMap[f]++; });
  const counts = bins.map(b => countsMap[b]);

  // theoretical expected counts: probabilities * sims
  const pmf = binomialPMF(n, p); // k from 0..n successes
  // map pmf (k) to score S=2k-n; expected counts = pmf[k]*sims
  const theoryMap = {}; for (let k=0;k<=n;k++){ theoryMap[2*k - n] = pmf[k] * sims; }
  const theoryArr = bins.map(b => theoryMap[b] || 0);

  // draw histogram with theoretical overlay
  destroyIfExists(rwHistChart);
  const ctx2 = document.getElementById('rwHist').getContext('2d');
  rwHistChart = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: bins.map(String),
      datasets: [
        { label: 'Empirical counts', data: counts, backgroundColor: 'rgba(78,163,255,0.85)' },
        { type: 'line', label: 'Theoretical (expected counts)', data: theoryArr, borderColor: 'rgba(255,80,120,0.95)', borderWidth:2, fill:false, pointRadius:3 }
      ]
    },
    options: {
      animation: false,
      scales: {
        x: { title: { display:true, text:'Final score (S = 2K − n)' }, ticks: { color: '#cfd9e6' } },
        y: { title: { display:true, text:'Number of trajectories' }, ticks: { color: '#cfd9e6' } }
      },
      plugins: { legend: { display: true } }
    }
  });
}

function resetRandomWalk() {
  document.getElementById('rwN').value = 50;
  document.getElementById('rwP').value = 0.3;
  document.getElementById('rwSims').value = 200;
  if (rwTrajChart) { rwTrajChart.destroy(); rwTrajChart = null; }
  if (rwHistChart) { rwHistChart.destroy(); rwHistChart = null; }
  const ctx1 = document.getElementById('rwTraj').getContext('2d'); ctx1.clearRect(0,0,ctx1.canvas.width,ctx1.canvas.height);
  const ctx2 = document.getElementById('rwHist').getContext('2d'); ctx2.clearRect(0,0,ctx2.canvas.width,ctx2.canvas.height);
}

// ---------- 3) Pascal triangle rendering + Fibonacci diagonals ----------
function renderPascal() {
  const rows = Math.max(3, Math.min(20, parseInt(document.getElementById('ptRows').value, 10) || 10));
  const container = document.getElementById('pascalContainer');
  container.innerHTML = '';

  // build triangle
  const triangle = [];
  for (let r = 0; r < rows; r++) {
    triangle[r] = [];
    for (let k = 0; k <= r; k++) triangle[r][k] = nCk(r, k);
  }

  // render as table-like block (flex rows)
  for (let r = 0; r < rows; r++) {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';
    rowDiv.style.justifyContent = 'center';
    rowDiv.style.gap = '8px';
    rowDiv.style.marginBottom = '6px';
    for (let k = 0; k <= r; k++) {
      const cell = document.createElement('div');
      cell.textContent = triangle[r][k];
      cell.style.padding = '6px 10px';
      cell.style.borderRadius = '6px';
      cell.style.background = 'rgba(255,255,255,0.02)';
      cell.style.color = '#cfd9e6';
      cell.style.minWidth = '34px';
      cell.style.textAlign = 'center';
      rowDiv.appendChild(cell);
    }
    container.appendChild(rowDiv);
  }

  // Fibonacci demonstration (sum along diagonals)
  const fibs = [];
  // for small demonstration, diagonals starting at row 2
  for (let start = 0; start <= rows - 1; start++) {
    let sum = 0;
    let r = start;
    let c = 0;
    while (r >= 0 && c <= r) {
      sum += triangle[r][c];
      r--; c++;
    }
    fibs.push(sum);
    if (fibs.length >= 10) break;
  }

  const fibDiv = document.createElement('div');
  fibDiv.style.marginTop = '10px';
  fibDiv.innerHTML = `<strong>Diagonal sums (small demo):</strong> ${fibs.join(', ')} 
    <div style="color:#9aa6b1;font-size:0.95rem;margin-top:6px">
      These diagonal sums produce initial Fibonacci-like numbers (small demonstration).
    </div>`;
  container.appendChild(fibDiv);
}

// ---------- bootstrap: render initial small views ----------
window.addEventListener('load', () => {
  // draw an initial empty skeleton: light grid or nothing
  renderPascal();
});
