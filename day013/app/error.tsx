'use client';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main style={{ padding: 40, fontFamily: 'system-ui', textAlign: 'center' }}><h1>読み込みに失敗しました</h1><button onClick={() => reset()}>もう一度試す</button></main>;
}
