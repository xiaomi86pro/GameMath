/**************************************************
 * QUIZ GAME – CLEAN VERSION
 **************************************************/

/* =========================
   1. CONFIG / CONSTANTS
========================= */

export const MAX_QUIZ_TIME_SECONDS = 30 * 60;

export const QUESTION_TYPES_BASIC = [
  'basic-op',
  'find-x',
  'sorting',
  'comparison',
  'balance-equation',
  'create-even-odd',
  'create-max-min',
  'sequence-pattern',
  'sequence-increment',
  'shape-pattern'
];

export const QUESTION_TYPES_MULT_DIV = [
  'mult-div',
  'find-x-mult-div',
  'sorting',
  'comparison'
];

export const QUESTION_TYPES_TIMO = [
  'day-of-week',
  'age-problem',
  'queue-problem'
];

export const DAYS_OF_WEEK = [
  'Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư',
  'Thứ Năm','Thứ Sáu','Thứ Bảy'
];

export const MULT_DIV_FACTORS = {
  1: [2, 3],
  2: [4, 5],
  3: [6, 7],
  4: [8, 9]
};

export const RELATIVE_DAY_OPTIONS = {
  'Hôm nay': 0,
  'Ngày mai': 1,
  'Ngày kia': 2,
  'Hôm qua': -1,
  'Hôm kia': -2
};

export const DAY_OF_WEEK_HINT = `
<div class="flex flex-col sm:flex-row justify-center items-center text-center">
  <span class="text-red-600">Hôm qua / Hôm kia → TRỪ</span>
  <span class="mx-4 font-bold">HÔM NAY</span>
  <span class="text-green-600">Ngày mai / Ngày kia → CỘNG</span>
</div>
`;

/* =========================
   2. STATE
========================= */

export const quizState = {
  currentLevel: 1,
  currentLevelName: 'Cấp 1 (Phạm vi 0-9)',
  currentQuizType: 'ADD_SUB',
  currentScore: 0,
  currentQuestionNumber: 0,
  currentQuestion: null,
  quizTimer: null,
  timeRemaining: MAX_QUIZ_TIME_SECONDS,
  startTime: 0,
  TOTAL_QUIZ_QUESTIONS: 20
};

/* =========================
   3. DOM REFERENCES
========================= */

let setupScreen, quizScreen, endScreen;
let startQuizBtn, nextQuestionBtn, restartQuizBtn, exitQuizBtn;
let levelSelectBtns;
let questionCountBtns;

let questionText, messageBox;
let currentScoreSpan, currentQuestionNumberSpan, totalQuestionsSpan;
let currentLevelNameSpan, finalScoreSpan;

let inputAnswerContainer, mathAnswerInput, submitAnswerBtn;
let sortingNumbersContainer, sortingTargetContainer, sortingControls;
let resetSortingBtn, submitSortingBtn;

let comparisonButtonsContainer, comparisonDisplayArea;
let progressBar, scoreEffect, quizTimerDisplay;
let timeTakenMessage, clockImageContainer, levelDescription;

let hintArea, hintText;



/* =========================
   4. DOMContentLoaded
========================= */

document.addEventListener('DOMContentLoaded', () => {

  /* === Screen === */
  setupScreen = document.getElementById('setup-screen');
  quizScreen = document.getElementById('quiz-screen');
  endScreen = document.getElementById('end-screen');

  /* === Buttons === */
  startQuizBtn = document.getElementById('start-quiz-btn');
  nextQuestionBtn = document.getElementById('next-question-btn');
  restartQuizBtn = document.getElementById('restart-quiz-btn');
  exitQuizBtn = document.getElementById('exit-quiz-btn');
  levelSelectBtns = document.querySelectorAll('.level-select-btn');
  questionCountBtns = document.querySelectorAll('.q-count-btn');

  /* === Text / Display === */
  questionText = document.getElementById('question-text');
  messageBox = document.getElementById('message-box');
  currentLevelNameSpan = document.getElementById('current-level-name');
  currentQuestionNumberSpan = document.getElementById('current-question-number');
  totalQuestionsSpan = document.getElementById('total-questions');
  currentScoreSpan = document.getElementById('current-score');
  finalScoreSpan = document.getElementById('final-score');

  /* === Input Answer === */
  inputAnswerContainer = document.getElementById('input-answer-container');
  mathAnswerInput = document.getElementById('math-answer-input');
  submitAnswerBtn = document.getElementById('submit-answer-btn');

  /* === Sorting === */
  sortingNumbersContainer = document.getElementById('sorting-numbers-container');
  sortingTargetContainer = document.getElementById('sorting-target-container');
  sortingControls = document.getElementById('sorting-controls');
  resetSortingBtn = document.getElementById('reset-sorting-btn');
  submitSortingBtn = document.getElementById('submit-sorting-btn');

  /* === Comparison === */
  comparisonButtonsContainer = document.getElementById('comparison-buttons-container');
  comparisonDisplayArea = document.getElementById('comparison-display-area');

  /* === Progress / Timer === */
  progressBar = document.getElementById('progress-bar');
  scoreEffect = document.getElementById('score-effect');
  quizTimerDisplay = document.getElementById('quiz-timer');
  timeTakenMessage = document.getElementById('time-taken-message');
  clockImageContainer = document.getElementById('clockImageContainer');
  levelDescription = document.getElementById('level-description');

  hintArea = document.getElementById('hint-area');
  hintText = document.getElementById('hint-text');
  
  submitAnswerBtn.addEventListener('click', checkAnswer);
  nextQuestionBtn.addEventListener('click', nextQuestion);
  
  bindEvents();
});

