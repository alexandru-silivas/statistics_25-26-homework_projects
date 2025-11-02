// rsa_demo.js - Clean, self-contained RSA demo (BigInt)

// ---------- Helpers ----------
function modPow(base, exp, mod) {
  base = BigInt(base) % BigInt(mod);
  let result = 1n;
  let e = BigInt(exp);
  let m = BigInt(mod);
  while (e > 0n) {
    if (e & 1n) result = (result * base) % m;
    base = (base * base) % m;
    e >>= 1n;
  }
  return result;
}

// Extended gcd for modular inverse
function egcd(a, b) {
  a = BigInt(a); b = BigInt(b);
  if (b === 0n) return { g: a, x: 1n, y: 0n };
  const res = egcd(b, a % b);
  return { g: res.g, x: res.y, y: res.x - (a / b) * res.y };
}
function modInverse(a, m) {
  const { g, x } = egcd(a, m);
  if (g !== 1n) return null;
  return (x % m + m) % m;
}

// small primality test (trial division) for demo
function isPrimeSmall(n) {
  n = BigInt(n);
  if (n < 2n) return false;
  if (n % 2n === 0n) return n === 2n;
  for (let i = 3n; i * i <= n; i += 2n) if (n % i === 0n) return false;
  return true;
}

// ---------- Key generation ----------
function generateKeys() {
  const p = document.getElementById("p").value;
  const q = document.getElementById("q").value;
  const status = document.getElementById("rsaStatus");

  const pN = Number(p);
  const qN = Number(q);
  if (!pN || !qN) {
    status.textContent = "Enter primes p and q.";
    return;
  }
  if (!isPrimeSmall(pN) || !isPrimeSmall(qN) || pN === qN) {
    status.textContent = "Please enter two distinct small primes.";
    return;
  }

  const n = BigInt(pN) * BigInt(qN);
  const phi = BigInt(pN - 1) * BigInt(qN - 1);
  let e = 65537n;
  // if e not coprime (rare for small demo), try 17
  function gcd(a, b) { a = BigInt(a); b = BigInt(b); while (b !== 0n) [a, b] = [b, a % b]; return a; }
  if (gcd(e, phi) !== 1n) e = 17n;
  const d = modInverse(e, phi);
  if (d === null) {
    status.textContent = "Failed to compute d (choose different primes).";
    return;
  }

  // Save globally in consistent names
  window.rsa_n = n;
  window.rsa_e = e;
  window.rsa_d = d;

  document.getElementById("publicKey").textContent = `(n=${n.toString()}, e=${e.toString()})`;
  document.getElementById("privateKey").textContent = `(n=${n.toString()}, d=${d.toString()})`;
  status.textContent = "Keys generated successfully.";
}

// ---------- Encrypt ----------
function rsaEncrypt() {
  const n = window.rsa_n;
  const e = window.rsa_e;
  const status = document.getElementById("rsaStatus");
  if (!n || !e) {
    status.textContent = "Generate keys first.";
    return;
  }

  const text = document.getElementById("plaintext").value || "";
  if (!text) {
    status.textContent = "Enter plaintext to encrypt.";
    return;
  }

  const cipherParts = [];
  for (let i = 0; i < text.length; i++) {
    const m = BigInt(text.charCodeAt(i));
    const c = modPow(m, e, n);
    cipherParts.push(c.toString());
  }

  document.getElementById("ciphertext").value = cipherParts.join(",");
  status.textContent = "Encrypted successfully.";
  // automatically update comparison chart
  rsaShowFrequencyComparison(text, document.getElementById("ciphertext").value);
}

