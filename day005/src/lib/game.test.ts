import { describe, expect, it } from "vitest";
import { createQuestion, getResultMessage, isCorrect, numberWords } from "./game";

describe("createQuestion", () => {
  it("1〜10の範囲で前問と異なる数の問題を作る", () => {
    const question = createQuestion(5, () => 0.4);

    expect(question.count).toBeGreaterThanOrEqual(1);
    expect(question.count).toBeLessThanOrEqual(10);
    expect(question.count).not.toBe(5);
    expect(question.item).toBeTruthy();
  });
});

describe("ゲームの判定", () => {
  it("選んだ数と正解数を比較する", () => {
    expect(isCorrect(7, 7)).toBe(true);
    expect(isCorrect(6, 7)).toBe(false);
  });

  it("数字に対応するひらがなを返す", () => {
    expect(numberWords[1]).toBe("いち");
    expect(numberWords[10]).toBe("じゅう");
  });

  it("正解数に応じた結果メッセージを返す", () => {
    expect(getResultMessage(10)).toContain("すごい");
    expect(getResultMessage(6)).toBe("よくできました！");
    expect(getResultMessage(5)).toContain("がんばった");
  });
});
