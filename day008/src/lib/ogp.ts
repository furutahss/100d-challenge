export type OgpResult = {
  title: string;
  description: string;
  image: string;
  siteName: string;
  type: string;
  url: string;
  tags: Record<string, string>;
};

export const parseOgpHtml = (html: string, requestedUrl: string): OgpResult => {
  const document = new DOMParser().parseFromString(html, "text/html");
  const tags = Object.fromEntries(
    [...document.querySelectorAll("meta[property^='og:'], meta[name^='twitter:']")]
      .map((element) => [element.getAttribute("property") ?? element.getAttribute("name") ?? "", element.getAttribute("content")?.trim() ?? ""])
      .filter(([name, content]) => name && content),
  );

  return {
    title: tags["og:title"] ?? tags["twitter:title"] ?? document.title ?? "タイトルが設定されていません",
    description: tags["og:description"] ?? tags["twitter:description"] ?? "説明が設定されていません",
    image: tags["og:image"] ?? tags["twitter:image"] ?? "",
    siteName: tags["og:site_name"] ?? new URL(requestedUrl).hostname,
    type: tags["og:type"] ?? "website",
    url: tags["og:url"] ?? requestedUrl,
    tags,
  };
};
