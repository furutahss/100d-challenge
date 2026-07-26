# 画像サイズコンバータ

複数の画像をブラウザ内だけで変換するWebアプリです。画像データをサーバーへアップロードしません。

## 機能

- 複数画像のドラッグ＆ドロップ / ファイル選択
- ファイルサイズ指定モード（JPEG / WebPの画質を調整し、ピクセル数を維持）
- 画像サイズ変更モード（指定ピクセル数へリサイズ）
- JPEG / PNG / WebP出力
- 個別ダウンロード、ZIP形式の一括ダウンロード
- ブラウザで画像を解読できないファイルや変換失敗を、ファイル単位で表示

## 開発

```bash
cd day004
npm install
npm run dev
```

### 公開パスの切り替え

`NEXT_PUBLIC_BASE_PATH` をビルド前に設定すると、ルートドメイン直下以外へ静的配備できます。`.env` は本番ビルド用に `/image-size-converter` を設定済みで、`.env.development` はローカル開発用に空文字を設定しています。

```env
# 例: https://example.com/tools/image-converter/ で公開する場合
NEXT_PUBLIC_BASE_PATH=/tools/image-converter
```

ルートドメイン直下で公開する場合は、`.env` の値を空にしてから `npm run build` を実行してください。`basePath` はビルド時に埋め込まれるため、設定変更後は必ず再ビルドが必要です。

以下でテスト、lint、静的エクスポート用のproduction buildを実行できます。

```bash
npm test
npm run lint
npm run build
```

ビルド成果物は `out/` に出力されます。

## 制約

- GIFなどのアニメーション画像は先頭フレームを静止画として変換します。
- PNGはCanvas APIで画質を調整できないため、ファイルサイズ指定モードでは目標サイズまで減らせない場合があります。
- 出力時にEXIFなどのメタデータは保持しません。

## 公開

https://100d.furutahss.com/image-size-converter/
