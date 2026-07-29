# Design QA — carton identity, AI progress, and ranking feed

Status: Passed

## Compared states

- Mobile home, 390 × 844: source capture and final implementation were reviewed together in `docs/audit/compare-home-reference-final.jpg`.
- Mobile AI concierge, 390 × 844: source capture and final implementation were reviewed together in `docs/audit/compare-ai-reference-final.jpg`.
- Mobile ranking feed, 390 × 844: reviewed in `docs/audit/08-ranking-mobile.jpg`.
- Desktop ranking feed, 1280 × 900: reviewed in `docs/audit/09-ranking-desktop.jpg`.

## Findings

- Preserved the existing warm editorial palette, serif display type, rounded controls, soft borders, and restrained motion language.
- Seven Stars soft pack and hard box now use distinct images and explicit package labels.
- Product detail keeps the single-pack and `一カートン` identities in separate cards, with source and verification status visible.
- Unverified carton images are not substituted with unrelated pack images; the UI exposes an exact image-search query and source instead.
- Every unsourced single-product image is explicitly marked “图片待核对” and includes a non-empty caution note.
- Device bodies, heated-tobacco boxes, and pods use their own identity labels instead of being mislabeled as a cigarette “单包”.
- The AI execution card remains in view while matching and shows a real stage list, percentage, terminal state, and privacy-safe blocked state for unconfigured photo recognition.
- The full ranking is a dedicated top-to-bottom feed with Japanese and Chinese-tourist audience controls.
- No horizontal page overflow was detected at 390 px or 1280 px.
- No missing product images were detected in the ranking smoke check.

## Corrections made during QA

- Kept the mobile “完整排行” action inside the viewport.
- Prevented result rendering from automatically scrolling the AI progress card out of view.
- Removed artificial stage delays and opaque upstream claims; progress now changes only at real local-match, request-sent, response-received, mapping, and terminal boundaries.
- Corrected the carton search wording from `10箱` to `10包`.
