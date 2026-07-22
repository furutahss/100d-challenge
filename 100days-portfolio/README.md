# 100 DAYS / VIBE CODING Portfolio

100日チャレンジで制作したアプリを、iPhoneのホーム画面風に掲載する静的ポートフォリオサイトです。

## 起動方法

```bash
npm install
npm run dev
```

## 公開用ビルド

```bash
npm run build
```

`next.config.ts` で `output: "export"` を指定しているため、静的ファイルは `out/` に出力されます。

## アプリ情報の更新

`data/projects.ts` の `publishedProjects` にデータを追加してください。

```ts
{
  day: 2,
  title: "アプリ名",
  description: "アプリの概要",
  href: "https://example.com/day002",
  icon: "🎨", // 省略するとアプリ名をアイコン内に表示
  accent: "orange",
}
```

未登録のDayは自動的に空の枠として表示されます。
