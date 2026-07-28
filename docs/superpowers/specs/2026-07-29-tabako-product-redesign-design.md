# Tabako product redesign

Date: 2026-07-29  
Primary surface: mobile web, enhanced for desktop  
Deployment: existing GitHub Pages URL

## Product outcome

Help an adult Chinese traveler in Japan answer four questions quickly:

1. Is this the cigarette I am looking at?
2. What is the current reference price and what does it taste/feel like?
3. How popular is it among Japanese users and Chinese visitors?
4. Where nearby might carry it?

The site remains an informational guide. It does not sell tobacco, claim live store inventory, or present editorial scores as measured market research.

## Explored directions

### Tobacco Compass

Search-first, calm Apple-inspired layout with one compact result list, bilingual names, prices, estimated availability, and dual-audience popularity at scan level.

Strengths: fastest path for travelers; clearest information hierarchy; best fit for one-handed mobile use.

### Shelf Lens

Image-led two-column catalog with denser product comparison and a large detail sheet.

Strengths: strongest visual recognition and browsing. Trade-off: denser, slower for users who already know a name.

### Near & Know

Map-first layout with a location surface and a draggable product sheet.

Strengths: makes “where can I buy it?” primary. Trade-off: a static site cannot provide verified live inventory or a native embedded Google Maps data layer without API credentials.

## Selected direction

Build Tobacco Compass as the base and borrow two proven ideas:

- Shelf Lens's strong pack photography and detail sheet.
- Near & Know's explicit nearby-store action and “not live” availability language.

This hybrid best resolves the user's main pain points without pretending the static site has data it cannot verify.

## Information architecture

### Home

- Compact brand statement and trust note.
- Sticky bilingual search.
- Primary “find nearby sellers” action.
- Category and flavor filters.
- Segmented popularity ranking: Japan / Chinese visitors.
- Searchable, sortable product catalog.

### Product detail

Presented as a mobile bottom sheet and desktop side panel.

- Pack image, Japanese name, Chinese name, category, compatibility where relevant.
- Reference JPY price and live JPY-to-CNY conversion.
- Flavor, strength, tar/nicotine where known, and a short characteristic summary.
- Likely availability level with plain-language evidence boundary.
- Japanese and Chinese popularity index, each out of 5.
- Paraphrased “common impressions” for both audiences, not fabricated quotes.
- Suggested seller types.
- Product-specific Google Maps search and a generic nearby tobacco-store search.
- Official/source links when available.

### Rankings and saved items

- Japan and Chinese-visitor rankings use the same catalog and can be switched without navigation.
- Favorites persist locally in the browser.
- No account, tracking profile, or server is required.

## Data rules

- `referencePrice`: current manufacturer/official retail reference where verified; otherwise clearly marked as a guide price.
- `priceChecked`: visible per product or source group.
- `stock`: one of `widely-available`, `likely`, `specialist`, or `discontinued`; always described as an estimate, never live inventory.
- `jpScore` and `cnScore`: editorial guide index based on brand prominence, distribution breadth, and traveler recognition. The methodology is disclosed.
- Audience impressions are paraphrased patterns, never direct unsourced quotations.
- Current authoritative price corrections include Mevius ¥580, Seven Stars ¥600, TEREA ¥620, SENTIA ¥570, Ploom Mevius ¥550, Ploom Camel ¥530, and Camel Craft ¥470 as of 2026-07-29.
- Devices and non-Japanese e-vapor products are retained as separate categories and labeled for channel availability.

## Visual system

- Warm off-white page with near-black type and one restrained tobacco-amber accent.
- Chinese/Japanese system-font stack for fast loading and native legibility.
- 16px body baseline, 44px minimum touch targets, high-contrast focus rings.
- Surfaces separated by spacing and hairlines before shadows.
- Product photography stays prominent and uncropped where possible.
- Motion uses spring-like cubic Bézier timing for sheets, pressed states, and ranking changes.
- `prefers-reduced-motion` removes non-essential movement.

## Interaction model

- Search matches Japanese names, Chinese names, brands, categories, flavor aliases, and prices.
- Filters and sort update a live result count announced to assistive technology.
- Tapping a row opens detail; Escape, close button, backdrop, or browser Back closes it.
- Focus moves into the sheet and returns to the triggering card on close.
- Favorite buttons are explicit controls and do not accidentally open details.
- Google Maps opens in a new tab with a Japanese search query for higher local-result quality.

## Responsive behavior

- Mobile: single-column list, sticky search/filter controls, bottom-sheet detail.
- Tablet: two-column catalog where space allows.
- Desktop: compact left discovery rail, two-column results, right-side detail panel with the catalog still visible.

## Reliability and performance

- Static HTML/CSS/JavaScript remains compatible with GitHub Pages and the current URL.
- Local images are lazy-loaded; failed images fall back to a branded neutral surface and never to unrelated random photos.
- Exchange-rate fetch has a timestamped fallback.
- A service worker caches the shell and product images after first load.
- No location permission is required; Google Maps can use its own location context after the user opens it.

## Acceptance checks

- Search, category, flavor, sort, ranking toggle, favorites, detail open/close, Back behavior, and Google Maps links work.
- No horizontal scrolling at 390 × 844.
- Keyboard focus is visible and sheet focus behavior is correct.
- Product images preserve aspect ratio.
- Data boundaries for price, stock, ratings, and impressions are visible.
- Layout is checked at mobile and desktop viewports.
- GitHub Pages workflow completes after the main-branch push and the original URL serves the new build.
