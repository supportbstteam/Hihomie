// src/utils/string.js  (ya utils/string.js)

export function capitalizeFirstLetter(str = "") {
  const s = String(str).trim();
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function capitalizeWords(str = "") {
  const s = String(str).trim();
  if (!s) return "";
  return s
    .split(/\s+/)
    .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");
}
