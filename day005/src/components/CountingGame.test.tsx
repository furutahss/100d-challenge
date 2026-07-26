import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CountingGame } from "./CountingGame";

describe("CountingGame", () => {
  it("問題とアクセシブルな数字ボタンを表示する", () => {
    render(<CountingGame random={() => 0} />);

    expect(screen.getByText("いくつ あるかな？")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1、いち" })).toBeInTheDocument();
    expect(screen.getByText("もんだい 1 / 10")).toBeInTheDocument();
  });

  it("解答後にフィードバックを表示して選択肢を無効にする", () => {
    render(<CountingGame random={() => 0} />);
    fireEvent.click(screen.getByRole("button", { name: "1、いち" }));

    expect(screen.getByText("せいかい！")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2、に" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "つぎへ" })).toBeInTheDocument();
  });

  it("全問終了後に結果を表示し、もう一度遊べる", () => {
    render(<CountingGame random={() => 0} />);

    for (let index = 0; index < 10; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: "10、じゅう" }));
      fireEvent.click(
        screen.getByRole("button", { name: index === 9 ? "けっかをみる" : "つぎへ" }),
      );
    }

    expect(screen.getByText("よく がんばりました！")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "もういちど あそぶ" }));
    expect(screen.getByText("もんだい 1 / 10")).toBeInTheDocument();
  });
});
