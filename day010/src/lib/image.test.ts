import { describe, expect, it } from "vitest";
import { clampDimension, formatBytes, isHexColor, mimeType, normalizeHexColor } from "./image";

describe("image helpers", () => {
  it("サイズを1〜2400pxに収める", () => {
    expect(clampDimension(-5)).toBe(1);
    expect(clampDimension(2500)).toBe(2400);
    expect(clampDimension(320.6)).toBe(321);
  });

  it("6桁のHexカラーだけを受け付ける", () => {
    expect(isHexColor("#aBc123")).toBe(true);
    expect(isHexColor("#fff")).toBe(false);
    expect(normalizeHexColor("  123456 ")).toBe("#123456");
    expect(normalizeHexColor("not-a-color")).toBe("#e8d8cb");
  });

  it("画像形式とファイルサイズを表示用に変換する", () => {
    expect(mimeType("png")).toBe("image/png");
    expect(mimeType("jpeg")).toBe("image/jpeg");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });
});
