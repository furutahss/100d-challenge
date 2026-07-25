"use client";

import JSZip from "jszip";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { convertImage } from "@/lib/image-converter";
import {
  bytesFromSize,
  formatBytes,
  type ConversionMode,
  type OutputFormat,
  type SizeUnit,
  validateImageFiles,
} from "@/lib/image-utils";

type Result = {
  id: string;
  original: File;
  url?: string;
  fileName?: string;
  size?: number;
  dimensions?: { width: number; height: number };
  warning?: string;
  error?: string;
};

export function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<ConversionMode>("compress");
  const [format, setFormat] = useState<OutputFormat>("original");
  const [targetSize, setTargetSize] = useState("500");
  const [unit, setUnit] = useState<SizeUnit>("KB");
  const [width, setWidth] = useState("1200");
  const [height, setHeight] = useState("800");
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [results, setResults] = useState<Result[]>([]);
  const [message, setMessage] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => () => results.forEach((result) => result.url && URL.revokeObjectURL(result.url)), [results]);

  function addFiles(newFiles: File[]) {
    const { accepted, rejected } = validateImageFiles(newFiles);
    if (accepted.length) setFiles((current) => [...current, ...accepted]);
    setMessage(rejected.length ? `画像ファイルのみ追加できます: ${rejected.join(", ")}` : "");
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    addFiles(Array.from(event.dataTransfer.files));
  }

  function resetResults() {
    results.forEach((result) => result.url && URL.revokeObjectURL(result.url));
    setResults([]);
  }

  async function handleConvert() {
    if (!files.length) return setMessage("変換する画像を追加してください。");
    let targetBytes: number | undefined;
    try {
      if (mode === "compress") targetBytes = bytesFromSize(Number(targetSize), unit);
      if (mode === "resize" && (!Number.isInteger(Number(width)) || !Number.isInteger(Number(height)) || Number(width) <= 0 || Number(height) <= 0)) {
        throw new Error("幅と高さには正の整数を入力してください。");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "設定を確認してください。");
      return;
    }

    resetResults();
    setMessage("");
    setProgress(0);
    setIsConverting(true);
    const nextResults: Result[] = [];
    for (const [index, file] of files.entries()) {
      try {
        const converted = await convertImage(file, {
          mode,
          format,
          targetBytes,
          resize: { width: Number(width), height: Number(height), keepAspectRatio },
        });
        nextResults.push({
          id: `${file.name}-${file.lastModified}-${index}`,
          original: file,
          url: URL.createObjectURL(converted.blob),
          fileName: converted.fileName,
          size: converted.blob.size,
          dimensions: converted.dimensions,
          warning: converted.warning,
        });
      } catch (error) {
        nextResults.push({ id: `${file.name}-${file.lastModified}-${index}`, original: file, error: error instanceof Error ? error.message : "変換に失敗しました。" });
      }
      setProgress(index + 1);
    }
    setResults(nextResults);
    setIsConverting(false);
  }

  function download(result: Result) {
    if (!result.url || !result.fileName) return;
    const anchor = document.createElement("a");
    anchor.href = result.url;
    anchor.download = result.fileName;
    anchor.click();
  }

  async function downloadAll() {
    const successful = results.filter((result) => result.url && result.fileName);
    if (!successful.length) return;
    const zip = new JSZip();
    await Promise.all(successful.map(async (result) => {
      const blob = await fetch(result.url!).then((response) => response.blob());
      zip.file(result.fileName!, blob);
    }));
    const url = URL.createObjectURL(await zip.generateAsync({ type: "blob" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "converted-images.zip";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">画像サイズコンバータ</h1>
        <p className="mt-2 text-slate-600">画像はアップロードされません。すべてこのブラウザ内で処理されます。</p>
      </header>

      <section className="space-y-6" aria-label="変換設定">
        <label className="drop-zone block cursor-pointer rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/70 p-8 text-center transition hover:border-sky-500" onDragOver={(event) => event.preventDefault()} onDrop={onDrop}>
          <span className="block text-base font-semibold text-slate-800">画像をドラッグ＆ドロップ</span>
          <span className="mt-1 block text-sm text-slate-600">またはクリックして複数選択（JPEG / PNG / WebP など）</span>
          <input className="sr-only" aria-label="画像を選択" type="file" accept="image/*" multiple onChange={onFileChange} />
        </label>

        {files.length > 0 && <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">追加済み画像（{files.length}件）</h2><button className="text-sm text-slate-600 underline" onClick={() => setFiles([])}>すべて削除</button></div><ul className="space-y-1 text-sm text-slate-600">{files.map((file, index) => <li className="flex justify-between gap-3" key={`${file.name}-${index}`}><span className="truncate">{file.name}</span><button className="shrink-0 text-rose-700 underline" onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}>削除</button></li>)}</ul></div>}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <fieldset><legend className="mb-3 font-semibold text-slate-900">変換モード</legend><div className="space-y-2"><label className="flex cursor-pointer items-center gap-2"><input type="radio" name="mode" checked={mode === "compress"} onChange={() => setMode("compress")} />ファイルサイズ指定</label><label className="flex cursor-pointer items-center gap-2"><input type="radio" name="mode" checked={mode === "resize"} onChange={() => setMode("resize")} />画像サイズ変更</label></div></fieldset>
            <label className="block font-semibold text-slate-900">出力形式<select className="control mt-2" value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)}><option value="original">元の形式（非対応はPNG）</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
          </div>
          {mode === "compress" ? <div className="mt-5"><label className="font-semibold text-slate-900">目標ファイルサイズ<div className="mt-2 flex max-w-sm gap-2"><input className="control" inputMode="decimal" value={targetSize} onChange={(event) => setTargetSize(event.target.value)} /><select className="control w-24" value={unit} onChange={(event) => setUnit(event.target.value as SizeUnit)}><option>KB</option><option>MB</option></select></div></label><p className="mt-2 text-sm text-slate-500">画質を調整し、元の縦横ピクセル数は保ちます。</p></div> : <div className="mt-5"><div className="grid max-w-lg gap-3 sm:grid-cols-2"><label className="font-semibold text-slate-900">幅（px）<input aria-label="幅（px）" className="control mt-2" inputMode="numeric" value={width} onChange={(event) => setWidth(event.target.value)} /></label><label className="font-semibold text-slate-900">高さ（px）<input aria-label="高さ（px）" className="control mt-2" inputMode="numeric" value={height} onChange={(event) => setHeight(event.target.value)} /></label></div><label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={keepAspectRatio} onChange={(event) => setKeepAspectRatio(event.target.checked)} />縦横比を維持する</label></div>}
        </div>

        {message && <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">{message}</p>}
        <button className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isConverting || !files.length} onClick={handleConvert}>{isConverting ? `変換中… ${progress}/${files.length}` : "変換する"}</button>
      </section>

      {results.length > 0 && <section className="mt-10" aria-live="polite"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">変換結果</h2><div className="flex gap-3"><button className="text-sm text-slate-600 underline" onClick={resetResults}>結果をリセット</button><button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300" disabled={!results.some((result) => result.url)} onClick={downloadAll}>成功分をZIPで一括ダウンロード</button></div></div><div className="grid gap-4 sm:grid-cols-2">{results.map((result) => <article className="overflow-hidden rounded-xl border border-slate-200 bg-white" key={result.id}>{result.url && <img className="h-44 w-full bg-slate-100 object-contain" src={result.url} alt={`${result.original.name} の変換結果`} />}<div className="space-y-2 p-4"><h3 className="truncate font-semibold">{result.fileName ?? result.original.name}</h3>{result.error ? <p className="text-sm text-rose-700">{result.error}</p> : <><p className="text-sm text-slate-600">{formatBytes(result.original.size)} → {formatBytes(result.size ?? 0)}</p><p className="text-sm text-slate-600">出力サイズ: {result.dimensions?.width} × {result.dimensions?.height}px</p>{result.warning && <p className="text-sm text-amber-700">{result.warning}</p>}<button className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold" onClick={() => download(result)}>個別ダウンロード</button></>}</div></article>)}</div></section>}
    </main>
  );
}
