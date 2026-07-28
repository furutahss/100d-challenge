import { describe, expect, it } from "vitest";
import {
  answerQuiz,
  createGameQuestions,
  createQuizState,
  nextQuestion,
  questions,
} from "./quiz";

describe("シルエットクイズの状態遷移", () => {
  it("正解を選ぶと得点を加算し、答えを表示する", () => {
    const state = createQuizState(0);
    const game = questions.slice(0, 5);
    const answered = answerQuiz(state, game, "elephant");

    expect(answered.score).toBe(1);
    expect(answered.isAnswered).toBe(true);
    expect(answered.isCorrect).toBe(true);
  });

  it("不正解では得点を加算しない", () => {
    const state = createQuizState(0);
    const game = questions.slice(0, 5);
    const answered = answerQuiz(state, game, "bus");

    expect(answered.score).toBe(0);
    expect(answered.isCorrect).toBe(false);
  });

  it("次の問題へ進むと選択状態をリセットし、最後は完了する", () => {
    const game = questions.slice(0, 5);
    const first = answerQuiz(createQuizState(0), game, "elephant");
    const second = nextQuestion(first, game.length);
    const finished = [1, 2, 3, 4].reduce(
      (current) => nextQuestion(current, game.length),
      second,
    );

    expect(second.index).toBe(1);
    expect(second.isAnswered).toBe(false);
    expect(finished.isFinished).toBe(true);
  });

  it("問題プールは30種類あり、1回のセッションは重複なしの5問になる", () => {
    const game = createGameQuestions(() => 0.42);

    expect(questions).toHaveLength(30);
    expect(game).toHaveLength(5);
    expect(new Set(game.map((question) => question.id)).size).toBe(5);
  });

  it("余白が大きい既存画像には表示倍率を指定する", () => {
    expect(questions.find((question) => question.id === "cat")?.displayScale).toBeGreaterThan(1);
  });
});
