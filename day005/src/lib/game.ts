export type Question = {
  count: number;
  item: string;
};

const items = ["🍎", "🐥", "🚗", "⭐", "🍓", "🦋", "🎈", "🐟"];

export const numberWords: Record<number, string> = {
  1: "いち",
  2: "に",
  3: "さん",
  4: "よん",
  5: "ご",
  6: "ろく",
  7: "なな",
  8: "はち",
  9: "きゅう",
  10: "じゅう",
};

export function createQuestion(
  previousCount: number | undefined,
  random: () => number = Math.random,
): Question {
  let count = Math.floor(random() * 10) + 1;
  if (count === previousCount) {
    count = (count % 10) + 1;
  }

  return {
    count,
    item: items[Math.floor(random() * items.length)],
  };
}

export function isCorrect(answer: number, count: number): boolean {
  return answer === count;
}

export function getResultMessage(score: number): string {
  if (score >= 9) return "すごい！ かぞえるのが じょうずだね！";
  if (score >= 6) return "よくできました！";
  return "さいごまで がんばったね！";
}
