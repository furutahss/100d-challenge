import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { DummyImageGenerator } from "./DummyImageGenerator";

beforeAll(() => {
  window.requestAnimationFrame = ((callback: FrameRequestCallback) => { callback(0); return 0; }) as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = vi.fn();
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillStyle: "", strokeStyle: "", lineWidth: 0, textAlign: "", textBaseline: "", font: "",
    fillRect: vi.fn(), strokeRect: vi.fn(), fillText: vi.fn(), beginPath: vi.fn(), arc: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.toDataURL = vi.fn(() => "data:image/png;base64,preview") as unknown as typeof HTMLCanvasElement.prototype.toDataURL;
});

describe("DummyImageGenerator", () => {
  it("初期設定のプレビューとダウンロードを表示する", () => {
    render(<DummyImageGenerator />);
    expect(screen.getByRole("heading", { name: "ダミー画像ジェネレーター" })).toBeInTheDocument();
    expect(screen.getByText("1200 × 630px · PNG")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ダウンロード" })).toBeEnabled();
  });

  it("プリセットでサイズを変更できる", () => {
    render(<DummyImageGenerator />);
    fireEvent.click(screen.getByRole("button", { name: "正方形" }));
    expect(screen.getAllByDisplayValue("1080")).toHaveLength(2);
    expect(screen.getByText("1080 × 1080px · PNG")).toBeInTheDocument();
  });

  it("不正なカラーコードは生成を止めて知らせる", () => {
    render(<DummyImageGenerator />);
    fireEvent.change(screen.getByLabelText("背景色を選択").nextElementSibling as HTMLInputElement, { target: { value: "blue" } });
    expect(screen.getByRole("alert")).toHaveTextContent("#RRGGBB");
  });

  it("形式を変えると自動で再生成される", () => {
    render(<DummyImageGenerator />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "jpeg" } });
    expect(screen.getByRole("button", { name: "ダウンロード" })).toBeEnabled();
  });

  it("ベタ塗り以外のデザインを選んで生成できる", () => {
    render(<DummyImageGenerator />);
    fireEvent.click(screen.getByRole("button", { name: "ドットデザイン" }));
    expect(screen.getByRole("button", { name: "ドットデザイン" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "ダウンロード" })).toBeEnabled();
  });

  it("有効な色に変更すると自動でプレビューを更新する", () => {
    render(<DummyImageGenerator />);
    fireEvent.change(screen.getByLabelText("背景色を選択").nextElementSibling as HTMLInputElement, { target: { value: "#123456" } });
    expect(screen.getByRole("button", { name: "ダウンロード" })).toBeEnabled();
  });

  it("サイズを変更すると自動でプレビューを更新する", () => {
    render(<DummyImageGenerator />);
    fireEvent.change(screen.getAllByRole("spinbutton")[0], { target: { value: "800" } });
    expect(screen.getByText("800 × 630px · PNG")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ダウンロード" })).toBeEnabled();
  });
});
