export type Project = {
  day: number;
  title?: string;
  description?: string;
  href?: string;
  image?: string;
  icon?: string;
  accent?: "lime" | "orange" | "blue" | "pink" | "violet";
};

/**
 * 公開済みアプリの情報は、この配列だけで管理します。
 *
 * - href: 公開URLを設定するとアイコン全体がリンクになります
 * - image: public 配下の画像を `/images/example.png` のように設定できます
 * - icon: 絵文字または短い文字を設定できます
 * - icon未設定: アプリ名がアイコン内に小さく表示されます
 */
const publishedProjects: Project[] = [
  {
    day: 1,
    title: "100Daysポートフォリオジェネレーター",
    description: "READMEを読み取り、100日分のプロジェクト一覧を自動更新するCLIツール。",
    accent: "lime",
    href: "https://github.com/furutahss/100d-challenge/tree/main/day001",
  },
  {
    day: 2,
    title: "Base64 画像エンコーダー / プレビュアー",
    description: "画像をブラウザ上でBase64のData URLへ変換し、プレビュー・コピー・テキスト保存できるシングルページアプリ。",
    accent: "blue",
    href: "https://100d.furutahss.com/base64-image-converter/",
    image: "/images/base64-image-converter.png",
  },
  {
    day: 3,
    title: "どっちが大きい？直感タップ",
    description: "2つの数字・りんご・図形から大きいほうを素早くタップする、子ども向けの知育ゲーム。",
    accent: "orange",
    href: "https://100d.furutahss.com/which-is-bigger/",
    image: "/images/which-is-bigger.png",
  },
  {
    day: 4,
    title: "画像サイズコンバータ",
    description: "複数の画像をブラウザ内だけで変換するWebアプリ。",
    accent: "violet",
    href: "https://100d.furutahss.com/image-size-converter/",
    image: "/images/image-size-converter.svg",
  },
  {
    day: 5,
    title: "かずをかぞえよう",
    description: "画面に出てくるアイテムを数え、正しい数字を選ぶ子ども向けのミニゲーム。",
    accent: "pink",
    href: "https://100d.furutahss.com/count-the-things/",
    image: "/images/count-the-things.svg",
  },
  {
    day: 6,
    title: "Markdown テーブルジェネレーター",
    description: "Excel、Numbers、Googleスプレッドシートなどでコピーした表を貼り付け、Markdownテーブルへ変換する静的Webツール。",
    accent: "lime",
    href: "https://100d.furutahss.com/markdown-table-generator/",
    image: "/images/markdown-table-generator.svg",
  },
  {
    day: 7,
    title: "シルエット クイズ",
    description: "真っ黒なシルエットから動物・乗り物を当てる、幼児向けのクイズ。",
    accent: "blue",
    href: "https://100d.furutahss.com/silhouette-quiz/",
    image: "/images/silhouette-quiz.svg",
  },
  {
    day: 8,
    title: "OGP-Previewer",
    description: "既存サイトのURLを入力し、取得したOGP・Twitter Card用メタタグとSNSシェア時のカード表示を確認する静的Webツール。",
    accent: "orange",
    href: "https://100d.furutahss.com/ogp-previewer/",
    image: "/images/ogp-previewer.svg",
  }
];

const projectsByDay = new Map(
  publishedProjects.map((project) => [project.day, project]),
);

export const projects: Project[] = Array.from({ length: 100 }, (_, index) => {
  const day = index + 1;
  return projectsByDay.get(day) ?? { day };
});

export const publishedCount = publishedProjects.length;
