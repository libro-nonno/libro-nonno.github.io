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

// Cambio lingua "per posizione": passando a un'altra lingua si arriva allo stesso punto del capitolo.
// - Se le due versioni hanno la stessa struttura (stessi blocchi nello stesso ordine) si va allo stesso paragrafo.
// - Altrimenti si usa la stessa sezione (i titoli ## coincidono nelle tre lingue) e lo stesso punto
//   in proporzione al testo della sezione.
(function () {
  var radice = document.querySelector('.capitolo .testo');
  if (!radice) return;

  function blocchi() {
    var par = radice.querySelector('.parallel');
    if (par) return Array.prototype.slice.call(par.querySelectorAll('.parallel-it'));
    var el = radice;
    // la versione in dialetto è dentro un unico <div lang="lmo">: si guarda dentro
    while (el.children.length === 1 && el.children[0].tagName === 'DIV' && el.children[0].children.length > 1) {
      el = el.children[0];
    }
    return Array.prototype.filter.call(el.children, function (b) {
      return b.tagName !== 'SCRIPT' && (b.textContent.trim() !== '' || b.querySelector('img'));
    });
  }

  function firma(bl) { // descrive la struttura: posizioni dei titoli e numero di blocchi
    var t = [];
    bl.forEach(function (b, i) { if (/^H[2-4]$/.test(b.tagName)) t.push(i); });
    return bl.length + '-' + t.join('.');
  }
  function peso(b) { return Math.max(b.textContent.replace(/\s+/g, ' ').length, b.querySelector('img') ? 200 : 20); }
  function sezioni(bl) { // indice della sezione di ogni blocco
    var s = 0;
    return bl.map(function (b) { if (/^H2$/.test(b.tagName)) s++; return s; });
  }
  var barra = document.getElementById('barra-lettura');
  function margineAlto() { // spazio coperto in alto dalla barra del capitolo
    return (barra ? barra.offsetHeight : 0) + 16;
  }

  function posizioneAttuale() {
    var bl = blocchi();
    if (!bl.length || window.scrollY < 40) return null;
    var alto = margineAlto(), u = bl.length - 1, parz = 0;
    for (var i = 0; i < bl.length; i++) {
      var r = bl[i].getBoundingClientRect();
      if (r.bottom > alto) { u = i; parz = r.height ? Math.min(1, Math.max(0, (alto - r.top) / r.height)) : 0; break; }
    }
    var sez = sezioni(bl), s = sez[u], tot = 0, prima = 0;
    bl.forEach(function (b, i) {
      if (sez[i] !== s) return;
      var p = peso(b);
      if (i < u) prima += p; else if (i === u) prima += p * parz;
      tot += p;
    });
    return { u: u, f: firma(bl), s: s, q: tot ? Math.round(1000 * prima / tot) : 0 };
  }

  document.querySelectorAll('a.lingua').forEach(function (a) {
    a.addEventListener('click', function () {
      var p = posizioneAttuale();
      if (!p) return;
      a.href = a.href.split('#')[0] + '#pos=' + [p.u, p.f, p.s, p.q].join('_');
    });
  });

  var m = location.hash.match(/^#pos=(\d+)_([\d.\-]+)_(\d+)_(\d+)$/);
  if (!m) return;
  var bl = blocchi(), meta = null;
  if (firma(bl) === m[2]) {
    meta = bl[+m[1]];
  } else {
    var sez = sezioni(bl), s = +m[3], q = +m[4] / 1000, tot = 0, acc = 0;
    bl.forEach(function (b, i) { if (sez[i] === s) tot += peso(b); });
    for (var i = 0; i < bl.length; i++) {
      if (sez[i] !== s) continue;
      acc += peso(bl[i]);
      if (acc / tot > q + 0.005 || i === bl.length - 1) { meta = bl[i]; break; }
    }
  }
  history.replaceState(null, '', location.pathname + location.search);
  if (!meta) return;
  var toccato = false; // se il lettore scorre da solo, non lo si sposta più
  ['wheel', 'touchstart', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function () { toccato = true; }, { once: true, passive: true });
  });
  function allinea() {
    if (toccato) return;
    window.scrollTo(0, meta.getBoundingClientRect().top + window.scrollY - margineAlto());
  }
  function vai() {
    allinea();
    meta.classList.add('evidenzia');
    setTimeout(function () { meta.classList.remove('evidenzia'); }, 2500);
    // i caratteri e le immagini possono spostare il testo dopo il caricamento: si riallinea
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(allinea);
    setTimeout(allinea, 400);
    setTimeout(allinea, 1200);
  }
  if (document.readyState === 'complete') vai(); else window.addEventListener('load', vai);
})();

// Barra del capitolo: compare quando la testata esce dallo schermo.
(function () {
  var barra = document.getElementById('barra-lettura');
  var testata = document.querySelector('.testata');
  if (!barra || !testata || !('IntersectionObserver' in window)) return;
  barra.querySelector('.barra-titolo').addEventListener('click', function (e) {
    e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  new IntersectionObserver(function (voci) {
    var fuori = !voci[0].isIntersecting;
    barra.classList.toggle('visibile', fuori);
    if (fuori) barra.removeAttribute('inert'); else barra.setAttribute('inert', '');
  }).observe(testata);
})();
