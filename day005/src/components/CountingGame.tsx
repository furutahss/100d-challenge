"use client";

import { useState } from "react";
import {
  createQuestion,
  getResultMessage,
  isCorrect,
  numberWords,
  type Question,
} from "@/lib/game";

const totalRounds = 10;

type CountingGameProps = {
  initialQuestion?: Question;
  random?: () => number;
};

function nextQuestion(previousCount: number | undefined, random: () => number): Question {
  return createQuestion(previousCount, random);
}

export function CountingGame({ initialQuestion, random = Math.random }: CountingGameProps) {
  const [question, setQuestion] = useState(
    () => initialQuestion ?? nextQuestion(undefined, random),
  );
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const answered = answer !== null;
  const correct = answered && isCorrect(answer, question.count);

  function answerQuestion(value: number) {
    if (answered) return;
    setAnswer(value);
    if (isCorrect(value, question.count)) setScore((current) => current + 1);
  }

  function advance() {
    if (round === totalRounds) {
      setIsFinished(true);
      return;
    }

    setQuestion(nextQuestion(question.count, random));
    setRound((current) => current + 1);
    setAnswer(null);
  }

  function restart() {
    setQuestion(nextQuestion(undefined, random));
    setRound(1);
    setScore(0);
    setAnswer(null);
    setIsFinished(false);
  }

  if (isFinished) {
    return (
      <main className="game-shell">
        <section className="result-card" aria-labelledby="result-title">
          <p className="eyebrow">けっか</p>
          <h1 id="result-title">よく がんばりました！</h1>
          <p className="score" aria-live="polite">
            10 もんちゅう <strong>{score}</strong> もん せいかい！
          </p>
          <p className="result-message">{getResultMessage(score)}</p>
          <button className="primary-button" type="button" onClick={restart}>
            もういちど あそぶ
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="game-shell">
      <section className="game-card" aria-labelledby="game-title">
        <div className="progress-row">
          <p className="eyebrow">かずを かぞえよう</p>
          <p aria-label={`もんだい ${round} / ${totalRounds}`}>もんだい {round} / {totalRounds}</p>
        </div>
        <h1 id="game-title">いくつ あるかな？</h1>

        <div className="item-grid" aria-label={`${question.item}が ${question.count} こ`}>
          {Array.from({ length: question.count }, (_, index) => (
            <span className="game-item" key={index} aria-hidden="true">
              {question.item}
            </span>
          ))}
        </div>

        <div className="answer-grid" aria-label="こたえを えらんでね">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => {
            const selected = answer === value;
            const status = answered
              ? value === question.count
                ? "answer-button is-correct"
                : selected
                  ? "answer-button is-incorrect"
                  : "answer-button"
              : "answer-button";

            return (
              <button
                className={status}
                type="button"
                key={value}
                disabled={answered}
                onClick={() => answerQuestion(value)}
                aria-label={`${value}、${numberWords[value]}`}
              >
                <span aria-hidden="true">{value}</span>
                <small aria-hidden="true">{numberWords[value]}</small>
              </button>
            );
          })}
        </div>

        <div className="feedback" aria-live="polite">
          {answered && (
            <>
              <p className={correct ? "feedback-correct" : "feedback-incorrect"}>
                {correct ? "せいかい！" : `ざんねん… こたえは ${question.count}`}
              </p>
              <button className="primary-button" type="button" onClick={advance}>
                {round === totalRounds ? "けっかをみる" : "つぎへ"}
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
