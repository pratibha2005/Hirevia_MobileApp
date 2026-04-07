# HireVia UI/UX Roadmap

This roadmap outlines the evolution of the HireVia application from a "Static Minimalist" interface to a **"Living Minimalist"** experience. All design decisions follow the "Pure Matte" aesthetic (#F3F3F3 / #1A1A1A).

## 1. Global Refinement (The System Layer)
- **Centralized Design Tokens**: Standardize all HSL-tailored colors, spacing, and typography into a unified library (`src/theme/tokens.ts`).
- **Tactile Feedback**: Integrate `expo-haptics` to add physical weight to interactions (Light for taps, Medium for success).

## 2. Screen-by-Screen Enhancements

### 🏠 Home Feed
- **Elastic Carousels**: Implement Snap-to-Center behavior and Parallax image depth for the job discovery cards.
- **Interactive Pulse Chart**: Transform the market bar chart into an interactive element with Glassmorphism tooltips.
- **Micro-Animations**: Add floating/hover states for the "In Motion" status cards.

### 🔍 Search screen
- **Inline Reveal Extension**: Sync the "Inline Reveal" animation with standardized padding and typography.
- **Bespoke Empty States**: Replace generic illustrations with brand-aligned "Zen" empty states.

### 📄 Job Details
- **Frosted Morph Header**: Implement a scroll-reactive header that melts into a BlurView as the user scrolls.
- **Animated CTAs**: Add spring-loaded entrances for the primary "Apply" button.

### 🧔 Profile Screen
- **Mastery Surge**: Animate the profile completion bar every time the screen focuses to visualize progress.
- **Active Timeline**: Add geometric pulsing nodes for current/present job entries.

## 3. High-End Transitions
- **Shared Element Transitions**: Morph job cards into full-screen details with fluid image flying.
- **Elastic Stack**: Utilize Spring-based overshoot transitions instead of standard linear slides.

---

**Current Status**: Starting implementing phase 1 (Global System Sync).
**Aesthetic Key**: #F3F3F3 (Soft Grey) / #1A1A1A (Matte Charcoal)
