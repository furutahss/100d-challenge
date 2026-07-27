# Markdown テーブルジェネレーター

Excel、Numbers、Googleスプレッドシートなどでコピーした表を貼り付け、Markdownテーブルへ変換する静的Webツールです。表のセルを直接編集した内容も、出力欄へすぐに反映されます。

## 機能

- タブ区切りの表データを貼り付けて表として読み込み
- ブラウザ上で行・列の追加とセル編集
- Markdownテーブルをリアルタイムに生成
- 生成結果をクリップボードへコピー
- すべてのデータをブラウザ内だけで処理

## 開発

```bash
npm install
npm run dev
```

## テストと静的ビルド

```bash
npm test
npm run lint
npm run build
```

ビルド結果は `out/` に出力されます。公開パスは `.env` の `NEXT_PUBLIC_BASE_PATH` で設定でき、開発時は `.env.development` によりルートパスで確認できます。
