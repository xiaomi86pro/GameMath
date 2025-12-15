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
  console.log('submitAnswerBtn =', submitAnswerBtn);


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
  
  const compButtons = document.querySelectorAll('.comp-btn');
  compButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedOp = btn.dataset.op;
      handleCompareAnswer(selectedOp);
    });
  });

  submitSortingBtn.addEventListener('click', () => {
    const selected = Array.from(
      sortingTargetContainer.children
    ).map(el => Number(el.textContent));
  
    checkSortingAnswer(selected);
  })
    
  bindEvents();
});

/* =========================
   5. EVENT BINDINGS
========================= */
function resetSubmitButton() {
    submitAnswerBtn.disabled = false;
    submitAnswerBtn.onclick = null;
}
function lockUserInput() {
    submitAnswerBtn.disabled = true;

    // Khoá sorting
    sortingNumbersContainer
        .querySelectorAll('.sorting-number')
        .forEach(el => el.style.pointerEvents = 'none');

    // Khoá compare
    comparisonButtonsContainer
        ?.querySelectorAll('button')
        .forEach(btn => btn.disabled = true);
  }
  
  function unlockUserInput() {
    submitAnswerBtn.disabled = false;
    submitAnswerBtn.classList.remove('opacity-50');
  
    mathAnswerInput.disabled = false;
  
    setCompareButtonsDisabled(false);
  
    submitSortingBtn.disabled = false;
    submitSortingBtn.classList.remove('opacity-50');
  }
  
function setCompareButtonsDisabled(disabled) {
    const buttons = document.querySelectorAll('.comp-btn');
    buttons.forEach(btn => {
      btn.disabled = disabled;
      btn.classList.toggle('opacity-50', disabled);
      btn.classList.toggle('cursor-not-allowed', disabled);
    });
  }

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
    unlockUserInput();
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
/* Hàm câu hỏi */

function renderSortingNumbers(numbers) {
    sortingNumbersContainer.innerHTML = '';
    sortingTargetContainer.innerHTML = '';
  
    numbers.forEach(num => {
      const div = document.createElement('div');
      div.textContent = num;
      div.className =
        'sorting-number px-4 py-2 bg-white rounded shadow font-bold text-lg';
  
      div.addEventListener('click', () => {
        sortingTargetContainer.appendChild(div);
      });
  
      sortingNumbersContainer.appendChild(div);
    });
  }
  
function generateSortingQuestion(level) {
    const count = level + 3; // level 1 → 4 số
  
    const set = new Set();
    while (set.size < count) {
      set.add(Math.floor(Math.random() * 50));
    }
  
    const numbers = Array.from(set);
  
    const order = Math.random() < 0.5 ? 'ASC' : 'DESC';
  
    const answer = [...numbers].sort((a, b) =>
      order === 'ASC' ? a - b : b - a
    );
  
    return {
      numbers,
      order,
      answer,
      type: 'SORT'
    };
  }
  
function handleCorrectAnswer() {
    quizState.currentScore += 1;
    currentScoreSpan.textContent = quizState.currentScore;
  
    messageBox.textContent = '✅ Chính xác!';
    messageBox.className = 'text-green-600 font-bold';
  
    nextQuestionBtn.classList.remove('hidden');
    nextQuestionBtn.focus();
  }
  
  function handleWrongAnswer() {
    messageBox.textContent = '❌ Sai rồi!';
    messageBox.className = 'text-red-600 font-bold';
  
    nextQuestionBtn.classList.remove('hidden');
    nextQuestionBtn.focus();
  }

function handleCompareAnswer(selectedOp) {
    if (submitAnswerBtn.disabled) return;

        lockUserInput();

        document.getElementById('comparison-box').textContent = selectedOp;

        if (selectedOp === quizState.currentQuestion.answer) {
            handleCorrectAnswer();
        } else {
            handleWrongAnswer();
  }
  }
  
function getMultipliersByLevel(level) {
    switch (level) {
      case 1: return [2, 3];
      case 2: return [4, 5];
      case 3: return [6, 7];
      case 4: return [8, 9];
      default: return [2];
    }
  }

/**
 * Sinh câu hỏi Nhân / Chia
 * - Luôn ra số nguyên
 * - Không âm
 * - Đúng bảng theo level
 */
function generateMultDivQuestion(quizState) {
    const multipliers = getMultipliersByLevel(quizState.currentLevel);
    const base = multipliers[Math.floor(Math.random() * multipliers.length)];
  
    const x = Math.floor(Math.random() * 10) + 1; // 1–10
    const result = base * x;
  
    const isMultiply = Math.random() < 0.5;
  
    return isMultiply
      ? {
          text: `${base} × ${x} = ?`,
          answer: result,
          type: 'MULT_DIV'
        }
      : {
          text: `${result} ÷ ${base} = ?`,
          answer: x,
          type: 'MULT_DIV'
        };
  }
    
function getRandomNumberByLevel(level) {
    switch (level) {
      case 1: return Math.floor(Math.random() * 10);   // 0–9
      case 2: return Math.floor(Math.random() * 100);  // 0–99
      case 3: return Math.floor(Math.random() * 1000); // 0–999
      default: return 0;
    }
  }
  
/**
 * Sinh câu hỏi Cộng / Trừ theo level
 * - Level 1: KHÔNG có số âm
 * - Level 2+: có thể có số âm (giữ đúng logic cũ)
 */
