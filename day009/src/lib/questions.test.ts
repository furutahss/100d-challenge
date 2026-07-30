import { describe, expect, it } from "vitest";
import { formatSpeed, getQuestions, questions } from "./questions";

describe("速さクイズの問題データ", () => {
  it("最大30問あり、1ラウンドは5問に切り出せる", () => { expect(questions).toHaveLength(30); expect(getQuestions(0)).toHaveLength(5); expect(getQuestions(25)).toHaveLength(5); });
  it("各問題は速さが同じ乗り物を組み合わせない", () => { expect(questions.every(({ left, right }) => left.speed !== right.speed)).toBe(true); });
  it("速度を読みやすく表示する", () => { expect(formatSpeed(28000)).toBe("28,000 km/h"); });
});
