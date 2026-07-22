export type Project = {
  day: number;
  title?: string;
  description?: string;
  href?: string;
  icon?: string;
  accent?: "lime" | "orange" | "blue" | "pink" | "violet";
};

/**
 * 公開済みアプリの情報は、この配列だけで管理します。
 *
 * - href: 公開URLを設定するとアイコン全体がリンクになります
 * - icon: 絵文字または短い文字を設定できます
 * - icon未設定: アプリ名がアイコン内に小さく表示されます
 */
const publishedProjects: Project[] = [
  {
    day: 1,
    title: "100Daysポートフォリオジェネレーター",
    description:
      "READMEを読み取り、100日分のプロジェクト一覧を自動更新するCLIツール。",
    accent: "lime",
    href: "https://github.com/furutahss/100d-challenge/tree/main/day001",
  },
];

const projectsByDay = new Map(
  publishedProjects.map((project) => [project.day, project]),
);

export const projects: Project[] = Array.from({ length: 100 }, (_, index) => {
  const day = index + 1;
  return projectsByDay.get(day) ?? { day };
});

export const publishedCount = publishedProjects.length;
