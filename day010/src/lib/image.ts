export const LIMITS = { min: 1, max: 2400 } as const;

export type ImageFormat = "png" | "jpeg";

export function clampDimension(value: number): number {
  if (!Number.isFinite(value)) return LIMITS.min;
  return Math.min(LIMITS.max, Math.max(LIMITS.min, Math.round(value)));
}

export function isHexColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

export function normalizeHexColor(value: string, fallback = "#e8d8cb"): string {
  const candidate = value.trim().startsWith("#") ? value.trim() : `#${value.trim()}`;
  return isHexColor(candidate) ? candidate.toLowerCase() : fallback;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function mimeType(format: ImageFormat): string {
  return format === "png" ? "image/png" : "image/jpeg";
}
