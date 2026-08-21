document.addEventListener('DOMContentLoaded', async function () {
  var grid = document.getElementById('product-grid');
  try {
    var res = await fetch('/api/products');
    if (!res.ok) throw new Error('Request failed: ' + res.status);
    var products = await res.json();

    if (products.length === 0) {
      grid.innerHTML = '<p>Nothing in stock right now -- check back soon.</p>';
      return;
    }

    grid.innerHTML = products
      .map(function (p) {
        return (
          '<div class="product-card">' +
          '<h3>' + escapeHtml(p.name) + '</h3>' +
          '<p>' + escapeHtml(p.description || '') + '</p>' +
          '<p><strong>$' + Number(p.price).toFixed(2) + '</strong></p>' +
          '</div>'
        );
      })
      .join('');
  } catch (err) {
    grid.innerHTML = '<p>Couldn\'t load products right now. Try refreshing.</p>';
    console.error(err);
  }
});

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
