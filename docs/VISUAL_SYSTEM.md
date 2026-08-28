# Visual System & Design Philosophy

> **Aesthetic Philosophy**: *Restraint over decoration. Calm over complexity.*

Raasta is built to evoke the calm, understated confidence of an Apple product rather than the chaotic, data-dense layout of a traditional government dashboard or hackathon prototype.

---

## 🎨 The Brand Identity: The ‘र’ Mark

The Raasta brand mark is an authentic, modern vector geometry inspired by the Devanagari letter **'र'** (the root of *Raasta* / रास्ता — the road forward):

- **Subtle Top Line (Shirorekha)**: A compact, balanced horizontal bar resting lightly above the upper bowl, honoring classical Indic script calligraphy without visual heaviness.
- **Continuous Fluid Loop & Road Sweep**: The upper loop gracefully transitions into a dynamic diagonal stroke symbolizing a clear path forward.
- **Calm Emblem Anchor**: In the header and home experience, the dark squircle emblem acts as a steady, reassuring anchor.

```text
       ┌──────────────┐
       │   ──────     │   ← Compact Shirorekha
       │    ╭──╮      │   ← Smooth Upper Loop
       │    ╰──╯\     │
       │         \    │   ← Forward Road Sweep
       └──────────────┘
```

---

## 📐 Typographic Hierarchy & Spacing

1. **Hierarchy (The 5 Civic Questions)**:
   - **Page Title**: `text-xl sm:text-2xl font-bold tracking-tight text-stone-950`
   - **Cause Subtitle**: `text-sm sm:text-base text-stone-600 leading-relaxed`
   - **Responsibility Baton**: `text-xs font-semibold uppercase tracking-wider`
   - **Primary Action**: Bold, full-width high-contrast card with explicit single task.
   - **Timeline History**: Clean vertical rail with muted timestamps.

2. **Color Palette (Calm Stone & Restrained Accents)**:
   - **Background**: `bg-stone-50` (soft warm paper)
   - **Cards & Surfaces**: `bg-white` with `border border-stone-200/80` and `shadow-2xs`
   - **Primary Text**: `text-stone-950` (deep ink)
   - **Secondary Text**: `text-stone-600`
   - **Success / Credited**: `emerald-600`
   - **Pending / Action**: `amber-700`
   - **Baton Active**: `stone-900`

---

## ♿ Accessibility & Multilingual Typography

- First-class font rendering for native Indian scripts (Devanagari, Telugu, Tamil, Kannada, Bengali, Gurmukhi).
- High contrast ratios (WCAG AAA compliant for all primary text).
- Audio narration buttons on every card for non-literate accessibility.
- Zero reliance on color alone to convey legal state.
