export type Vehicle = { name: string; emoji: string; speed: number; color: string };
export type Question = { left: Vehicle; right: Vehicle };

const vehicles: Vehicle[] = [
  { name: "自転車", emoji: "🚲", speed: 25, color: "#f59e0b" }, { name: "路線バス", emoji: "🚌", speed: 80, color: "#ef4444" },
  { name: "新幹線", emoji: "🚄", speed: 320, color: "#2563eb" }, { name: "飛行機", emoji: "✈️", speed: 900, color: "#7c3aed" },
  { name: "ロケット", emoji: "🚀", speed: 28000, color: "#0f766e" }, { name: "自動車", emoji: "🚗", speed: 120, color: "#e11d48" },
  { name: "オートバイ", emoji: "🏍️", speed: 180, color: "#334155" }, { name: "ヘリコプター", emoji: "🚁", speed: 250, color: "#16a34a" },
  { name: "ヨット", emoji: "⛵", speed: 30, color: "#0891b2" }, { name: "トラック", emoji: "🚚", speed: 100, color: "#b45309" },
  { name: "スクーター", emoji: "🛵", speed: 60, color: "#db2777" }, { name: "電車", emoji: "🚃", speed: 130, color: "#475569" },
];

export const questions: Question[] = Array.from({ length: 30 }, (_, index) => {
  const left = vehicles[index % vehicles.length];
  const right = vehicles[(index * 5 + 3) % vehicles.length];
  return { left, right: left.speed === right.speed ? vehicles[(index * 5 + 4) % vehicles.length] : right };
});

export const getQuestions = (start: number, count = 5) => questions.slice(start, start + count);
export const formatSpeed = (speed: number) => `${speed.toLocaleString("ja-JP")} km/h`;
