# Tabako mobile UX audit

Audit date: 2026-07-29  
Surface: `https://niuzipai-gif.github.io/tabako/` at a 390 × 844 mobile viewport.

## Overall verdict

The current page is a usable searchable price list, but it does not complete the visitor's real job: identify a pack, understand what it is like, judge whether it is likely to be available, compare how Japanese and Chinese users receive it, and find a plausible seller nearby.

## Step 1 — Landing and browsing

![Current mobile home](./01-current-mobile-home.png)

Health: needs redesign.

- Strength: the page clearly states JPY/CNY and exposes search and product categories.
- UX issue: all 91 products are rendered as one long stream, so the first screen has no recommendation, ranking, nearby-store shortcut, or progressive disclosure.
- UX issue: cards do not open, so the user cannot get details or move toward a purchase location.
- Trust issue: the page calls the exchange rate real-time but does not explain whether product prices, inventory, or images are verified.
- Accessibility risk: the interface lacks skip navigation, result announcements, focus-visible treatment on cards, and an explicit reduced-motion strategy.

## Step 2 — Search for “七星”

![Current mobile search](./02-current-mobile-search.png)

Health: partially healthy.

- Strength: filtering is immediate and the result count updates correctly.
- UX issue: there is no clear reset/filter affordance near the query, no typo/alias support, and no ranking/sort control.
- UX issue: the user can see a pack and price but cannot learn the flavor profile, strength, reviews, likely availability, or where to find it.
- Trust issue: the image credit says it came from a search result, but there is no source detail or product-price verification date.

## Highest-impact changes

1. Turn each product into an accessible detail entry with a mobile bottom sheet and desktop side panel.
2. Make search the main action, then add rankings, flavor/category filters, and nearby-store actions.
3. Separate verified facts from guidance: official/reference price, estimated availability, editorial popularity index, and paraphrased common impressions.
4. Use progressive disclosure so the home screen stays compact while every product can still expose rich details.
5. Add Google Maps search links that include the selected product's Japanese name and a generic nearby tobacco-store fallback.

## Evidence limits

The audit can verify visible UI behavior, content hierarchy, and basic interaction accessibility. It cannot establish live inventory, manufacturer price accuracy, or real user sentiment from screenshots alone. The redesign must label those data boundaries explicitly.
