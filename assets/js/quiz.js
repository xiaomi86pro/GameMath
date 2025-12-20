/**************************************************
 * QUIZ GAME – CLEAN VERSION
 **************************************************/

/* =========================
   SUPABASE CONFIG
========================= */

const SUPABASE_URL = 'https://jeycrlggnebcasbrfygr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_No04r_35Hg-FG8xf--9Zvg_pyUZPtkl';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

export const QUESTION_WEIGHTS = {
  ADD_SUB: {
    1: {
      'ADD_SUB': 10,
      'COMPARE': 20,
      'SORT': 10,
      'CLOCK': 20,
      'FIND-X': 20
    },
    2: {
      'ADD_SUB': 10,
      'COMPARE': 20,
      'SORT': 10,
      'CLOCK': 20,
      'FIND-X': 20   
    },
    3: {
      'ADD_SUB': 35,
      'COMPARE': 25,
      'SORT': 20,
      'FIND-X': 20
    }
  },
  MULT_DIV: {
    1: { 'MULT_DIV': 70, 'SORT': 30 },
    2: { 'MULT_DIV': 60, 'SORT': 25, 'COMPARE': 15 },
    3: { 'MULT_DIV': 65, 'SORT': 20, 'COMPARE': 15 },
    4: { 'MULT_DIV': 70, 'SORT': 20, 'COMPARE': 10 }
  },
  TIMO: {
     'AGE-COMBINED' : 10,
     'AGE-CURRENT-PAST': 10,
     'AGE-DIFFERENCE': 10,
     'QUEUE-PROBLEM': 10,
     'AGE-SIBLING': 10,
     'AlTERNATING-SEQUENCE' : 10,
     'ARITHMETIC-SEQUENCE' : 10,
     'FIBONACCI-SEQUENCE' : 10,
     'GEOMETRIC-SEQUENCE' : 10,
     'MIXED-SEQUENCE' : 10,
     'QUADRATIC-SEQUENCE': 10,
     'SQUARE-SEQUENCE' : 10,
     'TRIANGULAR-SEQUENCE' : 10,
     'PRIME-SEQUENCE' : 10,
     'ODD-SEQUENCE' : 10,
     'EVEN-SEQUENCE' : 10,
     'CREATE-MAX-MIN': 10,
     'CREATE-EVEN-ODD' : 10,
     'BALANCE-EQUATION' : 10,
  }
};

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
  correctStreak: 0,
  TOTAL_QUIZ_QUESTIONS: 20
};

/* =========================
   3. DOM REFERENCES
========================= */
let expressionLeft, expressionRight, comparisonBox;
let setupScreen, quizScreen, endScreen;
let startQuizBtn, nextQuestionBtn, restartQuizBtn, exitQuizBtn;
let levelSelectBtns;
let questionCountBtns;

let questionText, messageBox;
let currentScoreSpan, currentQuestionNumberSpan, totalQuestionsSpan;
let currentLevelNameSpan, finalScoreSpan;

let inputAnswerContainer, mathAnswerInput, submitAnswerBtn;
let sortingNumbersContainer, sortingTargetContainer, sortingControls;


let comparisonButtonsContainer, comparisonDisplayArea;
let progressBar, scoreEffect, quizTimerDisplay;
let timeTakenMessage, clockImageContainer, levelDescription;

let hintArea, hintText;

let confirmModal, modalCancelBtn, modalConfirmBtn;

let nameModal, playerNameInput, submitScoreBtn, leaderboardBody;

let soundCorrect, soundWrong;

let clockQuestionContainer, hourHand, minuteHand, clockChoices;

/* DOM mới */
// === Thay thế: gom tất cả khởi tạo vào init ===
function init() {
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
  expressionLeft = document.getElementById('expression-left');
  expressionRight = document.getElementById('expression-right');
  comparisonBox = document.getElementById('comparison-box');

  /* === Input Answer === */
  inputAnswerContainer = document.getElementById('input-answer-container');
  mathAnswerInput = document.getElementById('math-answer-input');
  submitAnswerBtn = document.getElementById('submit-answer-btn');

  /* === Sorting === */
  sortingNumbersContainer = document.getElementById('sorting-numbers-container');
  sortingTargetContainer = document.getElementById('sorting-target-container');
  sortingControls = document.getElementById('sorting-controls');

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

  /* === Modal === */
  confirmModal = document.getElementById('confirm-modal');
  modalCancelBtn = document.getElementById('modal-cancel-btn');
  modalConfirmBtn = document.getElementById('modal-confirm-btn');
  nameModal = document.getElementById('name-modal');
  playerNameInput = document.getElementById('player-name');
  submitScoreBtn = document.getElementById('submit-score');
  leaderboardBody = document.getElementById('leaderboard-body');

  /* === Audio === */
  soundCorrect = document.getElementById('sound-correct');
  soundWrong = document.getElementById('sound-wrong');

  /* Clock */
  clockQuestionContainer = document.getElementById('clock-question');
  hourHand = document.getElementById('hour-hand');
  minuteHand = document.getElementById('minute-hand');
  clockChoices = document.getElementById('clock-choices');

  // Bind events once
  bindEvents();

  // Load leaderboard after small delay to ensure DOM ready
  setTimeout(() => {
    if (typeof loadLeaderboard === 'function') loadLeaderboard();
  }, 300);
}

