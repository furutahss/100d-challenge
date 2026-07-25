import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ImageConverter } from "./ImageConverter";

describe("ImageConverter", () => {
  it("モードを切り替えると画像サイズ入力を表示する", () => {
    render(<ImageConverter />);
    fireEvent.click(screen.getByRole("radio", { name: "画像サイズ変更" }));
    expect(screen.getByLabelText("幅（px）")).toBeInTheDocument();
    expect(screen.getByLabelText("高さ（px）")).toBeInTheDocument();
  });

  it("画像以外のファイルを追加したときエラーを表示する", () => {
    render(<ImageConverter />);
    const input = screen.getByLabelText("画像を選択");
    fireEvent.change(input, { target: { files: [new File(["x"], "memo.txt", { type: "text/plain" })] } });
    expect(screen.getByText("画像ファイルのみ追加できます: memo.txt")).toBeInTheDocument();
  });
});
