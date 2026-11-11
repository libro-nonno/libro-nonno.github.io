// Dimensione del testo: piccolo / medio / grande, ricordata dal browser.
(function () {
  var radice = document.documentElement;
  var pulsanti = document.querySelectorAll('.dimensione button');
  var attuale = radice.getAttribute('data-size') || 'm';

  function applica(dim) {
    radice.setAttribute('data-size', dim);
    pulsanti.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-size') === dim ? 'true' : 'false');
    });
    try { localStorage.setItem('dimensione-testo', dim); } catch (e) {}
  }

  pulsanti.forEach(function (b) {
    b.addEventListener('click', function () { applica(b.getAttribute('data-size')); });
  });
  applica(attuale);
})();
