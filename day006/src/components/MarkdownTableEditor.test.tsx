import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MarkdownTableEditor } from "./MarkdownTableEditor";

describe("MarkdownTableEditor", () => {
  it("セルの編集を即座にMarkdown出力へ反映する", () => {
    render(<MarkdownTableEditor />);

    fireEvent.change(screen.getByLabelText("1行目 1列目"), {
      target: { value: "列名" },
    });

    expect(screen.getByRole("textbox", { name: "Markdown出力" })).toHaveValue(
      "| 列名 | 内容 |\n| --- | --- |\n| 言語 | TypeScript |\n| スタイル | Tailwind CSS / SCSS |",
    );
  });

  it("貼り付けたタブ区切り表を読み込み、Markdown出力を更新する", () => {
    render(<MarkdownTableEditor />);
    const editor = screen.getByLabelText("表データの貼り付け");

    fireEvent.paste(editor, {
      clipboardData: { getData: () => "項目\t内容\n言語\tTypeScript" },
    });

    expect(screen.getByLabelText("1行目 1列目")).toHaveValue("項目");
    expect(screen.getByRole("textbox", { name: "Markdown出力" })).toHaveValue(
      "| 項目 | 内容 |\n| --- | --- |\n| 言語 | TypeScript |",
    );
  });

  it("コピー操作でMarkdownをクリップボードへ渡し、完了を知らせる", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<MarkdownTableEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Markdownをコピー" }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("|"));
    expect(await screen.findByText("コピーしました")).toBeInTheDocument();
  });
});
