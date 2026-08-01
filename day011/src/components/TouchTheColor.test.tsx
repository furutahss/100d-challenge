import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TouchTheColor } from "./TouchTheColor";

describe("TouchTheColor", () => {
  afterEach(() => vi.useRealTimers());

  it("ゲーム開始画面を表示して開始できる", () => {
    render(<TouchTheColor />);
    expect(screen.getByRole("heading", { name: "色を見つけてタップ！" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "ゲームをはじめる" }));
    expect(screen.getByText("TOUCH THIS COLOR")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "あかのボール" }).length).toBeGreaterThan(0);
  });

  it("タッチ操作でもゲームを開始できる", () => {
    render(<TouchTheColor />);
    fireEvent.touchStart(screen.getByRole("button", { name: "ゲームをはじめる" }));
    expect(screen.getByText("TOUCH THIS COLOR")).toBeInTheDocument();
  });

  it("正解のボールをタップするとスコアが上がる", () => {
    render(<TouchTheColor />);
    fireEvent.click(screen.getByRole("button", { name: "ゲームをはじめる" }));
    fireEvent.click(screen.getAllByRole("button", { name: "あかのボール" })[0]);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("せいかい！ つぎの色をさがそう")).toBeInTheDocument();
  });

  it("時間切れで終了画面を表示して再挑戦できる", () => {
    vi.useFakeTimers();
    render(<TouchTheColor />);
    fireEvent.click(screen.getByRole("button", { name: "ゲームをはじめる" }));
    act(() => vi.advanceTimersByTime(31_000));
    expect(screen.getByRole("heading", { name: "ゲームしゅうりょう！" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "もう一度あそぶ" }));
    expect(screen.getByText("TOUCH THIS COLOR")).toBeInTheDocument();
  });
});
