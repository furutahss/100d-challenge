import { describe, expect, it } from "vitest";
import { extractPalette, fillPalette, rgbToHex } from "./palette";

describe("palette helpers", () => {
  it("RGBを大文字のHexへ変換する", () => {
    expect(rgbToHex({ r: 15, g: 160, b: 255 })).toBe("#0FA0FF");
  });

  it("出現数が多い色を優先して抽出する", () => {
    const pixels = new Uint8ClampedArray([
      255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 0, 0, 255, 255,
      0, 0, 255, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255,
    ]);
    expect(extractPalette(pixels, 2)).toEqual(["#FF0000", "#00FF00"]);
  });

  it("半透明のピクセルを無視し、5枠を必ず埋める", () => {
    expect(extractPalette(new Uint8ClampedArray([20, 30, 40, 30]))).toEqual([]);
    expect(fillPalette(["#123456"])).toHaveLength(5);
  });
});
