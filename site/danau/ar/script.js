(function () {
  var mv = document.getElementById('mv');
  var toast = document.getElementById('toast');
  var hint = document.getElementById('hint');
  var progressBar = document.getElementById('progressBar');

  function showToast(msg, ms) {
    toast.textContent = msg;
    toast.hidden = false;
    requestAnimationFrame(function () { toast.classList.add('show'); });
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.classList.remove('show');
    }, ms || 3200);
  }

  mv.addEventListener('progress', function (e) {
    var pct = Math.round((e.detail.totalProgress || 0) * 100);
    progressBar.style.width = pct + '%';
    if (pct >= 100) mv.setAttribute('loaded', '');
  });

  mv.addEventListener('load', function () {
    mv.setAttribute('loaded', '');
    setTimeout(function () {
      if (!mv.canActivateAR) {
        hint.textContent = 'Mode AR butuh kamera HP — buka halaman ini di Safari (iOS) atau Chrome (Android) untuk menaruh capung ini di ruanganmu. Di sini kamu tetap bisa memutar & memperbesar modelnya.';
        showToast('Buka di HP untuk mencoba mode AR', 4200);
      }
    }, 400);
  });

  mv.addEventListener('ar-status', function (e) {
    if (e.detail.status === 'failed') {
      showToast('AR belum bisa dibuka di perangkat ini.');
    }
  });
})();