/* =========================
   5. EVENT BINDINGS
========================= */

function enableQuestionCount() {
  questionCountBtns.forEach(btn => {
    btn.disabled = false;

    btn.addEventListener('click', () => {

      // Reset UI
      questionCountBtns.forEach(b => {
        b.classList.remove('bg-indigo-500', 'text-white');
        b.classList.add('bg-gray-200', 'text-gray-700');
      });

      // Highlight
      btn.classList.remove('bg-gray-200', 'text-gray-700');
      btn.classList.add('bg-indigo-500', 'text-white');

      // Update state
      quizState.TOTAL_QUIZ_QUESTIONS = parseInt(btn.dataset.questions, 10);
      totalQuestionsSpan.textContent = quizState.TOTAL_QUIZ_QUESTIONS;
    });
  });
}


function bindEvents() {

  startQuizBtn.addEventListener('click', startQuiz);
  nextQuestionBtn.addEventListener('click', nextQuestion);
  restartQuizBtn.addEventListener('click', restartQuiz);
  exitQuizBtn.addEventListener('click', exitQuiz);

  submitAnswerBtn.addEventListener('click', submitAnswer);

  levelSelectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
  
      // 1. Reset UI các nút level
      levelSelectBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('bg-gray-200', 'text-gray-700');
      });
  
      // 2. Highlight nút được chọn
      btn.classList.remove('bg-gray-200', 'text-gray-700');
      btn.classList.add('bg-indigo-600', 'text-white');
  
      // 3. Update state
      quizState.currentLevel = parseInt(btn.dataset.level, 10);
      quizState.currentLevelName = btn.dataset.name;
      quizState.currentQuizType = btn.dataset.type;
  
      // 4. Update UI
      updateLevelUI();
  
      // 5. Cho phép chọn số câu + start
      enableQuestionCount();
      startQuizBtn.disabled = false;
    });
  });
  
}

/* =========================
   6. FLOW CONTROL
========================= */

function startQuiz() {
  quizState.currentScore = 0;
  quizState.currentQuestionNumber = 0;
  quizState.timeRemaining = MAX_QUIZ_TIME_SECONDS;
  quizState.startTime = Date.now();

  questionText.classList.remove('hidden');
  messageBox.textContent = '';

  setupScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  endScreen.classList.add('hidden');

  totalQuestionsSpan.textContent = quizState.TOTAL_QUIZ_QUESTIONS;
  currentLevelNameSpan.textContent = quizState.currentLevelName;
  startTimer();
  nextQuestion();
}

function nextQuestion() 
{
    quizState.currentQuestionNumber++;

    mathAnswerInput.value = '';
    messageBox.textContent = '';
    submitAnswerBtn.disabled = false;
  
    nextQuestionBtn.classList.add('hidden');
  
    generateQuestion();

}

function restartQuiz() {
  endScreen.classList.add('hidden');
  setupScreen.classList.remove('hidden');
}

function exitQuiz() {
  location.reload();
}

/* =========================
   7. QUESTION / DISPLAY
========================= */
function getRandomNumberByLevel(level) 
{
    switch (level) {
      case 1: return Math.floor(Math.random() * 10);   // 0–9
      case 2: return Math.floor(Math.random() * 100);  // 0–99
      case 3: return Math.floor(Math.random() * 1000); // 0–999
      default: return 0;
    }
}

