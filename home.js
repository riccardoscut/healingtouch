/* Signature Healing Touch · home behaviour (2026 redesign).
   Reads window.HOME (strings for the current language, injected by tools/build-home.py)
   and window.testimonials (from contents.js). No framework, no build step at runtime. */
(function () {
  'use strict';
  var H = window.HOME || {};
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static\b/.test(location.search); /* ?static: QA only */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var css = function (v) { return getComputedStyle(root).getPropertyValue(v).trim(); };

  /* ---------- tracking helper (Meta Pixel helper defined in <head>) ---------- */
  function track(ev, params, type) { if (typeof window.trackPixel === 'function') window.trackPixel(ev, params || {}, type || 'track'); }

  /* ---------- headline: one of the approved lines at random on each visit ---------- */
  var h1 = $('#h'), hi = 0;
  function setHeadline(i) {
    if (!h1 || !H.headlines || !H.headlines.length) return;
    hi = (i + H.headlines.length) % H.headlines.length; var x = H.headlines[hi];
    $$('[data-dup]').forEach(function (el) { el.hidden = el.getAttribute('data-dup') === String(hi); });
    h1.innerHTML = '<em>' + x[0] + '</em> <strong>' + x[1] + '</strong>' + (x[2] ? ' <em>' + x[2] + '</em>' : '');
  }
  if (H.headlines) setHeadline(Math.floor(Math.random() * H.headlines.length));

  /* ---------- theme: the logo disc rotates and toggles light/dark ---------- */
  /* the padlock decides what the logo does: unlocked = switch theme; locked = keep theme, show next headline */
  var tbtn = $('#themeToggle'), lbtn = $('#lockToggle'), locked = false;
  try { locked = localStorage.getItem('theme-lock') === '1'; } catch (e) {}
  function tlabel() { if (tbtn) tbtn.setAttribute('aria-label', locked ? H.logo_next : (root.dataset.theme === 'dark' ? H.theme_to_light : H.theme_to_dark)); }
  function llabel() { if (!lbtn) return; lbtn.setAttribute('aria-pressed', locked); var t = locked ? H.lock_closed : H.lock_open; lbtn.setAttribute('aria-label', t); lbtn.title = t; tlabel(); }
  llabel();
  if (lbtn) lbtn.addEventListener('click', function () { locked = !locked; try { localStorage.setItem('theme-lock', locked ? '1' : '0'); } catch (e) {} llabel(); });
  if (tbtn) tbtn.addEventListener('click', function () {
    tbtn.classList.toggle('spin');
    if (locked) { setHeadline(hi + 1); setTimeout(build, 60); return; }
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('preferred-theme', root.dataset.theme); } catch (e) {}
    tlabel(); drawLattice();
  });

  /* ---------- language links remember the choice ---------- */
  $$('[data-lang]').forEach(function (a) { a.addEventListener('click', function () { try { localStorage.setItem('preferred-language', a.dataset.lang); } catch (e) {} }); });

  /* ---------- hero lattice: a family of close sine curves on one canvas ---------- */
  var cv = $('#heroLattice'), ctx = cv && cv.getContext('2d'), W = 0, Hh = 0, t = 0, run = false, last = 0;
  function size() { if (!cv) return; var dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; Hh = cv.clientHeight; cv.width = W * dpr; cv.height = Hh * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function hex(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function mix(a, b, u) { return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  function bz(p0, p1, p2, p3, q) { var m = 1 - q; return [m * m * m * p0[0] + 3 * m * m * q * p1[0] + 3 * m * q * q * p2[0] + q * q * q * p3[0], m * m * m * p0[1] + 3 * m * m * q * p1[1] + 3 * m * q * q * p2[1] + q * q * q * p3[1]]; }
  function drawLattice() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, Hh);
    var dark = root.dataset.theme === 'dark', cols = ['--c1', '--c2', '--c3'].map(function (v) { return hex(css(v)); });
    var mob = W < 820, N = mob ? 16 : 38, S = mob ? 90 : 160;
    var lg = tbtn.getBoundingClientRect(), cr = cv.getBoundingClientRect();
    var P0 = mob ? [lg.left - cr.left + 4, lg.bottom - cr.top + 4] : [lg.left + lg.width / 2 - cr.left, lg.bottom - cr.top + 6];
    var P1 = mob ? [6, P0[1] + 40] : [W * .62, P0[1] + 10], P2 = mob ? [6, Hh * .7] : [W * .8, Hh * .6], P3 = mob ? [6, Hh] : [W * .72, Hh];
    var wn = $('.who .node'); if (wn) { var nb = wn.getBoundingClientRect(); P3 = [nb.left + nb.width / 2 - cr.left, nb.top + nb.height / 2 - cr.top]; if (mob) P2 = [6, P3[1] - 60]; } /* the lattice flows into the portrait's light point */
    var spread = mob ? 5 : Hh * .26, amp = mob ? 2 : Hh * .08, base = [], k;
    ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'; ctx.lineWidth = 1;
    for (k = 0; k <= S; k++) base.push(bz(P0, P1, P2, P3, k / S));
    for (var i = 0; i < N; i++) {
      var u = i / (N - 1), c = u < .5 ? mix(cols[0], cols[1], u * 2) : mix(cols[1], cols[2], (u - .5) * 2);
      ctx.strokeStyle = 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (dark ? .55 : .7) + ')';
      ctx.beginPath();
      for (k = 0; k <= S; k++) {
        var q = k / S, a2 = base[Math.max(0, k - 1)], b2 = base[Math.min(S, k + 1)], dx = b2[0] - a2[0], dy = b2[1] - a2[1], m = Math.hypot(dx, dy) || 1;
        var env = Math.pow(Math.sin(Math.PI * q), q < .5 ? 1.8 : .9);
        var off = (u - .5) * spread * env + Math.sin(q * 5.2 * Math.PI / 1.6 + t + u * 2.4) * amp * env + Math.sin(q * 14 - t * .6 + u * 5) * amp * .2 * env;
        var px = base[k][0] - dy / m * off, py = base[k][1] + dx / m * off;
        if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      }
      ctx.stroke();
    }
  }
  function loop(ts) { if (!run) return; if (ts - last > 33) { t += .012; drawLattice(); last = ts; } requestAnimationFrame(loop); }
  if (cv) {
    size(); drawLattice();
    if (!reduce && 'IntersectionObserver' in window) new IntersectionObserver(function (e) { run = e[0].isIntersecting && !document.hidden; if (run) requestAnimationFrame(loop); }).observe(cv);
  }

  /* ---------- treatment marks: one continuous stroke from top (200,40) to bottom (200,360) ---------- */
  function spiral() { var d = 'M200 40 L200 122', n = 200; for (var k = 0; k <= n; k++) { var q = k / n, th = -Math.PI / 2 + q * 6.6 * Math.PI, r = 84 * (1 - q) + 6; d += ' L' + (200 + r * Math.cos(th) * .86).toFixed(1) + ' ' + (206 + r * Math.sin(th)).toFixed(1); } return d + ' C206 260 200 300 200 360'; }
  var MARKS = {
    detox: 'M200 40 L200 96 C200 96 278 192 278 242 A78 78 0 0 1 122 242 C122 206 144 170 168 138 C138 196 146 262 176 246 C200 232 224 264 250 250 C266 290 208 306 200 330 L200 360',
    athlete: 'M200 40 C200 96 290 120 268 170 A80 80 0 1 0 268 250 L237 268 L268 250 L268 286 L268 250 C252 300 208 322 200 360',
    balance: 'M200 40 L200 120 A80 80 0 0 1 200 280 A80 80 0 0 1 200 120 A40 40 0 0 1 200 200 A40 40 0 0 0 200 280 L200 360',
    signature: spiral(),
    purebody: 'M200 40 L200 92 A20 20 0 1 1 199.9 92 L200 150 C230 150 254 214 254 300 L146 300 C146 214 170 150 200 150 L200 360',
    ritual: 'M200 40 L200 140 C168 182 168 238 200 276 C166 268 134 238 124 196 C160 204 188 236 200 276 C234 268 266 238 276 196 C240 204 212 236 200 276 C232 238 232 182 200 140 L200 276 L128 284 L272 284 C292 318 220 330 200 360'
  };
  $$('[data-symbol]').forEach(function (el, idx) {
    var d = MARKS[el.dataset.symbol]; if (!d) return; var id = 'gold' + idx;
    el.innerHTML = '<svg viewBox="0 0 400 400" aria-hidden="true" focusable="false"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--c1)"/><stop offset=".3" stop-color="var(--gold-a)"/><stop offset=".7" stop-color="var(--gold-b)"/><stop offset="1" stop-color="var(--c3)"/></linearGradient></defs>' +
      '<path class="ghost-path" d="' + d + '" fill="none" stroke="var(--line)" stroke-width="1"/>' +
      '<path class="draw" d="' + d + '" pathLength="1" fill="none" stroke="url(#' + id + ')" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path class="draw" d="' + d + '" pathLength="1" fill="none" stroke="var(--core)" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  });

  /* ---------- the thread: braided strands through every anchor, revealed by a curtain ---------- */
  var sec = $('#journey'), svg = $('#spine'), base = $('#spineBase'), grp = $('#strands'), cur = $('#curtain'), SH = 0, rt;
  var marks = $$('.sym-node .sym');
  function build() {
    if (!sec) return;
    var r = sec.getBoundingClientRect(), Wd = r.width, mob = Wd < 820, pts = [[mob ? 14 : Wd * .72, 0]], inside = [];
    var wa = $('.who .anchor'); if (wa) { var wb = wa.getBoundingClientRect(); pts[0] = [wb.left - r.left, wb.top - r.top]; } /* home: start at the portrait's light point */
    var endPt = null;
    $$('.anchor', sec).forEach(function (a) {
      var b = a.getBoundingClientRect(), y = b.top - r.top, x = b.left - r.left, top = a.classList.contains('a-top'), bot = a.classList.contains('a-bot');
      pts.push([x, y, a.hasAttribute('data-quiet'), a.hasAttribute('data-end')]);
      if (top) inside.push(y);
    });
    pts.sort(function (a, b) { return a[1] - b[1]; });
    $$('[data-gutter]', sec).forEach(function (g) { var y = g.getBoundingClientRect().top - r.top; for (var q = 1; q < pts.length; q++) if (Math.abs(pts[q][1] - y) < 1) pts[q][0] = pts[q - 1][0]; });
    SH = r.height;
    svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + r.height); svg.style.height = r.height + 'px';
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var k = 1; k < pts.length; k++) { var p = pts[k - 1], n = pts[k], my = (n[1] - p[1]) * .42; d += ' C ' + p[0] + ' ' + (p[1] + my) + ', ' + n[0] + ' ' + (n[1] - my) + ', ' + n[0] + ' ' + n[1]; }
    base.setAttribute('d', d);
    var L = base.getTotalLength(), S = mob ? 5 : 18, cols = ['--c1', '--c2', '--c3', '--c5', '--c4'], out = '';
    var ys = pts.map(function (p) { return p[1]; });
    var spreadMax = mob ? 22 : Wd * .26, wob = mob ? 6 : 24, smp = [], l, i;
    var gutterScale = mob ? .9 : Math.min(.22, 70 / spreadMax);
    for (l = 0; l <= L; l += 12) smp.push(base.getPointAtLength(l));
    var nrm = smp.map(function (pt, i) {
      var a = smp[Math.max(0, i - 10)], b = smp[Math.min(smp.length - 1, i + 10)], dx = b.x - a.x, dy = b.y - a.y, m = Math.hypot(dx, dy) || 1, k = 0;
      while (k < ys.length - 2 && pt.y > ys[k + 1]) k++;
      var f = Math.min(1, Math.max(0, (pt.y - ys[k]) / ((ys[k + 1] - ys[k]) || 1)));
      var inS = inside.some(function (y0) { return pt.y >= y0 - 1 && pt.y <= y0 + (mob ? 101 : 209); });
      var quiet = pts[k + 1] && pts[k + 1][2], last = pts[k + 1] && pts[k + 1][3], sh = Math.pow(Math.sin(Math.PI * f), 2.2);
      if (last) return [-dy / m, dx / m, f, sh];
      if (quiet) return [1, 0, f, (inS || pt.y <= ys[0]) ? 0 : sh * gutterScale];
      return [-dy / m, dx / m, f, (inS || pt.y <= ys[0]) ? 0 : sh];
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
    var line = innerHeight * .75;
    marks.forEach(function (m) { var b = m.getBoundingClientRect(); if (!reduce && (b.bottom < -200 || b.top > innerHeight + 200)) return; var q = reduce ? 1 : Math.min(1, Math.max(0, (line - b.top) / (b.height * 1.1))); m.style.setProperty('--p', q.toFixed(3)); });
    if (!cur) return;
    if (reduce) { cur.style.transform = 'translateY(' + (SH + 200) + 'px)'; return; }
    var r = sec.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .75 - r.top) / r.height));
    cur.style.transform = 'translateY(' + (p * (SH + 200)) + 'px)';
    /* the texts beside situations and treatments are written in by the same light: revealed top to bottom at the curtain's edge */
    var edge = r.top + p * (SH + 200) - 40;
    for (var i = 0; i < reveal.length; i++) {
      var el = reveal[i], b = el.getBoundingClientRect(), q = b.height ? Math.min(1, Math.max(0, (edge - b.top) / b.height)) : 1;
      if (el._r !== q) { el._r = q; el.style.setProperty('--r', q.toFixed(3)); el.classList.toggle('lit', q >= 1); }
    }
  }
  var reveal = (reduce || !sec) ? [] : $$('.stop .txt > :not(.node), .bridge', sec);
  if (reveal.length) sec.classList.add('reveal-on');
  if (sec) {
    var raf = 0;
    addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; tick(); }); }, { passive: true });
    addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); drawLattice(); build(); }, 150); });
    addEventListener('load', build); build();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
    var lastH = 0;
    if ('ResizeObserver' in window) new ResizeObserver(function () { var h = sec.offsetHeight; if (Math.abs(h - lastH) > 2) { lastH = h; clearTimeout(rt); rt = setTimeout(build, 120); } }).observe(sec);
  }

  /* ---------- booking: Cal.com popup for three services, Stripe booking pages for the others ---------- */
  var CAL = ['balance-reflexology-massage-60-min-60', 'executive-detox-massage-45-min', 'reflexology-foot-massage-1-hour-30-min'];
  function initCal() {
    if (!window.Cal) return false;
    CAL.forEach(function (id) {
      try {
        window.Cal('init', id, { origin: 'https://cal.com' });
        window.Cal.ns[id]('ui', { cssVarsPerTheme: { light: { 'cal-brand': '#755A92' }, dark: { 'cal-brand': '#E4E4BC' } }, hideEventTypeDetails: false, layout: 'month_view' });
      } catch (e) {}
    });
    return true;
  }
  if (!initCal()) addEventListener('load', initCal, { once: true });
  $$('[data-book]').forEach(function (b) {
    b.addEventListener('click', function () {
      track('InitiateCheckout', { content_name: b.dataset.service || '', content_category: 'Booking Intent' });
      track('booking_button_clicked', { content_name: b.dataset.service || '', content_category: 'Service Interest' }, 'trackCustom');
    });
  });
  $$('a[href*="wa.me"]').forEach(function (a) { a.addEventListener('click', function () { track('Contact', { contact_method: 'WhatsApp' }); track('whatsapp_click', {}, 'trackCustom'); }); });
  $$('a[href*="instagram.com"]').forEach(function (a) { a.addEventListener('click', function () { track('Contact', { contact_method: 'Instagram' }); track('instagram_click', {}, 'trackCustom'); }); });
  $$('a[href^="mailto:"]').forEach(function (a) { a.addEventListener('click', function () { track('Contact', { contact_method: 'Email' }); track('email_click', {}, 'trackCustom'); }); });
  $$('[data-cal-link]').forEach(function (a) { a.addEventListener('click', function () { track('Schedule', { scheduling_provider: 'Cal.com' }); track('cal_opened', {}, 'trackCustom'); }); });

  /* ---------- reviews (real testimonials from contents.js) ---------- */
  var mo = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function keyLine(text) { var m = String(text).split(/(?<=[.!?…])\s+/); return m[0].length < 140 ? [m[0], m.slice(1).join(' ')] : ['', text]; }
  function card(r) {
    var k = keyLine(r.text), n = r.rating || 5, stars = ''; for (var z = 0; z < n; z++) stars += '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 .8l1.6 3.4 3.7.4-2.8 2.5.8 3.7L6 9 2.7 10.8l.8-3.7L.7 4.6l3.7-.4z" fill="currentColor"/></svg>';
    return '<figure class="review"><blockquote>' + (k[0] ? '<span class="key">' + esc(k[0]) + '</span>' : '') + esc(k[1]).replace(/\n+/g, '<br>') + '</blockquote>' +
      '<figcaption><span class="stars" aria-label="' + (r.rating || 5) + '/5">' + stars + '</span> · ' + esc(r.name) + ' · ' + esc(r.type) + ' · ' + esc((H.months && mo[r.month]) ? H.months[mo[r.month] - 1] : r.month) + ' ' + esc(r.year) + '</figcaption></figure>';
  }
  var T = (window.testimonials || []).slice();
  T.sort(function (a, b) { return (b.year * 12 + (mo[b.month] || 0)) - (a.year * 12 + (mo[a.month] || 0)); });
  var feat = T.filter(function (r) { return r.highlighted; }), rest = T.filter(function (r) { return !r.highlighted; });
  var first = feat.concat(rest).slice(0, 3), more = feat.concat(rest).slice(3);
  var rv = $('#reviewsTop'), rm = $('#reviewsMore'), sc = $('#reviewScore');
  if (rv) rv.innerHTML = first.map(card).join('');
  if (rm) rm.innerHTML = more.map(card).join('');
  if (sc && T.length) { var avg = Math.round(T.reduce(function (s, r) { return s + (r.rating || 0); }, 0) / T.length * 10) / 10; sc.textContent = avg.toFixed(1); var rc = document.getElementById('reviewCount'); if (rc) rc.textContent = T.length; $$('[data-score]').forEach(function (e) { e.textContent = avg.toFixed(1) + '/5'; }); }
  var tog = $('#reviewsToggle');
  if (tog && rm) tog.addEventListener('click', function () { var o = rm.classList.toggle('open'); tog.textContent = o ? H.reviews_less : H.reviews_all; tog.setAttribute('aria-expanded', o); build(); });

  /* ---------- about gallery + lightbox ---------- */
  var G = ['g76.webp', 'g74.webp', 'g79.webp', 'g78.webp', 'g46.webp', 'g25.webp'], gi = 0;
  var lb = $('#lightbox'), li = $('#lbImg'), lc = $('#lbCap'), ln = $('#lbCount');
  function showG(k) { gi = (k + G.length) % G.length; li.src = '/assets/home/' + G[gi]; li.alt = H.gallery[gi]; lc.textContent = H.gallery[gi]; ln.textContent = (gi + 1) + ' / ' + G.length; }
  if (lb && lb.showModal) {
    $('#deck').addEventListener('click', function () { showG(0); lb.showModal(); });
    $('#lbPrev').addEventListener('click', function () { showG(gi - 1); });
    $('#lbNext').addEventListener('click', function () { showG(gi + 1); });
    $('#lbClose').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') showG(gi + 1); if (e.key === 'ArrowLeft') showG(gi - 1); });
  }

  /* ---------- review form (EmailJS, same service/template as before) ---------- */
  var fd = $('#reviewDialog'), form = $('#reviewForm'), msg = $('#formMsg');
  $$('[data-open-review]').forEach(function (b) { b.addEventListener('click', function () { if (fd && fd.showModal) fd.showModal(); }); });
  $$('[data-close-review]').forEach(function (b) { b.addEventListener('click', function () { fd.close(); }); });
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, btn = form.querySelector('[type=submit]');
    var data = { experience: f.experience.value.trim(), rating: f.rating.value, massageType: (form.querySelector('input[name=massageType]:checked') || {}).value || '', name: f.name.value.trim(), email: f.email.value.trim(), date: f.month.value && f.year.value ? f.month.value + '/' + f.year.value : '' };
    if (!data.experience || !data.rating || !data.massageType || !data.name || !data.email || !data.date) { msg.textContent = H.form.missing; msg.className = 'form-msg err'; return; }
    btn.disabled = true; btn.textContent = H.form.sending;
    var done = function (ok) { msg.textContent = ok ? H.form.ok : H.form.err; msg.className = 'form-msg' + (ok ? '' : ' err'); btn.disabled = false; btn.textContent = H.form.submit; if (ok) { track('testimonial_submitted', { content_name: 'Testimonial Form', content_category: 'Lead Generation' }, 'trackCustom'); form.reset(); setTimeout(function () { fd.close(); msg.textContent = ''; }, 2200); } };
    if (!window.emailjs) { done(false); return; }
    window.emailjs.send('service_dwed3y6', 'template_9gsve0p', data).then(function () { done(true); }, function (err) { done(!!(err && (err.status === 200 || (err.text && err.text.indexOf('OK') > -1)))); });
  });

  /* ---------- footer year ---------- */
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
