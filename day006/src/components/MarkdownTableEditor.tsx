"use client";

import { useMemo, useState } from "react";
import { cellsFromClipboard, markdownFromTable, TableCells, updateCell } from "@/lib/table";

const initialCells: TableCells = [
  ["項目", "内容"],
  ["言語", "TypeScript"],
  ["スタイル", "Tailwind CSS / SCSS"],
];

export function MarkdownTableEditor() {
  const [cells, setCells] = useState<TableCells>(initialCells);
  const [copyStatus, setCopyStatus] = useState("");
  const markdown = useMemo(() => markdownFromTable(cells), [cells]);

  const replaceFromClipboard = (text: string) => {
    if (!text.includes("\t") && !text.includes("\n") && !text.includes("\r")) return;
    setCells(cellsFromClipboard(text));
    setCopyStatus("");
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLElement>) => {
    const text = event.clipboardData.getData("text/plain");
    if (text.includes("\t") || text.includes("\n") || text.includes("\r")) {
      event.preventDefault();
      replaceFromClipboard(text);
    }
  };

  const addRow = () => setCells((current) => [...current, Array(current[0].length).fill("")]);
  const addColumn = () => setCells((current) => current.map((row) => [...row, ""]));

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyStatus("コピーしました");
    } catch {
      setCopyStatus("コピーできませんでした。出力欄から選択してください。");
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 max-w-2xl">
          <p className="mb-3 text-sm font-bold tracking-[0.16em] text-teal-700">TABLE TO MARKDOWN</p>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Markdown テーブルジェネレーター</h1>
          <p className="mt-4 leading-7 text-slate-600">表をそのまま編集するか、Excel・Numbers・Googleスプレッドシートから貼り付けるだけ。Markdownはリアルタイムに更新されます。</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="panel" aria-labelledby="table-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="table-heading" className="text-xl font-bold">表を編集</h2>
                <p className="mt-1 text-sm text-slate-500">セルをクリックして入力できます。</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="secondary-button" onClick={addRow}>行を追加</button>
                <button type="button" className="secondary-button" onClick={addColumn}>列を追加</button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full border-collapse text-left">
                <tbody>
                  {cells.map((row, rowIndex) => <tr key={rowIndex}>
                    {row.map((cell, columnIndex) => <td className="border-b border-r border-slate-200 last:border-r-0" key={columnIndex}>
                      <input
                        aria-label={`${rowIndex + 1}行目 ${columnIndex + 1}列目`}
                        className="cell-input"
                        value={cell}
                        onChange={(event) => setCells((current) => updateCell(current, rowIndex, columnIndex, event.target.value))}
                        onPaste={handlePaste}
                      />
                    </td>)}
                  </tr>)}
                </tbody>
              </table>
            </div>

            <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="paste-area">表データの貼り付け</label>
            <textarea id="paste-area" aria-label="表データの貼り付け" className="paste-area" placeholder="ここに表を貼り付け" onPaste={handlePaste} />
            <p className="mt-2 text-xs leading-5 text-slate-500">複数セルをコピーして貼り付けると、表全体を置き換えます。データは外部へ送信されません。</p>
          </section>

          <section className="panel" aria-labelledby="markdown-heading">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 id="markdown-heading" className="text-xl font-bold">Markdown出力</h2>
                <p className="mt-1 text-sm text-slate-500">GitHubなどにそのまま貼り付けできます。</p>
              </div>
              <button type="button" className="copy-button" onClick={copyMarkdown}>Markdownをコピー</button>
            </div>
            <textarea aria-label="Markdown出力" className="markdown-output" value={markdown} readOnly />
            <p aria-live="polite" className="mt-3 min-h-5 text-sm font-medium text-teal-700">{copyStatus}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
