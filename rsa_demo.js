// rsa_demo.js - Educational RSA demo using BigInt

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
  const { g, x } = egcd(a, m);
  if (g !== 1n) return null;
  return (x % m + m) % m;
}
function isPrimeSmall(n) {
  if (n < 2n) return false;
  for (let i = 2n; i * i <= n; i++) if (n % i === 0n) return false;
  return true;
}

function rsaKeyGenFromPrimes(p, q) {
  p = BigInt(p); q = BigInt(q);
  if (!isPrimeSmall(p) || !isPrimeSmall(q) || p === q) return { error: "Please provide two distinct small primes." };
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  let e = 65537n;
  if (gcd(e, phi) !== 1n) e = 17n;
  const d = modInverse(e, phi);
  return { p, q, n, phi, e, d };
}

function rsaGenerateKeys() {
  const pVal = document.getElementById("rsaP").value;
  const qVal = document.getElementById("rsaQ").value;
  const status = document.getElementById("rsaStatus");
  const pub = document.getElementById("rsaPublic");
  const priv = document.getElementById("rsaPrivate");

  const keys = rsaKeyGenFromPrimes(BigInt(pVal), BigInt(qVal));
  if (keys.error) return status.textContent = keys.error;

  window._rsa = keys;
  pub.textContent = `(n=${keys.n}, e=${keys.e})`;
  priv.textContent = `(n=${keys.n}, d=${keys.d})`;
  status.textContent = "Keys generated successfully.";
}

function rsaEncrypt() {
  const keys = window._rsa;
  const status = document.getElementById("rsaStatus");
  if (!keys) return status.textContent = "Generate keys first.";

  const text = document.getElementById("rsaInput").value;
  const n = keys.n, e = keys.e;
  const codes = textToCodes(text);
  if (codes.some(c => c >= n)) return status.textContent = "Message too long for n.";

  const cipher = codes.map(m => modPow(m, e, n));
  document.getElementById("rsaOutput").value = cipher.join(",");
  status.textContent = "Encrypted successfully.";
}

function rsaDecrypt() {
  const keys = window._rsa;
  const status = document.getElementById("rsaStatus");
  if (!keys) return status.textContent = "Generate keys first.";

  const n = keys.n, d = keys.d;
  const data = document.getElementById("rsaOutput").value.trim();
  if (!data) return status.textContent = "No ciphertext to decrypt.";

  const nums = data.split(",").map(x => BigInt(x.trim()));
  const plainCodes = nums.map(c => modPow(c, d, n));
  document.getElementById("rsaInput").value = codesToText(plainCodes);
  status.textContent = "Decrypted successfully.";
}

function rsaBruteExample() {
  document.getElementById("rsaP").value = 61;
  document.getElementById("rsaQ").value = 53;
  rsaGenerateKeys();
  document.getElementById("rsaInput").value = "Hi";
  rsaEncrypt();
}


// --- RSA Frequency Analysis Utilities ---

// English reference distribution (%)
const ENGLISH_FREQ = {
  A: 8.167, B: 1.492, C: 2.782, D: 4.253, E: 12.702, F: 2.228, G: 2.015,
  H: 6.094, I: 6.966, J: 0.153, K: 0.772, L: 4.025, M: 2.406, N: 6.749,
  O: 7.507, P: 1.929, Q: 0.095, R: 5.987, S: 6.327, T: 9.056, U: 2.758,
  V: 0.978, W: 2.360, X: 0.150, Y: 1.974, Z: 0.074
};

// Compute frequencies of letters in a text
function letterFrequencies(text) {
  const counts = {};
  let total = 0;
  for (const ch of text.toUpperCase()) {
    if (/[A-Z]/.test(ch)) {
      counts[ch] = (counts[ch] || 0) + 1;
      total++;
    }
  }
  const freqs = {};
  for (let i = 0; i < 26; i++) {
    const L = String.fromCharCode(65 + i);
    freqs[L] = total ? ((counts[L] || 0) / total) * 100 : 0;
  }
  return freqs;
}

// Chi-squared test between observed frequencies and English reference
function chiSquaredScore(observed) {
  let chi2 = 0;
  for (const L in ENGLISH_FREQ) {
    const O = observed[L] || 0;
    const E = ENGLISH_FREQ[L] || 0.0001;
    chi2 += Math.pow(O - E, 2) / E;
  }
  return chi2;
}

// Chart.js global reference
let rsaFreqChart = null;

// Draw frequency comparison between plaintext and ciphertext
function updateRSAFreqDualChart(plainFreqs, cipherFreqs) {
  const labels = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const plainData = labels.map(L => plainFreqs[L]);
  const cipherData = labels.map(L => cipherFreqs[L]);

  const ctx = document.getElementById("rsaFreqChart").getContext("2d");
  if (rsaFreqChart) rsaFreqChart.destroy();

  rsaFreqChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Plaintext (%)",
          data: plainData,
          backgroundColor: "rgba(78,163,255,0.85)",
        },
        {
          label: "Ciphertext (%)",
          data: cipherData,
          backgroundColor: "rgba(160,160,160,0.6)",
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true, ticks: { color: "#cfd9e6" } },
        x: { ticks: { color: "#cfd9e6" } },
      },
      plugins: { legend: { labels: { color: "#e6eef8" } } },
    },
  });
}

// Compare plaintext and ciphertext distributions
function rsaShowFrequencyComparison(plaintext, ciphertextString) {
  if (!plaintext.trim() || !ciphertextString.trim()) {
    document.getElementById("rsaStatus").textContent =
      "Please generate ciphertext first.";
    return;
  }

  const plainFreqs = letterFrequencies(plaintext);
  const cipherFreqs = letterFrequencies(ciphertextString);
  const chiPlain = chiSquaredScore(plainFreqs).toFixed(2);
  const chiCipher = chiSquaredScore(cipherFreqs).toFixed(2);

  document.getElementById("rsaStatus").textContent =
    `Plain χ²=${chiPlain} | Cipher χ²=${chiCipher} ` +
    `(lower = closer to natural English)`;

  updateRSAFreqDualChart(plainFreqs, cipherFreqs);
}