function generateAddSubQuestion()
{
    const a = getRandomNumberByLevel(quizState.currentLevel);
    const b = getRandomNumberByLevel(quizState.currentLevel);
    const isAdd = Math.random() < 0.5;
  
    return {
      text: isAdd ? `${a} + ${b} = ?` : `${a} - ${b} = ?`,
      answer: isAdd ? a + b : a - b,
      type: 'ADD_SUB'
    };
}

function generateMultDivQuestion()
{
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const isMult = Math.random() < 0.5;
  
    if (isMult) {
      return {
        text: `${a} × ${b} = ?`,
        answer: a * b,
        type: 'MULT_DIV'
      };
    } else {
      return {
        text: `${a * b} ÷ ${a} = ?`,
        answer: b,
        type: 'MULT_DIV'
      };
    }
}
  

function generateQuestion() 
{
    console.log('generateQuestion chạy');
  
    let question;
  
    if (quizState.currentQuizType === 'ADD_SUB') {
      question = generateAddSubQuestion();
    } 
    else if (quizState.currentQuizType === 'MULT_DIV') {
      question = generateMultDivQuestion();
    } 
    else {
      question = {
        text: 'Chưa hỗ trợ loại quiz này',
        answer: null
      };
    }
  
    quizState.currentQuestion = question;
  
    console.log('currentQuestion =', quizState.currentQuestion);
  
    displayQuestion();
}
  

function displayQuestion() {
  questionText.classList.remove('hidden');
  questionText.innerHTML = quizState.currentQuestion?.text || '';
  inputAnswerContainer.classList.remove('hidden');
}

/* =========================
   8. ANSWER CHECKING
========================= */

function submitAnswer() {
  const userAnswer = mathAnswerInput.value.trim();

  if (userAnswer === '') return;

  const correct = checkAnswer(userAnswer);

  if (correct) {
    quizState.currentScore += getBonusByLevel();
    showMessage('Đúng rồi 🎉', 'success');
  } else {
    showMessage('Sai rồi 😢', 'error');
  }

  nextQuestionBtn.classList.remove('hidden');
}

function checkAnswer(answer) {
    if (!quizState.currentQuestion) return;

    const userAnswer = Number(mathAnswerInput.value);
  
    if (mathAnswerInput.value.trim() === '') {
      messageBox.textContent = '⚠️ Bạn chưa nhập đáp án';
      messageBox.className = 'text-yellow-600 font-bold';
      return;
    }
  
    if (userAnswer === quizState.currentQuestion.answer) {
      quizState.currentScore += 1;
  
      currentScoreSpan.textContent = quizState.currentScore;
      messageBox.textContent = '✅ Chính xác!';
      messageBox.className = 'text-green-600 font-bold';
  
      nextQuestionBtn.classList.remove('hidden');
      submitAnswerBtn.disabled = true;
    } else {
      messageBox.textContent = '❌ Sai rồi, thử lại nhé!';
      messageBox.className = 'text-red-600 font-bold';
    }
}

/* =========================
   9. TIMER
========================= */

function startTimer() {
  clearInterval(quizState.quizTimer);

  quizState.quizTimer = setInterval(() => {
    quizState.timeRemaining--;
    quizTimerDisplay.textContent = formatTime(quizState.timeRemaining);

    if (quizState.timeRemaining <= 0) {
      clearInterval(quizState.quizTimer);
      endQuiz();
    }
  }, 1000);
}

/* =========================
   10. END QUIZ
========================= */

function endQuiz() {
  clearInterval(quizState.quizTimer);

  quizScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');

  finalScoreSpan.textContent = quizState.currentScore;

  const timeTaken = Math.floor((Date.now() - quizState.startTime) / 1000);
  timeTakenMessage.textContent = `Thời gian làm bài: ${formatTime(timeTaken)}`;
}

/* =========================
   11. UTILITIES
========================= */

function hideAllAnswerAreas() {
  inputAnswerContainer.classList.add('hidden');
  sortingNumbersContainer.classList.add('hidden');
  sortingTargetContainer.classList.add('hidden');
  sortingControls.classList.add('hidden');
  comparisonButtonsContainer.classList.add('hidden');
  comparisonDisplayArea.classList.add('hidden');
  clockImageContainer.classList.add('hidden');
}

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = type;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getBonusByLevel() {
  return quizState.currentLevel * 10;
}

function updateLevelUI() {
  levelDescription.textContent = quizState.currentLevelName;
}
