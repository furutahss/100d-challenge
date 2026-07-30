import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SpeedQuiz } from "./SpeedQuiz";

describe("SpeedQuiz", () => {
  it("最初はスタート画面を表示する", () => { render(<SpeedQuiz />); expect(screen.getByRole("button", { name: "ゲームをはじめる" })).toBeInTheDocument(); expect(screen.queryAllByRole("button", { name: /を選ぶ/ })).toHaveLength(0); });
  it("スタートするとタイトルと2つの乗り物を表示する", () => { render(<SpeedQuiz />); fireEvent.click(screen.getByRole("button", { name: "ゲームをはじめる" })); expect(screen.getByRole("heading", { name: "どっちがはやい？" })).toBeInTheDocument(); expect(screen.getAllByRole("button", { name: /を選ぶ/ })).toHaveLength(2); });
  it("回答後に正解表示と次の問題ボタンを出す", () => { render(<SpeedQuiz />); fireEvent.click(screen.getByRole("button", { name: "ゲームをはじめる" })); fireEvent.click(screen.getAllByRole("button", { name: /を選ぶ/ })[0]); expect(screen.getByRole("status")).toBeInTheDocument(); expect(screen.getByRole("button", { name: "次の問題へ" })).toBeInTheDocument(); });
  it("5問答えると結果画面になり、もう一度遊べる", () => { render(<SpeedQuiz />); fireEvent.click(screen.getByRole("button", { name: "ゲームをはじめる" })); for (let i = 0; i < 4; i += 1) { fireEvent.click(screen.getAllByRole("button", { name: /を選ぶ/ })[0]); fireEvent.click(screen.getByRole("button", { name: "次の問題へ" })); } fireEvent.click(screen.getAllByRole("button", { name: /を選ぶ/ })[0]); fireEvent.click(screen.getByRole("button", { name: "結果を見る" })); expect(screen.getByRole("heading", { name: "5問おわり！" })).toBeInTheDocument(); expect(screen.getByRole("button", { name: "もう一度遊ぶ" })).toBeInTheDocument(); });
});
