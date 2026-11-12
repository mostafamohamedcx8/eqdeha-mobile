/** "#B4471B" → light background of the same hue (the design pairs each icon color with a soft tint). */
export function tint(hex: string, amount = 0.86): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return '#EEF2F3';
  const n = parseInt(m[1], 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const [r, g, b] = [mix((n >> 16) & 255), mix((n >> 8) & 255), mix(n & 255)];
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

/** Valid #RRGGBB, or the fallback. */
export function safeColor(hex: string | null | undefined, fallback: string): string {
  return hex && /^#[0-9a-f]{6}$/i.test(hex.trim()) ? hex.trim() : fallback;
}
