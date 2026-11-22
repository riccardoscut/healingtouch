/* Signature Healing Touch · secondary pages (thank-you, privacy)
   Theme disc + padlock, EN/ES switch for the thank-you page, thanks cloud, reviews, contact tracking.
   No framework, no build step. Reviews come from window.testimonials (contents.js). */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static\b/.test(location.search); /* ?static: QA only */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function track(ev, params, type) { if (typeof window.trackPixel === 'function') window.trackPixel(ev, params || {}, type || 'track'); }

  var STR = {
    en: {
      title: 'Booking confirmed · Signature Healing Touch',
      skip: 'Skip to content', home: 'Home',
      h1: '<em>Booking</em> <strong>confirmed.</strong>',
      lede: 'We’ve sent you an email with all the details of your appointment. We can’t wait to welcome you to Signature Healing Touch!',
      back: 'Back to home', questions: 'Questions? Contact us:',
      reviews_h: '<em>What people</em> <strong>say.</strong>',
      reviews_n: 'reviews', reviews_note: 'Real reviews from clients since 2020, in their own language.',
      reviews_all: 'Show all reviews', reviews_less: 'Show fewer reviews', reviews_none: 'Reviews are on their way.',
      foot: 'Foot reflexology in Barcelona',
      theme_to_light: 'Switch to light theme', theme_to_dark: 'Switch to dark theme', theme_locked: 'Theme locked',
      lock_open: 'Theme unlocked: the logo switches light and dark. Click to lock the theme.',
      lock_closed: 'Theme locked: the logo keeps the current theme. Click to unlock.',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      thanks: 'Thank you'
    },
    es: {
      title: 'Reserva confirmada · Signature Healing Touch',
      skip: 'Ir al contenido', home: 'Inicio',
      h1: '<em>Reserva</em> <strong>confirmada.</strong>',
      lede: 'Te hemos enviado un correo con todos los detalles de tu cita. ¡Tenemos muchas ganas de recibirte en Signature Healing Touch!',
      back: 'Volver al inicio', questions: '¿Dudas? Escríbenos:',
      reviews_h: '<em>Lo que dice</em> <strong>la gente.</strong>',
      reviews_n: 'opiniones', reviews_note: 'Opiniones reales de clientes desde 2020, en su propio idioma.',
      reviews_all: 'Ver todas las opiniones', reviews_less: 'Ver menos opiniones', reviews_none: 'Las opiniones llegarán pronto.',
      foot: 'Reflexología podal en Barcelona',
      theme_to_light: 'Cambiar a tema claro', theme_to_dark: 'Cambiar a tema oscuro', theme_locked: 'Tema bloqueado',
      lock_open: 'Tema desbloqueado: el logo cambia entre claro y oscuro. Haz clic para bloquear el tema.',
      lock_closed: 'Tema bloqueado: el logo mantiene el tema actual. Haz clic para desbloquear.',
      months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      thanks: 'Gracias'
    }
  };

  /* ---------- language: thank-you switches in place; privacy is bilingual on one page ---------- */
  var switchable = document.body.hasAttribute('data-switch-lang');
  var lang = root.lang === 'es' ? 'es' : 'en';
  if (switchable) {
    var saved = store('preferred-language');
    lang = (saved === 'es' || saved === 'en') ? saved : ((navigator.language || '').toLowerCase().indexOf('es') === 0 ? 'es' : 'en');
  }
  var S = STR[lang];

  function applyLang() {
    S = STR[lang];
    root.lang = lang;
    if (!switchable) return;
    document.title = S.title;
    $$('[data-t]').forEach(function (el) { el.textContent = S[el.getAttribute('data-t')]; });
    $$('[data-th]').forEach(function (el) { el.innerHTML = S[el.getAttribute('data-th')]; });
    $$('[data-home]').forEach(function (a) { a.href = '/' + lang + '/'; });
    $$('[data-set-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === lang); });
    renderReviews();
    cloud();
    tlabel(); llabel();
  }

  /* ---------- theme: the logo disc rotates and toggles light/dark; the padlock keeps the theme ---------- */
  var tbtn = $('#themeToggle'), lbtn = $('#lockToggle'), locked = store('theme-lock') === '1';
  function tlabel() { if (tbtn) tbtn.setAttribute('aria-label', locked ? S.theme_locked : (root.dataset.theme === 'dark' ? S.theme_to_light : S.theme_to_dark)); }
  function llabel() { if (!lbtn) return; lbtn.setAttribute('aria-pressed', locked); var t = locked ? S.lock_closed : S.lock_open; lbtn.setAttribute('aria-label', t); lbtn.title = t; tlabel(); }
  if (lbtn) lbtn.addEventListener('click', function () { locked = !locked; store('theme-lock', locked ? '1' : '0'); llabel(); });
  if (tbtn) tbtn.addEventListener('click', function () {
    tbtn.classList.toggle('spin');
    if (locked) return;
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    store('preferred-theme', root.dataset.theme);
    tlabel(); drawLattice();
  });

  $$('[data-set-lang]').forEach(function (b) { b.addEventListener('click', function () { lang = b.getAttribute('data-set-lang'); store('preferred-language', lang); applyLang(); }); });
  $$('a[data-lang]').forEach(function (a) { a.addEventListener('click', function () { store('preferred-language', a.dataset.lang); }); });

  /* ---------- thanks cloud: one upright word in the visitor's language, the rest in italic ---------- */
  var WORDS = [
    ['Grazie', 6], ['Thank you', 6], ['Gracias', 6], ['Merci', 5], ['Danke', 4], ['Obrigado', 4], ['Gràcies', 4],
    ['ありがとう', 4], ['谢谢', 4], ['شكراً', 3], ['תודה', 3],
    ['धन्यवाद', 3], ['Спасибо', 3], ['Kiitos', 3], ['Tack', 3],
    ['Dziękuję', 3], ['Hvala', 3], ['Köszönöm', 2], ['Mulțumesc', 2],
    ['Ευχαριστώ', 2], ['Teşekkürler', 2], ['Dank je', 2], ['Takk', 2],
    ['Děkuji', 2], ['Mahalo', 2], ['Asante', 2], ['Ačiū', 1], ['Paldies', 1], ['Aitäh', 1], ['Grazie mille', 1], ['Muchas gracias', 1]
  ];
  var box = $('#thanks'), measurer;
  function cloud() {
    if (!box) return;
    var cw = box.clientWidth, ch = box.clientHeight;
    if (!cw || !ch) return;
    if (!measurer) { measurer = document.createElement('span'); measurer.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:"Bodoni Moda",serif;font-style:italic;font-weight:500;line-height:1'; document.body.appendChild(measurer); }
    var scale = Math.max(.62, Math.min(1, cw / 620));
    var hiWord = S.thanks;
    var list = WORDS.slice().sort(function (a, b) { return (b[0] === hiWord) - (a[0] === hiWord) || b[1] - a[1]; });
    var rects = [], out = '';
    list.forEach(function (w, i) {
      var hi = w[0] === hiWord;
      var fs = Math.round((hi ? 64 : 14 + (w[1] - 1) * 5.2) * scale);
      measurer.style.fontWeight = hi ? 900 : 500; measurer.style.fontStyle = hi ? 'normal' : 'italic';
      measurer.style.fontSize = fs + 'px'; measurer.textContent = w[0];
      var mw = measurer.offsetWidth + 10, mh = fs * 1.1, th = 0, x, y, ok = false, guard = 0;
      while (!ok && guard++ < 3000) {
        var r = 5 * th; x = cw / 2 + r * Math.cos(th) * 1.5; y = ch / 2 + r * Math.sin(th); th += .22;
        var L = x - mw / 2, T = y - mh / 2, R = L + mw, B = T + mh;
        if (L < 0 || T < 0 || R > cw || B > ch) continue;
        ok = !rects.some(function (q) { return !(R < q[0] || L > q[2] || B < q[1] || T > q[3]); });
        if (ok) rects.push([L, T, R, B]);
      }
      if (!ok) return;
      var o = hi ? 1 : (.28 + w[1] * .1).toFixed(2);
      out += '<span' + (hi ? ' class="hi"' : '') + ' lang="' + (hi ? lang : 'und') + '" style="left:' + x.toFixed(0) + 'px;top:' + y.toFixed(0) + 'px;font-size:' + fs + 'px;--o:' + o + ';transition-delay:' + (reduce ? 0 : i * 40) + 'ms">' + w[0] + '</span>';
    });
    box.classList.remove('ready');
    box.innerHTML = out;
    requestAnimationFrame(function () { requestAnimationFrame(function () { box.classList.add('ready'); }); });
  }
  if (box) {
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(cloud, 150); }, { passive: true });
  }

  /* ---------- reviews (same cards as the home) ---------- */
  var mo = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function keyLine(text) { var m = String(text).split(/(?<=[.!?…])\s+/); return m[0].length < 140 ? [m[0], m.slice(1).join(' ')] : ['', text]; }
  function card(r) {
    var k = keyLine(r.text), n = r.rating || 5, stars = '';
    for (var z = 0; z < n; z++) stars += '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 .8l1.6 3.4 3.7.4-2.8 2.5.8 3.7L6 9 2.7 10.8l.8-3.7L.7 4.6l3.7-.4z" fill="currentColor"/></svg>';
    return '<figure class="review"><blockquote>' + (k[0] ? '<span class="key">' + esc(k[0]) + '</span>' : '') + esc(k[1]).replace(/\n+/g, '<br>') + '</blockquote>' +
      '<figcaption><span class="stars" aria-label="' + n + '/5">' + stars + '</span> · ' + esc(r.name) + (r.type ? ' · ' + esc(r.type) : '') + ' · ' + esc(mo[r.month] ? S.months[mo[r.month] - 1] : r.month) + ' ' + esc(r.year) + '</figcaption></figure>';
  }
  var T = (window.testimonials || []).slice();
  T.sort(function (a, b) { return (b.year * 12 + (mo[b.month] || 0)) - (a.year * 12 + (mo[a.month] || 0)); });
  var ordered = T.filter(function (r) { return r.highlighted; }).concat(T.filter(function (r) { return !r.highlighted; }));
  var rv = $('#reviewsTop'), rm = $('#reviewsMore'), tog = $('#reviewsToggle');
  function renderReviews() {
    if (!rv) return;
    if (!ordered.length) { $('#reviews').hidden = true; return; }
    rv.innerHTML = ordered.slice(0, 3).map(card).join('');
    rm.innerHTML = ordered.slice(3).map(card).join('');
    var avg = Math.round(ordered.reduce(function (s, r) { return s + (r.rating || 0); }, 0) / ordered.length * 10) / 10;
    $('#reviewScore').textContent = avg.toFixed(1);
    $('#reviewCount').textContent = ordered.length;
    if (tog) { tog.hidden = ordered.length <= 3; tog.textContent = rm.classList.contains('open') ? S.reviews_less : S.reviews_all; }
  }
  if (tog && rm) tog.addEventListener('click', function () { var o = rm.classList.toggle('open'); tog.textContent = o ? S.reviews_less : S.reviews_all; tog.setAttribute('aria-expanded', o); build(); });

  /* ---------- the light thread (same drawing as the home): lattice from the header logo,
     then braided strands through every .anchor of #journey down to the footer logo ---------- */
  var css = function (v) { return getComputedStyle(root).getPropertyValue(v).trim(); };
  var cv = $('#heroLattice'), ctx = cv && cv.getContext('2d'), W = 0, Hh = 0, t = 0, run = false, last = 0;
  var originNode = $('#journey .origin .node');
  function size() { if (!cv) return; var dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; Hh = cv.clientHeight; cv.width = W * dpr; cv.height = Hh * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function hex(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function mix(a, b, u) { return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  function bz(p0, p1, p2, p3, q) { var m = 1 - q; return [m * m * m * p0[0] + 3 * m * m * q * p1[0] + 3 * m * q * q * p2[0] + q * q * q * p3[0], m * m * m * p0[1] + 3 * m * m * q * p1[1] + 3 * m * q * q * p2[1] + q * q * q * p3[1]]; }
  function drawLattice() {
    if (!ctx || !tbtn) return;
    ctx.clearRect(0, 0, W, Hh);
    var dark = root.dataset.theme === 'dark', cols = ['--c1', '--c2', '--c3'].map(function (v) { return hex(css(v)); });
    var mob = W < 820, N = mob ? 16 : 38, S = mob ? 90 : 160;
    var lg = tbtn.getBoundingClientRect(), cr = cv.getBoundingClientRect();
    var ex = originNode ? originNode.getBoundingClientRect().left + originNode.offsetWidth / 2 - cr.left : W * .72;
    var P0 = mob ? [lg.left - cr.left + 4, lg.bottom - cr.top + 4] : [lg.left + lg.width / 2 - cr.left, lg.bottom - cr.top + 6];
    var P1 = mob ? [6, P0[1] + 40] : [cv.dataset.p1 ? W * cv.dataset.p1 : Math.max(W * .62, ex - W * .1), P0[1] + 10], P2 = mob ? [6, Hh * .7] : [Math.min(W - 40, ex + W * .08), Hh * .6], P3 = mob ? [6, Hh] : [ex, Hh];
    var spread = mob ? 5 : Math.min(Hh * (+cv.dataset.spread || .26), 220), amp = mob ? 2 : Hh * .08, bs = [], k;
    ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'; ctx.lineWidth = 1;
    for (k = 0; k <= S; k++) bs.push(bz(P0, P1, P2, P3, k / S));
    for (var i = 0; i < N; i++) {
      var u = i / (N - 1), c = u < .5 ? mix(cols[0], cols[1], u * 2) : mix(cols[1], cols[2], (u - .5) * 2);
      ctx.strokeStyle = 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (dark ? .55 : .7) + ')';
      ctx.beginPath();
      for (k = 0; k <= S; k++) {
        var q = k / S, a2 = bs[Math.max(0, k - 1)], b2 = bs[Math.min(S, k + 1)], dx = b2[0] - a2[0], dy = b2[1] - a2[1], m = Math.hypot(dx, dy) || 1;
        var env = Math.pow(Math.sin(Math.PI * q), q < .5 ? 1.8 : .9);
        var off = (u - .5) * spread * env + Math.sin(q * 5.2 * Math.PI / 1.6 + t + u * 2.4) * amp * env + Math.sin(q * 14 - t * .6 + u * 5) * amp * .2 * env;
        var px = bs[k][0] - dy / m * off, py = bs[k][1] + dx / m * off;
        if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      }
      ctx.stroke();
    }
  }
  function loop(ts) { if (!run) return; if (ts - last > 33) { t += .012; drawLattice(); last = ts; } requestAnimationFrame(loop); }

  $$('.pg-doc .doc h2').forEach(function (h) { h.insertAdjacentHTML('beforeend', '<span class="node gut-node" aria-hidden="true"><span class="anchor" data-quiet></span></span>'); });
  var sec = $('#journey'), svg = $('#spine'), sbase = $('#spineBase'), grp = $('#strands'), cur = $('#curtain'), SH = 0, brt;
  function build() {
    if (!sec) return;
    var r = sec.getBoundingClientRect(), Wd = r.width, mob = Wd < 820, pts = [];
    $$('.anchor', sec).forEach(function (a) { var b = a.getBoundingClientRect(), y = b.top - r.top; pts.push([(mob && !a.hasAttribute('data-end')) ? 14 : b.left - r.left, y, a.hasAttribute('data-quiet'), a.hasAttribute('data-end')]); });
    pts.sort(function (a, b) { return a[1] - b[1]; });
    if (pts.length < 2) return;
    $$('[data-gutter]', sec).forEach(function (g) { var y = g.getBoundingClientRect().top - r.top; for (var q = 1; q < pts.length; q++) if (Math.abs(pts[q][1] - y) < 1) pts[q][0] = pts[q - 1][0]; });
    pts.unshift([pts[0][0], 0]);
    SH = r.height;
    svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + r.height); svg.style.height = r.height + 'px';
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var k = 1; k < pts.length; k++) { var p = pts[k - 1], n = pts[k], my = (n[1] - p[1]) * .42; d += ' C ' + p[0] + ' ' + (p[1] + my) + ', ' + n[0] + ' ' + (n[1] - my) + ', ' + n[0] + ' ' + n[1]; }
    sbase.setAttribute('d', d);
    var L = sbase.getTotalLength(), S = mob ? 5 : 18, cols = ['--c1', '--c2', '--c3', '--c5', '--c4'], out = '';
    var ys = pts.map(function (p) { return p[1]; });
    var spreadMax = mob ? 10 : Wd * .26, wob = mob ? 3 : 24, smp = [], l, i;
    var gutterScale = mob ? .9 : Math.min(.22, 70 / spreadMax);
    for (l = 0; l <= L; l += 12) smp.push(sbase.getPointAtLength(l));
    var nrm = smp.map(function (pt, i) {
      var a = smp[Math.max(0, i - 10)], b = smp[Math.min(smp.length - 1, i + 10)], dx = b.x - a.x, dy = b.y - a.y, m = Math.hypot(dx, dy) || 1, k = 0;
      while (k < ys.length - 2 && pt.y > ys[k + 1]) k++;
      var f = Math.min(1, Math.max(0, (pt.y - ys[k]) / ((ys[k + 1] - ys[k]) || 1)));
      var quiet = pts[k + 1] && pts[k + 1][2], lst = pts[k + 1] && pts[k + 1][3], sh = Math.pow(Math.sin(Math.PI * f), 2.2);
      if (lst) return [-dy / m, dx / m, f, sh * .55];
      if (quiet) return [1, 0, f, pt.y <= ys[1] ? 0 : sh * gutterScale];
      return [-dy / m, dx / m, f, pt.y <= ys[1] ? 0 : sh];
    });
    var lim = nrm.map(function (n, i) { var p = nrm[Math.max(0, i - 3)], q = nrm[Math.min(nrm.length - 1, i + 3)]; var dt = Math.acos(Math.max(-1, Math.min(1, p[0] * q[0] + p[1] * q[1]))) || 1e-4; return .85 * 72 / dt; });
    for (i = 1; i < lim.length; i++) lim[i] = Math.min(lim[i], lim[i - 1] + 6);
    for (i = lim.length - 2; i >= 0; i--) lim[i] = Math.min(lim[i], lim[i + 1] + 6);
    for (var j = 0; j < S; j++) {
      var pd = '', u = j / (S - 1);
      for (i = 0; i < smp.length; i++) {
        var pt = smp[i], nn = nrm[i], off = nn[3] * ((u - .5) * spreadMax + wob * Math.sin(nn[2] * Math.PI * 2 + u * 3.1));
        off = Math.max(-lim[i], Math.min(lim[i], off));
        pd += (i ? ' L' : 'M') + (pt.x + nn[0] * off).toFixed(1) + ' ' + (pt.y + nn[1] * off).toFixed(1);
      }
      out += '<path class="strand" d="' + pd + '" stroke="var(' + cols[j % cols.length] + ')"/>';
    }
    grp.innerHTML = out; tick();
  }
  function tick() {
    if (!cur || !sec) return;
    if (reduce) { cur.style.transform = 'translateY(' + (SH + 200) + 'px)'; return; }
    var r = sec.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .9 - r.top) / r.height));
    cur.style.transform = 'translateY(' + (p * (SH + 200)) + 'px)';
  }
  function relayout() { size(); drawLattice(); build(); }
  if (cv) {
    size(); drawLattice();
    if (!reduce && 'IntersectionObserver' in window) new IntersectionObserver(function (e) { run = e[0].isIntersecting && !document.hidden; if (run) requestAnimationFrame(loop); }).observe(cv);
  }
  if (sec) {
    var sraf = 0;
    addEventListener('scroll', function () { if (!sraf) sraf = requestAnimationFrame(function () { sraf = 0; tick(); }); }, { passive: true });
    addEventListener('resize', function () { clearTimeout(brt); brt = setTimeout(relayout, 150); });
    addEventListener('load', relayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    var lastH = 0;
    if ('ResizeObserver' in window) new ResizeObserver(function () { var h = sec.offsetHeight; if (Math.abs(h - lastH) > 2) { lastH = h; clearTimeout(brt); brt = setTimeout(build, 120); } }).observe(sec);
  }

  /* ---------- contact tracking (same events as the home) ---------- */
  $$('a[href*="wa.me"]').forEach(function (a) { a.addEventListener('click', function () { track('Contact', { contact_method: 'WhatsApp' }); track('whatsapp_click', {}, 'trackCustom'); }); });
  $$('a[href*="instagram.com"]').forEach(function (a) { a.addEventListener('click', function () { track('Contact', { contact_method: 'Instagram' }); track('instagram_click', {}, 'trackCustom'); }); });
  $$('a[href^="mailto:"]').forEach(function (a) { a.addEventListener('click', function () { track('Contact', { contact_method: 'Email' }); track('email_click', {}, 'trackCustom'); }); });

  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  applyLang();
  llabel();
  if (box && document.fonts && document.fonts.ready) document.fonts.ready.then(cloud);
})();
