// -----------------------------------------------------
// Homework 11 — Brownian Motion (Euler–Maruyama Method)
// -----------------------------------------------------

// Box–Muller transform → standard normal
function randn() {
    const u = Math.random();
    const v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Main simulation entry point
function simulateBrownian() {
    const T = parseFloat(document.getElementById("bm_T").value);
    const n = parseInt(document.getElementById("bm_n").value);

    if (isNaN(T) || isNaN(n) || n <= 1) {
        alert("Enter valid values for T and n.");
        return;
    }

    const dt = T / n;
    const sqrt_dt = Math.sqrt(dt);

    let W = new Array(n + 1);
    W[0] = 0;

    for (let i = 1; i <= n; i++) {
        W[i] = W[i - 1] + sqrt_dt * randn();
    }

    drawBrownianPath(W, T);
}

// Draw BM trajectory on canvas
function drawBrownianPath(W, T) {
    const canvas = document.getElementById("brownianCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const midY = canvas.height / 2;

    // Axes
    ctx.strokeStyle = "#777";
    ctx.lineWidth = 1;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(40, midY);
    ctx.lineTo(canvas.width - 20, midY);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "#ccc";
    ctx.font = "14px sans-serif";
    ctx.fillText("0", 40, midY + 20);
    ctx.fillText("t = " + T, canvas.width - 60, midY + 20);

    // Draw BM path
    ctx.strokeStyle = "#4ea3ff";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const n = W.length - 1;

    for (let i = 0; i <= n; i++) {
        const x = 40 + (i / n) * (canvas.width - 60);
        const y = midY - W[i] * 40; // scale
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.stroke();
}

// Reset button — clears the canvas
function resetBrownian() {
    const canvas = document.getElementById("brownianCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
