# OGP-Previewer

既存サイトのURLを入力し、取得したOGP・Twitter Card用メタタグとSNSシェア時のカード表示を確認する静的Webツールです。

## 開発

```bash
npm install
npm test
npm run lint
npm run build
```

`.env` は公開用の `NEXT_PUBLIC_BASE_PATH=ogp-previewer`、`.env.development` はローカル開発用の空のbasePathを設定しています。
