export type SizeUnit = "KB" | "MB";
export type ConversionMode = "compress" | "resize";
export type OutputFormat = "original" | "image/jpeg" | "image/png" | "image/webp";

export type Dimensions = { width: number; height: number };

const extensionByMimeType: Record<Exclude<OutputFormat, "original">, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function bytesFromSize(value: number, unit: SizeUnit): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("正の数値を入力してください。");
  }

  return value * (unit === "KB" ? 1024 : 1024 * 1024);
}

export function calculateDimensions(
  original: Dimensions,
  requested: Partial<Dimensions>,
  keepAspectRatio: boolean,
): Dimensions {
  const width = requested.width;
  const height = requested.height;

  if (keepAspectRatio) {
    if (width && width > 0) {
      return { width: Math.round(width), height: Math.max(1, Math.round((width * original.height) / original.width)) };
    }
    if (height && height > 0) {
      return { width: Math.max(1, Math.round((height * original.width) / original.height)), height: Math.round(height) };
    }
  }

  if (!width || width <= 0 || !height || height <= 0) {
    throw new Error("幅と高さには正の整数を入力してください。");
  }

  return { width: Math.round(width), height: Math.round(height) };
}

export function resolveOutputType(sourceType: string, format: OutputFormat): Exclude<OutputFormat, "original"> {
  if (format !== "original") return format;
  return sourceType === "image/jpeg" || sourceType === "image/png" || sourceType === "image/webp"
    ? sourceType
    : "image/png";
}

export function createOutputFileName(
  originalName: string,
  mode: ConversionMode,
  mimeType: Exclude<OutputFormat, "original">,
  dimensions?: Dimensions,
): string {
  const baseName = originalName.replace(/\.[^.]+$/, "") || "image";
  const suffix = mode === "compress" ? "-compressed" : `-${dimensions?.width}x${dimensions?.height}`;
  return `${baseName}${suffix}.${extensionByMimeType[mimeType]}`;
}

export function validateImageFiles(files: File[]): { accepted: File[]; rejected: string[] } {
  return files.reduce<{ accepted: File[]; rejected: string[] }>((result, file) => {
    if (file.type.startsWith("image/")) result.accepted.push(file);
    else result.rejected.push(file.name);
    return result;
  }, { accepted: [], rejected: [] });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
