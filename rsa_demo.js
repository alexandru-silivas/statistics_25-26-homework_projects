// rsa_demo.js - Educational RSA demo using BigInt

// === Helper functions ===
function textToCodes(text) {
  return Array.from(text).map(ch => BigInt(ch.charCodeAt(0)));
}
function codesToText(codes) {
  return codes.map(c => String.fromCharCode(Number(c))).join('');
}
function modPow(base, exp, mod) {
  base = (base % mod + mod) % mod;
  let result = 1n;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}
function gcd(a, b) {
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}
function egcd(a, b) {
  if (b === 0n) return { g: a, x: 1n, y: 0n };
  const { g, x: x1, y: y1 } = egcd(b, a % b);
  return { g, x: y1, y: x1 - (a / b) * y1 };
}
function modInverse(a, m) {
  const { g, x } = egcd(BigInt(a), BigInt(m));
  if (g !== 1n) return null;
  return (x % m + m) % m;
}
function isPrimeSmall(n) {
  if (n < 2n) return false;
  for (let i = 2n; i * i <= n; i++) if (n % i === 0n) return false;
  return true;
}

// === RSA Key Generation ===
function rsaKeyGenFromPrimes(p, q) {
  p = BigInt(p);
  q = BigInt(q);
  if (!isPrimeSmall(p) || !isPrimeSmall(q) || p === q) {
    return { error: "Please provide two distinct small primes." };
  }
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  let e = 65537n;
  if (gcd(e, phi) !== 1n) e = 17n;
  const d = modInverse(e, phi);
  return { p, q, n, phi, e, d };
}

function generateKeys() {
  const p = parseInt(document.getElementById("p").value);
  const q = parseInt(document.getElementById("q").value);
  if (!p || !q) {
    alert("Please enter valid primes!");
    return;
  }

  const { n, phi, e, d } = rsaKeyGenFromPrimes(p, q);
  if (!d) {
    alert("Invalid key generation. Try different primes.");
    return;
  }

  // Store keys globally
  window.rsa_n = Number(n);
  window.rsa_e = Number(e);
  window.rsa_d = Number(d);

  // Update UI
  document.getElementById("publicKey").textContent = `(n=${n}, e=${e})`;
  document.getElementById("privateKey").textContent = `(n=${n}, d=${d})`;
  document.getElementById("rsaStatus").textContent = "✅ Keys generated successfully.";
}

// === Encrypt / Decrypt ===
function rsaEncrypt() {
  const n = window.rsa_n;
  const e = window.rsa_e;
  if (!n || !e) {
    document.getElementById("rsaStatus").textContent = "Generate keys first.";
    return;
  }

  const text = document.getElementById("plaintext").value;
  if (!text) return;

  const encrypted = [];
  for (const ch of text) {
    const m = ch.charCodeAt(0);
    const c = modPow(m, BigInt(e), BigInt(n));
    encrypted.push(c);
  }

  document.getElementById("ciphertext").value = encrypted.join(",");
  document.getElementById("rsaStatus").textContent = "✅ Encrypted successfully.";
  rsaShowFrequencyComparison(text, encrypted.join(","));
}

function rsaDecrypt() {
  const n = window.rsa_n;
  const d = window.rsa_d;
  if (!n || !d) {
    document.getElementById("rsaStatus").textContent = "Generate keys first.";
    return;
  }

  const cipherText = document.getElementById("ciphertext").value.trim();
  if (!cipherText) {
    document.getElementById("rsaStatus").textContent = "Enter ciphertext to decrypt.";
    return;
  }

  const parts = cipherText.split(",").map(x => BigInt(x));
  let result = "";
  for (const c of parts) {
    const m = modPow(c, BigInt(d), BigInt(n));
    result += String.fromCharCode(Number(m));
  }

  document.getElementById("plaintext").value = result;
  document.getElementById("rsaStatus").textContent = "✅ Decryption complete.";
  rsaShowFrequencyComparison(result, cipherText);
}

// === Example ===
function fillExample() {
  document.getElementById("p").value = 61;
  document.getElementById("q").value = 53;
  generateKeys();
  document.getElementById("plaintext").value = "Hi";
  document.getElementById("ciphertext").value = "";
  document.getElementById("rsaStatus").textContent = "Example loaded.";
}

// === Frequency Analysis (existing, preserved) ===
const ENGLISH_FREQ = {
  A: 8.167, B: 1.492, C: 2.782, D: 4.253, E: 12.702, F: 2.228, G: 2.015,
  H: 6.094, I: 6.966, J: 0.153, K: 0.772, L: 4.025, M: 2.406, N: 6.749,
  O: 7.507, P: 1.929, Q: 0.095, R: 5.987, S: 6.327, T: 9.056, U: 2.758,
  V: 0.978, W: 2.360, X: 0.150, Y: 1.974, Z: 0.074
};

function getLetterFrequencies(text) {
  const freq = {};
  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");
  for (const ch of clean) freq[ch] = (freq[ch] || 0) + 1;
  const total = clean.length || 1;
  for (const key in freq) freq[key] = +(freq[key] / total * 100).toFixed(2);
  return freq;
}

function rsaShowFrequencyComparison(plainText, cipherText) {
  const plainCounts = getLetterFrequencies(plainText);
  const cipherCounts = getLetterFrequencies(cipherText);

  const container = document.getElementById("rsaFreqChartContainer");
  if (!container) return;

  container.innerHTML = '<canvas id="rsaFreqChart"></canvas>';
  const ctx = document.getElementById("rsaFreqChart").getContext("2d");

  const labels = Object.keys(ENGLISH_FREQ);
  const plainData = labels.map(L => plainCounts[L] || 0);
  const cipherData = labels.map(L => cipherCounts[L] || 0);

  if (window.rsaFreqChart) window.rsaFreqChart.destroy();
  window.rsaFreqChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Plaintext", data: plainData, backgroundColor: "rgba(78,163,255,0.6)" },
        { label: "Ciphertext", data: cipherData, backgroundColor: "rgba(46,204,113,0.6)" }
      ]
    },
    options: {
      plugins: { legend: { labels: { color: "#e6eef8" } } },
      scales: {
        x: { ticks: { color: "#bfc8d4" } },
        y: { ticks: { color: "#bfc8d4" } }
      }
    }
  });
}
