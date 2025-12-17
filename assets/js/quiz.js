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
      'ADD_SUB': 40,
      'COMPARE': 30,
      'SORT': 20,
      'CLOCK': 10
    },
    2: {
      'ADD_SUB': 30,
      'COMPARE': 25,
      'SORT': 20,
      'CLOCK': 15,
      'MULT_DIV': 10
    },
    3: {
      'ADD_SUB': 35,
      'COMPARE': 25,
      'SORT': 20,
      'MULT_DIV': 20
    }
  },
  MULT_DIV: {
    1: { 'MULT_DIV': 70, 'SORT': 30 },
    2: { 'MULT_DIV': 60, 'SORT': 25, 'COMPARE': 15 },
    3: { 'MULT_DIV': 65, 'SORT': 20, 'COMPARE': 15 },
    4: { 'MULT_DIV': 70, 'SORT': 20, 'COMPARE': 10 }
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
  expressionLeft = document.getElementById('expression-left');
  expressionRight = document.getElementById('expression-right');
  comparisonBox = document.getElementById('comparison-box');
  /* === Input Answer === */
  inputAnswerContainer = document.getElementById('input-answer-container');
  mathAnswerInput = document.getElementById('math-answer-input');
  submitAnswerBtn = document.getElementById('submit-answer-btn');
  //console.log('submitAnswerBtn =', submitAnswerBtn);


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

  //submitAnswerBtn.addEventListener('click', checkAnswer);
  nextQuestionBtn.addEventListener('click', nextQuestion);
  
  const compButtons = document.querySelectorAll('.comp-btn');
  compButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedOp = btn.dataset.op;
      handleCompareAnswer(selectedOp);
    });
  });

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

 // submitAnswerBtn.addEventListener('click', submitAnswer);

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
  modalCancelBtn.addEventListener('click', () => {
    confirmModal.classList.add('hidden');
    confirmModal.classList.remove('flex');
  });
  
  modalConfirmBtn.addEventListener('click', () => {
    location.reload();
  });

  // Xử lý phím Enter cho ô nhập đáp án
  mathAnswerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Nếu nút "Kiểm tra" đang hiện và không bị disabled
      if (!submitAnswerBtn.classList.contains('hidden') && !submitAnswerBtn.disabled) {
        submitAnswerBtn.click();
      }
      // Nếu nút "Câu hỏi tiếp theo" đang hiện
      else if (!nextQuestionBtn.classList.contains('hidden')) {
        nextQuestionBtn.click();
      }
    }
  });
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

  const scoreBall = document.getElementById('score-ball');
    if (scoreBall) {
      scoreBall.textContent = 0;
      scoreBall.classList.remove('bg-yellow-400', 'animate-pulse');
      scoreBall.classList.add('bg-blue-500');
      scoreBall.style.left = '0%';
    }
  
  startTimer();
  nextQuestion();
}

