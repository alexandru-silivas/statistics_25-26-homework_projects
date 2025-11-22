// Poisson process approximation simulation (HW 10)

let poissonChart = null;

function simulatePoisson() {
    const lambda = parseFloat(document.getElementById("lambdaInput").value);
    const status = document.getElementById("simStatus");

    if (isNaN(lambda) || lambda <= 0) {
        status.textContent = "Please enter a valid λ > 0.";
        return;
    }

    const T = 1;
    const n = 5000;                       // subintervals
    const p = lambda / n;                 // event probability per subinterval
    const simulations = 1000;             // number of runs

    const counts = [];
    for (let s = 0; s < simulations; s++) {
        let total = 0;
        for (let i = 0; i < n; i++) {
            if (Math.random() < p) total++;
        }
        counts.push(total);
    }

    // Empirical histogram
    const freq = {};
    counts.forEach(v => { freq[v] = (freq[v] || 0) + 1; });

    const keys = Object.keys(freq).map(Number).sort((a, b) => a - b);
    const values = keys.map(k => freq[k] / simulations);

    // Theoretical Poisson PMF
    const pois = keys.map(k => Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k));

    // Draw chart
    const ctx = document.getElementById("poissonHist").getContext("2d");

    if (poissonChart) poissonChart.destroy();

    poissonChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: keys,
            datasets: [
                {
                    label: "Empirical Frequency",
                    data: values,
                    backgroundColor: "rgba(80, 160, 255, 0.7)"
                },
                {
                    label: "Poisson(λ) Theoretical PMF",
                    data: pois,
                    type: "line",
                    borderColor: "red",
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: { display: true, text: "Number of events in [0,1]" },
                    ticks: { color: "#dfe8f3" }
                },
                y: {
                    title: { display: true, text: "Probability" },
                    beginAtZero: true,
                    ticks: { color: "#dfe8f3" }
                }
            },
            plugins: {
                legend: { labels: { color: "#ffffff" } }
            }
        }
    });

    status.textContent = "Simulation completed.";
}

function factorial(k) {
    if (k < 0) return 0;
    if (k === 0) return 1;
    let r = 1;
    for (let i = 1; i <= k; i++) r *= i;
    return r;
}
