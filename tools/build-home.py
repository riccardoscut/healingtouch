#!/usr/bin/env python3
"""Build the home pages from home-content.json.

    python3 tools/build-home.py

Writes en/index.html, es/index.html and index.html (English + redirect to the
visitor's language, like before). Edit texts in home-content.json, never in the
generated HTML.
"""
import html, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://healingtouch.da-sign.com'
WA = 'https://wa.me/34652952566'
CAL = 'signaturehealingtouch/'
STRIPE = {
    'athlete': 'https://book.stripe.com/bJe5kDclI4bP8MPfln7ok09',
    'purebody': 'https://book.stripe.com/00w3cvdpMeQtaUXddf7ok0b',
    'ritual': 'https://book.stripe.com/9B6dR92L84bP2or6OR7ok0a',
}
SERVICES = {  # id used by Cal.com / Stripe, minutes, price (from contents.js, confirmed by Riccardo)
    'detox': ('executive-detox-massage-45-min', 45, 45),
    'athlete': ('athlete-recovery-reflexology-leg-release-80-min', 80, 110),
    'balance': ('balance-reflexology-massage-60-min-60', 60, 60),
    'signature': ('reflexology-foot-massage-1-hour-30-min', 90, 70),
    'purebody': ('pure-body-massage-60-min', 60, 100),
    'ritual': ('signature-full-body-ritual-experience-120-min', 120, 240),
}
PACKS = [  # name index in strings, pack price, regular price, Stripe link
    (0, 270, 360, 'https://buy.stripe.com/5kQ8wPfxUbEhe793CF7ok05'),
    (1, 180, 240, 'https://buy.stripe.com/9B69ATbhEaAd6EHehj7ok08'),
    (2, 135, 180, 'https://buy.stripe.com/7sY14n5Xk37L6EHehj7ok04'),
]
e = html.escape

ARR = '<svg class="arr" viewBox="0 0 16 10" aria-hidden="true"><path d="M1 5h13M10 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>'
WA_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1.2-1.1 1.8.9-.4 1.6c-3.6.3-7.6-3.7-7.3-7.3l1.6-.4.9 1.8z"/></svg>'


def book_button(key, s, label, primary=True):
    sid, _, _ = SERVICES[key]
    t = s['treatments'][key]
    name = (t['name1'] + ' ' + t['name2']).strip()
    cls = 'btn btn-primary' if primary else 'btn btn-ghost'
    if key in STRIPE:
        return f'<a class="{cls}" data-book data-service="{e(name)}" href="{STRIPE[key]}" target="_blank" rel="noopener noreferrer">{e(label)}</a>'
    return (f'<button type="button" class="{cls}" data-book data-service="{e(name)}" data-cal-link="{CAL}{sid}" '
            f'data-cal-namespace="{sid}" data-cal-config=\'{{"layout":"month_view"}}\'>{e(label)}</button>')


def hook(parts):
    a, b, c = parts
    return f'<em>{e(a)}</em> <strong>{e(b)}</strong> {e(c)}'


def situation(side, sit, s, dup):
    a, b, c, txt = sit
    return f'''  <article class="stop sit {side}"><span class="node"><span class="anchor"></span></span>
    <div class="txt"><h2 data-dup="{dup}">{hook([a, b, c])}</h2><p>{e(txt)}</p><a class="tag" href="#detox"><i></i>{e(s["detox_tag"])}{ARR}</a></div>
  </article>
'''


def treatment(side, key, s, extra=''):
    sid, mins, price = SERVICES[key]
    t = s['treatments'][key]
    name = (t['name1'] + ' ' + t['name2']).strip()
    head = ''
    if 'hook' in t:
        dup = ' data-dup="5"' if key == 'athlete' else ''
        head = f'<h2 class="hook"{dup}>{hook(t["hook"])}</h2><p class="lead">{e(t["lead"])}</p>'
    return f'''  <article class="stop treat {side}" id="{key}">
    <div class="txt"><span class="node sym-node"><span class="anchor a-top"></span><span class="anchor a-bot"></span><span class="sym" data-symbol="{key}"></span></span>{head}<h3><strong>{e(t["name1"])}</strong> {e(t["name2"])}</h3>
      <div class="price"><span><b>{mins}</b> min</span><span><b>€{price}</b></span></div>
      <p>{e(t["text"])}</p>
      <div class="actions">{book_button(key, s, s["book_prefix"] + " " + name)}<a class="btn btn-ghost" href="{WA}" target="_blank" rel="noopener noreferrer">{e(s["ask"])}</a></div>
{extra}
    </div>
  </article>
'''