// ---------- Decrypt ----------
function rsaDecrypt() {
  const n = window.rsa_n;
  const d = window.rsa_d;
  const status = document.getElementById("rsaStatus");
  if (!n || !d) {
    status.textContent = "Generate keys first.";
    return;
  }

  const cipherText = (document.getElementById("ciphertext").value || "").trim();
  if (!cipherText) {
    status.textContent = "No ciphertext to decrypt.";
    return;
  }

  // parse csv bigints
  const parts = cipherText.split(",").map(s => s.trim()).filter(Boolean);
  let plain = "";
  try {
    for (const p of parts) {
      const big = BigInt(p);
      const m = modPow(big, d, n);
      plain += String.fromCharCode(Number(m));
    }
  } catch (err) {
    status.textContent = "Ciphertext format error. Ensure comma-separated integers.";
    return;
  }

  document.getElementById("plaintext").value = plain;
  status.textContent = "Decrypted successfully.";
  rsaShowFrequencyComparison(plain, cipherText);
}

// ---------- Fill example ----------
function fillExample() {
  document.getElementById("p").value = 61;
  document.getElementById("q").value = 53;
  generateKeys();
  document.getElementById("plaintext").value = "Hi";
  rsaEncrypt(); // auto-encrypt example so output and chart appear
}

// ---------- Frequency analysis + chart ----------
const ENGLISH_FREQ = {
  A: 8.167, B: 1.492, C: 2.782, D: 4.253, E: 12.702, F: 2.228, G: 2.015,
  H: 6.094, I: 6.966, J: 0.153, K: 0.772, L: 4.025, M: 2.406, N: 6.749,
  O: 7.507, P: 1.929, Q: 0.095, R: 5.987, S: 6.327, T: 9.056, U: 2.758,
  V: 0.978, W: 2.360, X: 0.150, Y: 1.974, Z: 0.074
};

function getLetterFrequencies(text) {
  const clean = (text || "").toUpperCase().replace(/[^A-Z]/g, "");
  const counts = {};
  for (const ch of clean) counts[ch] = (counts[ch] || 0) + 1;
  const total = clean.length || 1;
  const freqs = {};
  for (let i = 0; i < 26; i++) {
    const L = String.fromCharCode(65 + i);
    freqs[L] = ((counts[L] || 0) / total) * 100;
  }
  return freqs;
}

let rsaFreqChart = null;
function rsaShowFrequencyComparison(plainText, cipherText) {
  const plainFreqs = getLetterFrequencies(plainText);
  const cipherFreqs = getLetterFrequencies(cipherText);

  const labels = Array.from({length:26}, (_,i) => String.fromCharCode(65+i));
  const plainData = labels.map(l => +plainFreqs[l].toFixed(2));
  const cipherData = labels.map(l => +cipherFreqs[l].toFixed(2));

  const container = document.getElementById("rsaFreqChartContainer");
  if (!container) return;
  // ensure canvas exists
  container.innerHTML = '<canvas id="rsaFreqChart"></canvas>';
  const ctx = document.getElementById("rsaFreqChart").getContext("2d");

  if (rsaFreqChart) rsaFreqChart.destroy();
  rsaFreqChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Plaintext (%)", data: plainData, backgroundColor: "rgba(78,163,255,0.85)" },
        { label: "Ciphertext (%)", data: cipherData, backgroundColor: "rgba(160,160,160,0.6)" }
      ]
    },
    options: {
      scales: {
        y: { beginAtZero:true, ticks: { color: "#cfd9e6" } },
        x: { ticks: { color: "#cfd9e6" } }
      },
      plugins: { legend: { labels: { color: "#e6eef8" } } }
    }
  });

  // show chi-squared numeric assistance
  function chi2(freqs) {
    let chi=0;
    for (const L in ENGLISH_FREQ) {
      const O = freqs[L] || 0;
      const E = ENGLISH_FREQ[L] || 0.0001;
      chi += (O - E)*(O - E)/E;
    }
    return chi;
  }
  const chiPlain = chi2(plainFreqs).toFixed(2);
  const chiCipher = chi2(cipherFreqs).toFixed(2);
  const status = document.getElementById("rsaStatus");
  if (status) status.textContent = `Plain χ²=${chiPlain} | Cipher χ²=${chiCipher} (lower ≈ closer to English)`;
}
