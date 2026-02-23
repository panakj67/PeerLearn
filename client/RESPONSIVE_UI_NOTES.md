# UI Refactor Snapshot (Before vs After)

## Before
- Global layout used fixed page padding (`px-28`) that caused cramped space on small screens.
- Navbar had no mobile navigation drawer/hamburger interaction.
- Home page used fixed widths/absolute values that overflowed on mobile.
- Login modal and cards had limited accessibility/focus affordances.

## After
- Introduced reusable layout primitives (`Container`, `Section`, `Grid`) for consistent spacing and responsive structure.
- Added responsive, sticky navbar with mobile menu, integrated search, and improved interaction states.
- Refactored home page sections to responsive grid/flex patterns with fluid typography and reduced overflow risk.
- Upgraded modal, cards, and browse filters with clearer hierarchy, keyboard support, and visible focus ring.
- Added design tokens and utility classes in `index.css` for consistency (`surface`, `focus-ring`, `text-fluid-*`).
