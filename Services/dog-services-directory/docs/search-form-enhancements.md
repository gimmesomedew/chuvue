# Search Form Enhancement Ideas

Below is a checklist of potential UX and technical refinements for the "Where?" controls and overall search experience.

- [x] **Replace toggle with accessible radio-button pills** – keep full keyboard / screen-reader support while preserving pill styling.
- [x] **Animate field transitions** – smoothly fade/slide ZIP input or State dropdown when the option changes to prevent layout jumps.
- [ ] **Auto-detect state from ZIP** – on 5-digit ZIP entry, fetch state and lock it to prevent mismatched combinations.
- [ ] **Expose radius selector when using My Location** – small slider or dropdown (10 / 25 / 50 mi) that only appears for geo searches.
- [x] **Cache geolocation permission & coords** – store coordinates in localStorage with 30-minute TTL for instant reuse.
- [x] **Graceful fallback on geolocation denial** – automatically switch to ZIP mode, focus input, and show tooltip guidance.
- [ ] **Mobile-first toggle layout** – horizontal scroll-snap pills for small screens to keep tap targets large.
- [x] **Debounce ZIP input** – validate only after 5 digits, stripping non-numeric keystrokes. 