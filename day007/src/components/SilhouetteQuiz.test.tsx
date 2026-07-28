import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SilhouetteQuiz } from "./SilhouetteQuiz";
import { questions } from "@/lib/quiz";

describe("SilhouetteQuiz", () => {
  const startGame = () => fireEvent.click(screen.getByRole("button", { name: "あそびを はじめる" }));

  it("開始画面を表示して、操作後にゲームを始める", () => {
    render(<SilhouetteQuiz initialQuestions={questions.slice(0, 5)} />);

    expect(screen.getByRole("button", { name: "あそびを はじめる" })).toBeInTheDocument();
    startGame();
    expect(screen.getByText("なんの シルエットかな？")).toBeInTheDocument();
  });

  it("正解を選ぶと答えの画像と次へ進むボタンを表示する", () => {
    render(<SilhouetteQuiz initialQuestions={questions.slice(0, 5)} />);
    startGame();

    fireEvent.click(screen.getByRole("button", { name: "ぞう" }));

    expect(screen.getByText("せいかい！ ぞう だよ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "つぎの もんだい" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "ぞうのえ" })).toBeInTheDocument();
  });

  it("答えのボタンに、文字と対応する小さな絵を表示する", () => {
    render(<SilhouetteQuiz initialQuestions={questions.slice(0, 5)} />);
    startGame();

    expect(screen.getByRole("button", { name: "ぞう" })).toContainElement(
      screen.getByRole("img", { name: "ぞうのえ" }),
    );
  });

  it("最後まで答えると結果を表示し、もう一度遊べる", () => {
    render(<SilhouetteQuiz initialQuestions={questions.slice(0, 5)} />);
    startGame();
    fireEvent.click(screen.getByRole("button", { name: "ぞう" }));
    fireEvent.click(screen.getByRole("button", { name: "つぎの もんだい" }));
    fireEvent.click(screen.getByRole("button", { name: "ねこ" }));
    fireEvent.click(screen.getByRole("button", { name: "つぎの もんだい" }));
    fireEvent.click(screen.getByRole("button", { name: "いぬ" }));
    fireEvent.click(screen.getByRole("button", { name: "つぎの もんだい" }));
    fireEvent.click(screen.getByRole("button", { name: "うさぎ" }));
    fireEvent.click(screen.getByRole("button", { name: "つぎの もんだい" }));
    fireEvent.click(screen.getByRole("button", { name: "らいおん" }));
    fireEvent.click(screen.getByRole("button", { name: "けっかを みる" }));

    expect(screen.getByText("5 もん せいかい！")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "もういちど あそぶ" }));
    expect(screen.getByRole("button", { name: "あそびを はじめる" })).toBeInTheDocument();
  });
});
