const form = document.getElementById('barcode-form');
const styleEl = document.getElementById('style-size');
const catEl = document.getElementById('category');
const svg = document.getElementById('barcode');
const styleSelect = document.getElementById('style-select');

let products = [];

/** Compute UPC-A check digit from first 11 digits */
function upcCheckDigit(first11) {
  let odd = 0;
  let even = 0;

  for (let i = 0; i < 11; i++) {
    const n = Number(first11[i]);
    if (i % 2 === 0) odd += n;
    else even += n;
  }

  const total = odd * 3 + even;
  return (10 - (total % 10)) % 10;
}

/** Normalize UPC input to valid 12-digit UPC-A */
function normalizeUPC(rawDigits) {
  const digits = (rawDigits.match(/\d+/g) || []).join('');

  if (digits.length === 11) {
    return digits + upcCheckDigit(digits);
  }

  if (digits.length === 12) {
    return digits;
  }

  return null;
}

/** Render a UPC-A into the SVG */
function renderUPC(rawDigits) {
  const value = normalizeUPC(rawDigits);

  if (!value) {
    alert('UPC-A must be 11 or 12 digits.');
    return;
  }

  JsBarcode(svg, value, {
    format: 'UPC',
    width: 2,
    height: 90,
    displayValue: true,
    font: 'Arial',
    fontSize: 14,
    textMargin: 0,
    margin: 0,
    lineColor: '#2b2f39',
    background: '#ffffff'
  });
}

/** Update preview + barcode */
function updateTag(item) {
  styleEl.textContent = `${item.style} ${item.size}`;
  catEl.textContent = item.category;
  renderUPC(item.upc);
}

/** Fill form fields */
function fillForm(item) {
  document.getElementById('style-input').value = item.style;
  document.getElementById('size-input').value = item.size;
  document.getElementById('category-input').value = item.category;
  document.getElementById('upc-input').value = item.upc;
}

/** Load styles from JSON */
async function loadStyles() {
  try {
    const res = await fetch('./data.json');
    products = await res.json();

    products.forEach((item, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${item.style} (${item.size})`;
      styleSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error loading styles:', err);
  }
}

/** When dropdown changes */
styleSelect.addEventListener('change', (e) => {
  const selectedIndex = e.target.value;
  if (selectedIndex === '') return;

  const item = products[selectedIndex];
  fillForm(item);
  updateTag(item);
});

/** Manual form submit */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const style = document.getElementById('style-input').value.trim();
  const size = document.getElementById('size-input').value.trim();
  const category = document.getElementById('category-input').value.trim();
  const upc = document.getElementById('upc-input').value.trim();

  updateTag({ style, size, category, upc });
});

/** Init */
window.addEventListener('DOMContentLoaded', loadStyles);
