# タッチ・ザ・カラー

動き回るカラーボールから、お題と同じ色だけをタップする動体視力ゲームです。制限時間は30秒。正解は10点、誤タップは5点減点です。すべてブラウザ内で動作します。

## 開発

```bash
npm install
npm test
npm run lint
npm run build
```

静的exportで生成されます。公開時は`.env`の`NEXT_PUBLIC_BASE_PATH=/touch-the-color`を使用し、ローカル開発時は`.env.development`で空にします。
