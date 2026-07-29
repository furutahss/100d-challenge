"use client";

import { FormEvent, useState } from "react";
import { parseOgpHtml, type OgpResult } from "@/lib/ogp";

type Status = "idle" | "loading" | "success" | "error";

export function OgpPreviewer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<OgpResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const inspect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const target = new URL(url);
      if (!/^https?:$/.test(target.protocol)) throw new Error("invalid-url");
      setStatus("loading");
      setResult(null);
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(target.href)}`);
      if (!response.ok) throw new Error("fetch-failed");
      setResult(parseOgpHtml(await response.text(), target.href));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-indigo-600">SOCIAL SHARE CHECKER</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">OGP-Previewer</h1>
          <p className="mt-3 max-w-2xl text-slate-600">既存サイトのURLからOpen Graphタグを読み取り、SNSシェア時のカード表示を確認します。</p>
        </header>

        <form onSubmit={inspect} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex sm:items-end sm:gap-4">
          <div className="flex-1">
            <label htmlFor="target-url" className="text-sm font-semibold">調べたいページのURL</label>
            <input id="target-url" value={url} onChange={(event) => setUrl(event.target.value)} required type="url" placeholder="https://example.com/article" className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
          </div>
          <button type="submit" disabled={status === "loading"} className="mt-4 w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70 sm:mt-0 sm:w-auto">{status === "loading" ? "取得中…" : "OGPを確認"}</button>
        </form>
        <p className="mt-3 text-xs text-slate-500">URLのHTML取得には公開プロキシを使用します。認証が必要なページやアクセス制限のあるページは確認できません。</p>

        {status === "error" && <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">OGP情報を取得できませんでした。URL、ページの公開状態、またはアクセス制限を確認してください。</p>}

        {result && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">シェアカードのプレビュー</h2>
              <article className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                {result.image ? (
                  // 外部サイトの画像URLをそのまま表示するため、Next.jsの画像最適化は使わない。
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="h-56 w-full object-cover" src={result.image} alt={`${result.title}のOGP画像`} />
                ) : <div className="grid h-56 place-items-center bg-slate-100 text-sm font-medium text-slate-500">OGP画像が設定されていません</div>}
                <div className="bg-slate-100 p-4"><p className="truncate text-xs uppercase tracking-wide text-slate-500">{result.url.replace(/^https?:\/\//, "")}</p><h3 className="mt-1.5 truncate text-lg font-bold">{result.title}</h3><p className="mt-1 line-clamp-2 text-sm text-slate-600">{result.description}</p><p className="mt-2 text-xs font-medium text-slate-500">{result.siteName}</p></div>
              </article>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">検出したメタタグ</h2><p className="mt-1 text-sm text-slate-500">{Object.keys(result.tags).length}件のOGP / Twitterタグを検出しました。</p><dl className="mt-5 divide-y divide-slate-100">{Object.entries(result.tags).map(([name, content]) => <div className="py-3" key={name}><dt className="font-mono text-xs font-semibold text-indigo-700">{name}</dt><dd className="mt-1 break-all text-sm text-slate-700">{content}</dd></div>)}</dl></section>
          </div>
        )}
      </div>
    </main>
  );
}
