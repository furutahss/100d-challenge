import { ProjectGrid } from "@/components/ProjectGrid";
import { projects, publishedCount } from "@/data/projects";

export default function Home() {
  const progress = `${publishedCount}%`;

  return (
    <main className="min-h-screen overflow-hidden bg-paper text-ink">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-1 bg-acid" />

      <header className="mx-auto max-w-[1500px] px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-10">
        <nav
          aria-label="ページ情報"
          className="mb-14 flex items-center justify-between border-b border-ink/20 pb-4 sm:mb-20 lg:mb-12"
        >
          <a
            className="text-sm font-black tracking-[-0.04em] transition-opacity hover:opacity-60"
            href="#top"
          >
            FURUTAHSS
          </a>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">
            001—100 / ongoing
          </p>
        </nav>

        <div id="top" className="grid items-end gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="mb-4 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-acid ring-1 ring-ink" />
              100 days of vibe coding
            </p>
            <h1 className="hero-title max-w-[1000px] font-black uppercase leading-[0.78] tracking-[-0.085em]">
              <span className="block">Make.</span>
              <span className="flex items-center gap-[0.12em]">
                <span>Every</span>
                <span className="hero-badge inline-flex aspect-square items-center justify-center rounded-full bg-ink text-paper">
                  ×
                </span>
                <span>Day.</span>
              </span>
            </h1>
          </div>

          <div className="border-l-0 border-ink/20 lg:border-l lg:pl-8">
            <p className="text-base font-bold leading-[1.8] tracking-[-0.025em] sm:text-lg">
              AIと一緒に、毎日ひとつ。
              <br />
              小さなアイデアを、動くものへ。
            </p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-ink/60">
              SNSでの発信と技術力の向上、日常の省力化を目指す100日間の制作記録です。すべての実装をバイブコーディングで進めています。
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 border-y border-ink/20 py-5 sm:grid-cols-[1fr_auto] sm:items-center lg:mt-8 lg:py-4">
          <div className="flex flex-wrap gap-2">
            {[
              "01 / One project a day",
              "02 / Built with AI",
              "03 / Learn in public",
            ].map((label) => (
              <span
                className="rounded-full border border-ink/25 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] sm:text-[10px]"
                key={label}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 sm:min-w-[280px]">
            <span className="font-mono text-[10px] font-bold tracking-wider">
              {String(publishedCount).padStart(3, "0")} / 100
            </span>
            <div
              aria-label={`進捗 ${publishedCount}%`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={publishedCount}
              className="h-2 flex-1 overflow-hidden rounded-full border border-ink/20 bg-white/40"
              role="progressbar"
            >
              <div className="h-full bg-ink" style={{ width: progress }} />
            </div>
          </div>
        </div>
      </header>

      <div className="bg-ink px-4 pb-20 pt-9 sm:px-8 sm:pb-28 sm:pt-12 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <ProjectGrid projects={projects} />

          <footer className="mt-12 flex flex-col gap-6 border-t border-white/15 pt-7 text-white sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                Keep making, keep learning.
              </p>
              <p className="mt-2 text-lg font-black tracking-[-0.04em]">
                DAY 100 まで、つづく。
              </p>
            </div>
            <a
              className="w-fit border-b border-acid pb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-acid transition-opacity hover:opacity-60"
              href="#top"
            >
              Back to top ↑
            </a>
          </footer>
        </div>
      </div>
    </main>
  );
}
