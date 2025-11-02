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
