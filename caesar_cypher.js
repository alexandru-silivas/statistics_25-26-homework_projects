/* caesar_cipher.js — interactive Caesar Cipher + frequency visualization
   ---------------------------------------------------------------
   Features:
   - Encrypt/decrypt text using Caesar cipher.
   - Brute-force mode showing all 26 shifts.
   - Auto-decode based on letter frequency analysis.
   - Live frequency histogram using Chart.js.
*/

// ===== Utility Functions =====

function caesarTransform(text, shift) {
  const A = "A".charCodeAt(0);
  const a = "a".charCodeAt(0);
  const mod = (n, m) => ((n % m) + m) % m;

  return text
    .split("")
    .map((ch) => {
      if (/[A-Z]/.test(ch)) return String.fromCharCode(A + mod(ch.charCodeAt(0) - A + shift, 26));
      if (/[a-z]/.test(ch)) return String.fromCharCode(a + mod(ch.charCodeAt(0) - a + shift, 26));
      return ch;
    })
    .join("");
}

// ===== Main Cipher Operations =====

function caesarEncrypt() {
  const text = document.getElementById("cipherInput").value;
  const shift = parseInt(document.getElementById("shift").value) || 0;
  const result = caesarTransform(text, shift);

  document.getElementById("cipherOutput").value = result;
  document.getElementById("statusMsg").textContent = `Encrypted with shift ${shift}.`;

  updateFreqChart(result);
}

function bruteForce() {
  const text = document.getElementById("cipherInput").value;
  if (!text.trim()) return (document.getElementById("statusMsg").textContent = "Please enter some text first.");

  let output = "";
  for (let s = 0; s < 26; s++) {
    output += `Shift ${s}: ${caesarTransform(text, -s)}\n`;
  }

  document.getElementById("cipherOutput").value = output;
  document.getElementById("statusMsg").textContent = "Displayed all 26 possible shifts.";
}

function autoDecode() {
  const text = document.getElementById("cipherInput").value.toUpperCase();
  if (!text.trim()) return (document.getElementById("statusMsg").textContent = "Please enter some encrypted text first.");

  const englishFreq = {
    A: 8.17, B: 1.49, C: 2.78, D: 4.25, E: 12.70, F: 2.23, G: 2.02,
    H: 6.09, I: 6.97, J: 0.15, K: 0.77, L: 4.03, M: 2.41, N: 6.75,
    O: 7.51, P: 1.93, Q: 0.10, R: 5.99, S: 6.33, T: 9.06, U: 2.76,
    V: 0.98, W: 2.36, X: 0.15, Y: 1.97, Z: 0.07,
  };

  function score(text) {
    const counts = {};
    let total = 0;
    for (const c of text) {
      if (/[A-Z]/.test(c)) {
        counts[c] = (counts[c] || 0) + 1;
        total++;
      }
    }
    let chi2 = 0;
    for (const l in englishFreq) {
      const observed = ((counts[l] || 0) / total) * 100;
      const expected = englishFreq[l];
      chi2 += ((observed - expected) ** 2) / expected;
    }
    return chi2;
  }

  let bestShift = 0;
  let bestScore = Infinity;
  for (let s = 0; s < 26; s++) {
    const decoded = caesarTransform(text, -s);
    const sc = score(decoded);
    if (sc < bestScore) {
      bestScore = sc;
      bestShift = s;
    }
  }

  const result = caesarTransform(text, -bestShift);
  document.getElementById("cipherOutput").value = result;
  document.getElementById("statusMsg").textContent = `Auto-decoded (best shift: ${bestShift}).`;

  updateFreqChart(result);
}

// ===== Frequency Chart Visualization =====

let freqChart = null;

function updateFreqChart(text) {
  const counts = {};
  let total = 0;
  for (const c of text.toUpperCase()) {
    if (/[A-Z]/.test(c)) {
      counts[c] = (counts[c] || 0) + 1;
      total++;
    }
  }

  const labels = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const data = labels.map((l) => ((counts[l] || 0) / total) * 100);

  const ctx = document.getElementById("freqChart").getContext("2d");
  if (freqChart) freqChart.destroy();

  freqChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Letter Frequency (%)",
          data,
          backgroundColor: "rgba(78, 163, 255, 0.7)",
          borderColor: "rgba(78, 163, 255, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255,255,255,0.05)" },
          ticks: { color: "#cfd9e6" },
        },
        x: {
          grid: { color: "rgba(255,255,255,0.02)" },
          ticks: { color: "#cfd9e6" },
        },
      },
      plugins: {
        legend: { labels: { color: "#e6eef8" } },
      },
    },
  });
}


function caesarEncrypt() {
  const text = document.getElementById("cipherInput").value;
  const shift = parseInt(document.getElementById("shift").value) || 0;
  const resultBox = document.getElementById("cipherOutput");
  const status = document.getElementById("statusMsg");

  if (!text.trim()) {
    status.textContent = "Please enter some text to encrypt.";
    return;
  }

  const encrypted = text
    .split("")
    .map(ch => {
      if (/[a-z]/.test(ch)) {
        return String.fromCharCode(((ch.charCodeAt(0) - 97 + shift) % 26) + 97);
      } else if (/[A-Z]/.test(ch)) {
        return String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      return ch;
    })
    .join("");

  resultBox.value = encrypted;
  document.getElementById("cipherInput").value = encrypted;  // ✅ Automatically transfer result
  status.textContent = `Encrypted using shift = ${shift}`;
}
