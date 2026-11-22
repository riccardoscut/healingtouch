---
name: Signature Healing Touch
description: Reflexology and massage in Barcelona, guided by a neon rainbow foot.
colors:
  deep-space: "#000000"
  lunar-gold: "#E4E4BC"
  light-gold: "#EFEFD4"
  dark-gold: "#C5C59F"
  cosmic-violet: "#755A92"
  dark-violet: "#50406A"
  light-violet: "#9B7CB8"
  aurora-green: "#C2DED5"
  medium-green: "#A3C9BF"
  light-green: "#E8F3F0"
  off-white: "#F8F5F0"
  white: "#FFFFFF"
  light-highlight: "#F0EDE0"
  wordmark-gold: "#EDD483"
  neon-cyan: "#1AE9F0"
  neon-aqua: "#5FF7F2"
  neon-teal: "#29C9AF"
  neon-lime: "#D6D152"
  neon-violet: "#8F7EB5"
  cosmic-red: "#CC0000"
typography:
  display:
    fontFamily: "Rajdhani, sans-serif"
    fontSize: "2.8rem"
    fontWeight: 600
    letterSpacing: "1px"
  headline:
    fontFamily: "Rajdhani, sans-serif"
    fontSize: "2.2rem"
    fontWeight: 600
    letterSpacing: "1px"
  title:
    fontFamily: "Rajdhani, sans-serif"
    fontSize: "1.8rem"
    fontWeight: 600
    letterSpacing: "1px"
  body:
    fontFamily: "Barlow, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  quote:
    fontFamily: "Barlow, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Rajdhani, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 600
    letterSpacing: "1px"
rounded:
  sm: "8px"
  md: "10px"
  pill: "50px"
  circle: "50%"
spacing:
  gutter: "20px"
  card: "30px"
  section: "70px"
  container: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.cosmic-violet}"
    textColor: "{colors.lunar-gold}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 30px"
    width: "100%"
  price-badge:
    backgroundColor: "{colors.aurora-green}"
    textColor: "{colors.deep-space}"
    rounded: "{rounded.pill}"
    padding: "5px 15px"
  service-card:
    rounded: "{rounded.md}"
    padding: "{spacing.card}"
  testimonial-card:
    rounded: "{rounded.md}"
    padding: "{spacing.card}"
  quote-panel:
    rounded: "{rounded.sm}"
    padding: "20px"
  language-switcher:
    backgroundColor: "{colors.deep-space}"
    textColor: "{colors.lunar-gold}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
---

# Design System: Signature Healing Touch

## Overview

**Creative North Star: "The Sole as a Map"**

In reflexology the sole is a map of the whole body: every zone answers to an organ, a system, a feeling. The site borrows that idea. The neon rainbow foot in the logo is the map's legend: one continuous glowing line, colours shifting from violet through lime and gold to cyan, as if energy were flowing through the reflex zones. Everything else on the page should feel like a calm reading of that map: dark, quiet ground; a few luminous lines; clear stations (the services) that the visitor can locate and reach.

Today the site is a single long page, dark by default (`deep-space` ground, `lunar-gold` text) with a light theme (white ground, violet text). Density is low and the tone is soft: rounded cards, pill buttons, italic quotes, thin gradient dividers that scan slowly like a beam of light. Typography pairs a technical, slightly squared display face (Rajdhani) with a plain humanist body face (Barlow).

These rules describe the current system and are to be followed for any change until the planned redesign replaces this file. The redesign must keep the **neon rainbow foot logo and its glowing-line style**; everything else may change.

**Key Characteristics:**
- Neon rainbow foot logo as the one binding visual asset.
- Dark ground by default, light theme available (toggle + system preference).
- Three working colours: Lunar Gold, Cosmic Violet, Aurora Green.
- Rounded, soft containers; pill-shaped actions.
- Slow, light-beam motion (section divider scan, cards rising on scroll).

## Colors

A night palette: black ground, pale moon-gold text, violet for action, misty green for prices and links, with the logo's neon spectrum as the brand's signature.

### Primary
- **Cosmic Violet** (`cosmic-violet`): the action colour. Booking buttons (gradient from Dark Violet), section titles, quote borders, testimonial borders, text colour of the light theme.
- **Dark Violet** (`dark-violet`): start of the button gradient; deep violet text in the light theme.

### Secondary
- **Aurora Green** (`aurora-green`): price badges, links, service titles in dark theme, the green end of section dividers. **Medium Green** (`medium-green`) for durations and secondary card text; **Light Green** (`light-green`) as a pale tint.

### Tertiary
- **Lunar Gold** (`lunar-gold`): the default text colour of the dark theme and the text on violet buttons. **Light Gold** and **Dark Gold** are its tints for glows and borders.
- **Wordmark Gold** (`wordmark-gold`): the colour of the script wordmark "Signature Healing Touch". Lives in the logo images, not in CSS.

### Brand neon (logo spectrum)
- **Neon Cyan, Neon Aqua, Neon Teal, Neon Lime, Neon Violet**: sampled from `logo_white_500x500.png`. The glowing line of the foot moves violet → lime/gold → cyan. Not used in the CSS today; they are the reference for any future use of the logo's light.

### Neutral
- **Deep Space** (`deep-space`): dark-theme background.
- **White** and **Off-White** (`off-white`): light-theme background and cards.
- **Light Highlight** (`light-highlight`): warm pale fill behind quotes in the light theme.
- **Cosmic Red** (`cosmic-red`): discounted prices only.

