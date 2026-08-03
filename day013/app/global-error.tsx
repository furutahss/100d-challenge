'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="ja"><body><main style={{ padding: 40, fontFamily: 'system-ui', textAlign: 'center' }}><h1>エラーが発生しました</h1><button onClick={() => reset()}>再読み込み</button></main></body></html>;
}
