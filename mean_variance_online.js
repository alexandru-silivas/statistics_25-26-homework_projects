// Online Mean and Variance Calculator (Welford’s Algorithm)
let n = 0;
let mean = 0;
let M2 = 0;
const means = [];
const variances = [];
const labels = [];

const ctx = document.getElementById("statsChart").getContext("2d");
const statsChart = new Chart(ctx, {
  type: "line",
  data: {
    labels,
    datasets: [
      {
        label: "Mean",
        data: means,
        borderColor: "rgba(78,163,255,0.9)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Variance",
        data: variances,
        borderColor: "rgba(255,159,64,0.9)",
        fill: false,
        tension: 0.1,
      },
    ],
  },
  options: {
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    scales: {
      x: { title: { display: true, text: "Sample Number" } },
      y: { beginAtZero: true, title: { display: true, text: "Value" } },
    },
  },
});

// Function to add a new value
function addValue() {
  const input = document.getElementById("newValue");
  const val = parseFloat(input.value);
  const status = document.getElementById("statsStatus");

  if (isNaN(val)) {
    status.textContent = "⚠️ Please enter a valid number.";
    return;
  }

  n++;
  const delta = val - mean;
  mean += delta / n;
  M2 += delta * (val - mean);
  const variance = n > 1 ? M2 / n : 0;

  means.push(mean);
  variances.push(variance);
  labels.push(n);

  statsChart.update();

  status.textContent = `After ${n} value${n > 1 ? "s" : ""}: Mean = ${mean.toFixed(
    3
  )}, Variance = ${variance.toFixed(3)}`;

  input.value = "";
  input.focus();
}
