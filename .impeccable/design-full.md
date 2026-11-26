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

## Overview

**Creative North Star: "The Charge of Light"**

The page is a dark field crossed by one thread of light. It is born under the neon rainbow foot logo, sweeps down the hero as a lattice of many thin close sine curves, gathers into white light points at each situation, draws each treatment's mark in a single gold stroke, and ends at the footer logo. Everything else (type, buttons, frame) stays quiet and thin so the thread carries the movement.

The world is premium and nocturnal by default: pure black ground, lunar gold text, a highlight cream for the one heavy word in each headline. A light theme exists as a full mirror (paper-white ground, violet night ink, deepened strands) and is reached through the logo itself. Density is low: large Bodoni Moda display set italic with one heavy upright word, Barlow body at a comfortable 18px, generous vertical room between stops.

The only photographs are Riccardo's own portraits, feathered into the ground with soft masks. There is no situation photography, stock or AI-generated.

**Key Characteristics:**
- One braided thread of five strand colours on black, never under body copy.
- White light points with a soft pulsing ring mark each stop.
- One-stroke gold treatment marks drawn by scroll, brighter than the strands, which fuse into the mark at its top and bottom.
- Bodoni Moda italic display with one heavy upright word; Barlow body and tracked uppercase labels.
- Thin fixed page frame with two marked corners; square buttons; round logo disc and points.
- Binding neon rainbow foot logo, doubling as the theme switch, governed by a padlock.

## Colors

A black night field lit by a lunar gold voice and a five-colour thread (cyan, gold, violet, lime, aurora) that only the thread, points and marks may wear.

### Primary
- **Lunar Gold** (lunar-gold): the default text colour, frame corners, ghost button border and one of the five strands. The voice of the page.
- **Moonlight Highlight** (moonlight-highlight): the heavy upright headline word, prices, key figures, and the light end of the metallic primary button gradient.

### Secondary
- **Thread Cyan** (thread-cyan): lead strand colour, the glow of the light points, the focus ring, the short line inside the treatment link, the top of each mark's gradient.
- **Dusk Violet** (dusk-violet): strand colour and the outer halo of the light points; the hero wash deepens toward a violet black behind the lattice.

### Tertiary
- **Lime Glint** (lime-glint): strand colour, the Step-Up box border and step figures, review stars.
- **Aurora** (aurora): strand colour and, on dark, the muted text colour for labels, facts and secondary lines.
- **Padlock Amber** (padlock-amber): only the locked padlock state. Light theme uses padlock-amber-deep.

### Neutral
- **Void Black** (void-black): dark ground, logo disc fill, primary button ink.
- **Body Cream** (body-cream): paragraph text on dark, a step softer than lunar gold.
- **Light Point White** (light-point): core of every light point and the bright inner line of each mark.
- **Hairline**: lunar gold at 26% alpha (dark) or night ink at 22% (light) for the frame, dividers, card and pack rules.

### Light theme
- **Paper White** (paper-white) ground, **Night Ink** (night-ink) text, **Night Ink Highlight** for the heavy word, **Body Ink** for paragraphs, **Muted Violet** for labels.
- Strands deepen to thread-cyan-deep, lunar-gold-deep, dusk-violet-deep, lime-glint-deep, aurora-deep; strands draw with normal compositing instead of additive light. Light points take a cyan core.

### Named Rules
**The Thread Owns the Spectrum Rule.** Cyan, violet, lime and aurora appear as strands, point glows, marks and tiny signals (focus ring, link line, stars, Step-Up border). They never fill a surface or a button.

**The One Bright Word Rule.** Moonlight Highlight is reserved for the heavy word of a headline, prices and key figures. Body text never takes it.

## Typography

**Display Font:** Bodoni Moda (serif fallback), optical sizes 6-96, weights 400-900, italic and upright
**Body Font:** Barlow (system-ui, sans-serif fallback), weights 400, 500, 600

**Character:** A high-contrast didone set mostly italic and light (500), broken by one heavy upright word (900) that carries the meaning; a plain, slightly condensed grotesque underneath that never competes.

### Hierarchy
- **Display** (500 italic, clamp 52-108px, line 0.92, -0.03em): hero headline, balanced wrap. Its strong word is upright 900 at 1.2em on its own line.
- **Headline** (500, clamp 44-96px, line 0.95): situation and treatment stops, same italic plus heavy-word pattern.
- **Headline Section** (500, clamp 40-76px): packs, reviews, about, FAQ, contact.
- **Title** (Bodoni Moda 800, 28px): pack names; Step-Up titles are Bodoni Moda italic 600 at 30px; FAQ questions Bodoni Moda clamp 22-30px.
- **Lede** (Barlow 400, 20px, max 44ch): the one-line offer under a headline.
- **Body** (Barlow 400, 18px, line 1.55, max 52ch): paragraphs. Supporting copy drops to 16px.
- **Label** (Barlow, 13px, 0.18em, uppercase): navigation, facts row, price units, treatment links, captions. Figures use tabular numerals.

