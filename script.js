const form = document.getElementById('barcode-form');
const styleEl = document.getElementById('style-size');
const catEl = document.getElementById('category');
const svg = document.getElementById('barcode');

/** Compute UPC-A check digit from first 11 digits */
function upcCheckDigit(first11) {
  let odd = 0, even = 0;
  for (let i = 0; i < 11; i++) {
    const n = +first11[i];
    if ((i % 2) === 0) odd += n;   // positions 1,3,5... (0-indexed)
    else even += n;                // positions 2,4,6...
  }
  const total = odd * 3 + even;
  return (10 - (total % 10)) % 10;
}

/** Render a UPC-A into the SVG */
function renderUPC(rawDigits) {
  const digits = (rawDigits.match(/\d+/g) || []).join(''); // keep digits only
  let value = '';

  if (digits.length === 11) value = digits + upcCheckDigit(digits);
  else if (digits.length === 12) value = digits;
  else {
    alert('UPC-A must be 11 or 12 digits.');
    return;
  }

  // Draw the barcode
  JsBarcode(svg, value, {
    format: "UPC",
    width: 2,           // bar thickness
    height: 90,         // bar height
    displayValue: true, // show digits under bars
    font: "Arial",
    fontSize: 14,       // small digits like your photo
    textMargin: 0,
    margin: 0,
    lineColor: "#2b2f39",
    background: "#ffffff"
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const style = document.getElementById('style-input').value.trim();
  const size  = document.getElementById('size-input').value.trim();
  const cat   = document.getElementById('category-input').value.trim();
  const upc   = document.getElementById('upc-input').value;

  styleEl.textContent = `${style} ${size}`;
  catEl.textContent = cat;

  renderUPC(upc);
});

// Optional: initial sample so you see something right away
// renderUPC("761736378671");
