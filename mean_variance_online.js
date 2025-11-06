// mean_variance_online.js.js – Online mean and variance calculator (Welford's algorithm)

let count = 0;
let mean = 0;
let M2 = 0;

function addValue() {
  const input = document.getElementById("valueInput");
  const value = parseFloat(input.value);
  if (isNaN(value)) return;

  count += 1;
  const delta = value - mean;
  mean += delta / count;
  M2 += delta * (value - mean);

  const variance = count > 1 ? M2 / (count - 1) : 0;

  document.getElementById("count").textContent = count;
  document.getElementById("mean").textContent = mean.toFixed(4);
  document.getElementById("variance").textContent = variance.toFixed(4);

  input.value = "";
}
