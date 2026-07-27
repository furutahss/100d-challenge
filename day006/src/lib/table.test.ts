import { describe, expect, it } from "vitest";
import { cellsFromClipboard, markdownFromTable, updateCell } from "./table";

describe("cellsFromClipboard", () => {
  it("スプレッドシート由来のタブ区切り文字列を行と列に変換する", () => {
    expect(cellsFromClipboard("名前\t役割\n佐藤\t開発"))
      .toEqual([["名前", "役割"], ["佐藤", "開発"]]);
  });

  it("CRLFと末尾改行を正規化する", () => {
    expect(cellsFromClipboard("A\tB\r\n1\t2\r\n")).toEqual([["A", "B"], ["1", "2"]]);
  });

  it("空のセルを保持し、最長行に合わせて埋める", () => {
    expect(cellsFromClipboard("A\t\n1\t2\t3")).toEqual([["A", "", ""], ["1", "2", "3"]]);
  });
});

describe("markdownFromTable", () => {
  it("1行目を見出しとしてMarkdownテーブルへ変換する", () => {
    expect(markdownFromTable([["名前", "役割"], ["佐藤", "開発"]]))
      .toBe("| 名前 | 役割 |\n| --- | --- |\n| 佐藤 | 開発 |");
  });

  it("パイプ、改行、バックスラッシュをMarkdown用にエスケープする", () => {
    expect(markdownFromTable([["A|B", "改行\n文字"], ["\\", ""]]))
      .toBe("| A\\|B | 改行<br>文字 |\n| --- | --- |\n| \\\\ |  |");
  });
});

describe("updateCell", () => {
  it("対象セルだけを不変に更新する", () => {
    const original = [["A", "B"], ["1", "2"]];
    expect(updateCell(original, 1, 0, "10")).toEqual([["A", "B"], ["10", "2"]]);
    expect(original[1][0]).toBe("1");
  });
});
