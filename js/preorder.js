/* ============================================================
   StoryGrove — pre-order page
   Product tabs + WhatsApp hand-off (number kept out of the DOM)
   ============================================================ */

(function () {
  'use strict';

  var PRODUCT_TITLES = {
    storybook: 'Buku Cerita — Belajar Bersama Alam: Danau',
    games: 'Play & Board',
    digital: 'Digital Companion',
    kit: 'Learning Kit'
  };

  /* WhatsApp number, obfuscated so it never sits as plain text in the page. */
  var WA_ENCODED = [1, 7, 3, 0, 7, 7, 6, 5, 4, 3, 2, 6, 5];
  var WA_OFFSET = 5;
  function waNumber() {
    return WA_ENCODED.map(function (d) { return (d - WA_OFFSET + 10) % 10; }).join('');
  }

  /* ---------- tabs ---------- */

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.preorder-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-panel]'));
  var productInput = document.getElementById('preorder-product');

  function setActiveProduct(key) {
    if (!PRODUCT_TITLES[key]) key = 'storybook';

    tabs.forEach(function (tab) {
      tab.classList.toggle('is-active', tab.getAttribute('data-target') === key);
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.id !== 'panel-' + key;
    });
    if (productInput) productInput.value = key;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.getAttribute('data-target');
      setActiveProduct(key);
      var url = new URL(window.location.href);
      url.searchParams.set('produk', key);
      window.history.replaceState({}, '', url);
    });
  });

  var params = new URLSearchParams(window.location.search);
  setActiveProduct(params.get('produk') || 'storybook');

  /* ---------- form ---------- */

  var form = document.getElementById('preorder-order-form');
  var status = document.getElementById('preorder-form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nama = document.getElementById('preorder-name').value.trim();
      var kontak = document.getElementById('preorder-contact').value.trim();
      var jumlah = document.getElementById('preorder-qty').value.trim();
      var catatan = document.getElementById('preorder-note').value.trim();
      var productKey = productInput ? productInput.value : 'storybook';
      var productTitle = PRODUCT_TITLES[productKey] || productKey;

      if (!nama || !kontak) {
        status.textContent = 'Nama dan nomor WhatsApp wajib diisi ya.';
        status.style.color = '#C55E1D';
        return;
      }

      var lines = [
        'Halo StoryGrove! Saya ingin pre-order:',
        '',
        'Produk: ' + productTitle,
        'Nama: ' + nama,
        'Jumlah: ' + jumlah,
        'Kontak: ' + kontak
      ];
      if (catatan) lines.push('Catatan: ' + catatan);
      lines.push('', 'Mohon info lebih lanjut. Terima kasih!');

      var text = encodeURIComponent(lines.join('\n'));
      var url = 'https://wa.me/' + waNumber() + '?text=' + text;

      status.textContent = 'Membuka WhatsApp...';
      status.style.color = '';
      window.open(url, '_blank', 'noopener');
    });
  }
})();
