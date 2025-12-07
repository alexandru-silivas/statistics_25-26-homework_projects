// ---------- Normal generator (Box–Muller) ----------
function normalBM() {
    let u1 = Math.random();
    let u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// ---------- Euler–Maruyama Brownian Simulation ----------
function simulateBM() {
    const T = parseFloat(document.getElementById("bmT").value);
    const n = parseInt(document.getElementById("bmN").value);

    const dt = T / n;
    const sqrt_dt = Math.sqrt(dt);

    const x = new Array(n + 1).fill(0);
    const t = new Array(n + 1);

    for (let i = 0; i <= n; i++) t[i] = (i * T) / n;

    for (let i = 1; i <= n; i++) {
        x[i] = x[i-1] + sqrt_dt * normalBM();
    }

    drawBM(t, x);
}

// ---------- Chart.js handling ----------
let bmChartInstance = null;

function drawBM(t, x) {
    const ctx = document.getElementById("bmChart").getContext("2d");

    if (bmChartInstance) bmChartInstance.destroy();

    bmChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: t,
            datasets: [{
                label: "Brownian Motion Path",
                data: x,
                borderColor: "#4ea3ff",
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                tension: 0   // straight segments (original style)
            }]
        },
        options: {
            responsive: false,   // *** THIS restores the original size behaviour ***
            animation: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Time t",
                        color: "#c9d1d9"
                    },
                    ticks: { color: "#c9d1d9" },
                    grid: { color: "#1f2937" }
                },
                y: {
                    title: {
                        display: true,
                        text: "X(t)",
                        color: "#c9d1d9"
                    },
                    ticks: { color: "#c9d1d9" },
                    grid: { color: "#1f2937" }
                }
            },
            plugins: {
                legend: {
                    labels: { color: "#c9d1d9" }
                }
            }
        }
    });
}

// ---------- Reset ----------
function resetBM() {
    if (bmChartInstance) {
        bmChartInstance.destroy();
        bmChartInstance = null;
    }
}
