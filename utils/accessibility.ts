/**
 * Accessibility utilities for the Aether Design System Generator
 * Based on WCAG 2.1 Level AA compliance requirements
 */

export interface ContrastResult {
  ratio: number;
  passes: boolean;
  level: 'AAA' | 'AA' | 'FAIL';
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance of a color
 */
function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG contrast requirements
 */
export function checkColorContrast(foreground: string, background: string, isLargeText: boolean = false): ContrastResult {
  const ratio = calculateContrastRatio(foreground, background);
  
  const aaThreshold = isLargeText ? 3 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7;
  
  let level: 'AAA' | 'AA' | 'FAIL';
  let passes: boolean;
  
  if (ratio >= aaaThreshold) {
    level = 'AAA';
    passes = true;
  } else if (ratio >= aaThreshold) {
    level = 'AA';
    passes = true;
  } else {
    level = 'FAIL';
    passes = false;
  }
  
  return { ratio, passes, level };
}

/**
 * Validate all color combinations in a design system
 */
export function validateDesignSystemColors(colors: Record<string, string>): Record<string, ContrastResult[]> {
  const results: Record<string, ContrastResult[]> = {};
  
  // Check common color combinations
  const combinations = [
    { name: 'primary-on-white', fg: colors.primary, bg: '#ffffff' },
    { name: 'primary-on-neutral', fg: colors.primary, bg: colors.neutral },
    { name: 'white-on-primary', fg: '#ffffff', bg: colors.primary },
    { name: 'secondary-on-white', fg: colors.secondary, bg: '#ffffff' },
    { name: 'accent-on-white', fg: colors.accent, bg: '#ffffff' },
    { name: 'error-on-white', fg: colors.error, bg: '#ffffff' },
    { name: 'success-on-white', fg: colors.success, bg: '#ffffff' },
    { name: 'warning-on-white', fg: colors.warning, bg: '#ffffff' },
  ];
  
  combinations.forEach(combo => {
    if (combo.fg && combo.bg) {
      results[combo.name] = [
        checkColorContrast(combo.fg, combo.bg, false), // Normal text
        checkColorContrast(combo.fg, combo.bg, true),  // Large text
      ];
    }
  });
  
  return results;
}

/**
 * Generate accessible color suggestions
 */
export function suggestAccessibleColors(baseColor: string, targetBg: string = '#ffffff'): string[] {
  const suggestions: string[] = [];
  const baseRgb = hexToRgb(baseColor);
  
  if (!baseRgb) return suggestions;
  
  // Try darkening the color
  for (let factor = 0.1; factor <= 0.9; factor += 0.1) {
    const darkerColor = `#${Math.round(baseRgb.r * (1 - factor)).toString(16).padStart(2, '0')}${Math.round(baseRgb.g * (1 - factor)).toString(16).padStart(2, '0')}${Math.round(baseRgb.b * (1 - factor)).toString(16).padStart(2, '0')}`;
    
    const contrast = checkColorContrast(darkerColor, targetBg);
    if (contrast.passes && !suggestions.includes(darkerColor)) {
      suggestions.push(darkerColor);
    }
  }
  
  return suggestions.slice(0, 3); // Return top 3 suggestions
}