// Single DOMContentLoaded that calls init
document.addEventListener('DOMContentLoaded', init);

/* =========================
   5. EVENT BINDINGS
========================= */
function resetSubmitButton() {
    submitAnswerBtn.disabled = false;
    submitAnswerBtn.onclick = null;
}
function lockUserInput() {
  // Khoá nút kiểm tra
  if (submitAnswerBtn) {
    submitAnswerBtn.disabled = true;
    submitAnswerBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }

  // Khoá ô nhập đáp án
  if (mathAnswerInput) {
    mathAnswerInput.disabled = true;
    mathAnswerInput.classList.add('opacity-50', 'cursor-not-allowed');
  }

  // Khoá sorting
  sortingNumbersContainer
    ?.querySelectorAll('.sorting-number')
    .forEach(el => el.style.pointerEvents = 'none');

  // Khoá compare buttons
  comparisonButtonsContainer
    ?.querySelectorAll('button')
    .forEach(btn => {
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    });

  // Khoá clock choices
  clockChoices
    ?.querySelectorAll('button')
    .forEach(btn => {
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    });

  // 👉 Focus sang nút "Câu hỏi tiếp theo"
  if (nextQuestionBtn) nextQuestionBtn.focus();
}
  
function unlockUserInput() {
  // Mở lại nút kiểm tra
  if (submitAnswerBtn) {
    submitAnswerBtn.disabled = false;
    submitAnswerBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  // Mở lại ô nhập đáp án
  if (mathAnswerInput) {
    mathAnswerInput.disabled = false;
    mathAnswerInput.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  // Mở lại sorting
  sortingNumbersContainer
    ?.querySelectorAll('.sorting-number')
    .forEach(el => el.style.pointerEvents = 'auto');

  // Mở lại compare buttons
  comparisonButtonsContainer
    ?.querySelectorAll('button')
    .forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
    });

  // Mở lại clock choices
  clockChoices
    ?.querySelectorAll('button')
    .forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
    });
}
  
function setCompareButtonsDisabled(disabled) {
    const buttons = document.querySelectorAll('.comp-btn');
    buttons.forEach(btn => {
      btn.disabled = disabled;
      btn.classList.toggle('opacity-50', disabled);
      btn.classList.toggle('cursor-not-allowed', disabled);
    });
  }

  /* NEW */
  function enableQuestionCount() {
    questionCountBtns.forEach(btn => {
      btn.disabled = false;
      if (!btn.dataset.boundQCount) {
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
          if (totalQuestionsSpan) totalQuestionsSpan.textContent = quizState.TOTAL_QUIZ_QUESTIONS;
        });
        btn.dataset.boundQCount = '1';
      }
    });
  }
  

