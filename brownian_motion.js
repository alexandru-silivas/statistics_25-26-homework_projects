// ===========================================================
// Horizontal dotted line plugin (y = 0)
// ===========================================================
const horizontalLinePlugin = {
    id: "horizontalLine",
    afterDraw(chart, args, opts) {
        if (opts.y === undefined) return;
        const yScale = chart.scales.y;
        const yValue = yScale.getPixelForValue(opts.y);

        const ctx = chart.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = opts.color || "#888";
        ctx.lineWidth = 1.5;
        ctx.moveTo(chart.chartArea.left, yValue);
        ctx.lineTo(chart.chartArea.right, yValue);
        ctx.stroke();
        ctx.restore();
    }
};

Chart.register(horizontalLinePlugin);

let bmChart = null;

// ===========================================================
// Brownian Motion Simulator (Euler–Maruyama)
// ===========================================================
function simulateBM() {
    const T = parseFloat(document.getElementById("Tfinal").value);
    const n = parseInt(document.getElementById("Nsteps").value);
    const dt = T / n;

    // Time grid
    const times = new Array(n + 1).fill(0).map((_, i) => i * dt);

    // Simulate path
    const X = [0];
    for (let i = 1; i <= n; i++) {
        const Z = Math.sqrt(2 * Math.log(1 / Math.random())) *
                  Math.cos(2 * Math.PI * Math.random()); // Box-Muller
        X.push(X[i - 1] + Math.sqrt(dt) * Z);
    }

    drawBM(times, X);
}

// ===========================================================
// Draw the path on Chart.js
// ===========================================================
function drawBM(t, x) {

    if (bmChart !== null) bmChart.destroy();

    const canvas = document.getElementById("bmChart");
    bmChart = new Chart(canvas, {
        type: "line",
        data: {
            labels: t,
            datasets: [{
                label: "Brownian Motion",
                data: x,
                borderColor: "#3b82f6",
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: "#c9d1d9" }},
                horizontalLine: { y: 0, color: "#cbd5e1" }
            },
            scales: {
                x: {
                    title: { display: true, text: "Time t", color: "#cbd5e1" },
                    ticks: { color: "#cbd5e1" },
                    grid: { color: "#1e293b" }
                },
                y: {
                    title: { display: true, text: "X(t)", color: "#cbd5e1" },
                    ticks: { color: "#cbd5e1" },
                    grid: { color: "#1e293b" }
                }
            }
        }
    });
}

// ===========================================================
// Reset the graph
// ===========================================================
function resetBM() {
    if (bmChart !== null) {
        bmChart.destroy();
        bmChart = null;
    }
}
