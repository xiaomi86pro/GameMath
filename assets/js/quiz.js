// ===== CONFIG & CONSTANTS =====
const MAX_QUIZ_TIME_SECONDS = 30 * 60; // 30 phút
const TOTAL_QUIZ_QUESTIONS_DEFAULT = 20;

const QUESTION_TYPES_BASIC = [
  'basic-op', 'find-x', 'sorting', 'comparison',
  'balance-equation', 'create-even-odd', 'create-max-min',
  'sequence-pattern', 'sequence-increment', 'shape-pattern'
];
const QUESTION_TYPES_MULT_DIV = ['mult-div', 'find-x-mult-div', 'sorting', 'comparison'];
const QUESTION_TYPES_TIMO = ['day-of-week', 'age-problem', 'queue-problem'];

const DAYS_OF_WEEK = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const RELATIVE_DAY_OPTIONS = { 'Hôm nay':0,'Ngày mai':1,'Ngày kia':2,'Hôm qua':-1,'Hôm kia':-2 };
const DAY_OF_WEEK_HINT = `...`; // HTML hint

const MULT_DIV_FACTORS = {
  1:[2,3], 2:[4,5], 3:[6,7], 4:[8,9]
};

// ===== STATE =====
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

// ===== DOM ELEMENTS =====
// (gom tất cả phần tử DOM: setupScreen, quizScreen, endScreen, questionText, answerInput, sorting, comparison, clock, hint...)

// ===== SOUND & FEEDBACK =====
const soundCorrect = new Audio('assets/sounds/correct.mp3');
const soundWrong = new Audio('assets/sounds/wrong.mp3');

function playCorrectSound(){ ... }
function playIncorrectSound(){ ... }
function giveFeedback(correct){ ... }

// ===== TIMER =====
function formatTime(seconds){ ... }
function updateTimerDisplay(){ ... }
function startTimer(){ ... }
function stopTimer(){ ... }

// ===== UTILITIES =====
function getMaxRange(level){ ... }
function getRandomInt(max){ ... }
function showScoreEffect(isCorrect){ ... }
function flashColor(color){ ... }

// ===== QUESTION GENERATORS =====
// --- Cộng/Trừ ---
function generateBasicOpQuestion(max){ ... }
function generateFindXQuestion(max){ ... }
function generateBalanceEquation(max){ ... }

// --- Nhân/Chia ---
function generateMultDivQuestion(){ ... }
function generateFindXMultDivQuestion(){ ... }

// --- Ghép số ---
function generateEvenOddNumberQuestion(level){ ... }
function generateMaxMinTwoNumbers(level){ ... }

// --- Dãy số & Mẫu hình ---
function generateSequencePattern(){ ... }
function generateSequenceIncrement(){ ... }
function generateShapePattern(){ ... }

// --- Sắp xếp ---
function generateSortingQuestion(level){ ... }

// --- So sánh ---
function generateSimpleExpression(max, quizType){ ... }
function generateComparisonQuestion(level){ ... }

// --- TIMO ---
function generateDayOfWeekQuestion(){ ... }
function generateAgeProblem(){ ... }
function generateQueueProblem(){ ... }

// ===== QUIZ LOGIC =====
function generateQuestion(){
  currentQuestionNumber++;
  // Router: gọi đúng hàm theo currentQuizType và currentLevel
  switch(currentQuizType){
    case 'ADD_SUB':
      currentQuestion = generateBasicOpQuestion(getMaxRange(currentLevel));
      break;
    case 'MULT_DIV':
      currentQuestion = generateMultDivQuestion();
      break;
    case 'TIMO':
      currentQuestion = generateDayOfWeekQuestion(); // ví dụ
      break;
    default:
      currentQuestion = generateBasicOpQuestion(getMaxRange(currentLevel));
  }
  questionText.textContent = currentQuestion.question;
}

function checkAnswer(userAnswer){ ... }

// ===== EVENT BINDING =====
function bindEvents(){ ... }

// ===== END QUIZ =====
function endQuiz(){ ... }

// ===== DOMContentLoaded =====
document.addEventListener('DOMContentLoaded',()=>{
  levelSelectBtns[0].click();
  startQuizBtn.disabled = false;
  initState();
  bindEvents();
});
