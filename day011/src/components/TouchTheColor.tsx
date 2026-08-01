"use client";

import { useEffect, useState } from "react";
import { COLORS, createBalls, difficultyFor, moveBall, nextTarget, scoreTap, type Ball, type ColorId } from "@/lib/game";

const GAME_SECONDS = 30;
const colorById = Object.fromEntries(COLORS.map((color) => [color.id, color]));

type GameStatus = "start" | "playing" | "finished";

export function TouchTheColor() {
  const [status, setStatus] = useState<GameStatus>("start");
  const [score, setScore] = useState(0);
  const [clears, setClears] = useState(0);
  const [remaining, setRemaining] = useState(GAME_SECONDS);
  const [target, setTarget] = useState<ColorId>("coral");
  const [balls, setBalls] = useState<Ball[]>([]);
  const [message, setMessage] = useState("準備ができたらスタート！");
  const [round, setRound] = useState(0);

  const createRound = (nextTargetId: ColorId, nextClears: number) => {
    setRound((value) => value + 1);
    setTarget(nextTargetId);
    setBalls(createBalls(nextTargetId, difficultyFor(nextClears).ballCount));
  };

  const startGame = () => {
    setRound(0);
    setScore(0);
    setClears(0);
    setRemaining(GAME_SECONDS);
    setMessage("お題の色をタップ！");
    setStatus("playing");
    createRound("coral", 0);
  };

  // iOS Chromeではタップがclickへ変換されない状況があるため、touchstartも受け取る。
  const handleTouch = (action: () => void) => (event: React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    action();
  };

  useEffect(() => {
    if (status !== "playing") return;
    const countdown = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    const finish = window.setTimeout(() => setStatus("finished"), GAME_SECONDS * 1000);
    return () => { window.clearInterval(countdown); window.clearTimeout(finish); };
  }, [status]);

  useEffect(() => {
    if (status !== "playing") return;
    const difficulty = difficultyFor(clears);
    const moveBalls = () => setBalls((current) => current.map((ball) => moveBall(ball, difficulty)));
    // 新しいラウンドでも待機せず、表示直後から次の目的地へ動かす。
    moveBalls();
    const mover = window.setInterval(moveBalls, difficulty.interval);
    return () => window.clearInterval(mover);
  }, [clears, status]);

  const tapBall = (ball: Ball) => {
    if (status !== "playing") return;
    const correct = ball.color === target;
    const nextScore = scoreTap(correct, score);
    setScore(nextScore);
    if (correct) {
      const next = nextTarget(target);
      const nextClears = clears + 1;
      setClears(nextClears);
      setMessage("せいかい！ つぎの色をさがそう");
      createRound(next, nextClears);
    } else {
      setMessage("おっと！ お題の色をよく見てね");
    }
  };

  const targetColor = colorById[target];

  return (
    <main className="min-h-screen bg-[#101b38] px-4 py-5 text-white sm:px-8 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-5 flex items-center justify-between">
          <div><p className="text-xs font-bold tracking-[.24em] text-cyan-300">DAY 11 · VISION GAME</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">タッチ・ザ・カラー</h1></div>
          <div aria-hidden className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 via-amber-300 to-cyan-400 text-2xl shadow-lg">●</div>
        </header>

        {status === "start" && <section className="rounded-[2rem] bg-white p-7 text-center text-slate-900 shadow-2xl sm:p-11" aria-labelledby="start-title">
          <div aria-hidden className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-rose-400 via-amber-300 to-cyan-400 text-5xl shadow-lg">●</div>
          <h2 id="start-title" className="mt-7 text-3xl font-black">色を見つけてタップ！</h2><p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">画面を動き回るボールのなかから、お題と同じ色だけをタップしよう。正解で<strong>＋10点</strong>、まちがえると<strong>−5点</strong>です。</p>
          <button type="button" onClick={startGame} onTouchStart={handleTouch(startGame)} className="touch-manipulation mt-8 rounded-2xl bg-[#f05252] px-10 py-4 text-lg font-black text-white shadow-lg transition hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-rose-200">ゲームをはじめる</button>
          <p className="mt-4 text-sm font-bold text-slate-400">制限時間 30 秒</p>
        </section>}

        {status === "playing" && <section className="overflow-hidden rounded-[2rem] bg-white text-slate-900 shadow-2xl" aria-labelledby="game-title">
          <h2 id="game-title" className="sr-only">ゲーム画面</h2>
          <div className="flex items-center justify-between bg-slate-50 px-5 py-4 sm:px-7"><div><p className="text-xs font-bold tracking-wider text-slate-400">TOUCH THIS COLOR</p><p className="mt-1 flex items-center gap-2 text-xl font-black"><span className="h-6 w-6 rounded-full border-2 border-white shadow" style={{ backgroundColor: targetColor.hex }} />{targetColor.label}</p></div><div className="flex gap-3 text-right"><div><p className="text-xs font-bold text-slate-400">SCORE</p><p className="text-2xl font-black tabular-nums">{score}</p></div><div><p className="text-xs font-bold text-slate-400">TIME</p><p className={`text-2xl font-black tabular-nums ${remaining <= 5 ? "text-rose-500" : ""}`}>{remaining}</p></div></div></div>
          <div className="relative h-[440px] overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#284979,transparent_35%),radial-gradient(circle_at_80%_80%,#542e72,transparent_42%),#15264d]" aria-label="カラーボールが動くゲームエリア">
            {balls.map((ball) => <button key={`${round}-${ball.id}`} type="button" aria-label={`${colorById[ball.color].label}のボール`} onClick={() => tapBall(ball)} onTouchStart={handleTouch(() => tapBall(ball))} className="touch-manipulation absolute grid place-items-center rounded-full border-4 border-white/70 shadow-[0_10px_18px_rgba(0,0,0,.28)] transition-all ease-linear focus:outline-none focus:ring-4 focus:ring-white" style={{ width: ball.size, height: ball.size, left: `${ball.x}%`, top: `${ball.y}%`, transitionDuration: `${difficultyFor(clears).duration}ms`, background: `radial-gradient(circle at 32% 27%, #fff9, ${colorById[ball.color].hex} 36%, #0003 100%)` }}><span aria-hidden className="h-2 w-2 rounded-full bg-white/70" /></button>)}
            <p className="absolute bottom-4 left-1/2 w-full -translate-x-1/2 px-4 text-center text-sm font-bold text-white/90" aria-live="polite">{message}</p>
          </div>
        </section>}

        {status === "finished" && <section className="rounded-[2rem] bg-white p-7 text-center text-slate-900 shadow-2xl sm:p-11" aria-labelledby="result-title">
          <p className="text-sm font-black tracking-[.2em] text-cyan-600">TIME UP!</p><h2 id="result-title" className="mt-3 text-3xl font-black">ゲームしゅうりょう！</h2><div className="mx-auto mt-7 grid h-40 w-40 place-items-center rounded-full border-8 border-amber-200 bg-amber-50"><div><p className="text-xs font-bold tracking-wider text-slate-500">SCORE</p><p className="text-5xl font-black text-[#f05252]">{score}</p></div></div><p className="mt-6 text-slate-600">{score >= 100 ? "すごい！色の見きわめ名人！" : score >= 50 ? "いい調子！もう一度挑戦しよう！" : "あせらず色をよく見てみよう！"}</p><button type="button" onClick={startGame} onTouchStart={handleTouch(startGame)} className="touch-manipulation mt-8 rounded-2xl bg-[#f05252] px-10 py-4 text-lg font-black text-white shadow-lg transition hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-rose-200">もう一度あそぶ</button></section>}
        <p className="mt-5 text-center text-xs text-blue-200">ボールは自動で動きます。タップ・クリックで遊べます。</p>
      </div>
    </main>
  );
}