GMAPS = 'https://share.google/fibJMihBEMmJxMQ5v'  # Riccardo's Google business profile (Sardenya 371)
AMAPS = f'https://maps.apple.com/?q=SLK+Alkalina&address=Carrer+de+Sardenya+371,+08025+Barcelona'


def find_map():
    """A drawn, abstract map (no real streets or landmarks): chamfered city blocks on a rotated grid,
    like the Eixample. The page's own light thread crosses it and converges on the light point at its centre."""
    blocks, step, size, cut = [], 58, 44, 10
    for i in range(-5, 6):
        for j in range(-5, 6):
            x, y = i * step - size / 2, j * step - size / 2
            if i == 0 and j == 0:
                continue  # the studio block is the light point
            pts = [(x + cut, y), (x + size - cut, y), (x + size, y + cut), (x + size, y + size - cut),
                   (x + size - cut, y + size), (x + cut, y + size), (x, y + size - cut), (x, y + cut)]
            blocks.append('<path d="M' + ' L'.join(f'{a:.0f} {b:.0f}' for a, b in pts) + 'Z"/>')
    return ('<svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">'
            '<g class="blocks" transform="translate(200 200) rotate(45)">' + ''.join(blocks) + '</g></svg>')


def page(s, other, is_root=False):
    L = s['lang']
    url = f'{SITE}/{L}/'
    stepup = f'''
      <div class="stepup"><div class="steps" aria-hidden="true"><svg viewBox="0 0 16 22"><ellipse cx="8" cy="13" rx="5" ry="8"/></svg><svg viewBox="0 0 16 22" style="transform:translateY(-6px)"><ellipse cx="8" cy="13" rx="5" ry="8"/></svg><svg viewBox="0 0 16 22"><ellipse cx="8" cy="13" rx="5" ry="8"/></svg></div>
        <h4 data-dup="6">{e(s["stepup_title"])}</h4><p>{e(s["stepup_text"])}</p><ul>{"".join(f"<li>{e(r)}</li>" for r in s["stepup_rules"])}</ul><small>{e(s["stepup_note"])}</small></div>'''
    sides = ['left', 'right', 'left', 'right']
    dups = [2, 3, 1, 4]  # hero headline index that tells the same story as each situation
    journey = ''.join(situation(sides[i], sit, s, dups[i]) for i, sit in enumerate(s['situations']))
    journey += f'  <p class="bridge">{e(s["bridge1"][0])} <strong>{e(s["bridge1"][1])}</strong></p>\n'
    journey += treatment('left', 'detox', s, stepup)
    journey += treatment('right', 'athlete', s) + treatment('left', 'balance', s) + treatment('right', 'signature', s)
    journey += f'  <p class="bridge">{e(s["bridge2"][0])} <strong>{e(s["bridge2"][1])}</strong></p>\n'
    journey += treatment('left', 'purebody', s) + treatment('right', 'ritual', s)

    packs = ''.join(f'''<article class="pack"><h3>{e(s["packs"][i][0])} 3+1</h3><p class="pp"><b>€{p}</b><s>€{reg}</s></p><p>{e(s["packs"][i][1])}</p>
        <a class="btn btn-ghost" data-book data-service="{e(s["packs"][i][0])} Pack 3+1" href="{link}" target="_blank" rel="noopener noreferrer">{e(s["packs_buy"])}</a></article>''' for i, p, reg, link in PACKS)

    PLUS = '<svg class="plus" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2v14M2 9h14" stroke="currentColor" stroke-width="1.2"/></svg>'
    faq = ''.join(f'<details><summary><span>{e(q)}</span>{PLUS}</summary><p>{e(a)}</p></details>' for q, a in s['faq'])
    ftypes = ''.join(f'<label><input type="radio" name="massageType" value="{e((s["treatments"][k]["name1"] + " " + s["treatments"][k]["name2"]).strip())}" required> {e((s["treatments"][k]["name1"] + " " + s["treatments"][k]["name2"]).strip())}</label>' for k in SERVICES)
    ratings = ''.join(f'<option value="{i + 1}">{e(r)}</option>' for i, r in enumerate(s['form']['ratings']))
    months = ''.join(f'<option value="{m:02d}">{m:02d}</option>' for m in range(1, 13))
    years = ''.join(f'<option value="{y}">{y}</option>' for y in range(2026, 2018, -1))
    other_url = f'/{other["lang"]}/'

    redirect = '''<script>(function(){var p=location.pathname;if(p.indexOf('/en')===0||p.indexOf('/es')===0)return;var l='en';try{var s=localStorage.getItem('preferred-language');if(s==='es'||s==='en')l=s;else if((navigator.language||'').slice(0,2)==='es')l='es';}catch(e){}location.replace('/'+l+'/'+location.search+location.hash);})();</script>''' if is_root else ''

    home_json = json.dumps({k: s[k] for k in ['headlines', 'theme_to_light', 'theme_to_dark', 'reviews_all', 'reviews_less', 'gallery', 'form', 'months', 'lock_open', 'lock_closed', 'logo_next']}, ensure_ascii=False)
    ld = {
        '@context': 'https://schema.org', '@type': 'HealthAndBeautyBusiness', 'name': 'Signature Healing Touch',
        'url': SITE + '/', 'image': SITE + '/logo_wName_transparentBG_newGold.png', 'telephone': '+34652952566',
        'email': 'healingtouch@da-sign.com', 'priceRange': '€45–€240',
        'address': {'@type': 'PostalAddress', 'streetAddress': 'Carrer de Sardenya 371', 'postalCode': '08025', 'addressLocality': 'Barcelona', 'addressRegion': 'Catalonia', 'addressCountry': 'ES'},
        'areaServed': 'Barcelona', 'sameAs': ['https://instagram.com/SignatureHealingTouch'], 'description': s['description'],
        'founder': {'@type': 'Person', 'name': 'Riccardo Francescut', 'jobTitle': 'Cognitive Psychologist | Yoga Master | Reflexologist & Masseur'},
        'makesOffer': [{'@type': 'Offer', 'price': str(p), 'priceCurrency': 'EUR', 'itemOffered': {'@type': 'Service', 'name': (s['treatments'][k]['name1'] + ' ' + s['treatments'][k]['name2']).strip(), 'description': f'{m} min'}} for k, (_, m, p) in SERVICES.items()],
    }

    return f'''<!DOCTYPE html>
<html lang="{L}" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{redirect}
<script async src="https://www.googletagmanager.com/gtag/js?id=G-M7C39Q6HX8"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-M7C39Q6HX8');</script>
<title>{e(s["title"])}</title>
<meta name="description" content="{e(s["description"])}">
<meta name="author" content="Riccardo Francescut">
<meta name="theme-color" content="#000000">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="en" href="{SITE}/en/">
<link rel="alternate" hreflang="es" href="{SITE}/es/">
<link rel="alternate" hreflang="x-default" href="{SITE}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Signature Healing Touch">
<meta property="og:title" content="{e(s["title"])}">
<meta property="og:description" content="{e(s["description"])}">
<meta property="og:url" content="{url}">
<meta property="og:locale" content="{s["locale"]}">
<meta property="og:image" content="{SITE}/assets/home/g76.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<script>(function(){{var t;try{{t=localStorage.getItem('preferred-theme')}}catch(e){{}}if(t!=='light'&&t!=='dark')t='dark';document.documentElement.dataset.theme=t;}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/home.css?v=2026-11-23b">
<script>
!function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','1517659402723971');fbq('track','PageView');
window.trackedEvents=window.trackedEvents||new Set();
window.trackPixel=function(ev,p,type){{p=p||{{}};type=type||'track';if(!window.fbq)return;var k=type+':'+ev+':'+JSON.stringify(p);if(window.trackedEvents.has(k))return;fbq(type,ev,p);window.trackedEvents.add(k);}};
</script>
<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=1517659402723971&ev=PageView&noscript=1"></noscript>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
<a class="skip" href="#main">{e(s["skip"])}</a>
<div class="frame" aria-hidden="true"></div>
<header class="site-header">
  <div class="brand">
    <button class="disc" id="themeToggle" type="button" aria-label="{e(s["theme_to_light"])}"><img src="/logo_white_500x500.png" alt="" width="40" height="40"></button>
    <button class="lock" id="lockToggle" type="button" aria-pressed="false" aria-label="{e(s["lock_open"])}" title="{e(s["lock_open"])}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path class="shackle-open" d="M8 11V8a4 4 0 0 1 7.6-1.7"/><path class="shackle-closed" d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.2" fill="currentColor" stroke="none"/></svg></button>
    <img class="word" src="/logo_onlyWords_newGold.png" alt="Signature Healing Touch" width="105" height="24">
  </div>
  <nav class="site-nav" aria-label="Main"><ul>
    <li><a href="#detox">{e(s["nav_treatments"])}</a></li><li><a href="#reviews">{e(s["nav_reviews"])}</a></li><li><a href="#faq">{e(s["nav_faq"])}</a></li><li><a href="#contact">{e(s["nav_contact"])}</a></li>
    <li class="l"><span class="lang-switch"><a href="/en/" data-lang="en" hreflang="en"{' aria-current="page"' if L == 'en' else ''}>EN</a><a href="/es/" data-lang="es" hreflang="es"{' aria-current="page"' if L == 'es' else ''}>ES</a></span></li>
  </ul></nav>
</header>

<main id="main">
<section class="hero" aria-labelledby="h">
  <canvas class="lattice" id="heroLattice" aria-hidden="true"></canvas>
  <div class="hero-copy">
    <h1 id="h">{hook(s["headlines"][0]) if s["headlines"][0][2] else hook(s["headlines"][0])}</h1>
    <p class="lede">{e(s["lede"])}</p>
    <div class="actions">
      {book_button("detox", s, s["book"])}
      <a class="btn btn-ghost" href="{WA}" target="_blank" rel="noopener noreferrer">{WA_ICON}{e(s["whatsapp"])}</a>
    </div>
    <div class="facts"><span><b>45–120</b> {e(s["fact_min"])}</span><span>{e(s["fact_from"])} <b>€45</b></span><span><b data-score>4.9/5</b> {e(s["fact_reviews"])}</span></div>
    <p class="avail">{e(s["avail"])}</p>
  </div>
  <a class="who" href="#about"><span class="node" aria-hidden="true"><span class="anchor"></span></span><img src="/assets/home/riccardo-face.webp" alt="" width="240" height="223"><span><b>Riccardo Francescut</b>{e(s["who_role"])} {ARR}</span></a>
</section>

<section class="journey" id="journey" aria-label="{e(s["journey_label"])}">
  <svg class="spine" id="spine" aria-hidden="true" preserveAspectRatio="none"><path id="spineBase" fill="none" stroke="none"/><g id="strands"></g></svg><div class="curtain-clip" aria-hidden="true"><div class="curtain" id="curtain"></div></div>
{journey}
  <section class="section" id="packs" aria-labelledby="packs-h"><span class="node sec-node r"><span class="anchor"></span></span>
    <div class="section-head"><h2 id="packs-h"><em>{e(s["packs_title"][0])}</em> <strong>{e(s["packs_title"][1])}</strong></h2><p>{e(s["packs_lead"])}</p></div>
    <div class="packs">{packs}</div>
  </section>

  <section class="section" id="reviews" aria-labelledby="reviews-h"><span class="node sec-node l"><span class="anchor"></span></span>
    <div class="section-head"><h2 id="reviews-h"><em>{e(s["reviews_title"][0])}</em> <strong>{e(s["reviews_title"][1])}</strong></h2><div class="score"><span id="reviewScore">4.9</span><span class="of">/5 · <span id="reviewCount">28</span> {e(s["fact_reviews"])}</span><small>{e(s["reviews_lead"])}</small></div></div>
    <div class="reviews" id="reviewsTop"></div>
    <div class="reviews reviews-more" id="reviewsMore"></div>
    <div class="reviews-actions">
      <button type="button" class="btn btn-ghost" id="reviewsToggle" aria-expanded="false" aria-controls="reviewsMore">{e(s["reviews_all"])}</button>
      <a class="btn btn-ghost" href="https://share.google/7NGZE7Wp8Jhivp1r4" target="_blank" rel="noopener noreferrer">{e(s["reviews_google"])}</a>
      <button type="button" class="btn btn-ghost" data-open-review>{e(s["reviews_share"])}</button>
    </div>
  </section>

  <section class="section about" id="about" aria-labelledby="ab">
    <div class="about-photo">
      <button class="deck" id="deck" type="button" aria-label="{e(s["deck_label"])} (6)">
        <img class="d3" src="/assets/home/g79.webp" alt="" loading="lazy" width="800" height="1200"><img class="d2" src="/assets/home/g74.webp" alt="" loading="lazy" width="800" height="1200"><img class="d1" src="/assets/home/g76.webp" alt="{e(s["gallery"][0])}" loading="lazy" width="800" height="1200">
        <span class="deck-hint">6 {e(s["deck_hint"])}</span>
      </button>
    </div>
    <div>
      <h2 id="ab"><em>{e(s["about_hi"])}</em> <strong>Riccardo.</strong></h2>
      <p class="role">{e(s["about_role"])}</p>
      <p>{e(s["about_p1"])}</p>
      <p>{e(s["about_p2"])}</p>
      <p class="langs">{e(s["about_langs"])}</p>
    </div>
  </section>

  <section class="section" id="faq" aria-labelledby="faq-h"><span class="node sec-node r"><span class="anchor"></span></span>
    <div class="section-head"><h2 id="faq-h"><em>{e(s["faq_title"][0])}</em> <strong>{e(s["faq_title"][1])}</strong></h2></div>
    <div class="faq">{faq}</div>
  </section>

  <section class="section find" id="find" aria-labelledby="find-h">
    <div class="find-txt">
      <h2 id="find-h"><em>{e(s["find_title"][0])}</em> <strong>{e(s["find_title"][1])}</strong></h2>
      <p class="find-place"><strong>{e(s["find_place"])}</strong><span>{e(s["find_address"])}</span></p>
      <p>{e(s["find_lead"])}</p>
      <div class="actions"><a class="btn btn-primary" href="{GMAPS}" target="_blank" rel="noopener noreferrer">{e(s["find_gmaps"])}</a><a class="btn btn-ghost" href="{AMAPS}" target="_blank" rel="noopener noreferrer">{e(s["find_amaps"])}</a></div>
    </div>
    <a class="find-map" href="{GMAPS}" target="_blank" rel="noopener noreferrer" aria-label="{e(s["find_map_label"])}">{find_map()}<span class="node big find-point" aria-hidden="true"><span class="anchor"></span></span></a>
  </section>

  <section class="section contact" id="contact" aria-labelledby="contact-h">
    <h2 id="contact-h"><em>{e(s["contact_title"][0])}</em> <strong>{e(s["contact_title"][1])}</strong></h2>
    <p>{e(s["contact_lead"])}</p>
    <div class="actions"><a class="btn btn-primary" href="{WA}" target="_blank" rel="noopener noreferrer">{WA_ICON}<span class="nowrap">WhatsApp +34 652 952 566</span></a></div>
    <ul class="contact-list"><li><a href="https://instagram.com/SignatureHealingTouch" target="_blank" rel="noopener noreferrer">Instagram @SignatureHealingTouch</a></li><li><a href="mailto:healingtouch@da-sign.com">healingtouch@da-sign.com</a></li></ul>
  </section>

  <footer class="foot"><span class="anchor" data-end style="left:50%;top:194px"></span>
    <div class="disc foot-disc"><img src="/logo_white_500x500.png" alt="" width="68" height="68"></div>
    <img class="foot-word" src="/logo_onlyWords_newGold.png" alt="Signature Healing Touch" width="131" height="30">
    <p>{e(s["footer_line"])}</p>
    <p class="quote">{e(s["quote"])}</p>
    <p class="small">© <span data-year>2026</span> {e(s["copyright"])} · <a href="/privacy.html">{e(s["privacy"])}</a> · <a href="{other_url}" hreflang="{other["lang"]}" data-lang="{other["lang"]}">{other["lang"].upper()}</a></p>
  </footer>
</section>
</main>

<nav class="bar" aria-label="Quick booking">{book_button("detox", s, s["bar_book"]).replace('class="btn btn-primary"', 'class="bar-book"')}<a href="{WA}" target="_blank" rel="noopener noreferrer">WhatsApp</a></nav>

<dialog class="lightbox" id="lightbox" aria-label="{e(s["deck_label"])}">
  <figure><img id="lbImg" alt=""><figcaption id="lbCap"></figcaption></figure>
  <button class="lb-btn lb-prev" id="lbPrev" type="button" aria-label="{e(s["lb_prev"])}">←</button>
  <button class="lb-btn lb-next" id="lbNext" type="button" aria-label="{e(s["lb_next"])}">→</button>
  <button class="lb-close" id="lbClose" type="button">{e(s["lb_close"])}</button>
  <p class="lb-count" id="lbCount"></p>
</dialog>

<dialog class="form-dialog" id="reviewDialog" aria-labelledby="form-h">
  <form id="reviewForm" novalidate>
    <h2 id="form-h">{e(s["form"]["title"])}</h2>
    <label for="f-exp">{e(s["form"]["experience"])}</label><textarea id="f-exp" name="experience" rows="4" required></textarea>
    <label for="f-rating">{e(s["form"]["rating"])}</label><select id="f-rating" name="rating" required><option value="">{e(s["form"]["rating_ph"])}</option>{ratings}</select>
    <fieldset><legend class="role">{e(s["form"]["type"])}</legend>{ftypes}</fieldset>
    <div class="form-row"><div><label for="f-name">{e(s["form"]["name"])}</label><input id="f-name" name="name" required autocomplete="name"></div>
    <div><label for="f-email">{e(s["form"]["email"])}</label><input id="f-email" name="email" type="email" required autocomplete="email"></div></div>
    <small>{e(s["form"]["email_help"])}</small>
    <label for="f-month">{e(s["form"]["date"])}</label>
    <div class="form-row"><select id="f-month" name="month" required aria-label="{e(s["form"]["month"])}"><option value="">{e(s["form"]["month"])}</option>{months}</select><select name="year" required aria-label="{e(s["form"]["year"])}"><option value="">{e(s["form"]["year"])}</option>{years}</select></div>
    <p class="form-msg" id="formMsg" role="status" aria-live="polite"></p>
    <div class="form-actions"><button type="button" class="btn btn-ghost" data-close-review>{e(s["form"]["close"])}</button><button type="submit" class="btn btn-primary">{e(s["form"]["submit"])}</button></div>
  </form>
</dialog>

<script>window.HOME={home_json};</script>
<script src="/contents.js?v=2026-11-23b"></script>
<script src="/home.js?v=2026-11-23b"></script>
<script>(function(C,A,L){{let p=function(a,ar){{a.q.push(ar);}};let d=C.document;C.Cal=C.Cal||function(){{let cal=C.Cal;let ar=arguments;if(!cal.loaded){{cal.ns={{}};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true;}}if(ar[0]===L){{const api=function(){{p(api,arguments);}};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){{cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["initNamespace",namespace]);}}else p(cal,ar);return;}}p(cal,ar);}};}})(window,"https://app.cal.com/embed/embed.js","init");</script>
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js" defer onload="emailjs.init('fitJ75sG9o72X64G7')"></script>
<script data-goatcounter="https://healingtouch.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
'''


def main():
    data = json.load(open(os.path.join(ROOT, 'home-content.json'), encoding='utf-8'))
    en, es = data['en'], data['es']
    out = {'en/index.html': page(en, es), 'es/index.html': page(es, en), 'index.html': page(en, es, is_root=True)}
    for path, content in out.items():
        with open(os.path.join(ROOT, path), 'w', encoding='utf-8') as f:
            f.write(content)
        print('wrote', path, len(content), 'bytes')


if __name__ == '__main__':
    main()
