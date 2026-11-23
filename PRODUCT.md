# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audiences, weighted equally:

- **Tourists in Barcelona.** Short stay, find the site via Instagram, Google or Airbnb Experiences, usually book a single session, often in their hotel room. Mostly on mobile, often reading in English. Includes visitors who come to Barcelona for its night life, clubs and festivals and dance all night (internal reference only: never call them "ravers" on the site).
- **Residents of Barcelona.** Come back for repeated sessions and session packs; many arrive with stress, chronic pain or long-term discomfort and want a focused, therapeutic approach.
- **Night-shift workers** (e.g. hospital staff) who need to recover after a night on their feet.
- **Managers and office workers** taking a break between morning and afternoon meetings.
- **Athletes and active people.** Runners, gym-goers, people on their feet all day, looking for leg release and recovery after training (Athlete Recovery protocol).

Their job on the site: recognise their own situation, understand which treatment fits it, trust Riccardo, and book or contact him quickly.

## Product Purpose

Website of **Signature Healing Touch**, the reflexology and massage practice of Riccardo Francescut in Barcelona. It exists to turn visits into bookings and contacts. Success = booked sessions (Cal.com), paid sessions and packs (Stripe), WhatsApp/Instagram/email contacts, and visits to the thank-you page.

## Positioning

- **Energetic approach to reflexology**: work on reflex zones and meridians to rebalance energy flow, not only to relax muscles.
- **Reflexology that is gentle, non-invasive and adapted to you** (approved public wording; do not claim it is risk-free or "cannot hurt").
- **A practitioner shaped by body-mind disciplines**: degree in Cognitive Psychology, Yoga teacher, practitioner of Tai Chi, Qi Gong, Pa Kua Chang (Baguazhang), breathwork and meditation, background in martial arts and Eastern healing traditions; certified reflexologist (ISMET).
- **Range from therapeutic to premium**: targeted reflexology for chronic discomfort, a sport-specific recovery protocol, and long signature rituals (up to 120 min).
- **Real, multilingual social proof**: client reviews since 2020 in many languages.
- **Comes to the client**: sessions in hotels and at home across Barcelona city.

## Operating Context

Where sessions take place:

- **Hotels**: Riccardo is sent to hotel guests by the **Karuna** centre.
- **At home**: house calls to clients within Barcelona city.
- **Travel supplement**: €6 for hotel and home sessions (confirmed 22/11/2026).
- **SLK Alkalina centre**: a treatment room Riccardo rents, Carrer de Sardenya 371, 08025 Barcelona. The address is public (confirmed 22/11/2026): shown on the home "Find the studio" section, in the FAQ and in the schema.org address; use the same NAP on Google Business Profile.
- **Private space by arrangement**: for friends and Airbnb Experiences guests. Never publish its address.

Booking and payment flow (23/11/2026): Executive Detox, Balance and Personalized Signature open a Cal.com calendar; Athlete Recovery, Pure Body and Signature Ritual open a Stripe booking/payment page; packs 3+1 use Stripe payment links; then `thank-you.html`. Direct contact via WhatsApp, Instagram (@SignatureHealingTouch) and email.
Pending (Riccardo): one Stripe "customer chooses what to pay" link to replace some or all of the Stripe links (which ones: not decided yet), and the Stripe pack pages still say 4 months and "Signature Reflexology".

## Capabilities and Constraints

