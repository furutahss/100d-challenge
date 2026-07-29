import { describe, expect, it } from "vitest";
import { parseOgpHtml } from "./ogp";

describe("OGP HTML の解析", () => {
  it("Open Graphタグを読み取り、プレビュー用の情報にする", () => {
    const result = parseOgpHtml(`
      <html><head>
        <meta property="og:title" content="春のカフェ巡り" />
        <meta property="og:description" content="お気に入りのカフェを紹介します。" />
        <meta property="og:image" content="https://images.example.com/cafe.jpg" />
        <meta property="og:site_name" content="Sample Note" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://example.com/cafe" />
      </head></html>`, "https://example.com/fallback");

    expect(result).toMatchObject({ title: "春のカフェ巡り", image: "https://images.example.com/cafe.jpg", type: "article" });
    expect(result.tags["og:url"]).toBe("https://example.com/cafe");
  });

  it("OGPがない場合はtitleタグをフォールバックにする", () => {
    const result = parseOgpHtml("<html><head><title>既存サイト</title></head></html>", "https://example.com");

    expect(result.title).toBe("既存サイト");
    expect(result.tags).toEqual({});
  });
});