/* Bind Events NEW */
function bindEvents() {
  if (startQuizBtn) startQuizBtn.addEventListener('click', startQuiz);
  if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', nextQuestion);
  if (restartQuizBtn) restartQuizBtn.addEventListener('click', restartQuiz);
  if (exitQuizBtn) exitQuizBtn.addEventListener('click', exitQuiz);

  // submitAnswerBtn may be null in some screens
  if (submitAnswerBtn) submitAnswerBtn.addEventListener('click', submitAnswer);

  // Level select buttons
  levelSelectBtns.forEach(btn => {
    if (!btn.dataset.boundLevel) {
      btn.addEventListener('click', () => {
        levelSelectBtns.forEach(b => {
          b.classList.remove('bg-indigo-600', 'text-white');
          b.classList.add('bg-gray-200', 'text-gray-700');
        });

        btn.classList.remove('bg-gray-200', 'text-gray-700');
        btn.classList.add('bg-indigo-600', 'text-white');

        quizState.currentLevel = parseInt(btn.dataset.level, 10);
        quizState.currentLevelName = btn.dataset.name;
        quizState.currentQuizType = btn.dataset.type;

        updateLevelUI();
        enableQuestionCount();
        if (startQuizBtn) startQuizBtn.disabled = false;
      });
      btn.dataset.boundLevel = '1';
    }
  });

  // Comparison buttons (if present)
  const compButtons = document.querySelectorAll('.comp-btn');
  compButtons.forEach(btn => {
    if (!btn.dataset.boundComp) {
      btn.addEventListener('click', () => {
        const selectedOp = btn.dataset.op;
        handleCompareAnswer(selectedOp);
      });
      btn.dataset.boundComp = '1';
    }
  });

  // Modal buttons
  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => {
      confirmModal?.classList.add('hidden');
      confirmModal?.classList.remove('flex');
    });
  }
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => {
      location.reload();
    });
  }

  // Enter key handling for mathAnswerInput (idempotent + keydown)
  if (mathAnswerInput && !mathAnswerInput.dataset.boundEnter) {
    mathAnswerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Ưu tiên gọi trực tiếp submitAnswer để tránh +2
        if (submitAnswerBtn && !submitAnswerBtn.classList.contains('hidden') && !submitAnswerBtn.disabled) {
          submitAnswer();
        } else if (nextQuestionBtn && !nextQuestionBtn.classList.contains('hidden')) {
          nextQuestionBtn.click(); // OK vì chỉ có một handler nextQuestion
        }
      }
    });
    mathAnswerInput.dataset.boundEnter = '1';
  }

  // Bind submit score button safely
  if (submitScoreBtn && !submitScoreBtn.dataset.boundSubmitScore) {
    submitScoreBtn.addEventListener('click', async () => {
      const name = playerNameInput?.value?.trim() || '';
      if (name === '') {
        alert('Vui lòng nhập tên!');
        return;
      }
      await saveScore(name, quizState.currentScore, quizState.currentLevel);
      nameModal?.classList.add('hidden');
      nameModal?.classList.remove('flex');
      if (playerNameInput) playerNameInput.value = '';
      location.reload();
    });
    submitScoreBtn.dataset.boundSubmitScore = '1';
  }
}


/* =========================
   6. FLOW CONTROL
========================= */

function startQuiz() {
  quizState.correctStreak = 0;
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

  updateScoreBall();
  
  startTimer();
  nextQuestion();
}

async function nextQuestion(){
    quizState.currentQuestionNumber++;
    if (quizState.currentQuestionNumber > quizState.TOTAL_QUIZ_QUESTIONS) {
      endQuiz();
      return;
    }
    quizState.hasEvaluated = false;
    unlockUserInput();
    mathAnswerInput.value = '';
    messageBox.textContent = '';
    submitAnswerBtn.disabled = false;
  
    nextQuestionBtn.classList.add('hidden');

     // Cập nhật progress bar
     const progress = (quizState.currentQuestionNumber / quizState.TOTAL_QUIZ_QUESTIONS) * 100;
     progressBar.style.width = progress + '%';

     const scoreBall = document.getElementById('score-ball');
      if (scoreBall) {
        scoreBall.style.left = `calc(${progress}% - 10px)`;
        scoreBall.textContent = quizState.currentScore;
      }

     
     // Cập nhật số câu hỏi hiển thị
     currentQuestionNumberSpan.textContent = quizState.currentQuestionNumber;
    
     // Cập nhật số câu hỏi hiển thị
    currentQuestionNumberSpan.textContent = quizState.currentQuestionNumber;
    
    // CHÈN 5 DÒNG MỚI VÀO ĐÂY ↓↓↓
    
    // Focus vào ô input để có thể nhấn Enter ngay
    setTimeout(() => {
      if (!mathAnswerInput.classList.contains('hidden')) {
        mathAnswerInput.focus();
      }
    }, 100);
    // ↑↑↑ HẾT PHẦN CHÈN
  
    await generateQuestion();
}

function restartQuiz() {
  endScreen.classList.add('hidden');
  setupScreen.classList.remove('hidden');
}

function exitQuiz() {
  confirmModal.classList.remove('hidden');
  confirmModal.classList.add('flex');
}

