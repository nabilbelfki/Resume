/**
 * Converts a hex color string to an RGB array.
 * Assumes input is in the format '#RRGGBB' or 'RRGGBB'.
 * @param {string} hex - The hex color string.
 * @returns {number[]} - An array [R, G, B] where each component is 0-255.
 */
export function hexToRgb(hex: string) {
  // Remove '#' if present
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;

  // Parse R, G, B values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return [r, g, b];
}

/**
 * Calculates the relative luminance of a color (0-1).
 * Based on WCAG 2.0 guidelines.
 * @param {string} hexColor - The hex color string (e.g., '#RRGGBB').
 * @returns {number} - The luminance value (0 for black, 1 for white).
 */
export function getLuminance(hexColor: string) {
  const [r, g, b] = hexToRgb(hexColor);

  // Convert R, G, B from 0-255 to 0-1 range
  const R_sRGB = r / 255;
  const G_sRGB = g / 255;
  const B_sRGB = b / 255;

  // Linearize sRGB values
  const linearize = (c_sRGB: number) => {
    if (c_sRGB <= 0.03928) {
      return c_sRGB / 12.92;
    }
    return Math.pow((c_sRGB + 0.055) / 1.055, 2.4);
  };

  const R_linear = linearize(R_sRGB);
  const G_linear = linearize(G_sRGB);
  const B_linear = linearize(B_sRGB);

  // Calculate luminance
  return 0.2126 * R_linear + 0.7152 * G_linear + 0.0722 * B_linear;
}

/**
 * Determines if a background color is "too dark" for dark text.
 * If the luminance is below the threshold, it suggests using light text.
 * @param {string} hexColor - The hex color string of the background.
 * @param {number} [threshold=0.179] - The luminance threshold.
 * Colors with luminance below this are considered "dark".
 * A common threshold is around 0.179 or 0.5.
 * Lower threshold means the background needs to be darker to use white text.
 * @returns {boolean} - True if the color is too dark for dark text (suggests white text), false otherwise.
 */
export function isColorTooDark(hexColor: string, threshold = 0.179) {
  const luminance = getLuminance(hexColor);
  // If luminance is low (closer to 0), the color is dark.
  // We want white text on dark backgrounds, so if it's "too dark" (below threshold), return true.
  return luminance < threshold;
}

export function stringToHexColor(str: string): string {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to hex color
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += value.toString(16).padStart(2, '0');
    }

    return color;
}