# Generation Prompt: Neo Brutalism UI Component Architecture for Next.js & Tailwind CSS

## 1. System Design System & Aesthetic Tokens
You are an expert Frontend Engineer and Tailwind CSS specialist. Your task is to generate clean, semantic Next.js (React) functional components and pages styled strictly in the **Tactile Neo Brutalism UI** design system. You must configure and use the exact color tokens, rigid typography, and border conventions defined below.

### Color Palette Tokens
- **Canvas / Background (`canvas`, `mint-canvas`):** `#EAF4ED` (Pale Mint Mist / Off-White Canvas)
- **Soft Accent / Mint (`mint-soft`, `surface-variant`):** `#8BBB92` (Soft Sage Mint Green)
- **Primary / Active Accent (`jade-vibrant`, `primary`, `primary-container`):** `#2A835F` (Vibrant Jade Green)
- **Secondary / Deep Pine (`pine-deep`, `secondary`):** `#12544F` (Deep Emerald Pine Teal)
- **Base Neutral / Dark Accent (`forest-teal`, `secondary-container`, `tertiary`):** `#092328` (Deep Forest Teal / Midnight Teal)
- **Ink / Strokes / Shadows (`outline`, `black`):** `#000000` (Absolute Solid Black)
- **Card Highlights / High Contrast Containers:** `#FFFFFF` (Pure White)

### Absolute Design Rules
- **Zero-Blur Policy:** Strictly avoid ambient blurs, `backdrop-blur`, and blurred drop shadows (`filter`, `blur-*`).
- **Heavy Ink Borders:** Every panel, card, button, tag, and form element must be framed by solid black borders (`border-4 border-black` for primary cards and buttons; `border-2 border-black` for sub-elements and badges).
- **Tactile Hard Drop Shadows:** Elevations are created exclusively by sharp, unblurred, offset box shadows using solid black:
  - Standard buttons/inputs/cards: `shadow-[4px_4px_0px_0px_#000]`
  - Hero & major section panels: `shadow-[8px_8px_0px_0px_#000]`
  - Micro-elements/badges: `shadow-[2px_2px_0px_0px_#000]`
- **Interactive Push Physics:** Active and hover states must mimic tactile physical push buttons:
  - Hover: `hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]`
  - Active: `active:translate-x-[4px] active:translate-y-[4px] active:shadow-none`
- **Corners & Geometry:** Corners must remain strictly rectangular (`rounded-none` or `rounded-DEFAULT`) with 100% explicit geometry. Do not use rounded pill shapes except for explicit circular avatar icons.
- **Typography:** Built using high-impact grotesque typefaces (`Space Grotesk`, sans-serif) featuring heavy weights, tight tracking, and uppercase styling (`font-black uppercase tracking-tight`).

---

## 2. Layout & Feature Component Specifications

The interface is composed of a fixed top bar, an interactive marquee banner, and a main workspace grid over the `#EAF4ED` canvas.

### A. Navigation & Live Marquee Ticker
- **Fixed Navbar (`bg-[#EAF4ED] border-b-4 border-black`):**
  - Brand identity box with an emblem logo container in Deep Forest Teal (`bg-[#092328]`) and uppercase title (`NEOBRUTAL.UI`).
  - Desktop nav links with active states styled in Deep Forest Teal (`bg-[#092328] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000]`).
  - CTA action button in Vibrant Jade Green (`bg-[#2A835F] text-white border-4 border-black shadow-[4px_4px_0px_0px_#000]`).
- **Live System Ticker:** Full-width running status ribbon with a Jade background (`bg-[#2A835F] border-b-4 border-black`), displaying black geometric markers (`■`, `●`, `★`, `▲`) and monospaced alerts with Mint text on Black (`bg-black text-[#8BBB92]`).

