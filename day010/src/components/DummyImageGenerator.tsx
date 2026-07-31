"use client";

import { useEffect, useRef, useState } from "react";
import { clampDimension, formatBytes, isHexColor, mimeType, normalizeHexColor, type ImageFormat } from "@/lib/image";

const PRESETS = [
  { label: "SNS カード", width: 1200, height: 630 },
  { label: "ブログ画像", width: 1200, height: 675 },
  { label: "正方形", width: 1080, height: 1080 },
  { label: "プロフィール", width: 400, height: 400 },
  { label: "スマホ壁紙", width: 1108, height: 2400 },
  { label: "プレゼン", width: 1920, height: 1080 },
  { label: "サムネイル", width: 1280, height: 720 },
  { label: "名刺", width: 1050, height: 600 },
  { label: "A4", width: 1697, height: 2400 },
];

type DesignPattern = "solid" | "gradient" | "dots" | "grid" | "stripes";

const DESIGNS: Array<{ id: DesignPattern; label: string; description: string }> = [
  { id: "solid", label: "ベタ塗り", description: "単色" },
  { id: "gradient", label: "グラデーション", description: "なめらか" },
  { id: "dots", label: "ドット", description: "水玉" },
  { id: "grid", label: "グリッド", description: "方眼" },
  { id: "stripes", label: "ストライプ", description: "斜め線" },
];

function drawDummyImage(canvas: HTMLCanvasElement, width: number, height: number, color: string, format: ImageFormat, design: DesignPattern): string {
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return "";
  if (design === "gradient") {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "#fff8f1");
    context.fillStyle = gradient;
  } else {
    context.fillStyle = color;
  }
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "rgba(255,255,255,.42)";
  context.lineWidth = Math.max(1, Math.min(width, height) * 0.004);
  if (design === "dots") {
    for (let x = 0; x < width; x += Math.max(24, Math.min(width, height) * 0.08)) {
      for (let y = 0; y < height; y += Math.max(24, Math.min(width, height) * 0.08)) {
        context.beginPath();
        context.arc(x, y, Math.max(2, Math.min(width, height) * 0.012), 0, Math.PI * 2);
        context.stroke();
      }
    }
  }
  if (design === "grid") {
    const step = Math.max(32, Math.min(width, height) * 0.12);
    for (let x = step; x < width; x += step) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
    for (let y = step; y < height; y += step) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
  }
  if (design === "stripes") {
    const step = Math.max(36, Math.min(width, height) * 0.14);
    for (let offset = -height; offset < width; offset += step) { context.beginPath(); context.moveTo(offset, 0); context.lineTo(offset + height, height); context.stroke(); }
  }
  context.strokeStyle = "rgba(255,255,255,.72)";
  context.lineWidth = Math.max(2, Math.min(width, height) * 0.006);
  context.strokeRect(context.lineWidth / 2, context.lineWidth / 2, width - context.lineWidth, height - context.lineWidth);
  context.fillStyle = "rgba(255,255,255,.82)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `600 ${Math.max(16, Math.min(width, height) * 0.09)}px Arial, sans-serif`;
  context.fillText(`${width} × ${height}`, width / 2, height / 2);
  return canvas.toDataURL(mimeType(format), format === "jpeg" ? 0.92 : undefined);
}

