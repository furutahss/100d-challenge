# 画像 → カラーパレット抽出ツール

画像をドロップまたは選択すると、ブラウザ内で主要な5色を抽出して Hex コードを表示します。画像はアップロードされません。

```bash
npm install
npm test
npm run lint
npm run build
```

静的 export 対応です。公開環境では `.env` の `NEXT_PUBLIC_BASE_PATH=/image-palette-extractor`、ローカル開発では `.env.development` の空値を使用します。
