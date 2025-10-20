import chroma from 'chroma-js';
import { colord } from 'colord';

export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
  name: string;
  locked?: boolean;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: string[];
  mood: string;
  category: string;
}

export function generateRandomPalette(): Color[] {
  const colors: Color[] = [];

  for (let i = 0; i < 5; i++) {
    const hue = Math.random() * 360;
    const saturation = 60 + Math.random() * 40; // 60-100%
    const lightness = 30 + Math.random() * 40; // 30-70%

    const color = chroma.hsl(hue, saturation / 100, lightness / 100);
    colors.push(createColorObject(color.hex()));
  }

  return colors;
}

export function generatePaletteByTheme(theme: Theme): Color[] {
  return theme.colors.map(hex => createColorObject(hex));
}

export function generatePaletteByHarmony(
  baseColor: string,
  harmonyRule: 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'monochromatic'
): Color[] {
  const base = chroma(baseColor);
  const colors: Color[] = [createColorObject(base.hex())];

  switch (harmonyRule) {
    case 'analogous':
      colors.push(...generateAnalogousColors(base));
      break;
    case 'complementary':
      colors.push(...generateComplementaryColors(base));
      break;
    case 'triadic':
      colors.push(...generateTriadicColors(base));
      break;
    case 'tetradic':
      colors.push(...generateTetradicColors(base));
      break;
    case 'monochromatic':
      colors.push(...generateMonochromaticColors(base));
      break;
  }

  return colors.slice(0, 5); // Ensure we have exactly 5 colors
}

function generateAnalogousColors(base: chroma.Color): Color[] {
  const colors: Color[] = [];
  const hue = base.get('hsl.h');

  // Generate 4 analogous colors (30° apart)
  for (let i = 1; i <= 4; i++) {
    const newHue = (hue + (i * 30)) % 360;
    const color = chroma.hsl(newHue, base.get('hsl.s'), base.get('hsl.l'));
    colors.push(createColorObject(color.hex()));
  }

  return colors;
}

function generateComplementaryColors(base: chroma.Color): Color[] {
  const colors: Color[] = [];
  const hue = base.get('hsl.h');
  const complementaryHue = (hue + 180) % 360;

  // Generate variations of the complementary color
  for (let i = 1; i <= 4; i++) {
    const variation = i * 20; // 20°, 40°, 60°, 80° variations
    const newHue = (complementaryHue + variation) % 360;
    const color = chroma.hsl(newHue, base.get('hsl.s'), base.get('hsl.l'));
    colors.push(createColorObject(color.hex()));
  }

  return colors;
}

function generateTriadicColors(base: chroma.Color): Color[] {
  const colors: Color[] = [];
  const hue = base.get('hsl.h');

  // Triadic colors are 120° apart
  for (let i = 1; i <= 4; i++) {
    const newHue = (hue + (i * 120)) % 360;
    const color = chroma.hsl(newHue, base.get('hsl.s'), base.get('hsl.l'));
    colors.push(createColorObject(color.hex()));
  }

  return colors;
}

function generateTetradicColors(base: chroma.Color): Color[] {
  const colors: Color[] = [];
  const hue = base.get('hsl.h');

  // Tetradic colors are 90° apart
  for (let i = 1; i <= 4; i++) {
    const newHue = (hue + (i * 90)) % 360;
    const color = chroma.hsl(newHue, base.get('hsl.s'), base.get('hsl.l'));
    colors.push(createColorObject(color.hex()));
  }

  return colors;
}

function generateMonochromaticColors(base: chroma.Color): Color[] {
  const colors: Color[] = [];
  const hue = base.get('hsl.h');
  const saturation = base.get('hsl.s');

  // Generate variations in lightness
  const lightnesses = [0.2, 0.4, 0.6, 0.8];
  for (const lightness of lightnesses) {
    const color = chroma.hsl(hue, saturation, lightness);
    colors.push(createColorObject(color.hex()));
  }

  return colors;
}

export function generatePaletteByMood(mood: string): Color[] {
  const moodPalettes: { [key: string]: string[] } = {
    warm: ['#FF6B6B', '#FF8E53', '#F8B500', '#FF6B9D', '#C44569'],
    cool: ['#4ECDC4', '#45B7D1', '#74B9FF', '#A29BFE', '#6C5CE7'],
    vibrant: ['#FF6B6B', '#4ECDC4', '#F8B500', '#96CEB4', '#FF6B9D'],
    muted: ['#DDA0DD', '#F0E68C', '#98FB98', '#F5DEB3', '#FFB6C1'],
    professional: ['#2D3436', '#636E72', '#74B9FF', '#A29BFE', '#FD79A8'],
    playful: ['#FF6B6B', '#4ECDC4', '#F8B500', '#96CEB4', '#FF6B9D'],
    minimal: ['#2D3436', '#636E72', '#74B9FF', '#A29BFE', '#FD79A8'],
    luxury: ['#2D3436', '#636E72', '#74B9FF', '#A29BFE', '#FD79A8']
  };

  const palette = moodPalettes[mood] || moodPalettes.warm;
  return palette.map(hex => createColorObject(hex));
}

