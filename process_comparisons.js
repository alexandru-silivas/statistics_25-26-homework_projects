// ------------------------------
// PASCAL (TARTAGLIA) TRIANGLE
// ------------------------------

function renderPascal() {
    const rows = parseInt(document.getElementById("pascalRows").value);
    const container = document.getElementById("pascalContainer");

    container.innerHTML = "";
    container.style.display = "block";
    container.style.padding = "10px";
    container.style.background = "rgba(255,255,255,0.05)";
    container.style.borderRadius = "8px";
    container.style.marginBottom = "20px";

    let triangle = [];

    for (let i = 0; i < rows; i++) {
        triangle[i] = [];
        const rowDiv = document.createElement("div");
        rowDiv.style.textAlign = "center";
        rowDiv.style.fontFamily = "monospace";
        rowDiv.style.margin = "2px";

        for (let j = 0; j <= i; j++) {
            if (j === 0 || j === i) triangle[i][j] = 1;
            else triangle[i][j] = triangle[i - 1][j - 1] + triangle[i - 1][j];

            const cell = document.createElement("span");
            cell.style.margin = "0 6px";
            cell.textContent = triangle[i][j];
            rowDiv.appendChild(cell);
        }

        container.appendChild(rowDiv);
    }
}



// ------------------------------
// INTERACTIVE RANDOM WALK
// ------------------------------

let interactiveChart = null;

function runInteractiveWalk() {
    const p = parseFloat(document.getElementById("rwP").value);
    const n = parseInt(document.getElementById("rwN").value);

    let steps = [];
    let score = 0;

    for (let i = 0; i < n; i++) {
        const r = Math.random();
        if (r < p) score += 1;
        else score -= 1;
        steps.push(score);
    }

    const ctx = document.getElementById("interactiveWalk").getContext("2d");

    if (interactiveChart) interactiveChart.destroy();

    interactiveChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: Array.from({ length: n }, (_, i) => i + 1),
            datasets: [{
                label: "Random Walk Path",
                data: steps,
                borderWidth: 2,
                fill: false,
                borderColor: "rgba(80,150,255,1)"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: "Step (Week)", color: "#cfd9e6" },
                    ticks: { color: "#cfd9e6" }
                },
                y: {
                    title: { display: true, text: "Score", color: "#cfd9e6" },
                    ticks: { color: "#cfd9e6" }
                }
            },
            plugins: {
                legend: { labels: { color: "#e6eef8" } }
            }
        }
    });
}

function resetInteractiveWalk() {
    if (interactiveChart) {
        interactiveChart.destroy();
        interactiveChart = null;
    }
}
