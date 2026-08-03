'use client';

import { useMemo, useState } from 'react';

type Animal = { name: string; emoji: string; food: string; foodEmoji: string; color: string; hint: string };

const animals: Animal[] = [
  { name: 'ぞう', emoji: '🐘', food: 'りんご', foodEmoji: '🍎', color: '#cad8f6', hint: 'ながい おはなで たべるよ' },
  { name: 'うさぎ', emoji: '🐰', food: 'にんじん', foodEmoji: '🥕', color: '#f7c8d8', hint: 'しゃきしゃきが だいすき' },
  { name: 'パンダ', emoji: '🐼', food: 'たけ', foodEmoji: '🎋', color: '#d7e8ce', hint: 'みどりの くさを むしゃむしゃ' },
  { name: 'きりん', emoji: '🦒', food: 'はっぱ', foodEmoji: '🍃', color: '#f8e3a0', hint: 'たかいところの くさがすき' },
  { name: 'さる', emoji: '🐒', food: 'バナナ', foodEmoji: '🍌', color: '#f5d29a', hint: 'あまい くだものが すき' },
  { name: 'ライオン', emoji: '🦁', food: 'おにく', foodEmoji: '🍖', color: '#f5c06d', hint: 'もりの おうさま' },
  { name: 'ペンギン', emoji: '🐧', food: 'さかな', foodEmoji: '🐟', color: '#b9dceb', hint: 'つめたい うみの なかま' },
  { name: 'コアラ', emoji: '🐨', food: 'ユーカリ', foodEmoji: '🌿', color: '#d6ccb7', hint: 'きのうえで うとうと' },
  { name: 'ひつじ', emoji: '🐑', food: 'くさ', foodEmoji: '🌱', color: '#e7d8ef', hint: 'ふわふわの けなみ' },
  { name: 'カバ', emoji: '🦛', food: 'すいか', foodEmoji: '🍉', color: '#d9c5da', hint: 'みずあそびが だいすき' },
  { name: 'キツネ', emoji: '🦊', food: 'きのこ', foodEmoji: '🍄', color: '#f3c6a4', hint: 'ふさふさの しっぽ' },
  { name: 'カメ', emoji: '🐢', food: 'レタス', foodEmoji: '🥬', color: '#c5dfad', hint: 'ゆっくり のんびり' },
  { name: 'フラミンゴ', emoji: '🦩', food: 'えび', foodEmoji: '🦐', color: '#f6c2d0', hint: 'ながい あしで すいすい' },
  { name: 'くま', emoji: '🐻', food: 'はちみつ', foodEmoji: '🍯', color: '#d9b48d', hint: 'あまいものに めがない' },
  { name: 'かえる', emoji: '🐸', food: 'むし', foodEmoji: '🪲', color: '#b7dfb5', hint: 'ぴょんぴょん はねるよ' },
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export default function Home() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Animal[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const current = questions[index];
  const choices = useMemo(() => current ? shuffle([current, ...shuffle(animals.filter((a) => a.name !== current.name)).slice(0, 2)]) : [], [current]);

  const start = () => { setQuestions(shuffle(animals).slice(0, 5)); setStarted(true); setFinished(false); setIndex(0); setScore(0); setPicked(null); };
  const answer = (food: Animal) => { if (picked) return; setPicked(food.name); if (food.food === current.food) setScore((s) => s + 1); };
  const next = () => { if (index === 4) { setStarted(false); setFinished(true); } else { setIndex((i) => i + 1); setPicked(null); } };

  if (finished) return <main className="home"><div className="hero-image" /><section className="intro"><p className="eyebrow">ANIMAL CAFÉ <span>RESULT</span></p><h1>おつかれさま！<br /><em>{score}もん</em> せいかい</h1><p className="lead">どうぶつたちは にこにこ。<br />また いつでも あそびにきてね。</p><button className="start" onClick={start}>もういちど あそぶ <span>↻</span></button></section></main>;
  if (!started) return <main className="home"><div className="hero-image" /><section className="intro"><p className="eyebrow">ANIMAL CAFÉ <span>DAY 013</span></p><h1>どうぶつに<br /><em>ごはんを</em>あげよう</h1><p className="lead">おなかをすかせた なかまたちに<br />すきな たべものを とどけてあげてね。</p><button className="start" onClick={start}>あそびにいく <span>→</span></button><p className="note">全5問 ／ ゆっくり考えて大丈夫</p></section></main>;

  if (!current) return null;
  return <main className="game"><header><p className="eyebrow">ANIMAL CAFÉ</p><div className="progress"><span>QUESTION {index + 1}</span><i><b style={{ width: `${((index + 1) / 5) * 100}%` }} /></i><strong>{score}<small> / 5</small></strong></div></header><section className="question"><p className="label">このこに なにを あげる？</p><div className="animal-card" style={{ background: current.color }}><div className="spark">✦</div><div className="animal">{current.emoji}</div><h2>{current.name}</h2><p>{current.hint}</p></div><div className="food-grid">{choices.map((food) => <button key={food.name} className={`food ${picked && food.food === current.food ? 'correct' : ''} ${picked === food.name && food.food !== current.food ? 'wrong' : ''}`} onClick={() => answer(food)}><span>{food.foodEmoji}</span><b>{food.food}</b></button>)}</div>{picked && <div className="feedback">{picked === current.name ? 'せいかい！ もぐもぐ、おいしいね。' : 'おしい！ つぎは どれかな？'}<button onClick={next}>{index === 4 ? 'けっかをみる' : 'つぎの もんだい'} <span>→</span></button></div>}</section></main>;
}
