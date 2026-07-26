import { CountingGame } from "@/components/CountingGame";
import { createQuestion } from "@/lib/game";

export default function Home() {
  // SSG で生成した最初の問題をそのままクライアントへ渡し、hydration 時の表示差を防ぐ。
  const initialQuestion = createQuestion(undefined);

  return <CountingGame initialQuestion={initialQuestion} />;
}