### B. Main Center Hero & Branding
- **Hero Canvas (`bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000]`):**
  - **Rotated Logo Box:** A tilted square container (`bg-[#092328] border-4 border-black shadow-[8px_8px_0px_0px_#000] transform -rotate-2 hover:rotate-0`) with an overlaid "RAW" chip (`bg-[#8BBB92] text-black font-black`).
  - **Typography Block:** Giant uppercase title "NEO BRUTALISM" (`font-black text-6xl tracking-tighter text-black`) paired with bold description text.
  - **Tag/Chip Row:** Multi-color brutalist badges with 4px black borders and 4px offset shadows:
    - "React" (`bg-white text-black font-black`)
    - "Tailwind CSS" (`bg-[#092328] text-white font-black`)
    - "29+ Components" (`bg-[#2A835F] text-white font-black`)
    - "All States" (`bg-[#8BBB92] text-black font-black`)
  - **Quick Terminal CTA:** A stark black code snippet box (`bg-black text-white font-mono`) with a Jade copy button alongside an "Explore System" Jade button (`bg-[#2A835F] text-white font-black`).

### C. Left Action Panel (Jade Green Column)
- **Container:** Wrapped in a large Vibrant Jade box (`bg-[#2A835F] border-4 border-black shadow-[8px_8px_0px_0px_#000]`) with a Forest Teal state chip (`bg-black text-[#8BBB92]`).
- **Button Stack:** 3 vertically stacked full-width push buttons:
  - Button 1 (Soft Mint): Labeled "Primary Button" (`bg-[#8BBB92] text-black`) with a heart icon and index tag `01` (`bg-[#092328] text-[#8BBB92]`).
  - Button 2 (Deep Pine): Labeled "Secondary Action" (`bg-[#12544F] text-white`) with a chat icon and index tag `02` (`bg-[#092328] text-white`).
  - Button 3 (Pale Mint Canvas): Labeled "Accent Feature" (`bg-[#EAF4ED] text-black`) with a star icon and index tag `03` (`bg-[#092328] text-[#8BBB92]`).
- **Embedded Product Card:** White interior card (`bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000]`) featuring a Deep Forest Teal badge, Soft Mint price tag, brutalist horizontal placeholder lines (`#EAF4ED`, `#8BBB92`, `#2A835F`), and a Deep Forest Teal "Add To Cart" button (`bg-[#092328] text-white`).
- **Counter Metrics:** 2-column grid in Pale Mint Canvas (`bg-[#EAF4ED] border-4 border-black shadow-[4px_4px_0px_0px_#000]`) displaying large bold metrics.

### D. Right Utility Panel (Soft Mint Column)
- **Container:** Wrapped in a large Soft Mint box (`bg-[#8BBB92] border-4 border-black shadow-[8px_8px_0px_0px_#000]`) with dark header text.
- **Search Component:** Input field with White fill (`bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_#000]`), absolute search icon, and focus state shifting to `#EAF4ED`.
- **Feature Flags (Toggles & Checkboxes):** White container (`bg-white border-4 border-black`) containing custom checkboxes filled with Deep Forest Teal (`bg-[#092328]`) or Vibrant Jade (`bg-[#2A835F]`) upon check.
- **Dropdown List Context Menu:** Stark context list with harsh black dividers (`border-4 border-black divide-y-4 divide-black`), featuring distinct hover states across `#2A835F`, `#092328`, and `#8BBB92`.
- **Telemetry & Coverage Bars:** Progress trackers inside a Pale Mint Canvas card (`bg-[#EAF4ED]`) using thick 20px progress tracks with explicit fills in Deep Forest Teal (94%), Deep Pine (100%), and Vibrant Jade (78%).

### E. Bottom Bento Showcase & Footer
- **3-Card Bento Row:** Highlights displaying:
  - "Zero CSS Runtime" (`bg-[#12544F] text-white`) with badge `bg-[#8BBB92] text-black`.
  - "Deep Teal & Jade Palette" (`bg-[#2A835F] text-white`) with badge `bg-[#092328] text-white`.
  - "Strict Standards" (`bg-white text-black`) with badge `bg-[#8BBB92] text-black`.
- **Tactile Footer:** Pale Mint base (`bg-[#EAF4ED] border-t-4 border-black`) containing version stamps (`bg-[#092328] text-white`, `bg-[#2A835F] text-white`, `bg-[#8BBB92] text-black`) and quick navigation links.

---

## 3. Technical Target Output
Generate fully typed, semantic React/Next.js components matching the Tailwind theme configuration above. Ensure zero runtime overhead, semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`), fully accessible contrast ratios, and authentic physical button push transitions.