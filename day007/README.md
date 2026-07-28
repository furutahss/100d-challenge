# シルエット クイズ

真っ黒なシルエットから動物・乗り物を当てる、幼児向けのクイズです。30種類の問題プールから、遊ぶたびに重複なしで5問を出題します。選択肢には文字と小さな絵を表示し、元画像は生成画像を透過処理したPNGです。出題時は同じ画像をCSSの`mask-image`でシルエット表示しています。

## 開発

```bash
npm install
npm test
npm run lint
npm run build
```

`.env` は静的公開用に `NEXT_PUBLIC_BASE_PATH=silhouette-quiz` を指定しています。ローカル開発では `.env.development` によりbasePathなしで起動します。
