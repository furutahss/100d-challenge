export type Rgb = { r: number; g: number; b: number };

type Bucket = Rgb & { count: number };

const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((value) => clamp(value).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

export function extractPalette(pixels: Uint8ClampedArray, colorCount = 5): string[] {
  const buckets = new Map<string, Bucket>();
  // 最大約10,000ピクセルを読む。小さな画像では全ピクセルを使うため偏りを避ける。
  const pixelStep = Math.max(1, Math.ceil(pixels.length / 4 / 10_000));
  for (let index = 0; index < pixels.length; index += pixelStep * 4) {
    const alpha = pixels[index + 3];
    if (alpha < 128) continue;
    const r = pixels[index]; const g = pixels[index + 1]; const b = pixels[index + 2];
    // 32階調へ量子化し、画像の細かなノイズより支配的な色を優先する。
    const key = `${r >> 3},${g >> 3},${b >> 3}`;
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, count: 0 };
    bucket.r += r; bucket.g += g; bucket.b += b; bucket.count += 1;
    buckets.set(key, bucket);
  }
  return [...buckets.values()]
    .sort((first, second) => second.count - first.count)
    .slice(0, colorCount)
    .map((bucket) => rgbToHex({ r: bucket.r / bucket.count, g: bucket.g / bucket.count, b: bucket.b / bucket.count }));
}

export function fillPalette(colors: string[], count = 5): string[] {
  const fallback = ["#1E3A8A", "#0EA5E9", "#F59E0B", "#F43F5E", "#10B981"];
  return [...colors, ...fallback.filter((color) => !colors.includes(color))].slice(0, count);
}
