// Centralized design tokens for MedHelp-AI experience
export const colors = {
  primary: '#0a1628',
  secondary: '#4dd4e8',
  accentPurple: '#a855f7',
  accentPink: '#ec4899',
  accentViolet: '#8b5cf6',
  glass: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
};

export const gradients = {
  background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #2d1b4e 100%)',
  hero: 'linear-gradient(135deg, #0a1628 0%, #4dd4e8 35%, #a855f7 70%, #ec4899 100%)',
  cardBorder: 'linear-gradient(90deg, rgba(77,212,232,0.6), rgba(168,85,247,0.6), rgba(236,72,153,0.6))',
};

export const radii = {
  xl: '24px',
  lg: '18px',
  md: '12px',
};

export const shadows = {
  glow: '0 0 40px rgba(77, 212, 232, 0.35)',
  card: '0 10px 50px rgba(0, 0, 0, 0.35)',
};

export const blur = {
  glass: '16px',
};

export const layout = {
  maxWidth: '1200px',
  sectionPadding: 'clamp(48px, 6vw, 96px)',
};

export const animationTimings = {
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
  slower: 0.9,
};

export const zIndexes = {
  nav: 20,
  hero: 10,
  particles: 5,
  modal: 30,
};
