document.getElementById('barcode-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const style = document.getElementById('style-input').value;
    const size = document.getElementById('size-input').value;
    const category = document.getElementById('category-input').value;
    const upc = document.getElementById('upc-input').value;

    // Display the input values
    document.getElementById('style-size').innerText = `${style}${size}`;
    document.getElementById('category').innerText = `${category}`;
    document.getElementById('upc').innerText = upc;

    // Generate Barcode
    JsBarcode("#upc", upc, {
        format: "CODE39",
        displayValue: true,
        fontSize: 50, // Increase font size for better visibility
        height: 250, // Increase height for a larger barcode
        width: 5,    // Adjust width for thicker bars
        background: "#ffffff",
        lineColor: "#000000",
    });
});







