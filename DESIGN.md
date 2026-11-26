---
name: Signature Healing Touch
description: Reflexology in Barcelona as a charge of light, one thread from the neon foot logo to the booking.
colors:
  void-black: "#000000"
  lunar-gold: "#E4E4BC"
  moonlight-highlight: "#FFF8D6"
  body-cream: "#EFEEDD"
  aurora: "#C2DED5"
  thread-cyan: "#1AE9F0"
  dusk-violet: "#9B7CB8"
  lime-glint: "#D6D152"
  light-point: "#FFFFFF"
  padlock-amber: "#A8792A"
  paper-white: "#FBFAF5"
  night-ink: "#2A1F3A"
  night-ink-highlight: "#120B1C"
  body-ink: "#2E2838"
  muted-violet: "#5E4A7A"
  thread-cyan-deep: "#00A3AD"
  lunar-gold-deep: "#A8902A"
  dusk-violet-deep: "#6A4C93"
  lime-glint-deep: "#7F8E12"
  aurora-deep: "#3E8C79"
  padlock-amber-deep: "#7A5414"
typography:
  display:
    fontFamily: "'Bodoni Moda', serif"
    fontSize: "clamp(52px, min(6.6vw, 11.5vh), 108px)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.03em"
  display-heavy:
    fontFamily: "'Bodoni Moda', serif"
    fontSize: "1.2em"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Bodoni Moda', serif"
    fontSize: "clamp(44px, 6vw, 96px)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline-section:
    fontFamily: "'Bodoni Moda', serif"
    fontSize: "clamp(40px, 4.8vw, 76px)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Bodoni Moda', serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.05
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  lede:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    letterSpacing: "0.18em"
  button:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.16em"
rounded:
  none: "0px"
  pill: "30px"
  full: "50%"
spacing:
  frame-inset: "14px"
  frame-inset-mobile: "8px"
  gutter: "62px"
  gutter-mobile: "22px"
  thread-lane-mobile: "44px"
  stack-sm: "12px"
  stack-md: "22px"
  stack-lg: "34px"
components:
  button-primary:
    backgroundColor: "{colors.moonlight-highlight}"
    textColor: "{colors.void-black}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "21px 32px"
  button-primary-light:
    backgroundColor: "{colors.night-ink}"
    textColor: "{colors.moonlight-highlight}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "21px 32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.lunar-gold}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "21px 32px"
  logo-disc:
    backgroundColor: "{colors.void-black}"
    rounded: "{rounded.full}"
    size: "52px"
  light-point:
    backgroundColor: "{colors.light-point}"
    rounded: "{rounded.full}"
    size: "12px"
  language-switch:
    textColor: "{colors.lunar-gold}"
    rounded: "{rounded.pill}"
    padding: "3px"
  input:
    textColor: "{colors.lunar-gold}"
    rounded: "{rounded.none}"
    padding: "12px"
---

# Design System: Signature Healing Touch

<!-- impeccable:design-map -->
Name: Signature Healing Touch
Colors: primary: lunar-gold #E4E4BC; secondary: thread-cyan #1AE9F0; tertiary: aurora #C2DED5; neutral: void-black #000000; primary: moonlight-highlight #FFF8D6; primary: lunar-gold-deep #A8902A (+15 more in the sidecar)
Fonts: Bodoni Moda (display, display-heavy, headline, headline-section, title); Barlow (body, lede, label, button)
Spacing: frame-inset 14px, frame-inset-mobile 8px, gutter 62px, gutter-mobile 22px, thread-lane-mobile 44px, stack-sm 12px, stack-md 22px, stack-lg 34px
Radius: none 0px, pill 30px, full 50%
North Star: "The Charge of Light"
Rules:
- The Thread Owns the Spectrum Rule. Cyan, violet, lime and aurora appear as strands, point glows, marks and tiny signals (focus ring, link line, stars, Step-Up border).
- The One Bright Word Rule. Moonlight Highlight is reserved for the heavy word of a headline, prices and key figures.
- The Italic With One Heavy Word Rule. Every major headline is Bodoni Moda italic at 500 with exactly one upright 900 word in the highlight colour.
- The Grotesque Stays Quiet Rule. Barlow never goes above 600 or larger than 22px; emphasis in body is carried by the highlight colour, not weight.
- The No Blur on Strands Rule. Strands and the hero lattice are drawn as plain 1px lines at partial opacity with no blur or glow filter, for performance.
Elevation:
- Button glow: 0 12px 36px -14px rgba(255,248,214,.7)
- Light point halo: 0 0 0 3px rgba(255,255,255,.12), 0 0 18px 6px cyan 70%, 0 0 60px 22px violet 35%
- Mark halo: drop-shadow(0 0 4px rgba(255,248,214,.55)) drop-shadow(0 0 14px cyan 45%)
- Box glow (packs, reviews on hover/focus or mid-screen on touch): lift 4px, 0 18px 64px -16px moonlight 42% + 0 10px 34px -16px cyan 40%; violet in light theme
Don't:
- Don't reroute the thread to keep it away from text: strands and the lattice pass under body copy, headlines and buttons (always below them, with the copy's ground-coloured halo keeping it legible), on desktop and above all on mobile.
- Don't use stock or AI-generated photography of situations, treatments or places; the only photos are Riccardo's portraits.
- Don't apply blur or glow filters to strands or the lattice.
- Don't fill surfaces or buttons with cyan, violet, lime or aurora; they belong to the thread.
- Don't round buttons, cards or inputs; circles are for the logo disc, points and portraits.
- Don't replace, recolour or redraw the foot logo; only the wordmark lettering takes the header text colour.
- Don't give treatment marks the light-point halo; the disc behind a mark ends inside the thread's joins.
- Don't add arrows, counters or swipe to the hero situations: the logo is the only control.
Do:
- Do keep the ground pure black (void-black) by default and offer the light theme only through the logo disc and padlock.
- Do open the home on one random situation in the page's language; the line under it and the hero Book button follow the treatment it books (slides_book).
- Do keep the slim mobile bar as Instagram (metallic, primary) + WhatsApp; it never books and never changes with the situation.
- Do let the gallery lightbox move by arrows, keys, tap on the photo and swipe; on mobile the arrows sit above the browser toolbar.
- (+7 more)
Full: .impeccable/design-full.md (read a section when you need its detail)