async function nextQuestion(){
    quizState.currentQuestionNumber++;
    if (quizState.currentQuestionNumber > quizState.TOTAL_QUIZ_QUESTIONS) {
      endQuiz();
      return;
    }
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
  console.log('generateQuestion chạy');
  
  // Lấy trọng số theo quiz type và level
  const weights = QUESTION_WEIGHTS[quizState.currentQuizType]?.[quizState.currentLevel];
  
  if (!weights) {
    console.error('Không tìm thấy weights cho', quizState.currentQuizType, quizState.currentLevel);
    quizState.currentQuestion = {
      text: 'Chưa cấu hình dạng bài cho level này',
      answer: null,
      type: 'ERROR'
    };
    displayQuestion();
    return;
  }
  
  // Chọn loại câu hỏi theo trọng số
  const selectedType = weightedRandom(weights);
  console.log('Đã chọn type:', selectedType);
  
  // Load module tương ứng
  const module = await loadQuestionModule(selectedType);
  
  if (!module || !module.generate) {
    console.error('Module không hợp lệ:', selectedType);
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
  
  console.log('currentQuestion =', quizState.currentQuestion);
  console.log('TYPE =', quizState.currentQuestion?.type);
  
  displayQuestion();
}

async function displayQuestion() {
  hideAllAnswerAreas();
  resetSubmitButton();
  submitAnswerBtn.classList.add('hidden');
  const q = quizState.currentQuestion;
  if (!q || q.type === 'ERROR') {
    questionText.textContent = q?.text || 'Lỗi không xác định';
    questionText.classList.remove('hidden');
    return;
  }
  
  // Load module tương ứng
  const module = await loadQuestionModule(q.type);
  
  if (!module || !module.display) {
    console.error('Module không có hàm display:', q.type);
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

  function handleCorrectAnswer() {
    quizState.currentScore += 1;
    quizState.correctStreak += 1;
  
    showScoreEffect('+1', 'text-yellow-400');
  
    const scoreBall = document.getElementById('score-ball');
      if (scoreBall) {
        scoreBall.textContent = quizState.currentScore;

        // reset class lửa
        scoreBall.classList.remove(
          'score-ball-fire',
          'fire-lv1',
          'fire-lv2',
          'fire-lv3'
        );

        if (quizState.correctStreak >= 3) {
          scoreBall.classList.add('score-ball-fire', 'fire-lv1');
        }
        if (quizState.correctStreak >= 5) {
          scoreBall.classList.add('fire-lv2');
        }
        if (quizState.correctStreak >= 10) {
          scoreBall.classList.add('fire-lv3');
        }
      }
    //        scoreBall.classList.remove('bg-blue-500');

    soundCorrect?.play();
  
    messageBox.textContent = '✅ Chính xác!';
    messageBox.className = 'text-green-600 font-bold';
  
    nextQuestionBtn.classList.remove('hidden');
  }
  
  function handleWrongAnswer() {
    quizState.currentScore -= 1;
    quizState.correctStreak = 0;
  
    showScoreEffect('-1', 'text-red-500');
  
    const scoreBall = document.getElementById('score-ball');
      if (scoreBall) {
        scoreBall.textContent = quizState.currentScore;
        scoreBall.classList.remove(
          'score-ball-fire',
          'fire-lv1',
          'fire-lv2',
          'fire-lv3'
        );
      }
  
    soundWrong?.play();
  
    messageBox.textContent = '❌ Sai rồi!';
    messageBox.className = 'text-red-600 font-bold';
  
    nextQuestionBtn.classList.remove('hidden');
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
  
/* =========================
   8. ANSWER CHECKING
========================= */
function checkSortingAnswer(userOrder) {
  const correct = quizState.currentQuestion.answer;
  const isCorrect =
    JSON.stringify(userOrder) === JSON.stringify(correct);

  if (isCorrect) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer();
  }

  nextQuestionBtn.classList.remove('hidden');
}


function submitAnswer() {
  const userAnswer = mathAnswerInput.value.trim();

  if (userAnswer === '') {
    messageBox.textContent = '⚠️ Bạn chưa nhập đáp án';
    messageBox.className = 'text-yellow-600 font-bold';
    return;
  }
  
  lockUserInput();
  checkAnswer();
}

function checkAnswer() {
  if (!quizState.currentQuestion) return false;

  const userAnswer = Number(mathAnswerInput.value);

  if (mathAnswerInput.value.trim() === '') {
    messageBox.textContent = '⚠️ Bạn chưa nhập đáp án';
    messageBox.className = 'text-yellow-600 font-bold';
    return false;
  }

  const isCorrect = userAnswer === quizState.currentQuestion.answer;
  
  if (isCorrect) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer();
  }
  
  return isCorrect;
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
    console.error(`Không thể load module ${type}:`, error);
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
function showScoreEffect(text, color) {
  scoreEffect.textContent = text;
  scoreEffect.className = `absolute text-2xl font-bold ${color}`;
  scoreEffect.style.opacity = 1;
  scoreEffect.style.transform = 'translateY(0)';

  setTimeout(() => {
    scoreEffect.style.opacity = 0;
    scoreEffect.style.transform = 'translateY(-30px)';
  }, 600);
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

  //submitAnswerBtn.classList.add('hidden');
  //clockQuestionContainer.classList.add('hidden');
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
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.player_name}</td>
            <td>${row.score}</td>
            <td>${row.level}</td>
          `;
          
          leaderboardBody.appendChild(tr);
        });
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      }
    }

    async function saveScore(playerName, score, level) {
      console.log('🟡 saveScore được gọi với:', { playerName, score, level }); // THÊM
      console.log('🟡 Supabase client:', supabase); // THÊM
      console.log('🟡 SUPABASE_URL:', SUPABASE_URL); // THÊM
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
          
            console.log('🟢 Kết quả insert:', { data, error }); // THÊM
        
         if (error) throw error;
          
          await loadLeaderboard();
        } catch (error) {
          console.error('🔴 Lỗi khi lưu điểm:', error);
          alert('Lỗi khi lưu điểm: ' + error.message);
        }
      }

      // Xử lý sự kiện submit score (phải đặt sau khi hàm saveScore đã được định nghĩa)
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🟣🟣🟣 DOMContentLoaded THỨ HAI đã chạy!');
        console.log('🟣 Kiểm tra biến global:', { submitScoreBtn, playerNameInput, nameModal });
        //const submitScoreBtn = document.getElementById('submit-score');
        //const playerNameInput = document.getElementById('player-name');
        //const nameModal = document.getElementById('name-modal');
      
        if (submitScoreBtn) {
          console.log('🟣 submitScoreBtn TỒN TẠI, đang bind event...');
          submitScoreBtn.addEventListener('click', async () => {
            console.log('🔵 Đã click nút Lưu kết quả'); 
            const name = playerNameInput.value.trim();
            console.log('🔵 Tên người chơi:', name);
            if (name === '') {
              alert('Vui lòng nhập tên!');
              return;
            }
            console.log('🔵 Chuẩn bị gọi saveScore');
            await saveScore(name, quizState.currentScore, quizState.currentLevel);
            console.log('🔵 Đã gọi saveScore xong');
            nameModal.classList.add('hidden');
            nameModal.classList.remove('flex');
            playerNameInput.value = '';
            location.reload();
          });
          console.log('🟣 Đã bind event xong!');
        } else {
          console.log('🔴 Không tìm thấy submitScoreBtn');
        }
        }
    );

      /* =========================
        INIT LEADERBOARD
      ========================= */

      // Gọi loadLeaderboard khi trang load xong
      document.addEventListener('DOMContentLoaded', () => {
        console.log('🟣🟣🟣 DOMContentLoaded THỨ HAI đã chạy!');
        // Đợi một chút để đảm bảo tất cả biến đã được khởi tạo
        setTimeout(() => {
          if (typeof loadLeaderboard === 'function') {
            loadLeaderboard();
          }
        }, 500);
      });

