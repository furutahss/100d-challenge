export const QUESTIONS_PER_GAME = 5;

export type Question = {
  id: string;
  label: string;
  image: string;
  displayScale: number;
};

const spaciousCanvasIds = new Set(["cat", "dog", "penguin", "car", "ambulance", "helicopter", "scooter", "balloon", "panda"]);

const itemQuestions = (entries: ReadonlyArray<readonly [string, string]>): Question[] =>
  entries.map(([id, label]) => ({ id, label, image: `/images/items/${id}.png`, displayScale: spaciousCanvasIds.has(id) ? 1.35 : 1 }));

export const questions: Question[] = [
  ...itemQuestions([["elephant", "ぞう"], ["cat", "ねこ"], ["dog", "いぬ"], ["rabbit", "うさぎ"], ["lion", "らいおん"]]),
  ...itemQuestions([["giraffe", "きりん"], ["penguin", "ぺんぎん"], ["turtle", "かめ"], ["monkey", "さる"], ["dinosaur", "きょうりゅう"]]),
  ...itemQuestions([["bus", "バス"], ["train", "でんしゃ"], ["car", "くるま"], ["airplane", "ひこうき"], ["bicycle", "じてんしゃ"]]),
  ...itemQuestions([["fire-truck", "しょうぼうしゃ"], ["ambulance", "きゅうきゅうしゃ"], ["police-car", "パトカー"], ["rocket", "ロケット"], ["ship", "ふね"]]),
  ...itemQuestions([["excavator", "ショベルカー"], ["helicopter", "ヘリコプター"], ["tractor", "トラクター"], ["scooter", "スクーター"], ["balloon", "ききゅう"]]),
  ...itemQuestions([["horse", "うま"], ["panda", "パンダ"], ["whale", "くじら"], ["submarine", "せんすいかん"], ["motorcycle", "バイク"]]),
];

export const createGameQuestions = (random: () => number = Math.random): Question[] => {
  const shuffled = [...questions];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled.slice(0, QUESTIONS_PER_GAME);
};

export const choicesFor = (question: Question): Question[] => {
  const index = questions.findIndex(({ id }) => id === question.id);
  const choices = [question, questions[(index + 7) % questions.length], questions[(index + 17) % questions.length]];
  return choices.map((_, choiceIndex) => choices[(choiceIndex + (index % choices.length)) % choices.length]);
};

export type QuizState = {
  index: number;
  score: number;
  isAnswered: boolean;
  isCorrect: boolean | null;
  isFinished: boolean;
};

export const createQuizState = (index = 0): QuizState => ({
  index,
  score: 0,
  isAnswered: false,
  isCorrect: null,
  isFinished: false,
});

export const answerQuiz = (state: QuizState, game: Question[], answer: string): QuizState => {
  if (state.isAnswered || state.isFinished) return state;
  const isCorrect = game[state.index]?.id === answer;
  return { ...state, isAnswered: true, isCorrect, score: state.score + Number(isCorrect) };
};

export const nextQuestion = (state: QuizState, questionCount = QUESTIONS_PER_GAME): QuizState => {
  const nextIndex = state.index + 1;
  if (nextIndex >= questionCount) return { ...state, isFinished: true };
  return { ...state, index: nextIndex, isAnswered: false, isCorrect: null };
};
