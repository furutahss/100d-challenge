import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PaletteExtractor } from "./PaletteExtractor";

describe("PaletteExtractor", () => {
  afterEach(() => vi.restoreAllMocks());

  it("初期状態で5色と画像選択エリアを表示する", () => {
    render(<PaletteExtractor />);
    expect(screen.getByRole("heading", { name: "画像 → カラーパレット抽出" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /をコピー/ })).toHaveLength(5);
    expect(screen.getByRole("button", { name: "画像を選択またはドロップ" })).toBeInTheDocument();
  });

  it("画像以外のファイルにエラーを表示する", () => {
    render(<PaletteExtractor />);
    const input = document.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [new File(["text"], "memo.txt", { type: "text/plain" })] } });
    expect(screen.getByRole("alert")).toHaveTextContent("画像ファイル");
  });

  it("色コードをクリップボードへコピーする", async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    render(<PaletteExtractor />);
    fireEvent.click(screen.getAllByRole("button", { name: /をコピー/ })[0]);
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith("#1E3A8A"));
    expect(screen.getByText("コピー済み")).toBeInTheDocument();
  });
});
