const TOTAL_QUESTIONS = 10;
const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const resultScreen = document.querySelector("#result-screen");
const startButton = document.querySelector("#start-button");
const retryButton = document.querySelector("#retry-button");
const choices = document.querySelector("#choices");
const scoreElement = document.querySelector("#score");
const questionCount = document.querySelector("#question-count");
const progressBar = document.querySelector("#progress-bar");
const feedback = document.querySelector("#feedback");

let score = 0;
let questionNumber = 0;
let locked = false;

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function createQuestion() {
  const kind = ["number", "fruit", "shape"][randomInt(0, 2)];
  const small = randomInt(1, kind === "number" ? 8 : 5);
  const large = small + randomInt(1, kind === "number" ? 8 : 4);
  const answerFirst = Math.random() > .5;
  return { kind, values: answerFirst ? [large, small] : [small, large], correctIndex: answerFirst ? 0 : 1 };
}

function visualFor(kind, value, index) {
  if (kind === "number") return `<span class="number-value">${value}</span>`;
  if (kind === "fruit") return `<span class="fruit-value">${"🍎".repeat(value)}</span>`;
  const colors = ["#6fb8e8", "#ef9b70"];
  const size = 48 + value * 12;
  return `<span class="shape-value" style="--shape-size:${size}px;--shape-color:${colors[index]}"></span>`;
}

function renderQuestion() {
  const question = createQuestion();
  questionCount.textContent = `${questionNumber + 1} / ${TOTAL_QUESTIONS}`;
  progressBar.style.width = `${((questionNumber + 1) / TOTAL_QUESTIONS) * 100}%`;
  feedback.textContent = "";
  choices.replaceChildren();
  question.values.forEach((value, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.setAttribute("aria-label", `${index === 0 ? "ひだり" : "みぎ"}をえらぶ`);
    button.innerHTML = visualFor(question.kind, value, index);
    bindPress(button, () => answer(button, index === question.correctIndex));
    choices.append(button);
  });
}

function answer(button, isCorrect) {
  if (locked) return;
  locked = true;
  const allButtons = [...choices.querySelectorAll("button")];
  if (isCorrect) {
    score += 1;
    scoreElement.textContent = score;
    button.classList.add("correct");
    feedback.textContent = "せいかい！ すごい！";
  } else {
    button.classList.add("wrong");
    allButtons.find((item) => item !== button && !item.classList.contains("wrong"))?.classList.add("correct");
    feedback.textContent = "おしい！ つぎも がんばろう！";
  }
  window.setTimeout(() => {
    questionNumber += 1;
    if (questionNumber === TOTAL_QUESTIONS) showResult();
    else { locked = false; renderQuestion(); }
  }, 950);
}

function showResult() {
  gameScreen.hidden = true;
  resultScreen.hidden = false;
  document.querySelector("#final-score").textContent = score;
  const title = document.querySelector("#result-title");
  const message = document.querySelector("#result-message");
  const face = document.querySelector("#result-face");
  if (score === TOTAL_QUESTIONS) { title.textContent = "パーフェクト！"; message.textContent = "ぜんぶ せいかい！ ほんとうに すごい！"; face.textContent = "🏆"; }
  else if (score >= 7) { title.textContent = "すごい！"; message.textContent = "おおきい ほうを みつけるのが とくいだね！"; face.textContent = "🎉"; }
  else { title.textContent = "よくできました！"; message.textContent = "さいごまで がんばったね！"; face.textContent = "😊"; }
}

function startGame() {
  score = 0; questionNumber = 0; locked = false;
  scoreElement.textContent = score;
  startScreen.hidden = true; resultScreen.hidden = true; gameScreen.hidden = false;
  renderQuestion();
}

function bindPress(element, action) {
  // タップ直後に開始して、スマホのclick遅延や重なった要素の影響を受けにくくします。
  element.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    action();
  });
  element.addEventListener("click", (event) => {
    event.preventDefault();
    // キーボード操作で発生するclick（detail: 0）にも対応します。
    if (event.detail === 0) action();
  });
}

bindPress(startButton, startGame);
bindPress(retryButton, startGame);