export function DummyImageGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(630);
  const [color, setColor] = useState("#e8d8cb");
  const [format, setFormat] = useState<ImageFormat>("png");
  const [design, setDesign] = useState<DesignPattern>("solid");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  const generate = (nextWidth = width, nextHeight = height) => {
    const safeWidth = clampDimension(nextWidth);
    const safeHeight = clampDimension(nextHeight);
    const safeColor = normalizeHexColor(color);
    if (!isHexColor(color)) {
      setDataUrl("");
      setError("カラーコードは #RRGGBB 形式で入力してください。");
      return;
    }
    setWidth(safeWidth);
    setHeight(safeHeight);
    setColor(safeColor);
    setError("");
    const nextDataUrl = canvasRef.current ? drawDummyImage(canvasRef.current, safeWidth, safeHeight, safeColor, format, design) : "";
    setDataUrl(nextDataUrl);
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => generate());
    return () => window.cancelAnimationFrame(frame);
    // すべての設定変更後、DOM更新後に自動で再描画する。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, design, format, width, height]);

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setWidth(preset.width);
    setHeight(preset.height);
    window.setTimeout(() => generate(preset.width, preset.height), 0);
  };

  const download = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `dummy-${width}x${height}.${format}`;
    link.click();
  };

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[.24em] text-[#ef6c4d]">DAY 10 · IMAGE TOOL</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">ダミー画像ジェネレーター</h1>
            <p className="mt-3 text-sm leading-6 text-stone-500">サイズと色を決めて、モックアップ用画像をつくります。</p>
          </div>
          <div aria-hidden className="hidden rounded-2xl bg-[#ef6c4d] p-3 text-2xl text-white shadow-sm sm:block">▧</div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(260px,330px)_1fr]">
          <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="settings-title">
            <h2 id="settings-title" className="text-lg font-bold text-stone-900">画像の設定</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="text-sm font-bold text-stone-600">幅（px）<input className="field-input" type="number" min="1" max="2400" value={width} onChange={(event) => setWidth(Number(event.target.value))} /></label>
              <label className="text-sm font-bold text-stone-600">高さ（px）<input className="field-input" type="number" min="1" max="2400" value={height} onChange={(event) => setHeight(Number(event.target.value))} /></label>
            </div>
            <p className="mt-2 text-xs text-stone-400">1〜2400pxまで指定できます。</p>
            <div className="mt-6">
              <label className="text-sm font-bold text-stone-600" htmlFor="color-text">背景色</label>
              <div className="mt-2 flex gap-2">
                <input aria-label="背景色を選択" className="h-11 w-12 shrink-0 rounded-xl border border-stone-200" type="color" value={isHexColor(color) ? color : "#e8d8cb"} onChange={(event) => setColor(event.target.value)} />
                <input id="color-text" className="field-input mt-0" value={color} onChange={(event) => setColor(event.target.value)} aria-describedby="color-help" />
              </div>
              <p id="color-help" className="mt-2 text-xs text-stone-400">例：#E8D8CB</p>
            </div>
            <label className="mt-6 block text-sm font-bold text-stone-600">ファイル形式<select className="field-input" value={format} onChange={(event) => setFormat(event.target.value as ImageFormat)}><option value="png">PNG（透過対応）</option><option value="jpeg">JPEG（軽量）</option></select></label>
            <fieldset className="mt-6"><legend className="text-sm font-bold text-stone-600">デザイン</legend><div className="mt-2 grid grid-cols-2 gap-2">{DESIGNS.map((item) => <button key={item.id} type="button" aria-label={`${item.label}デザイン`} aria-pressed={design === item.id} onClick={() => setDesign(item.id)} className={`rounded-xl border px-3 py-2.5 text-left transition focus:outline-none focus:ring-4 focus:ring-orange-100 ${design === item.id ? "border-[#ef6c4d] bg-orange-50 text-[#c84d34]" : "border-stone-200 bg-white text-stone-600 hover:border-orange-200"}`}><span className="block text-xs font-bold">{item.label}</span><span className="mt-0.5 block text-[11px] font-normal opacity-70">{item.description}</span></button>)}</div></fieldset>
            <p className="mt-4 text-xs leading-5 text-stone-400">サイズ・色・デザイン・形式はすべて自動反映されます。</p>
            {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
            <div className="mt-7 border-t border-stone-100 pt-5"><p className="text-xs font-bold tracking-wider text-stone-400">PRESETS</p><div className="mt-3 flex flex-wrap gap-2">{PRESETS.map((preset) => <button key={preset.label} type="button" onClick={() => applyPreset(preset)} className="rounded-lg bg-stone-100 px-3 py-2 text-xs font-bold text-stone-600 transition hover:bg-orange-50 hover:text-[#d9583d]">{preset.label}</button>)}</div></div>
          </section>

          <section className="flex min-h-[480px] flex-col rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="preview-title">
            <div className="flex items-center justify-between"><div><h2 id="preview-title" className="text-lg font-bold text-stone-900">プレビュー</h2><p className="mt-1 text-sm text-stone-400">{width} × {height}px · {format.toUpperCase()}</p></div><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500">BROWSER ONLY</span></div>
            <div className="checkerboard mt-5 flex min-h-[320px] flex-1 items-center justify-center overflow-hidden rounded-2xl p-5"><div className="max-h-full max-w-full overflow-hidden rounded-lg shadow-lg"><canvas ref={canvasRef} className="block h-auto max-h-[390px] max-w-full" aria-label={`${width}×${height}ピクセルのダミー画像`} /></div></div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-stone-500">生成サイズ：<strong className="text-stone-800">{dataUrl ? formatBytes(Math.ceil(dataUrl.length * 0.75)) : "—"}</strong></p><button type="button" onClick={download} disabled={!dataUrl} className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-stone-700 focus:outline-none focus:ring-4 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-stone-200">ダウンロード</button></div>
          </section>
        </div>
        <p className="mt-7 text-center text-xs text-stone-400">画像はサーバーに送信されず、このブラウザ内だけで生成されます。</p>
      </div>
    </main>
  );
}
