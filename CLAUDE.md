# Megan & Daniel's Wedding Website

Static site for a wedding at Sandon Hall, Staffordshire (14th August 2027, 1:30pm).
Plain HTML/CSS/vanilla JS — no build tools, no frameworks. Open any `.html` file
directly in a browser to preview.

## Structure

- `index.html` — Home: hero with framed couple photo, countdown, welcome text
- `schedule.html` — Order of the day (timeline: ceremony → carriages)
- `venue.html` — About Sandon Hall, address, map placeholder, hotels, taxis, parking
- `rsvp.html` — RSVP form (name, attending, guests, dietary, song)
- `styles.css` — shared stylesheet (single file, CSS custom properties for palette)
- `script.js` — mobile nav toggle, countdown timer, RSVP form submit handling
- `assets/` — images

## Design system

Country-house palette inspired by sandonhall.co.uk: ivory/cream base, charcoal
text, sage green as a secondary accent, gold as the primary decorative accent
(dividers, buttons, timeline dots), deep forest-green used only for the footer
band. Fonts: Playfair Display (headings) + Jost (body), loaded via Google Fonts.
All palette values are CSS custom properties in `:root` at the top of `styles.css`.

The homepage hero shows the couple's photo as a **framed portrait insert**
(not a full-bleed background) — a full-bleed `background-size: cover` was tried
first and rejected because it crops portrait photos into unrecognisable strips
on wide/short hero bands. Framed insert avoids that entirely.

## Known gotcha: `sips` HEIC/PNG/JPEG rotation bug

When converting an iPhone HEIC photo, `sips -r 90` (or any rotation) can leave
this machine's images looking correct in previews but rotated wrong in real
browsers. Two distinct causes were hit and fixed while building this site:

1. **Leftover EXIF/XMP orientation metadata** — even after physically rotating
   pixels, the original HEIC's orientation tag can survive into the output
   (as a PNG `eXIf`/`iTXt` chunk, or JPEG EXIF), causing EXIF-aware browsers to
   rotate an already-correct image a second time.
2. **A genuine `sips` encoder bug**: converting a *tall* (portrait) PNG to JPEG
   can silently scramble the pixel order, with no orientation tag involved at
   all — reproducible and confirmed on this machine.

If you need to rotate/reprocess a photo again: convert HEIC → PNG, rotate the
PNG in its own isolated step, verify visually, and if the source is portrait,
**keep the final file as PNG rather than converting to JPEG**. Strip any
`eXIf`/`iTXt` PNG chunks before use (see git history around the
"Fix couple photo orientation" commit for the chunk-stripping approach).

## Git / GitHub

- Repo: `adamgrew77/megs-wedding`, currently **private**
- GitHub Pages was enabled at `https://adamgrew77.github.io/megs-wedding/` but
  **Pages requires the repo to be public** on the free plan — it silently stops
  working whenever the repo is set back to private. Re-enable with:
  `gh repo edit adamgrew77/megs-wedding --visibility public --accept-visibility-change-consequences`
  then `gh api repos/adamgrew77/megs-wedding/pages -X POST -f "source[branch]=main" -f "source[path]=/"`
- Auth is via `gh` CLI (`gh auth login` already completed); git push uses `gh`
  as the credential helper (`gh auth setup-git`)
- `http.postBuffer` was bumped locally (`git config http.postBuffer 157286400`)
  after a push failed on a ~1.6MB PNG

## Still placeholder / not yet real

- Couple's full legal names (Megan Jane Grew, Daniel Fred Williams) — only
  first names ("Megan & Daniel") are shown on the site so far
- "About Sandon Hall" copy on `venue.html` — a real Sandon Hall photo is in
  place (`assets/sandon-hall.jpg`) but the description text is still placeholder
- Google Maps embed on `venue.html` — placeholder div with instructions
  commented in the HTML for where to paste a real embed `<iframe>`
- Hotels (3) and taxi firms (2) on `venue.html` — placeholder names/numbers
- RSVP form has **no backend** — submitting just shows a client-side "Thank
  You" message (see comment in `script.js`/`rsvp.html`); needs to be pointed at
  a service like Formspree or Google Forms to actually collect responses
- A second Sandon Hall photo (conservatory/orangery) was found but not yet used
  anywhere — available at the original source if wanted
