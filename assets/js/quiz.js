// ===== Config =====
const MAX_QUIZ_TIME_SECONDS = 30 * 60; // 30 phút
const TOTAL_QUIZ_QUESTIONS_DEFAULT = 20;

// ===== State =====
let currentLevel = 1;
let currentLevelName = 'Cấp 1 (Phạm vi 0-9)';
let currentQuizType = 'ADD_SUB';
let currentScore = 0;
let currentQuestionNumber = 0;
let currentQuestion = null;
let quizTimer = null;
let timeRemaining = MAX_QUIZ_TIME_SECONDS;
let startTime = 0;
let TOTAL_QUIZ_QUESTIONS = TOTAL_QUIZ_QUESTIONS_DEFAULT;

// ===== Âm thanh bằng MP3 =====
const soundCorrect = new Audio('assets/sounds/correct.mp3');
const soundWrong = new Audio('assets/sounds/wrong.mp3');

function playCorrectSound() {
  soundCorrect.currentTime = 0;
  soundCorrect.play();
}

function playIncorrectSound() {
  soundWrong.currentTime = 0;
  soundWrong.play();
}

// ===== Hàm khởi tạo lại trạng thái =====
function initState() {
  currentLevel = 1;
  currentLevelName = 'Cấp 1 (Phạm vi 0-9)';
  currentQuizType = 'ADD_SUB';
  currentScore = 0;
  currentQuestionNumber = 0;
  TOTAL_QUIZ_QUESTIONS = TOTAL_QUIZ_QUESTIONS_DEFAULT;
  timeRemaining = MAX_QUIZ_TIME_SECONDS;
  startTime = 0;
}

// ===== Các hàm tiện ích =====
function flashColor(color) {
  quizScreen.style.backgroundColor = color;
  setTimeout(() => {
    quizScreen.style.backgroundColor = '';
  }, 300);
}

// ===== Sinh câu hỏi =====
// Ví dụ: phép cộng/trừ cơ bản
function generateBasicOpQuestion() {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);
  const answer = a + b;
  return {
    text: `${a} + ${b} = ?`,
    answer: answer
  };
}

// Bạn có thể thêm các loại câu hỏi khác ở đây (mult-div, sequence, shape-pattern, day-of-week, word problem...)

// ===== Feedback =====
function giveFeedback(correct) {
  if (correct) {
    playCorrectSound();
    flashColor('lightgreen');
  } else {
    playIncorrectSound();
    flashColor('lightcoral');
  }
}

// ===== Quiz Logic =====
function generateQuestion() {
  currentQuestionNumber++;
  currentQuestion = generateBasicOpQuestion();
  questionText.textContent = currentQuestion.text;
}

function checkAnswer(userAnswer) {
  const correct = (parseInt(userAnswer) === currentQuestion.answer);
  giveFeedback(correct);
  if (correct) currentScore++;
  currentScoreSpan.textContent = currentScore;
}

// ===== Event Binding =====
function bindEvents() {
  startQuizBtn.addEventListener('click', () => {
    if (!currentLevel) return;

    currentScore = 0;
    currentQuestionNumber = 0;
    currentScoreSpan.textContent = 0;
    totalQuestionsSpan.textContent = TOTAL_QUIZ_QUESTIONS;
    currentLevelNameSpan.textContent = currentLevelName;

    setupScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');

    startTimer();
    generateQuestion();
  });

  submitAnswerBtn.addEventListener('click', () => {
    const userAnswer = answerInput.value;
    checkAnswer(userAnswer);
    if (currentQuestionNumber < TOTAL_QUIZ_QUESTIONS) {
      generateQuestion();
    } else {
      endQuiz();
    }
  });
}

// ===== Timer =====
function startTimer() {
  timeRemaining = MAX_QUIZ_TIME_SECONDS;
  quizTimer = setInterval(() => {
    timeRemaining--;
    timerSpan.textContent = timeRemaining;
    if (timeRemaining <= 0) {
      clearInterval(quizTimer);
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  quizScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');
  finalScoreSpan.textContent = currentScore;
}

// ===== DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', () => {
  levelSelectBtns[0].click();
  startQuizBtn.disabled = false;
  initState();
  bindEvents();
});
