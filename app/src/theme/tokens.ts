/**
 * HireVia Design Tokens
 * System Layer: Pure Matte Design Language
 */

export const PALETTE = {
  // Base Greys (Pure Matte)
  background:      '#F3F3F3', // Soft Matte Grey
  surface:         '#FFFFFF', // Pure White
  surfaceLow:      '#FAFAFA', // Ghost Grey
  surfaceContLow:  '#F0F4F7', // Sub-structural grey
  surfaceContHigh: '#E1E9EE', // Deep structural grey
  
  // Signature Accent (Strict Monochrome)
  primary:         '#1A1A1A', // Matte Black
  primaryText:     '#FFFFFF',
  
  // Text & Content
  onSurface:       '#1A1A1A', // Matte Black
  onSurfaceVariant: '#566166', // Matte Medium Grey
  outline:         '#717C82', // Standard stroke
  outlineVariant:  '#A9B4B9', // Faded stroke
  
  // Semantic (Monochromatic)
  error:           '#000000', // Strict Black
  indigo900:       '#1A1A1A', // Editorial Matte Black
};

export const TYPOGRAPHY = {
  // Editorial Scales
  h1: { fontSize: 38, fontWeight: '300', letterSpacing: -1, lineHeight: 46 },
  h1Bold: { fontWeight: '900', fontStyle: 'italic' },
  h2: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, lineHeight: 38 },
  h3: { fontSize: 24, fontWeight: '800', letterSpacing: -0.6 },
  
  label: { fontSize: 11, fontWeight: '900', letterSpacing: 5, textTransform: 'uppercase' },
  labelSmall: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodySecondary: { fontSize: 13, fontWeight: '500', lineHeight: 20 },
  
  metadata: { fontSize: 10, fontWeight: '800', letterSpacing: 2 },
};

export const GEOMETRY = {
  radiusPill: 100,
  radiusLarge: 32,
  radiusMedium: 24,
  radiusSmall: 14,
  paddingPage: 24,
};
