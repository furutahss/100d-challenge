import { calculateDimensions, createOutputFileName, type ConversionMode, type Dimensions, type OutputFormat, resolveOutputType } from "./image-utils";

export type ConvertedImage = {
  blob: Blob;
  fileName: string;
  dimensions: Dimensions;
  mimeType: Exclude<OutputFormat, "original">;
  warning?: string;
};

type SourceImage = { source: CanvasImageSource; dimensions: Dimensions; dispose: () => void };

async function loadImage(file: File): Promise<SourceImage> {
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return { source: bitmap, dimensions: { width: bitmap.width, height: bitmap.height }, dispose: () => bitmap.close() };
  }

  const url = URL.createObjectURL(file);
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("画像を読み込めませんでした。"));
    image.src = url;
  });
  return { source: image, dimensions: { width: image.naturalWidth, height: image.naturalHeight }, dispose: () => URL.revokeObjectURL(url) };
}

function render(source: CanvasImageSource, dimensions: Dimensions, type: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvasを初期化できませんでした。");
  if (type === "image/jpeg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, dimensions.width, dimensions.height);
  }
  context.drawImage(source, 0, 0, dimensions.width, dimensions.height);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("画像を書き出せませんでした。"))), type, quality);
  });
}

async function compressCanvas(canvas: HTMLCanvasElement, type: Exclude<OutputFormat, "original">, targetBytes: number): Promise<{ blob: Blob; warning?: string }> {
  if (type === "image/png") {
    const blob = await canvasToBlob(canvas, type);
    return { blob, warning: blob.size > targetBytes ? "PNGは画質を調整できないため、目標サイズに到達できませんでした。" : undefined };
  }

  let low = 0.05;
  let high = 1;
  let best: Blob | undefined;
  for (let step = 0; step < 8; step += 1) {
    const quality = (low + high) / 2;
    const blob = await canvasToBlob(canvas, type, quality);
    if (blob.size <= targetBytes) {
      best = blob;
      low = quality;
    } else {
      high = quality;
    }
  }
  if (best) return { blob: best };
  return { blob: await canvasToBlob(canvas, type, 0.05), warning: "最低画質でも目標サイズに到達できませんでした。" };
}

export async function convertImage(
  file: File,
  options: {
    mode: ConversionMode;
    format: OutputFormat;
    targetBytes?: number;
    dimensions?: Dimensions;
    resize?: { width?: number; height?: number; keepAspectRatio: boolean };
  },
): Promise<ConvertedImage> {
  const image = await loadImage(file);
  try {
    const mimeType = resolveOutputType(file.type, options.format);
    const dimensions = options.mode === "resize"
      ? options.resize
        ? calculateDimensions(image.dimensions, options.resize, options.resize.keepAspectRatio)
        : options.dimensions
      : image.dimensions;
    if (!dimensions) throw new Error("出力サイズを指定してください。");
    const canvas = render(image.source, dimensions, mimeType);
    const encoded = options.mode === "compress"
      ? await compressCanvas(canvas, mimeType, options.targetBytes ?? 0)
      : { blob: await canvasToBlob(canvas, mimeType, mimeType === "image/png" ? undefined : 1) };
    return {
      blob: encoded.blob,
      fileName: createOutputFileName(file.name, options.mode, mimeType, dimensions),
      dimensions,
      mimeType,
      warning: encoded.warning,
    };
  } finally {
    image.dispose();
  }
}
