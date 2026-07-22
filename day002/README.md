# Base64 画像エンコーダー / プレビュアー

画像をブラウザ上でBase64のData URLへ変換し、プレビュー・コピー・テキスト保存できるシングルページアプリです。変換はすべてローカルで完結し、画像は外部へ送信されません。

## 機能

- ドラッグ＆ドロップ／ファイル選択による複数画像の読み込み
- PNG、JPEG、GIF、WebP、SVGなどのBase64変換
- 変換結果のプレビューと文字数表示
- 画像ごとのBase64文字列コピー
- すべての変換結果を`.txt`として一括ダウンロード

## 実行方法

依存関係はありません。`day002/index.html` をブラウザで開くか、リポジトリルートで次を実行してください。

```bash
python3 -m http.server 8000 --directory day002
```

`http://localhost:8000` にアクセスします。

## 公開・デプロイ

静的ファイルのみで構成されているため、GitHub Pages、Netlify、Cloudflare Pagesなどへそのまま公開できます。

## サンプル

https://100d.furutahss.com/base64-image-converter/