- Static site on GitHub Pages (`main` branch). Home texts live in `home-content.json` and `tools/build-home.py` writes `index.html`, `en/index.html`, `es/index.html` (never edit those by hand); styles `home.css`, behaviour `home.js`; thank-you and privacy add `pages.css`/`pages.js`. Reviews live in `contents.js` (`window.testimonials`, each with a word-for-word `quote`). After every CSS/JS change bump the `?v=` version in `tools/build-home.py`, `thank-you.html` and `privacy.html`. `styles.css`, `script.js`, `i18n.js`, `language-switcher.js`, `theme.js` and `locales/` are no longer loaded by any page.
- **Site languages: English (default and fallback) and Spanish only.** Every text change goes into both. Exception: the rotating hero situations also include Catalan lines (`slides_extra.ca`, shown on both pages after the first logo click; Claude's draft, to be checked by a native speaker); Italian, French, Chinese, Japanese, Polish may be added the same way later.
- Services and prices (in `tools/build-home.py`): Executive Detox 45 min €45; Balance Reflexology 60 min €60; Athlete Recovery 80 min €110; **Personalized Signature** 90 min, regular €90, **launch offer €70** (no end date: Riccardo says when it ends); Pure Body Massage 60 min €100; Signature Ritual 120 min €240. Packs 3+1 (four sessions for the price of three, voucher **valid 1 year** from purchase): Personalized Signature €270, Balance €180, Executive Detox €135. "Step-Up Challenge" promotion.
- One public name per service everywhere (cards, packs, review captions, schema.org): the 90-min one is **Personalized Signature** (decision 23/11/2026).
- Tracking: Google Analytics + Meta Pixel; consent banner still to be done (EU).
- The repo is public: nothing private goes in it.

### Which service answers which need (confirmed by Riccardo, 22/11/2026)

- **Tired (danced all night, night shift, sightseeing all day, break between meetings) → Executive Detox Massage 45 min.** Works on the muscular system plus a short detox procedure. Paired with the Step-Up Challenge.
- **Trained hard (runners, athletes) → Athlete Recovery Reflexology & Leg Release 80 min.**
- **Stressed or anxious → Balance Reflexology Massage 60 min.** Works on the nervous system.
- **Personal ailments → Personalized Signature 90 min.** Personalised: starts with a personal anamnesis, then a deep detox procedure and specific work on the client's issue.
- Pure Body Massage 60 min and Signature Full Body Ritual 120 min: premium experiences outside the need-based path.

**Step-Up Challenge:** clients who show they walked more than 10,000 steps get €5 to €15 off the Executive Detox (10,000+ €40, 20,000+ €35, 30,000+ €30). Purpose: promote walking as a simple way to stay fit. It is the home page's main pact: "the more you walk, the less you pay".

**Hero situations** (23/11/2026): the home opens on one random situation; each books one treatment (`slides_book` in `home-content.json`): most → Executive Detox; "can't switch off after a night shift" and "ten tabs open in your head" → Balance; "today's kilometres" and "came down the mountain" → Athlete Recovery.

**Payment discounts:** cash −20% and crypto (BTC/ADA) −40% apply to single sessions only; session packs have no cash/crypto discount (confirmed 22/11/2026).

**Availability:** sessions are possible in the morning, afternoon and evening, but every client must ask for availability to confirm there is a free slot. Never imply guaranteed times.

**Health wording rules:** never mention panic attacks. Never promise to cure or treat medical conditions; describe what the session works on (muscles, nervous system, reflex points) and what it aims at (rest, calm, balance). Use "gentle, non-invasive and adapted to you"; never "risk-free" or "cannot hurt".

**Open decisions:**

- Exact public name of the Karuna centre and whether to name it on the site.

## Brand Commitments

- Name: **Signature Healing Touch**. Gold logo `logo_wName_transparentBG_newGold.png`.
- **Neon rainbow foot logo** (`logo_white_500x500.png`; with gold wordmark in `logo_wName_transparentBG_newGold.png`): binding. Every version of the site, including the planned redesign, keeps this logo and its glowing continuous-line style.
- Tone: calm, premium, wellness, warm and personal (first person, Riccardo speaking).
- Riccardo's descriptor on this site only: `Cognitive Psychologist | Yoga Master | Reflexologist & Masseur` (the other sites keep the one in CLAUDE.md).
- Instagram: signaturehealingtouch.

## Evidence on Hand

- Real client testimonials in `contents.js` (`window.testimonials`, 29 on 23/11/2026), 2019-2026, in Spanish, English, Italian, Portuguese, Catalan, Dutch, Turkish.
- Certification: ISMET (Instituto Superior de Medicinas Tradicionales).
- Photo: `HT_riccardo.jpg`. Logos in the repo root.
- Prices and durations in `contents.js` (confirmed by Riccardo).
- Not on hand, do not invent: further certifications, hotel or partner logos, press, number of clients, medical outcomes.

## Product Principles

1. Booking is always one tap away, especially on mobile.
2. Speak to each audience's real situation (a long night, a long day, hard training, stress, a personal ailment) and lead it to the one service that fits, without overpromising health results.
3. Trust comes from real people: Riccardo himself, his training and real reviews.
4. English and Spanish are first-class: never a half-translated page.
5. Light, static and fast.

## Accessibility & Inclusion

WCAG AA contrast, alt text, visible focus, correct `lang` per page. Many visitors read in a second language: keep text plain and short.
