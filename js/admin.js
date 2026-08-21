document.addEventListener('DOMContentLoaded', function () {
  var gate = document.getElementById('admin-gate');
  var panel = document.getElementById('admin-panel');
  var unlockBtn = document.getElementById('admin-unlock');
  var tokenInput = document.getElementById('admin-token');
  var form = document.getElementById('product-form');
  var list = document.getElementById('admin-list');

  function token() {
    return window.sessionStorage.getItem('admin_token') || '';
  }

  function unlock() {
    var t = tokenInput.value.trim();
    if (!t) return;
    window.sessionStorage.setItem('admin_token', t);
    gate.hidden = true;
    panel.hidden = false;
    loadProducts();
  }

  unlockBtn.addEventListener('click', unlock);
  tokenInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') unlock();
  });

  if (token()) {
    gate.hidden = true;
    panel.hidden = false;
    loadProducts();
  }

  async function loadProducts() {
    var res = await fetch('/api/products');
    var products = await res.json();
    list.innerHTML = products
      .map(function (p) {
        return (
          '<div class="product-card">' +
          '<h3>' + p.name + '</h3>' +
          '<p>' + (p.description || '') + '</p>' +
          '<p><strong>$' + Number(p.price).toFixed(2) + '</strong></p>' +
          '<button type="button" class="btn_primary" data-delete="' + p.id + '">Delete</button>' +
          '</div>'
        );
      })
      .join('');

    list.querySelectorAll('[data-delete]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        await fetch('/api/products?id=' + btn.dataset.delete, {
          method: 'DELETE',
          headers: { 'x-admin-token': token() },
        });
        loadProducts();
      });
    });
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var body = {
      name: document.getElementById('name').value,
      price: document.getElementById('price').value,
      description: document.getElementById('description').value,
    };
    var res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token() },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      alert('Could not save product (' + res.status + '). Check your admin token.');
      return;
    }
    form.reset();
    loadProducts();
  });
});