async function generateQuestion() {
  // Lấy nhóm trọng số theo quiz type
  const group = QUESTION_WEIGHTS[quizState.currentQuizType];
  // Nếu nhóm có theo level thì lấy theo level, nếu không thì dùng trực tiếp (TIMO)
  const weights = (group && group[quizState.currentLevel]) ? group[quizState.currentLevel] : group;

  if (!weights) {
    quizState.currentQuestion = {
      text: 'Chưa cấu hình dạng bài cho loại này',
      answer: null,
      type: 'ERROR'
    };
    displayQuestion();
    return;
  }

  // Chọn loại câu hỏi theo trọng số
  const selectedType = weightedRandom(weights);
  console.log("👉 Selected question type:", selectedType);

  // Load module tương ứng
  const module = await loadQuestionModule(selectedType);
  console.log("👉 Loaded module:", module);

  if (!module || !module.generate) {
    quizState.currentQuestion = {
      text: 'Lỗi khi load câu hỏi',
      answer: null,
      type: 'ERROR'
    };
    displayQuestion();
    return;
  }

  // Generate câu hỏi từ module
  quizState.currentQuestion = module.generate(quizState);

  displayQuestion();
}

async function displayQuestion() {
  hideAllAnswerAreas();
  resetSubmitButton();
  submitAnswerBtn.classList.add('hidden');
  const q = quizState.currentQuestion;
  console.log("👉 Current question object:", q);

  if (!q || q.type === 'ERROR') {
    questionText.textContent = q?.text || 'Lỗi không xác định';
    questionText.classList.remove('hidden');
    return;
  }
  
  // Load module tương ứng
  const module = await loadQuestionModule(q.type);
  console.log("👉 Display module for type:", q.type, module);

  if (!module || !module.display) {
    console.error("❌ Lỗi hiển thị câu hỏi với type:", q.type);
    questionText.textContent = 'Lỗi hiển thị câu hỏi';
    questionText.classList.remove('hidden');
    return;
  }
  
  // Gọi hàm display của module
  module.display(q, {
    questionText,
    inputAnswerContainer,
    mathAnswerInput,
    submitAnswerBtn,
    sortingNumbersContainer,
    sortingTargetContainer,
    comparisonDisplayArea,
    expressionLeft,
    expressionRight,
    comparisonBox,
    comparisonButtonsContainer,
    clockImageContainer,
    hourHand,
    minuteHand,
    clockChoices,
    // Các hàm cần thiết
    lockUserInput,
    checkSortingAnswer,
    submitAnswer,
    handleCorrectAnswer,
    handleWrongAnswer,
    renderSortingNumbers
  });
}

/* =========================
   7. QUESTION / DISPLAY
========================= */
function renderSortingNumbers(numbers) {
  sortingNumbersContainer.innerHTML = '';
  sortingTargetContainer.innerHTML = '';

  numbers.forEach(num => {
      const div = document.createElement('div');
      div.textContent = num;
      div.className = 'sorting-number px-4 py-2 bg-white rounded shadow font-bold text-lg cursor-pointer hover:bg-indigo-50 transition-colors';

      // Xử lý sự kiện click
      div.addEventListener('click', () => {
          // Nếu đang ở khung nguồn thì chuyển xuống khung đáp án
          if (div.parentNode === sortingNumbersContainer) {
              sortingTargetContainer.appendChild(div);
          } 
          // Nếu đang ở khung đáp án thì chuyển ngược lại khung nguồn
          else {
              sortingNumbersContainer.appendChild(div);
          }
      });

      sortingNumbersContainer.appendChild(div);
  });
}  
 
// Hàm cập nhật UI điểm
function updateScoreBall() {
  const scoreBall = document.getElementById('score-ball');
  if (!scoreBall) return;

  // Cập nhật số điểm
  quizState.currentScore = Number(quizState.currentScore) || 0;
  scoreBall.textContent = quizState.currentScore;

  // Xoá class fire cũ
  scoreBall.classList.remove('fire-lv1', 'fire-lv2', 'fire-lv3', 'score-ball-fire');

  // Thêm class theo streak
  const s = Number(quizState.currentStreak) || 0;
  if (s >= 3 && s < 5) {
    scoreBall.classList.add('score-ball-fire', 'fire-lv1');
  } else if (s >= 5 && s < 8) {
    scoreBall.classList.add('score-ball-fire', 'fire-lv2');
  } else if (s >= 8) {
    scoreBall.classList.add('score-ball-fire', 'fire-lv3');
  }
}

