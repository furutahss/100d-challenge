# どっちがはやい？

2つの乗り物を見比べて、速いほうを選ぶ幼児向けのミニクイズです。30問の問題プールから毎回5問を出題し、5問終わると結果画面になります。「もう一度遊ぶ」で別の5問に挑戦できます。選択後に速度と正解を表示し、A/Bキーでも回答できます。

## 開発

```bash
npm install
npm test
npm run lint
npm run build
```

`.env` は静的公開用の`NEXT_PUBLIC_BASE_PATH=speed-quiz`、`.env.development`はローカル開発用の空のbasePathを設定しています。
