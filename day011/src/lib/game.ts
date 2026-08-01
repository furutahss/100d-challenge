export const COLORS = [
  { id: "coral", label: "あか", hex: "#f05252" },
  { id: "blue", label: "あお", hex: "#3b82f6" },
  { id: "yellow", label: "きいろ", hex: "#fbbf24" },
  { id: "purple", label: "むらさき", hex: "#a855f7" },
] as const;

export type ColorId = (typeof COLORS)[number]["id"];
export type Ball = { id: number; color: ColorId; x: number; y: number; size: number };
export type Difficulty = { ballCount: number; interval: number; duration: number; horizontalDistance: number; verticalDistance: number };

export function createBalls(target: ColorId, count: number, random = Math.random): Ball[] {
  return Array.from({ length: count }, (_, index) => {
    const color = index === 0 ? target : COLORS[Math.floor(random() * COLORS.length)].id;
    return { id: index, color, x: 8 + random() * 76, y: 12 + random() * 70, size: 48 + random() * 18 };
  });
}

export function nextTarget(current: ColorId, random = Math.random): ColorId {
  const options = COLORS.filter((color) => color.id !== current);
  return options[Math.floor(random() * options.length)].id;
}

export function scoreTap(isCorrect: boolean, score: number): number {
  return Math.max(0, score + (isCorrect ? 10 : -5));
}

export function difficultyFor(clears: number): Difficulty {
  const level = Math.max(0, clears);
  const interval = Math.max(1500, 2600 - level * 120);
  return {
    ballCount: Math.min(10, 6 + Math.floor(level / 2)),
    interval,
    // 次の目的地を少し早く渡し、停止せずに連続して動かす。
    duration: interval + 200,
    horizontalDistance: Math.min(38, 20 + level * 3),
    verticalDistance: Math.min(30, 18 + level * 2),
  };
}

export function moveBall(ball: Ball, difficulty: Difficulty, random = Math.random): Ball {
  const x = Math.min(84, Math.max(6, ball.x + (random() * difficulty.horizontalDistance * 2 - difficulty.horizontalDistance)));
  const y = Math.min(82, Math.max(10, ball.y + (random() * difficulty.verticalDistance * 2 - difficulty.verticalDistance)));
  return { ...ball, x, y };
}