function updateProgressBar() {
  const progress = (quizState.currentQuestionNumber / quizState.TOTAL_QUIZ_QUESTIONS) * 100;
  if (progressBar) {
    progressBar.style.width = progress + '%';
  }

  const scoreBall = document.getElementById('score-ball');
  if (scoreBall) {
    scoreBall.style.left = `calc(${progress}% - 10px)`;
    scoreBall.textContent = quizState.currentScore;
  }
}

// Hàm trung tâm chấm điểm

// Đúng
// Đúng
function handleCorrectAnswer() {
  // Không cộng điểm ở đây nữa, chỉ lo hiệu ứng
  showScoreEffect('+1', 'text-yellow-400');
  updateScoreBall();

  nextQuestionBtn.classList.remove('hidden');
  nextQuestionBtn.focus();
}

// Sai
function handleWrongAnswer() {
  // Âm thanh sai
  const wrongSound = document.getElementById('sound-wrong');
  if (wrongSound) wrongSound.play();

  // Hiển thị thông báo sai
  messageBox.textContent = '❌ Sai rồi!';
  messageBox.className = 'text-red-600 font-bold';

  // Trừ điểm
  quizState.currentScore = Math.max(0, quizState.currentScore - 1);

  // Reset streak
  quizState.currentStreak = 0;

  // Cập nhật thanh tiến trình + quả cầu điểm
  updateProgressBar();
  updateScoreBall();

  // Hiện nút tiếp theo và focus
  nextQuestionBtn.classList.remove('hidden');
  nextQuestionBtn.focus();
}

function handleCompareAnswer(selectedOp) {
  if (quizState.hasEvaluated) return;
  if (submitAnswerBtn.disabled) return;

  // Normalize: nếu là &lt; thì đổi thành ký tự '<'
  if (selectedOp === '&lt;') selectedOp = '<';

 lockUserInput();
  comparisonBox.textContent = selectedOp;

  const isCorrect = (selectedOp === quizState.currentQuestion.answer);
  evaluateAnswer(isCorrect);

  // 👉 Sau khi xử lý, focus sang nút "Câu hỏi tiếp theo"
  if (nextQuestionBtn) nextQuestionBtn.focus();
}
  
/* =========================
   8. ANSWER CHECKING
========================= */
function checkSortingAnswer(userOrder) {
  if (!userOrder || userOrder.length === 0) {
    messageBox.textContent = '⚠️ Bạn chưa nhập đáp án';
    messageBox.className = 'text-yellow-600 font-bold';
    return;
  }
  lockUserInput();

  const correct = quizState.currentQuestion.answer;
  const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correct);
  evaluateAnswer(isCorrect);
}

// Hàm trung tâm chấm điểm
function evaluateAnswer(isCorrect) {
  if (quizState.hasEvaluated) return;
  quizState.hasEvaluated = true;

  if (isCorrect) {
    quizState.currentScore += 1;        // ✅ chỉ cộng ở đây
    quizState.currentStreak += 1;
    handleCorrectAnswer();
  } else {
    quizState.currentScore = Math.max(0, quizState.currentScore - 1);
    quizState.currentStreak = 0;
    handleWrongAnswer();
  }

  updateScoreBall();
}


function submitAnswer() {
  // Lấy giá trị nhập
  const raw = (mathAnswerInput?.value || '').trim();

  // Kiểm tra rỗng
  if (raw === '') {
    messageBox.textContent = '⚠️ Bạn chưa nhập đáp án';
    messageBox.className = 'text-yellow-600 font-bold';
    return; // 👉 Không khóa input, cho phép nhập lại
  }

  // Kiểm tra hợp lệ (phải là số)
  const userAnswer = Number(raw);
  if (Number.isNaN(userAnswer)) {
    messageBox.textContent = '⚠️ Đáp án không hợp lệ';
    messageBox.className = 'text-yellow-600 font-bold';
    return; // 👉 Không khóa input, cho phép nhập lại
  }

  // Nếu đã nhập hợp lệ thì mới khóa input để tránh spam
  lockUserInput();

  // So sánh với đáp án đúng
  const isCorrect = userAnswer === quizState.currentQuestion.answer;

  // ✅ Chấm điểm qua evaluateAnswer
  evaluateAnswer(isCorrect);

  // Sau khi kiểm tra thì disable input
  mathAnswerInput.disabled = true;
  // 👉 Thêm dòng này để focus sang nút "Câu hỏi tiếp theo"
  if (nextQuestionBtn) nextQuestionBtn.focus();
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

  // Cập nhật tổng số câu hỏi ở màn hình kết thúc
  const totalQuestionsDisplay = document.getElementById('total-questions-display');
  if (totalQuestionsDisplay) {
    totalQuestionsDisplay.textContent = quizState.TOTAL_QUIZ_QUESTIONS;
  }

  const timeTaken = Math.floor((Date.now() - quizState.startTime) / 1000);
  timeTakenMessage.textContent = `Thời gian làm bài: ${formatTime(timeTaken)}`;

  // Hiển thị modal nhập tên
  nameModal.classList.remove('hidden');
  nameModal.classList.add('flex');

}

