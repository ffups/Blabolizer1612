function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  let clean = input.trim();
  clean = clean.slice(0, 50); // Limit length
  clean = clean.replace(/[<>$%]/g, ''); // Remove unwanted characters
  return clean;
}

module.exports = sanitizeInput;