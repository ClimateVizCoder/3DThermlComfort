export const colors = {
  // Backgrounds – warm near-black, not pure black
  bgBase:     "#0C0A09",
  bgSurface:  "#141210",
  bgElevated: "#1C1916",
  bgOverlay:  "#242018",

  // Gold – the single accent, used sparingly
  gold:       "#C8A96E",
  goldLight:  "#DCC59E",
  goldDim:    "#8C7248",
  goldMuted:  "rgba(200,169,110,0.12)",

  // Text
  textPrimary:  "#F5F0E8",
  textSecondary:"#B4AC9E",
  textMuted:    "#6E665A",
  textDisabled: "#3E3830",

  // Semantic
  statusOk:   "#5AAA78",
  statusWarn: "#D4804A",
  statusAlert:"#C04848",

  // Structural
  divider:    "rgba(255,255,255,0.06)",
  borderSubtle:"rgba(200,169,110,0.14)",

  // Scrim
  scrim: "rgba(0,0,0,0.72)",
} as const;

export const type = {
  display:  { fontFamily:"'Cormorant Garamond', Georgia, serif",  fontWeight:600 },
  headline: { fontFamily:"'Inter', system-ui, sans-serif",        fontWeight:600 },
  body:     { fontFamily:"'Inter', system-ui, sans-serif",        fontWeight:400 },
  label:    { fontFamily:"'Inter', system-ui, sans-serif",        fontWeight:500 },
  caption:  { fontFamily:"'Inter', system-ui, sans-serif",        fontWeight:400 },
} as const;

export const radius = {
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  pill:99,
} as const;

export const space = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;
