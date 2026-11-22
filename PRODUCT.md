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

Booking and payment flow: service cards → Cal.com booking (event slug = service `id` in `contents.js`) → Stripe payment links for sessions and packs → `thank-you.html`. Direct contact via WhatsApp, Instagram (@SignatureHealingTouch) and email.

## Capabilities and Constraints

- Static site on GitHub Pages (`main` branch), no build step. Content lives in `contents.js` (English fallback) and `locales/en.json` / `locales/es.json` (what visitors actually see).
- **Site languages: English (default and fallback) and Spanish only.** Every text change goes into both locales.
- Services on hand (from `contents.js`): Pure Body Massage 60 min, Signature Full Body Ritual 120 min, Athlete Recovery Reflexology & Leg Release 80 min, Signature Reflexology Massage 90 min, Balance Reflexology Massage 60 min, Executive Detox Massage 45 min; session packs; "Step-Up Challenge" promotion.
- Tracking: Google Analytics + Meta Pixel; consent banner still to be done (EU).
- The repo is public: nothing private goes in it.

### Which service answers which need (confirmed by Riccardo, 22/11/2026)

- **Tired (danced all night, night shift, sightseeing all day, break between meetings) → Executive Detox Massage 45 min.** Works on the muscular system plus a short detox procedure. Paired with the Step-Up Challenge.
- **Trained hard (runners, athletes) → Athlete Recovery Reflexology & Leg Release 80 min.**
- **Stressed or anxious → Balance Reflexology Massage 60 min.** Works on the nervous system.
- **Personal ailments → Signature Reflexology Massage 90 min.** Personalised: starts with a personal anamnesis, then a deep detox procedure and specific work on the client's issue.
- Pure Body Massage 60 min and Signature Full Body Ritual 120 min: premium experiences outside the need-based path.

**Step-Up Challenge:** clients who show they walked more than 10,000 steps get €5 to €15 off the Executive Detox. Purpose: promote walking as a simple way to stay fit.

**Payment discounts:** cash −20% and crypto (BTC/ADA) −40% apply to single sessions only; session packs have no cash/crypto discount (confirmed 22/11/2026).

**Availability:** sessions are possible in the morning, afternoon and evening, but every client must ask for availability to confirm there is a free slot. Never imply guaranteed times.

**Health wording rules:** never mention panic attacks. Never promise to cure or treat medical conditions; describe what the session works on (muscles, nervous system, reflex points) and what it aims at (rest, calm, balance). Use "gentle, non-invasive and adapted to you"; never "risk-free" or "cannot hurt".

**Open decisions:**

- Exact public name of the Karuna centre and whether to name it on the site.

## Brand Commitments

- Name: **Signature Healing Touch**. Gold logo `logo_wName_transparentBG_newGold.png`.
- **Neon rainbow foot logo** (`logo_white_500x500.png`; with gold wordmark in `logo_wName_transparentBG_newGold.png`): binding. Every version of the site, including the planned redesign, keeps this logo and its glowing continuous-line style.
- Tone: calm, premium, wellness, warm and personal (first person, Riccardo speaking).
- Riccardo's descriptor where it appears: `Data Scientist | AI Modeler | Cognitive Psychologist | Reflexologist`.
- Instagram: signaturehealingtouch.

## Evidence on Hand

- Real client testimonials in `contents.js` (`window.testimonials`), 2020-2025, in Spanish, English, Italian, Portuguese, Catalan, Dutch, Turkish.
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
