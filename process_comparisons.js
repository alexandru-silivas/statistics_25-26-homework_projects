// ------------------------------
// PASCAL TRIANGLE (TARTAGLIA)
// ------------------------------

function generatePascal(n) {
  const triangle = [];
  for (let row = 0; row < n; row++) {
    const line = [1];
    for (let col = 1; col < row; col++) {
      line[col] = triangle[row - 1][col - 1] + triangle[row - 1][col];
    }
    if (row > 0) line.push(1);
    triangle.push(line);
  }
  return triangle;
}

function renderPascal() {
  const rows = parseInt(document.getElementById("pascalRows").value);
  const container = document.getElementById("pascalContainer");

  const triangle = generatePascal(rows);

  container.innerHTML = "";
  triangle.forEach((row) => {
    const div = document.createElement("div");
    div.className = "pascal-row";
    div.textContent = row.join("   ");
    container.appendChild(div);
  });
}

// Render triangle on page load
window.addEventListener("DOMContentLoaded", renderPascal);


// ------------------------------
// CHART.JS RANDOM WALKS
// ------------------------------

function bernoulliStep(p) {
  return Math.random() < p ? 1 : -1;
}

function randomWalk(steps, p) {
  let position = 0;
  const data = [0];

  for (let i = 0; i < steps; i++) {
    position += bernoulliStep(p);
    data.push(position);
  }
  return data;
}

function createWalkChart(canvasId, data, labelText) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: data.length }, (_, i) => i),
      datasets: [
        {
          label: labelText,
          data,
          borderWidth: 2,
          fill: false
        }
      ]
    },
    options: {
      scales: {
        x: { title: { display: true, text: "Step" } },
        y: { title: { display: true, text: "Position" } }
      }
    }
  });
}

// Pre-generate example random walks
window.addEventListener("DOMContentLoaded", () => {
  createWalkChart("rw1", randomWalk(50, 0.5), "Random Walk (p=0.5)");
  createWalkChart("rw2", randomWalk(50, 0.7), "Random Walk (p=0.7)");
});


// ------------------------------
// INTERACTIVE RANDOM WALK
// ------------------------------

let interactiveChart = null;

function simulateInteractiveWalk() {
  const p = parseFloat(document.getElementById("pInput").value);
  const steps = parseInt(document.getElementById("stepsInput").value);

  const data = randomWalk(steps, p);
  const ctx = document.getElementById("interactiveRandomWalk").getContext("2d");

  if (interactiveChart) interactiveChart.destroy();

  interactiveChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: data.length }, (_, i) => i),
      datasets: [
        {
          label: `Random Walk (p=${p})`,
          data,
          borderWidth: 2,
          fill: false
        }
      ]
    },
    options: {
      scales: {
        x: { title: { display: true, text: "Step" } },
        y: { title: { display: true, text: "Position" } }
      }
    }
  });
}

function resetInteractiveWalk() {
  if (interactiveChart) interactiveChart.destroy();
}