/* =========================
   11. UTILITIES
========================= */

/* =========================
   DYNAMIC MODULE LOADER
========================= */

const questionModules = {};

async function loadQuestionModule(type) {
  // Nếu đã load rồi thì return cache
  if (questionModules[type]) {
    return questionModules[type];
  }
  
  try {
    const module = await import(`./questions/${type.toLowerCase()}.js`);
    questionModules[type] = module;
    return module;
  } catch (error) {
    console.error("❌ Lỗi import module:", type, error);
    return null;
  }
}

/* =========================
   WEIGHTED RANDOM
========================= */

function weightedRandom(weights) {
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  let random = Math.random() * total;
  
  for (const [key, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) {
      return key;
    }
  }
  
  // Fallback
  return Object.keys(weights)[0];
}

/* Score Effect */
function showScoreEffect(text, colorClass) {
  const scoreBall = document.getElementById('score-ball');
  const effect = document.getElementById('score-effect');
  if (!scoreBall || !effect) return;

  // Hiện popup +1/-1
  effect.textContent = '+1';
  effect.classList.add(colorClass);
  effect.style.opacity = '1';
  effect.style.transform = 'translateY(-10px)';

  // Thêm glow cho quả cầu
  scoreBall.classList.add('glow');

  // Sau 1s xoá glow và reset popup
  setTimeout(() => {
    effect.style.opacity = '0';
    effect.style.transform = 'translateY(-30px)';
    effect.classList.remove(colorClass);
    scoreBall.classList.remove('glow');
    updateScoreBall(); // 👉 gọi lại để đảm bảo số điểm và fire class đúng
  }, 1000);
}

function hideAllAnswerAreas() {
  inputAnswerContainer.classList.add('hidden');
  mathAnswerInput.classList.add('hidden');
  

  sortingNumbersContainer.classList.add('hidden');
  sortingTargetContainer.classList.add('hidden');
  sortingControls.classList.add('hidden');

  comparisonDisplayArea.classList.add('hidden');
  comparisonButtonsContainer.classList.add('hidden');

  clockImageContainer.classList.add('hidden');
  clockChoices.innerHTML = '';
  
  nextQuestionBtn.classList.add('hidden');

  mathAnswerInput.classList.remove('hidden');

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
    // Cập nhật tên level ở màn hình quiz
    if (currentLevelNameSpan) {
      currentLevelNameSpan.textContent = quizState.currentLevelName;
    }
  }

    /* =========================
    SUPABASE & LEADERBOARD
    ========================= */

    async function loadLeaderboard() {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .order('score', { ascending: false })
          .limit(10);

        if (error) throw error;

        leaderboardBody.innerHTML = '';
        
        data.forEach((row, index) => {
          const tr = document.createElement('tr');
          const rankClass = index === 0 ? 'leader-top-1' :
                            index === 1 ? 'leader-top-2' :
                            index === 2 ? 'leader-top-3' : '';
          tr.className = rankClass;
        
          const tdRank = document.createElement('td');
          tdRank.textContent = index + 1;
        
          const tdName = document.createElement('td');
          tdName.textContent = row.player_name ?? '';
        
          const tdScore = document.createElement('td');
          tdScore.textContent = String(row.score ?? '');
        
          const tdLevel = document.createElement('td');
          tdLevel.textContent = row.level ?? '';
        
          tr.appendChild(tdRank);
          tr.appendChild(tdName);
          tr.appendChild(tdScore);
          tr.appendChild(tdLevel);
        
          leaderboardBody.appendChild(tr);
        });
        
        
      } catch (error) {
      }
    }

    async function saveScore(playerName, score, level) {
        try {
          const { data, error } = await supabase
            .from('leaderboard')
            .insert([
              { 
                player_name: playerName, 
                score: score, 
                level: level,
                created_at: new Date().toISOString()
              }
            ]);
          
        
         if (error) throw error;
          
          await loadLeaderboard();
        } catch (error) {
          alert('Lỗi khi lưu điểm: ' + error.message);
        }
      }