### Named Rules
**The Italic With One Heavy Word Rule.** Every major headline is Bodoni Moda italic at 500 with exactly one upright 900 word in the highlight colour. Not two, not none.

**The Grotesque Stays Quiet Rule.** Barlow never goes above 600 or larger than 22px; emphasis in body is carried by the highlight colour, not weight.

## Layout

A full-bleed single column on a fixed page frame inset 14px (8px on mobile). Copy sits on a left gutter of 62px; the hero copy column is at most 66% wide (max 1000px) so the right third belongs to the lattice. Stops alternate left and right inside a 1320px container, each about 62vh tall (treatments 78vh), copy at 72% width; the light point sits on the opposite side (88% or 12%). Content sections sit in a 1180px container with 16vh between them.

The thread moves in two registers. Through the situations and treatments it travels freely between anchors. From the lower content sections onward the anchors are quiet: the thread is held in the right gutter and swells only a little between anchors, so it never runs under text.

Below 820px: the header loses the wordmark and all nav items except the language switch; copy moves to a 22px right / 44px left padding so the thread runs in a 14px lane along the left gutter; actions go full width; treatment marks become 150px blocks above their copy; a slim sticky two-part bar (metallic "Instagram" opening @SignatureHealingTouch, then WhatsApp; 12px labels, about 34px tall; it does not book and does not follow the situation, decision 26/11/2026) appears while the visitor scrolls or touches and hides after 2 s idle.

## Elevation & Depth

Flat, with depth made of light rather than shadow. Surfaces never lift. Depth comes from the hero's radial violet-black wash, additive blending of the lattice on dark, the glow of light points, and a soft halo around the marks. Copy over the journey carries a ground-coloured text halo so it reads cleanly near the thread.

### Shadow Vocabulary
- **Button glow** (`box-shadow: 0 12px 36px -14px rgba(255,248,214,.7)`, hover `0 18px 40px -14px rgba(255,248,214,.85)`): primary button only.
- **Light point halo** (`0 0 0 3px rgba(255,255,255,.12), 0 0 18px 6px cyan 70%, 0 0 60px 22px violet 35%`): every light point.
- **Mark halo** (`drop-shadow(0 0 4px rgba(255,248,214,.55)) drop-shadow(0 0 14px cyan 45%)`): treatment marks on dark only.

### Named Rules
**The No Blur on Strands Rule.** Strands and the hero lattice are drawn as plain 1px lines at partial opacity with no blur or glow filter, for performance. Glow belongs to points and marks only.

## Shapes

Hairline geometry. Buttons, pack cells, the Step-Up box, the form and inputs are square (0 radius) with 1px rules. Circles are reserved for the light: the logo disc, the light points and their rings, the portrait chip, the lightbox arrows. The language switch is the one pill (30px). The page frame has two marked corners, top-left and bottom-right, drawn as 18px brackets in the ink colour.

Portraits never show a hard edge: the hero chip uses a radial mask, the About deck a horizontal and vertical feather.

## Components