### Named Rules
**The Three Lights Rule.** Interface colour comes from Lunar Gold, Cosmic Violet and Aurora Green only. Any other hex needs approval (the CSS currently holds about 30 stray values such as `#F4D03F`, `#B8860B`, `#1A73E8`: do not add more).

**The Logo Owns the Rainbow Rule.** The full neon spectrum belongs to the foot logo. Interface elements never reproduce the rainbow gradient as decoration.

**The Gold-on-White Ban.** Lunar Gold on white fails contrast (about 1.3:1). In the light theme, text is violet; gold may appear only as a fill or a glow behind darker text.

## Typography

**Display Font:** Rajdhani (with sans-serif)
**Body Font:** Barlow (with system sans-serif stack)

**Character:** Rajdhani is squared and slightly technical, Barlow is open and plain. The pairing reads modern and calm, never ornamental; all handwritten feeling is left to the logo wordmark.

### Hierarchy
- **Display** (600, 2.8rem, letter-spacing 1px): section titles ("My Services", "What People Say").
- **Headline** (600, 2.2rem): Riccardo's name in the About card; category titles.
- **Title** (600, 1.8rem): service names on cards.
- **Body** (400, 1rem, line-height 1.6): descriptions, contact info.
- **Quote** (400 italic, 1.2rem, line-height 1.7): the approach quote and testimonials.
- **Label** (600, 1.2rem, uppercase, letter-spacing 1px, Rajdhani): button text ("BOOK YOUR MASSAGE").

### Named Rules
**The One Script Rule.** The only script lettering is the wordmark inside the logo image. Never set live text in a script or handwritten font.

## Layout

Single long page, centred container of 1200px with 20px side gutters. Sections have 70px vertical padding and are separated by a 3px gradient divider (transparent → Cosmic Violet → Aurora Green → transparent). Order: promo banner, centred logo and wordmark, About card, services grouped by category (Signature Ritual Experience, Sport Specific Protocol, Reflexology Essentials), Session Packs, testimonials, review form, footer with contacts and quote.

Breakpoints in use: 480px, 768px, 968px, 1200px. On mobile everything stacks in one column; from 968px service cards sit side by side at natural height. Mobile is the main context (Instagram traffic).

Known weakness to respect until the redesign: the logo block plus About card push services well below the fold. Do not add more content above the services.

## Elevation & Depth

Soft and ambient. Cards carry a diffuse shadow (`0 5px 15px` violet-tinted in dark, `0 4px 15px` at 10% violet in light). Glow is reserved for accents: Aurora Green halo around price badges, gold glow on the logo, violet halo on focused or hovered accents. Depth also comes from the dark ground itself: cards sit on a translucent black (`rgba(0,0,0,0.5)`).

### Named Rules
**The Glow Is Light, Not Shadow Rule.** Glows are coloured light (green, gold, violet) and only around small accents. Large surfaces get soft dark shadows, never neon halos.

## Shapes

Gently curved, never sharp. Cards and panels: 10px (quotes 8px). Buttons, price badges, language switcher: full pills (50px). Portrait photo: circle. Thin 1px borders in translucent gold (dark) or translucent violet (light). The circle and the continuous curved line echo the logo.

## Components

### Buttons
- **Shape:** full pill (`rounded.pill`), up to 300px wide, full width on mobile.
- **Primary:** 45° gradient Dark Violet → Cosmic Violet, Lunar Gold uppercase Rajdhani label, 12px 30px padding, soft dark shadow.
- **Hover / Focus:** 0.3s ease transition; lift and brighter glow. Focus must stay visible.
- **Secondary:** "Show all reviews" and "Share your experience" use the same violet pill at smaller size.

### Price badge
Aurora Green pill, black bold text (1.6rem), pinned to the top-right corner of the service card, with a soft green glow. Discounted prices show the original value and the new one in Cosmic Red.

### Cards / Containers
- **Service card:** 10px corners, translucent black (dark) or white (light), 1px translucent border, soft shadow; title, duration, divider, description, special-offers box, booking button. Rises 30px and fades in when scrolled into view.
- **Testimonial card:** 10px corners, 1px Cosmic Violet border (Lunar Gold when featured), 30px padding, centred italic text, gold stars, service and date in small caps. Lifts 5px on hover.
- **Quote panel (About):** 8px corners, 3px Cosmic Violet left border, italic text.

### Navigation
No menu. A floating pill language switcher (EN | ES) top-right: translucent black with blur, Lunar Gold text, active language in a violet pill. Theme toggle alongside. A dismissible violet promo banner sits above everything.

### Signature: the neon foot
The logo (`logo_white_500x500.png` in the header, `logo_wName_transparentBG_newGold.png` with wordmark in the footer, `logo_onlyWords_newGold.png` for the wordmark alone) is centred at the top, max 300px. It is the brand's single most recognisable element.

## Do's and Don'ts

### Do:
- **Do** keep the neon rainbow foot logo and its glowing continuous-line style in every version of the site, including the redesign.
- **Do** use Cosmic Violet for every booking action, so the next step is always the same colour.
- **Do** keep price badges in Aurora Green with black text.
- **Do** check every text colour against both themes (WCAG AA).
- **Do** keep motion slow and soft (0.3s ease for states, 8s for the divider scan) and respect `prefers-reduced-motion`.

### Don't:
- **Don't** put Lunar Gold or Wordmark Gold text on a white background.
- **Don't** paint gradient bands behind headings that cut through the text (current light-theme category and card titles do this; do not copy it).
- **Don't** reproduce the logo's rainbow as a decorative gradient on buttons, cards or backgrounds.
- **Don't** add new colours, radii or breakpoints outside this file without approval.
- **Don't** use a script font for live text.
