# Tabako AI concierge and image-first catalog

Date: 2026-07-29
Primary surface: mobile web, enhanced for desktop
Deployment: existing GitHub Pages URL

## Product outcome

Help an adult Chinese traveler in Japan finish the whole “recognize, understand, ask, and locate” task even when the local catalog has no exact match:

1. Recognize a pack from a clear, uncropped image or a photo upload.
2. Compare likely matches, reference prices, taste direction, strength, and channel availability.
3. Ask for a recommendation in natural Chinese and keep the answer grounded in the local catalog.
4. Show a cashier a polite Japanese request card without needing an AI connection.
5. Continue to current web sources when the 91-product local catalog has no result.

The site remains an adult travel-information guide. It does not sell tobacco, claim live store inventory, infer health safety, or treat AI output as verified fact.

## Selected direction

Use an image-first “travel shelf” catalog with an AI concierge layered over the existing Tobacco Compass design.

- Product packs become the visual anchor: a consistent portrait stage, centered containment, quiet background, and larger detail imagery.
- The compact list becomes a responsive two-column visual grid on mobile and a denser multi-column grid on wider screens.
- A small “AI 找烟” entry in the search area opens one bottom sheet with three task tabs: preference search, photo recognition, and Japanese cashier card.
- Zero local results show a useful recovery path instead of a dead end: current web search through the secure proxy when available, plus direct Google/JT searches that require no key.
- AI answers must point back to catalog product IDs when recommending local products, clearly label web-derived information, and show source links when web search is used.

## AI capability design

### AI 找烟

The user describes taste, strength, budget, device, or a remembered package color. The browser sends only the prompt and a compact catalog index to the proxy. MiniMax returns:

- a short answer in Chinese;
- up to three catalog product IDs;
- a reason for each match;
- a confidence note and a reminder that availability is not live.

If the proxy is not configured or unavailable, the interface keeps working with a local deterministic matcher based on query, flavor, strength, price, and popularity.

### 拍照识烟

The user selects a pack photo. The browser:

- rejects non-image files and files over 4 MB;
- previews the image locally;
- sends a compressed data URL only after the user presses “开始识别”;
- asks MiniMax-M3 to identify visible brand/name/packaging cues and return likely catalog IDs;
- deletes the in-memory image reference when the dialog closes.

The UI states that the photo is sent to the configured AI service for recognition and is not uploaded when the proxy is unavailable.

### 日语沟通卡

For any catalog product, the site can generate a large, offline Japanese card:

`「[商品日文名]」はありますか？ 一箱お願いします。`

It also shows a Chinese explanation and a copy button. AI can optionally adapt the sentence for carton quantity, alternatives, or a request to see the package, but the offline template is always available.

### 零结果联网补搜

When local search returns zero:

- preserve the exact query;
- offer “联网查最新信息” through the proxy;
- offer no-key Google Images, Google web, and JT-site searches;
- show results inside a dedicated sheet with title, snippet, domain, and external link;
- explicitly label web results as unverified leads, not stock or price promises.

MiniMax web search uses the official Anthropic-compatible Messages API server tool. Image recognition and normal recommendations use the official OpenAI-compatible Chat Completions endpoint with MiniMax-M3.

## Security architecture

GitHub Pages is a public static host, so the MiniMax API key must never be placed in HTML, JavaScript, GitHub Actions output, repository variables rendered into the build, query parameters, or browser storage.

The browser talks only to a user-deployed serverless proxy:

- public configuration contains only the proxy URL;
- the proxy reads `MINIMAX_API_KEY` from a server-side secret;
- allowed origin defaults to `https://niuzipai-gif.github.io`;
- request bodies are size-limited and modes are allow-listed;
- image data is accepted only for the recognition mode;
- responses are normalized before returning to the browser;
- rate limiting should be enabled at the hosting layer.

The key shared in chat is treated as compromised and must be revoked before a replacement is configured.

## Image and layout rules

- Product images use `object-fit: contain`; no pack is cropped to fill a box.
- The mobile card image stage is approximately 4:5, with the pack occupying at most 76% of the stage.
- The card title and price stay visible without opening detail; popularity and detailed traits move into a compact metadata row.
- The detail image stage is at least 280 px tall on mobile and uses a subtle zoom-in transition on open.
- Brand/category tint is derived from existing category data, not from invented product artwork.
- Missing images fall back to the existing branded neutral state; no unrelated substitute image is shown.
- Animation uses transform/opacity only and respects `prefers-reduced-motion`.

## Trust and policy boundaries

- AI recommendations are informational and restricted to adults 20+.
- No answer claims a product is safer or healthy.
- Restricted e-liquid items never receive store, map, or purchase suggestions.
- “Inventory” remains an editorial availability estimate; AI cannot upgrade it to live stock.
- Web results are leads and always open at the original source.
- Product and audience impressions remain paraphrased guidance, not fabricated quotes.

## Acceptance checks

- At 390 × 844, the first screen exposes search, category chips, nearby action, AI entry, ranking preview, and image-first product cards without horizontal overflow.
- Product pack images remain uncropped at mobile and desktop widths.
- Local zero-result search exposes the exact query and working external-search fallbacks.
- The AI sheet supports text, image, and Japanese-card modes with keyboard and screen-reader labels.
- With an empty proxy URL, local recommendations, external search links, and Japanese cards still work.
- With a mocked proxy, recommendations, image recognition, and web results render only normalized text and links.
- Repository and built assets contain no API key patterns.
- Existing search, filters, rankings, favorites, details, Maps links, PWA behavior, and restricted-product safeguards continue to pass.
- The original GitHub Pages URL serves the redesign after `main` is pushed.