export function generatePaletteFromText(description: string): Color[] {
  const keywords = description.toLowerCase();

  // Simple keyword-based palette generation
  if (keywords.includes('sunset') || keywords.includes('warm')) {
    return generatePaletteByMood('warm');
  } else if (keywords.includes('ocean') || keywords.includes('cool') || keywords.includes('water')) {
    return generatePaletteByMood('cool');
  } else if (keywords.includes('nature') || keywords.includes('green') || keywords.includes('forest')) {
    return ['#00B894', '#00CEC9', '#FDCB6E', '#E17055', '#D63031'].map(hex => createColorObject(hex));
  } else if (keywords.includes('corporate') || keywords.includes('business') || keywords.includes('professional')) {
    return generatePaletteByMood('professional');
  } else if (keywords.includes('playful') || keywords.includes('fun') || keywords.includes('bright')) {
    return generatePaletteByMood('playful');
  } else if (keywords.includes('minimal') || keywords.includes('clean') || keywords.includes('simple')) {
    return generatePaletteByMood('minimal');
  } else if (keywords.includes('luxury') || keywords.includes('elegant') || keywords.includes('premium')) {
    return generatePaletteByMood('luxury');
  } else {
    // Default to a random palette
    return generateRandomPalette();
  }
}

export function createColorObject(hex: string): Color {
  const color = colord(hex);
  const rgb = color.toRgb();
  const hsl = color.toHsl();

  // Convert RGB to CMYK manually since colord doesn't have toCmyk()
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  return {
    hex: hex.toUpperCase(),
    rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
    hsl: { h: Math.round(hsl.h || 0), s: Math.round(hsl.s * 100), l: Math.round(hsl.l * 100) },
    cmyk: { c: Math.round(cmyk.c), m: Math.round(cmyk.m), y: Math.round(cmyk.y), k: Math.round(cmyk.k) },
    name: getColorName(hex)
  };
}

function rgbToCmyk(r: number, g: number, b: number) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: c * 100,
    m: m * 100,
    y: y * 100,
    k: k * 100
  };
}

export function getColorName(hex: string): string {
  const color = colord(hex);
  const rgb = color.toRgb();

  // Simple color name mapping based on RGB values
  const { r, g, b } = rgb;

  if (r > 200 && g < 100 && b < 100) return 'Red';
  if (r < 100 && g > 200 && b < 100) return 'Green';
  if (r < 100 && g < 100 && b > 200) return 'Blue';
  if (r > 200 && g > 200 && b < 100) return 'Yellow';
  if (r > 200 && g < 100 && b > 200) return 'Magenta';
  if (r < 100 && g > 200 && b > 200) return 'Cyan';
  if (r > 200 && g > 200 && b > 200) return 'White';
  if (r < 50 && g < 50 && b < 50) return 'Black';
  if (r > 150 && g > 150 && b > 150) return 'Light Gray';
  if (r > 100 && g > 100 && b > 100) return 'Gray';
  if (r > 200 && g > 100 && b < 100) return 'Orange';
  if (r > 100 && g > 200 && b < 100) return 'Lime';
  if (r < 100 && g > 200 && b > 100) return 'Teal';
  if (r > 100 && g < 100 && b > 200) return 'Purple';
  if (r > 200 && g > 100 && b > 100) return 'Pink';

  return 'Custom Color';
}

export function adjustColor(color: Color, adjustments: {
  hue?: number;
  saturation?: number;
  lightness?: number;
}): Color {
  const { hue = 0, saturation = 0, lightness = 0 } = adjustments;

  const currentHsl = color.hsl;
  const newHue = (currentHsl.h + hue) % 360;
  const newSaturation = Math.max(0, Math.min(100, currentHsl.s + saturation));
  const newLightness = Math.max(0, Math.min(100, currentHsl.l + lightness));

  const newColor = chroma.hsl(newHue, newSaturation / 100, newLightness / 100);
  return createColorObject(newColor.hex());
}

export function getContrastRatio(color1: string, color2: string): number {
  const c1 = chroma(color1);
  const c2 = chroma(color2);

  const l1 = c1.luminance();
  const l2 = c2.luminance();

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function getAccessibilityLevel(contrastRatio: number): {
  level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  description: string;
} {
  if (contrastRatio >= 7) {
    return { level: 'AAA', description: 'Excellent contrast' };
  } else if (contrastRatio >= 4.5) {
    return { level: 'AA', description: 'Good contrast' };
  } else if (contrastRatio >= 3) {
    return { level: 'AA Large', description: 'Acceptable for large text' };
  } else {
    return { level: 'Fail', description: 'Poor contrast' };
  }
}

export function sortColorsByVibrance(colors: Color[]): Color[] {
  return colors.sort((a, b) => {
    const vibranceA = chroma(a.hex).get('hsl.s') * chroma(a.hex).get('hsl.l');
    const vibranceB = chroma(b.hex).get('hsl.s') * chroma(b.hex).get('hsl.l');
    return vibranceB - vibranceA;
  });
}

export function sortColorsByLightness(colors: Color[]): Color[] {
  return colors.sort((a, b) => b.hsl.l - a.hsl.l);
}

export function sortColorsByHue(colors: Color[]): Color[] {
  return colors.sort((a, b) => a.hsl.h - b.hsl.h);
}

export function generateGradient(colors: Color[], steps: number = 10): string[] {
  if (colors.length < 2) return colors.map(c => c.hex);

  const gradient = chroma.scale(colors.map(c => c.hex)).mode('lab');
  const result: string[] = [];

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    result.push(gradient(t).hex());
  }

  return result;
}
