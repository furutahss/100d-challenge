import { describe, expect, it } from "vitest";
import {
  bytesFromSize,
  calculateDimensions,
  createOutputFileName,
  validateImageFiles,
} from "./image-utils";

describe("bytesFromSize", () => {
  it("KBとMBをバイト数へ変換する", () => {
    expect(bytesFromSize(1, "KB")).toBe(1024);
    expect(bytesFromSize(1.5, "MB")).toBe(1.5 * 1024 * 1024);
  });

  it("0以下または数値でない値を拒否する", () => {
    expect(() => bytesFromSize(0, "KB")).toThrow("正の数値");
    expect(() => bytesFromSize(Number.NaN, "MB")).toThrow("正の数値");
  });
});

describe("calculateDimensions", () => {
  it("縦横比を維持して幅から高さを算出する", () => {
    expect(calculateDimensions({ width: 1600, height: 900 }, { width: 800 }, true)).toEqual({
      width: 800,
      height: 450,
    });
  });

  it("縦横比を維持せず指定した寸法を返す", () => {
    expect(calculateDimensions({ width: 1600, height: 900 }, { width: 600, height: 600 }, false)).toEqual({
      width: 600,
      height: 600,
    });
  });
});

describe("createOutputFileName", () => {
  it("圧縮モードの名前を生成する", () => {
    expect(createOutputFileName("holiday.photo.png", "compress", "image/webp")).toBe("holiday.photo-compressed.webp");
  });

  it("リサイズモードの名前を生成する", () => {
    expect(createOutputFileName("photo.jpeg", "resize", "image/jpeg", { width: 800, height: 600 })).toBe("photo-800x600.jpg");
  });
});

describe("validateImageFiles", () => {
  it("画像だけを受け付け、問題のあるファイルを報告する", () => {
    const image = new File(["image"], "photo.png", { type: "image/png" });
    const text = new File(["text"], "notes.txt", { type: "text/plain" });

    expect(validateImageFiles([image, text])).toEqual({ accepted: [image], rejected: ["notes.txt"] });
  });
});
