"use client";

/* eslint-disable @next/next/no-img-element -- 選択画像はローカルのData URLであり、静的exportでは最適化対象にできない。 */

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { extractPalette, fillPalette } from "@/lib/palette";

const MAX_CANVAS_SIZE = 160;
const initialColors = ["#1E3A8A", "#0EA5E9", "#F59E0B", "#F43F5E", "#10B981"];

function isImage(file: File) { return file.type.startsWith("image/"); }

export function PaletteExtractor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [colors, setColors] = useState(initialColors);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const analyzeFile = (file?: File) => {
    if (!file) return;
    setCopied(null);
    if (!isImage(file)) { setError("画像ファイル（PNG・JPG・WebP など）を選択してください。"); return; }
    setError("");
    const reader = new FileReader();
    reader.onerror = () => setError("画像を読み込めませんでした。別のファイルをお試しください。");
    reader.onload = () => {
      const source = String(reader.result);
      const image = new Image();
      image.onerror = () => setError("画像を読み込めませんでした。別のファイルをお試しください。");
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, MAX_CANVAS_SIZE / Math.max(image.width, image.height));
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) { setError("このブラウザでは色を抽出できませんでした。"); return; }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        try { setColors(fillPalette(extractPalette(context.getImageData(0, 0, canvas.width, canvas.height).data))); }
        catch { setError("画像の色を読み取れませんでした。別のファイルをお試しください。"); return; }
        setImageUrl(source); setFileName(file.name);
      };
      image.src = source;
    };
    reader.readAsDataURL(file);
  };

  const onSelect = (event: ChangeEvent<HTMLInputElement>) => { analyzeFile(event.target.files?.[0]); event.target.value = ""; };
  const onDrop = (event: DragEvent<HTMLButtonElement>) => { event.preventDefault(); setIsDragging(false); analyzeFile(event.dataTransfer.files?.[0]); };
  const copy = async (color: string) => {
    try { await navigator.clipboard.writeText(color); setCopied(color); }
    catch { setError("コピーできませんでした。Hexコードを選択してコピーしてください。"); }
  };

  return <main className="min-h-screen bg-[#f8fafc] px-4 py-7 text-slate-900 sm:px-8 sm:py-10">
    <div className="mx-auto max-w-5xl">
      <header className="mb-9 flex items-center gap-3"><div aria-hidden className="grid h-12 w-12 place-items-center rounded-2xl bg-[#172554] text-2xl shadow-lg">🎨</div><div><p className="text-xs font-bold tracking-[.18em] text-blue-700">DAY 12 · COLOR TOOL</p><h1 className="text-2xl font-black sm:text-3xl">画像 → カラーパレット抽出</h1></div></header>
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/70" aria-labelledby="tool-title">
        <div className="border-b border-slate-100 px-6 py-7 sm:px-10"><h2 id="tool-title" className="text-xl font-black sm:text-2xl">お気に入りの画像から、色を見つけよう。</h2><p className="mt-2 text-sm leading-6 text-slate-500">画像はブラウザ内だけで処理され、アップロードされません。</p></div>
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_.9fr]">
          <button type="button" onClick={() => inputRef.current?.click()} onDrop={onDrop} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} className={`group min-h-72 overflow-hidden rounded-3xl border-2 border-dashed p-5 text-center transition focus:outline-none focus:ring-4 focus:ring-blue-200 ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"}`} aria-label="画像を選択またはドロップ">
            {imageUrl ? <div className="flex h-full flex-col"><img src={imageUrl} alt="選択した画像のプレビュー" className="min-h-48 w-full flex-1 rounded-2xl object-contain" /><p className="mt-3 truncate text-sm font-bold text-slate-600">{fileName}</p><span className="mt-1 text-xs font-bold text-blue-600">クリックして別の画像を選択</span></div> : <div className="grid h-full min-h-60 place-items-center"><div><span aria-hidden className="text-5xl">🖼️</span><p className="mt-4 text-lg font-black">画像をドロップ</p><p className="mt-1 text-sm text-slate-500">またはクリックしてファイルを選択</p><span className="mt-5 inline-block rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white">画像を選ぶ</span><p className="mt-4 text-xs text-slate-400">PNG / JPG / WebP / GIF</p></div></div>}
          </button>
          <div><div className="flex items-end justify-between"><div><h3 className="text-lg font-black">抽出した5色</h3><p className="mt-1 text-sm text-slate-500">Hexコードをクリックしてコピー</p></div>{imageUrl && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">抽出完了</span>}</div>
            <div className="mt-5 overflow-hidden rounded-2xl shadow-sm">{colors.map((color, index) => <button key={`${color}-${index}`} type="button" onClick={() => copy(color)} className="flex w-full items-center gap-4 border-b border-white/30 px-4 py-3 text-left text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-blue-300 last:border-0" style={{ backgroundColor: color }} aria-label={`${color}をコピー`}><span className="h-9 w-9 rounded-xl border border-white/40 shadow-inner" style={{ backgroundColor: color }} /><span className="font-mono text-base font-bold tracking-wide">{color}</span><span className="ml-auto text-xs font-bold">{copied === color ? "コピー済み" : "COPY"}</span></button>)}</div>
            <p className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">色数の少ない画像では、見やすい補助色を加えて5色で表示します。</p>
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={onSelect} />
        {error && <p role="alert" className="mx-6 mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 sm:mx-10">{error}</p>}
      </section>
      <p className="mt-6 text-center text-xs text-slate-400">写真、イラスト、スクリーンショットから配色のヒントをすばやく見つけられます。</p>
    </div>
  </main>;
}