function generateAddSubQuestion(quizState) {
    let a = getRandomNumberByLevel(quizState.currentLevel);
    let b = getRandomNumberByLevel(quizState.currentLevel);
  
    const isAdd = Math.random() < 0.5;
  
    // ❗ Level 1: không cho phép kết quả âm
    if (!isAdd && quizState.currentLevel === 1) {
      if (b > a) {
        [a, b] = [b, a];
      }
    }
  
    return {
      text: isAdd ? `${a} + ${b} = ?` : `${a} - ${b} = ?`,
      answer: isAdd ? a + b : a - b,
      type: 'ADD_SUB'
    };
  }

  function generateSimpleExpression(level) {
    let a = getRandomNumberByLevel(level);
    let b = getRandomNumberByLevel(level);
  
    const isAdd = Math.random() < 0.5;
  
    if (!isAdd && level === 1 && b > a) {
      [a, b] = [b, a];
    }
  
    return {
      text: isAdd ? `${a} + ${b}` : `${a} - ${b}`,
      value: isAdd ? a + b : a - b
    };
  }

/**
 * Sinh câu hỏi So sánh (> < =)
 */
function generateCompareQuestion(quizState) {
    const leftExp = generateSimpleExpression(quizState.currentLevel);
    const rightExp = generateSimpleExpression(quizState.currentLevel);
  
    let answer = '=';
  
    if (leftExp.value > rightExp.value) answer = '>';
    else if (leftExp.value < rightExp.value) answer = '<';
  
    return {
      left: leftExp.text,
      right: rightExp.text,
      answer,
      type: 'COMPARE'
    };
  }
  

/* Tạo câu hỏi */  
function generateQuestion() 
{
    console.log('generateQuestion chạy');
  
    let question;
  
    if (quizState.currentQuizType === 'ADD_SUB') {

        const rand = Math.random();
      
        if (rand < 0.2) {
          question = generateCompareQuestion(quizState);
        }
        else if (rand < 0.35) {
          question = generateSortingQuestion(quizState.currentLevel);
        }
        else {
          question = generateAddSubQuestion(quizState);
        }
      
      }
    else if (quizState.currentQuizType === 'MULT_DIV') {
      question = generateMultDivQuestion(quizState);
    } 
    else if (quizState.currentQuizType === 'COMPARE') {
        question = generateCompareQuestion(quizState);
    }
    else if (quizState.currentQuizType === 'SORT') {
        question = generateSortingQuestion(quizState.currentLevel);
    }      
    else {
      question = {
        text: 'Chưa hỗ trợ loại quiz này',
        answer: null
      };
    }
    quizState.currentQuestion = question;
  
    console.log('currentQuestion =', quizState.currentQuestion);
    console.log('TYPE =', quizState.currentQuestion?.type);
    displayQuestion();
}
  

function displayQuestion() {
    hideAllAnswerAreas();
    resetSubmitButton();

    const q = quizState.currentQuestion;
    if (!q) return;
    // Câu sắp xếp 
    if (q.type === 'SORT') {
        questionText.textContent =
            q.order === 'ASC'
                ? 'Sắp xếp các số theo thứ tự tăng dần'
                : 'Sắp xếp các số theo thứ tự giảm dần';
    
        questionText.classList.remove('hidden');
    
        sortingNumbersContainer.classList.remove('hidden');
        sortingTargetContainer.classList.remove('hidden');
    
        renderSortingNumbers(q.numbers);
    
        submitAnswerBtn.classList.remove('hidden');
        submitAnswerBtn.textContent = 'Kiểm tra';
    
        resetSubmitButton();
    
        submitAnswerBtn.onclick = () => {
            const selected = Array.from(
                sortingTargetContainer.children
            ).map(el => Number(el.textContent));
    
            console.log('SORT user chọn:', selected);
    
            lockUserInput();
            checkSortingAnswer(selected);
        };
    
        return;
    }
    
    // ===== SO SÁNH =====
    if (q.type === 'COMPARE') {
      questionText.classList.add('hidden');
  
      comparisonDisplayArea.classList.remove('hidden');
      comparisonButtonsContainer.classList.remove('hidden');

      setCompareButtonsDisabled(false);
  
      document.getElementById('expression-left').textContent = q.left;
      document.getElementById('expression-right').textContent = q.right;
      document.getElementById('comparison-box').textContent = '?';
  
      return;
    }
  
    // ===== CÂU NHẬP ĐÁP ÁN =====
    comparisonButtonsContainer.classList.add('hidden');
    comparisonDisplayArea.classList.add('hidden');
  
    questionText.classList.remove('hidden');
    questionText.textContent = q.text;
  
    inputAnswerContainer.classList.remove('hidden');
    mathAnswerInput.value = '';

    unlockUserInput();
    messageBox.textContent = '';
    nextQuestionBtn.classList.add('hidden');

  }
  
  

/* =========================
   8. ANSWER CHECKING
========================= */
function checkSortingAnswer(userOrder) {
    const correct = quizState.currentQuestion.answer;
  
    if (
      JSON.stringify(userOrder) ===
      JSON.stringify(correct)
    ) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  }

function submitAnswer() {
  const userAnswer = mathAnswerInput.value.trim();

  if (userAnswer === '') return;
  lockUserInput();
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
    questionText.classList.add('hidden');
    inputAnswerContainer.classList.add('hidden');
  
    comparisonDisplayArea.classList.add('hidden');
    comparisonButtonsContainer.classList.add('hidden');
  
    clockImageContainer.classList.add('hidden');
    sortingNumbersContainer.classList.add('hidden');
    sortingTargetContainer.classList.add('hidden');
    sortingControls.classList.add('hidden');
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
