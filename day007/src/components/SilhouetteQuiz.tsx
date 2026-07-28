"use client";

import { useState } from "react";
import {
  answerQuiz,
  choicesFor,
  createGameQuestions,
  createQuizState,
  nextQuestion,
  questions,
  Question,
} from "@/lib/quiz";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/^\/+|\/+$/g, "");
const withBasePath = (path: string) => `${basePath ? `/${basePath}` : ""}${path}`;

const imageStyle = (question: Question): React.CSSProperties => ({
  "--image": `url(${withBasePath(question.image)})`,
  "--image-size": `${question.displayScale * 100}%`,
}) as React.CSSProperties;

function SpriteImage({ question, className = "", label }: { question: Question; className?: string; label?: string }) {
  return <span className={`sprite-image ${className}`} style={imageStyle(question)} role="img" aria-label={label ?? `${question.label}のえ`} />;
}

export function SilhouetteQuiz({ initialQuestions }: { initialQuestions?: Question[] }) {
  const [game, setGame] = useState<Question[]>(() => initialQuestions ?? questions.slice(0, 5));
  const [state, setState] = useState(createQuizState());
  const [hasStarted, setHasStarted] = useState(false);
  const question = game[state.index];

  const startGame = () => {
    setGame(initialQuestions ?? createGameQuestions());
    setState(createQuizState());
    setHasStarted(true);
  };

  const restart = () => {
    setState(createQuizState());
    setHasStarted(false);
  };

  if (!hasStarted) {
    return <main className="quiz-page"><section className="result-card start-card"><span className="result-star" aria-hidden="true">🔍</span><h1>シルエット クイズ</h1><p>くろい かげを みて、だれか あてよう！</p><p className="result-copy">どうぶつや のりものが でてくるよ。</p><button className="primary-button" onClick={startGame}>あそびを はじめる</button></section></main>;
  }

  if (state.isFinished) {
    return <main className="quiz-page"><section className="result-card" aria-live="polite"><span className="result-star">★</span><p>よく できました！</p><h1>{state.score} もん せいかい！</h1><p className="result-copy">シルエットを じっくり みるのが とくいだね。</p><button className="primary-button" onClick={restart}>もういちど あそぶ</button></section></main>;
  }

  const submit = (answer: string) => setState((current) => answerQuiz(current, game, answer));
  const advance = () => setState((current) => nextQuestion(current, game.length));
  const choices = choicesFor(question);

  return <main className="quiz-page">
    <div className="confetti confetti-left" aria-hidden="true">● ▲ ●</div>
    <div className="confetti confetti-right" aria-hidden="true">★ ● ▲</div>
    <header className="quiz-header"><p className="eyebrow">SILHOUETTE QUIZ</p><div className="title-row"><span aria-hidden="true">🔍</span><h1>シルエット クイズ</h1></div><p>くろい かげを みて、だれか あてよう！</p></header>
    <section className="quiz-card" aria-labelledby="question-title">
      <div className="progress" aria-label={`${state.index + 1}問目 / ${game.length}問中`}><span>もんだい {state.index + 1}</span><div><i style={{ width: `${((state.index + 1) / game.length) * 100}%` }} /></div><b>{state.score} てん</b></div>
      <h2 id="question-title">なんの シルエットかな？</h2>
      <div className={`silhouette-stage ${state.isAnswered ? "revealed" : ""}`}>
        <div className="silhouette" style={imageStyle(question)} role="img" aria-label={`${question.label}のシルエット`} />
        {state.isAnswered && <SpriteImage question={question} className="answer-image" />}
      </div>
      {!state.isAnswered ? <div className="choices" aria-label="答えを選ぶ">{choices.map((choice, index) => <button aria-label={choice.label} className={`choice choice-${index + 1}`} key={choice.id} onClick={() => submit(choice.id)}><SpriteImage question={choice} /><span>{choice.label}</span></button>)}</div> : <div className={`answer-panel ${state.isCorrect ? "correct" : "incorrect"}`} aria-live="polite"><p>{state.isCorrect ? `せいかい！ ${question.label} だよ` : `おしい！ こたえは ${question.label} だよ`}</p><button className="primary-button" onClick={advance}>{state.index + 1 === game.length ? "けっかを みる" : "つぎの もんだい"}</button></div>}
    </section>
  </main>;
}
