// Caesar Cipher functions for Homework 2 interactive demo

function shiftChar(char, shift) {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90)  // uppercase
    return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
  if (code >= 97 && code <= 122) // lowercase
    return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
  return char; // non-letters unchanged
}

function caesarTransform(text, shift) {
  return text.split('').map(c => shiftChar(c, shift)).join('');
}

function caesarEncrypt() {
  const text = document.getElementById("cipherInput").value;
  const shift = parseInt(document.getElementById("shift").value) || 0;
  document.getElementById("cipherOutput").value = caesarTransform(text, shift);
}

function caesarDecrypt() {
  const text = document.getElementById("cipherInput").value;
  const shift = parseInt(document.getElementById("shift").value) || 0;
  document.getElementById("cipherOutput").value = caesarTransform(text, -shift);
}