### Buttons
Metallic and quiet: one bright object per action group.
- **Shape:** square corners (0), uppercase Barlow 600 at 15px, 0.16em tracking, 21px by 32px.
- **Primary:** on dark a gold metallic gradient (115deg, #d9d6a6, moonlight highlight, lunar gold, #c9c58f) with black ink and the button glow. On light it becomes a night-ink violet gradient with cream ink.
- **Hover / Focus:** lifts 2px and the glow strengthens; focus is a 2px cyan outline offset 4px.
- **Ghost:** 1px ink border, transparent, a faint neutral tint on hover. Used for WhatsApp and secondary actions.

### Navigation and logo
- **Header:** fixed inside the frame, fading from the ground to transparent. Tracked 13px uppercase links, 34px apart, a pill language switch with the current language filled in ink.
- **Logo disc:** 52px black circle holding the neon rainbow foot logo (40px); hover adds a faint cyan ring; it spins once when used. In light theme the disc is transparent and the logo lines are deepened by filter so they read on paper white. The footer repeats it at 88px.
- **Wordmark:** the logo's "Signature Healing Touch" lettering (`logo_onlyWords_newGold.png`) used as a CSS mask and painted in the header text colour (`--ink`: light cream on dark, night ink on light), in the header (105x24) and the footer (131x30). Owner decision 23/11/2026: lighter than the original brown-gold.
- **Padlock:** a 30px line icon beside the disc. Unlocked (open shackle, muted colour): the logo switches theme **and** shows another random situation. Locked (closed shackle, padlock amber): the logo keeps the theme and only shows another situation. The choice persists.

### Hero situations
One random "situation" headline per visit (pool in `home-content.json`: `slides` per language, `slides_extra.ca` in Catalan, `slides_book` = the treatment each situation books). The first one is always in the page's language; Catalan lines join only after the first logo click. No arrows, counter or swipe: only the logo changes it, in shuffled order. The heavy word takes its own line only when it starts a new sentence, otherwise it stays inline. Invisible copies of every situation reserve the tallest height (spare space sits above the title), so nothing below jumps. Under the title, the line and the gold Book button follow the booked treatment: the steps pact for Executive Detox, name·minutes·price + its lead for Balance/Athlete; the button reads "Book <treatment> · €<price>". The mobile bar does not follow the situation (Instagram + WhatsApp).

### Light points
A 12px white core (18px for major stops) with the light point halo, and a ring in lunar gold that pulses outward over 3.2s. On light the core turns cyan. Reduced motion stops the pulse.

### Treatment marks (signature)
Six one-stroke figures on a 400 unit canvas, each one continuous line from the top centre to the bottom centre: drop (detox), recovering circle with arrow (athlete), balanced halves (balance), fingerprint spiral (signature), essential figure (pure body), lotus (ritual). Each is drawn as a faint hairline ghost, then a 2.6 width stroke in a cyan to gold to cyan gradient, then a 0.9 width white core, revealed by scroll progress. The thread's strands converge into the mark at its top and bottom anchors and stay clear inside it. Marks sit on a ground-coloured disc (260px desktop, 124px mobile) that is opaque to 46% of the half-diagonal and clear by 53%, so it ends just inside the two anchors and the strands visibly join the mark at top and bottom. Marks never take the light-point fill or halo (in light theme they are line only). On mobile each mark floats beside its text, alternating sides (right for left stops, left for right stops), with the copy wrapping around its circle.

### The thread
Eighteen strands on desktop (nine on mobile, spread about a third of the screen) cycling cyan, gold, violet, aurora, lime at 0.9 width and 60% opacity, braided around one curve through every anchor. A ground-coloured curtain with a soft top fade slides away by transform as the visitor scrolls, revealing the thread. The hero lattice (38 curves desktop, 16 mobile) blends cyan to gold to violet, animates slowly and pauses off-screen. On mobile the light points of the situations alternate sides too, so the braid (wider than a hairline: 22px spread) zig-zags under the text from side to side and through every mark. The texts of situations and treatments (headings, copy, prices, buttons, bridge lines) are written in by the same light: each is revealed top to bottom by a soft mask at the curtain's edge as the visitor scrolls; with reduced motion or without JavaScript everything is visible at once.

### Cards / Containers
- **Packs and reviews:** separate framed boxes (1px line on all sides, ground fill, 28px gaps so the thread shows between them, no radius). On hover or keyboard focus a soft moonlight glow rises (lift 4px, brighter border, warm offset shadow; violet in light theme); on touch screens the box lights up while it crosses the middle of the screen. Packs: price in highlight at 30px, button pinned to the bottom. Reviews: a word-for-word quoted phrase from the review (`quote` in contents.js) in Bodoni italic, then the full text at body size, small lime stars.
- **Step-Up:** a square box with a 1px lime border and lime step figures notched into its top edge.

### Inputs / Fields
Square, 1px hairline border, a 3-4% tint panel, Barlow 16px, labels in tracked 13px uppercase muted. Focus uses the global cyan outline.

### Portraits
Hero chip: 64px circle with radial feather, linking to About. About: a stacked deck of portraits with feathered edges, back cards fanned and faded, opening a lightbox (arrows, arrow keys, tap on the photo for the next, swipe left/right; height in dvh so the mobile arrows stay above the browser toolbar).

## Do's and Don'ts

### Do:
- **Do** keep the ground pure black (void-black) by default and offer the light theme only through the logo disc and padlock.
- **Do** keep the neon rainbow foot logo, unaltered on dark and filter-deepened on a transparent disc in light theme.
- **Do** set every major headline in Bodoni Moda italic 500 with exactly one upright 900 word in the highlight colour.
- **Do** mark each situation with a white light point and pulsing ring, and each treatment with its one-stroke gold mark drawn by scroll.
- **Do** keep the thread in the right gutter through the lower content sections (left lane on mobile), swelling only gently between anchors; in the situations and treatments it zig-zags between alternating light points and marks on every width.
- **Do** show everything complete under reduced motion: thread revealed, marks fully drawn, no pulse, lattice still.
- **Do** keep primary actions as the gold metallic button and secondary actions as the ghost button.
- **Do** feather every portrait edge.

### Don't:
- **Don't** reroute the thread to keep it away from text: strands and the lattice pass under body copy, headlines and buttons (always below them, with the copy's ground-coloured halo keeping it legible), on desktop and above all on mobile.
- **Don't** use stock or AI-generated photography of situations, treatments or places; the only photos are Riccardo's portraits.
- **Don't** apply blur or glow filters to strands or the lattice.
- **Don't** fill surfaces or buttons with cyan, violet, lime or aurora; they belong to the thread.
- **Don't** round buttons, cards or inputs; circles are for the logo disc, points and portraits.
- **Don't** replace, recolour or redraw the foot logo (the wordmark lettering is the one exception: it takes the header text colour).
- **Don't** give treatment marks the light-point fill or halo, and don't let the disc behind a mark cover the points where the thread joins it.
- **Don't** add arrows, counters or swipe to the hero situations: the logo is the only control (owner decision).
