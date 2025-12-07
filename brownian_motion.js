// -----------------------------------------------------
// Homework 11 — Brownian Motion (Euler–Maruyama Method)
// -----------------------------------------------------

// Generate a standard normal using Box–Muller
function randn() {
    let u = Math.random();
    let v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Simulate Brownian motion
function simulateBrownian() {
    const T = parseFloat(document.getElementById("bm_T").value);
    const n = parseInt(document.getElementById("bm_n").value);

    if (isNaN(T) || isNaN(n) || n <= 1) {
        alert("Please enter valid values for T and n.");
        return;
    }

    const dt = T / n;
    const sqrt_dt = Math.sqrt(dt);

    // Generate BM path
    let W = new Array(n + 1);
    W[0] = 0;

    for (let i = 1; i <= n; i++) {
        W[i] = W[i - 1] + sqrt_dt * randn();
    }

    drawBrownianPath(W, T);
}

// Draw the Brownian motion path on the canvas
function drawBrownianPath(W, T) {
    const canvas = document.getElementById("brownianCanvas");
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;

    // Center Y axis
    let midY = canvas.height / 2;

    ctx.beginPath();
    ctx.moveTo(40, midY);
    ctx.lineTo(canvas.width - 20, midY);
    ctx.stroke();

    // Time labels (X-axis)
    ctx.fillStyle = "#ccc";
    ctx.font = "14px sans-serif";
    ctx.fillText("0", 40, midY + 20);
    ctx.fillText("T = " + T, canvas.width - 60, midY + 20);

    // Value labels (Y-axis)
    ctx.fillText("+", 20, 20);
    ctx.fillText("-", 20, canvas.height - 20);

    // Draw BM path
    ctx.strokeStyle = "#4ea3ff";
    ctx.lineWidth = 2;

    ctx.beginPath();

    let n = W.length - 1;

    for (let i = 0; i <= n; i++) {
        let x = 40 + (i / n) * (canvas.width - 60);
        let y = midY - W[i] * 40; // scale for visibility
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.stroke();
}
