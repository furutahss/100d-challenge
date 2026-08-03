# Day013 どうぶつ・エサやりゲーム

動物の口元へ正しい食べ物を届ける、全5問のブラウザゲームです。15種類の動物と、それぞれに対応する15種類の餌を収録しています。1プレイにつき重複なしで5種類が出題されます。

## 技術スタック

- Next.js (Static Export / SSG) + TypeScript
- SCSS + Tailwind CSS
- Vitest (TDD)

## 起動

```bash
npm install
NEXT_PUBLIC_BASE_PATH=/100d-challenge/day013 npm run build
npm run dev
```

開発時は `.env.development` の `/` により `http://localhost:3000/` で開きます。静的公開時は `.env` の `NEXT_PUBLIC_BASE_PATH=/day013` が適用されます。環境変数を変更した場合は、開発サーバーを再起動してください。
