import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OgpPreviewer } from "./OgpPreviewer";

describe("OgpPreviewer", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("URL入力欄と調べるボタンを表示する", () => {
    render(<OgpPreviewer />);

    expect(screen.getByRole("heading", { name: "OGP-Previewer" })).toBeInTheDocument();
    expect(screen.getByLabelText("調べたいページのURL")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OGPを確認" })).toBeInTheDocument();
  });

  it("URLから取得したOGPをプレビューとタグ一覧に表示する", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(`
      <meta property="og:title" content="テスト記事" />
      <meta property="og:description" content="テスト用の説明です" />
      <meta property="og:image" content="https://example.com/image.jpg" />
      <meta property="og:site_name" content="テストサイト" />`),
    }));
    render(<OgpPreviewer />);
    fireEvent.change(screen.getByLabelText("調べたいページのURL"), { target: { value: "https://example.com/news" } });
    fireEvent.click(screen.getByRole("button", { name: "OGPを確認" }));

    expect(await screen.findByRole("heading", { name: "テスト記事", level: 3 })).toBeInTheDocument();
    expect(screen.getByText(/og:site_name/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "テスト記事のOGP画像" })).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("取得に失敗した場合は理由を案内する", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    render(<OgpPreviewer />);
    fireEvent.change(screen.getByLabelText("調べたいページのURL"), { target: { value: "https://example.com/news" } });
    fireEvent.click(screen.getByRole("button", { name: "OGPを確認" }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("取得できませんでした"));
  });
});
