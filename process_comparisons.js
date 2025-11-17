// process_comparisons.js
// Updated HW8 script — Pascal triangle + example random walks + interactive walk
// Safe, self-contained, compatible with Chart.js

// ---------- Utility: binomial generation (Pascal) ----------
function generatePascal(n) {
  const tri = [];
  for (let r = 0; r < n; r++) {
    const row = [];
    for (let k = 0; k <= r; k++) {
      if (k === 0 || k === r) row.push(1);
      else row.push(tri[r - 1][k - 1] + tri[r - 1][k]);
    }
    tri.push(row);
  }
  return tri;
}

// ---------- Render Pascal (robust to different input IDs) ----------
function getPascalRowsInput() {
  return document.getElementById('pascalRows') || document.getElementById('ptRows') || document.getElementById('pascalRowsInput');
}

function renderPascal() {
  const input = getPascalRowsInput();
  const rows = input ? Math.max(1, Math.min(30, parseInt(input.value || "10", 10))) : 10;
  const container = document.getElementById('pascalContainer');
  if (!container) return;

  const triangle = generatePascal(rows);

  // Clear and render as centered rows (no fixed height)
  container.innerHTML = '';
  triangle.forEach(row => {
    const div = document.createElement('div');
    div.className = 'pascal-row';
    // join with spacing — use fixed spacing for monospace look
    div.textContent = row.join('   ');
    container.appendChild(div);
  });

  // small Fibonacci diagonal demo
  const fibs = [];
  for (let start = 0; start < Math.min(rows, 12); start++) {
    let sum = 0, r = start, c = 0;
    while (r >= 0 && c <= r) {
      sum += triangle[r][c];
      r--; c++;
    }
    fibs.push(sum);
  }
  const fibDivId = '__pascal_fib_demo';
  let fibDiv = document.getElementById(fibDivId);
  if (!fibDiv) {
    fibDiv = document.createElement('div');
    fibDiv.id = fibDivId;
    fibDiv.style.marginTop = '10px';
    container.appendChild(fibDiv);
  }
  fibDiv.innerHTML = `<strong>Diagonal sums (sample):</strong> ${fibs.join(', ')}`;
}

// ---------- Random walk generator ----------
function bernoulliStepSigned(p) {
  return (Math.random() < p) ? 1 : -1;
}

function randomWalkArray(steps, p) {
  let pos = 0;
  const out = [pos];
  for (let i = 0; i < steps; i++) {
    pos += bernoulliStepSigned(p);
    out.push(pos);
  }
  return out;
}

// ---------- Chart management (local variables) ----------
let _hw8_chart_rw1 = null;
let _hw8_chart_rw2 = null;
let _hw8_chart_interactive = null;

function destroyChart(ref) {
  try {
    if (ref && typeof ref.destroy === 'function') ref.destroy();
  } catch (e) {
    // ignore errors destroying
  }
}

// create a line chart for given canvas id and numeric array
function createLineChart(canvasId, dataArr, label) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  // ensure canvas has some default height if CSS didn't set it
  if (!canvas.style.height) canvas.style.height = '300px';
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataArr.map((_, i) => i),
      datasets: [{
        label: label || '',
        data: dataArr,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.18,
        borderColor: 'rgba(78,163,255,0.95)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Step' }, ticks: { color: '#cfd9e6' } },
        y: { title: { display: true, text: 'Position' }, ticks: { color: '#cfd9e6' } }
      },
      plugins: { legend: { labels: { color: '#e6eef8' } } }
    }
  });
}

// ---------- Initialize example RW charts ----------
function initExampleWalks() {
  // destroy if exist
  destroyChart(_hw8_chart_rw1); destroyChart(_hw8_chart_rw2);
  // create new
  _hw8_chart_rw1 = createLineChart('rw1', randomWalkArray(50, 0.5), 'Random Walk (p=0.5)');
  _hw8_chart_rw2 = createLineChart('rw2', randomWalkArray(50, 0.7), 'Random Walk (p=0.7)');
}

// ---------- Interactive RW simulation ----------
function simulateInteractiveWalk() {
  const pIn = document.getElementById('pInput');
  const stepsIn = document.getElementById('stepsInput');
  if (!pIn || !stepsIn) return;

  let p = parseFloat(pIn.value);
  let steps = parseInt(stepsIn.value, 10);
  if (isNaN(p) || p < 0) p = 0;
  if (p > 1) p = 1;
  if (isNaN(steps) || steps < 1) steps = 50;

  const dataArr = randomWalkArray(steps, p);

  // destroy previous
  destroyChart(_hw8_chart_interactive);

  // ensure canvas has appropriate CSS size if not provided
  const canvas = document.getElementById('interactiveRandomWalk');
  if (canvas) {
    canvas.style.maxWidth = canvas.style.maxWidth || '900px';
    canvas.style.height = canvas.style.height || '380px';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
  }

  _hw8_chart_interactive = createLineChart('interactiveRandomWalk', dataArr, `Interactive Walk (p=${p})`);
}

function resetInteractiveWalk() {
  destroyChart(_hw8_chart_interactive);
  _hw8_chart_interactive = null;
  // leave canvas cleared (Chart.js removed)
  const canvas = document.getElementById('interactiveRandomWalk');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ---------- Safe bootstrap on DOM ready ----------
window.addEventListener('DOMContentLoaded', () => {
  // Render Pascal: support multiple possible input IDs
  const input = getPascalRowsInput();
  // if input exists and has no oninput handler yet, ensure it triggers renderPascal
  if (input && !input.getAttribute('__hw8_hooked')) {
    input.addEventListener('input', renderPascal);
    input.setAttribute('__hw8_hooked', '1');
  }
  renderPascal();

  // init example random-walk charts
  // delay a tiny bit to ensure canvas sizing from CSS is settled
  setTimeout(initExampleWalks, 60);

  // create an empty skeleton for interactive chart so area exists (avoid tiny/no-chart)
  const canvas = document.getElementById('interactiveRandomWalk');
  if (canvas) {
    // if CSS didn't set height, give a reasonable default
    if (!canvas.style.height) canvas.style.height = '320px';
    // draw an empty Chart skeleton (no datasets) to show axes
    const ctx = canvas.getContext('2d');
    try {
      if (_hw8_chart_interactive) _hw8_chart_interactive.destroy();
    } catch (e) {}
    _hw8_chart_interactive = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Step' } },
          y: { title: { display: true, text: 'Position' } }
        }
      }
    });
  }
});

// ---------- Export functions to global (used by onclick in HTML) ----------
window.renderPascal = renderPascal;
window.simulateInteractiveWalk = simulateInteractiveWalk;
window.resetInteractiveWalk = resetInteractiveWalk;
