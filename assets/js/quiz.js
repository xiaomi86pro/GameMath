// ===== State =====
let leaderboardData = [];
let currentLevel = 1;
let currentLevelName = 'Cấp 1 (Phạm vi 0-9)';
let currentQuizType = 'ADD_SUB';
let currentScore = 0;
let currentQuestionNumber = 0;
let currentQuestion = null;
let quizTimer = null;
let timeRemaining = 0;
let startTime = 0;
let TOTAL_QUIZ_QUESTIONS = 20;

const QUESTION_TYPES_MULT_DIV = ['mult-div', 'find-x-mult-div', 'sorting', 'comparison'];
const QUESTION_TYPES_TIMO = ['day-of-week', 'age-problem', 'queue-problem'];
const DAYS_OF_WEEK = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const MAX_QUIZ_TIME_SECONDS = 30 * 60; // 30 phút

function initState() {
  currentLevel = 1;
  currentLevelName = 'Cấp 1 (Phạm vi 0-9)';
  currentQuizType = 'ADD_SUB';
  currentScore = 0;
  currentQuestionNumber = 0;
  TOTAL_QUIZ_QUESTIONS = 20;
  timeRemaining = MAX_QUIZ_TIME_SECONDS;
  startTime = 0;
}

        // Constants
        const soundCorrect = new Audio('assets/sounds/correct.mp3');
		const soundWrong = new Audio('assets/sounds/wrong.mp3');

        // Loại câu hỏi: Cộng/Trừ/So sánh/Sắp xếp/Tìm X, Nhân/Chia, Đọc giờ, Bài toán lời văn
        const QUESTION_TYPES_BASIC = [
    'basic-op', 
    'find-x', 
    'sorting', 
    'comparison',
    'balance-equation',      // MỚI: Phép tính cân bằng
    'create-even-odd',       // MỚI: Tạo số chẵn/lẻ
    'create-max-min',        // MỚI: Tạo 2 số lớn/nhỏ nhất
    'sequence-pattern',      // MỚI: Dãy số quy luật cộng đều
    'sequence-increment',    // MỚI: Dãy số quy luật cộng tăng dần
    'shape-pattern'          // MỚI: Hình vẽ quy luật
];
        
        
        // Thêm hằng số cho câu hỏi ngày trong tuần phức tạp
        const RELATIVE_DAY_OPTIONS = {
            'Hôm nay': 0,
            'Ngày mai': 1,
            'Ngày kia': 2,
            'Hôm qua': -1,
            'Hôm kia': -2
        };

        // Gợi ý cho bài toán ngày trong tuần (MỚI)
        const DAY_OF_WEEK_HINT = `
            <div class="flex flex-col sm:flex-row justify-center items-center text-center space-y-2 sm:space-y-0 sm:space-x-4 p-2">
                <span class="text-red-600 font-semibold text-xs md:text-sm text-right sm:text-left">Hôm kia, Hôm qua, Trước đó là TRỪ (-)</span>
                <span class="text-lg font-extrabold text-blue-700 px-3 py-1 bg-white rounded-full shadow-lg border-2 border-blue-300">HÔM NAY</span>
                <span class="text-green-600 font-semibold text-xs md:text-sm text-left sm:text-right">Ngày mai, Ngày kia, Sau đó là CỘNG (+)</span>
            </div>
        `;


        // Định nghĩa các bảng nhân cho từng cấp độ Nhân Chia
        const MULT_DIV_FACTORS = {
            1: [2, 3], // Cấp 1: x2, x3
            2: [4, 5], // Cấp 2: x4, x5
            3: [6, 7], // Cấp 3: x6, x7
            4: [8, 9]  // Cấp 4: x8, x9
        };

    


        // Các phần tử DOM
        const setupScreen = document.getElementById('setup-screen');
        const quizScreen = document.getElementById('quiz-screen');
        const endScreen = document.getElementById('end-screen');
        const levelSelectBtns = document.querySelectorAll('.level-select-btn');
        const startQuizBtn = document.getElementById('start-quiz-btn');
        const nextQuestionBtn = document.getElementById('next-question-btn');
        const restartQuizBtn = document.getElementById('restart-quiz-btn');
        const exitQuizBtn = document.getElementById('exit-quiz-btn');
        const questionText = document.getElementById('question-text');
        const currentLevelNameSpan = document.getElementById('current-level-name');
        const currentQuestionNumberSpan = document.getElementById('current-question-number');
        const totalQuestionsSpan = document.getElementById('total-questions');
        const currentScoreSpan = document.getElementById('current-score');
        const finalScoreSpan = document.getElementById('final-score');
        const mathAnswerInput = document.getElementById('math-answer-input');
        const submitAnswerBtn = document.getElementById('submit-answer-btn');
        const messageBox = document.getElementById('message-box');
        const inputAnswerContainer = document.getElementById('input-answer-container');
        const sortingNumbersContainer = document.getElementById('sorting-numbers-container');
        const sortingTargetContainer = document.getElementById('sorting-target-container');
        const sortingControls = document.getElementById('sorting-controls');
        const resetSortingBtn = document.getElementById('reset-sorting-btn');
        const submitSortingBtn = document.getElementById('submit-sorting-btn');
        const progressBar = document.getElementById('progress-bar');
        const scoreEffect = document.getElementById('score-effect');
        const quizTimerDisplay = document.getElementById('quiz-timer');
        const timeTakenMessage = document.getElementById('time-taken-message');
        const clockImageContainer = document.getElementById('clock-image-container');
        const levelDescription = document.getElementById('level-description');
	
        // Phần tử mới cho Gợi ý (MỚI)
        const hintArea = document.getElementById('hint-area');
        const hintText = document.getElementById('hint-text');


        // Phần tử mới cho So sánh
        const comparisonDisplayArea = document.getElementById('comparison-display-area');
        const expressionLeft = document.getElementById('expression-left');
        const expressionRight = document.getElementById('expression-right');
        const comparisonBox = document.getElementById('comparison-box');
        const comparisonButtonsContainer = document.getElementById('comparison-buttons-container');
        const comparisonButtons = document.querySelectorAll('.comp-btn');
        
        // Modal components
        const confirmModal = document.getElementById('confirm-modal');
        const modalCancelBtn = document.getElementById('modal-cancel-btn');
        const modalConfirmBtn = document.getElementById('modal-confirm-btn');

		function playCorrectSound() {
  			soundCorrect.currentTime = 0;
 			soundCorrect.play();
		}

		function playIncorrectSound() {
			soundWrong.currentTime = 0;
			soundWrong.play();
		}


		function giveFeedback(correct) {
 		if (correct) {
    	soundCorrect.currentTime = 0; // reset về đầu
   		soundCorrect.play();
    	flashColor('green'); // hiệu ứng màu xanh
  		} else {
    	soundWrong.currentTime = 0;
    	soundWrong.play();
    	flashColor('red'); // hiệu ứng màu đỏ
  		}
		}		
        
        // --- Logic Hẹn giờ ---

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }

        function updateTimerDisplay() {
            quizTimerDisplay.textContent = formatTime(timeRemaining);
            if (timeRemaining <= 60) {
                quizTimerDisplay.classList.add('text-4xl');
                quizTimerDisplay.classList.remove('text-3xl');
            } else {
                quizTimerDisplay.classList.add('text-3xl');
                quizTimerDisplay.classList.remove('text-4xl');
            }
        }

        function startTimer() {
            startTime = Date.now();
            timeRemaining = MAX_QUIZ_TIME_SECONDS;
            updateTimerDisplay();
            
            if (quizTimer) clearInterval(quizTimer);

            quizTimer = setInterval(() => {
                timeRemaining--;
                updateTimerDisplay();
                if (timeRemaining <= 0) {
                    clearInterval(quizTimer);
                    endQuiz(true); // Kết thúc do hết giờ
                }
            }, 1000);
        }

        function stopTimer() {
            if (quizTimer) clearInterval(quizTimer);
            quizTimer = null;
        }

        // --- Hàm Tiện Ích ---

        function getMaxRange(level) {
            if (level === 1) return 10;
            if (level === 2) return 100;
            if (level === 3) return 1000;
            return 10; // Fallback cho trường hợp không xác định
        }

        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }

        // --- Logic Hiệu ứng Điểm ---

        function showScoreEffect(isCorrect) {
            scoreEffect.textContent = isCorrect ? '+1' : '0';
            scoreEffect.className = isCorrect
                ? 'score-effect text-yellow-500' 
                : 'score-effect text-red-500'; 

            scoreEffect.style.opacity = '0';
            scoreEffect.style.transform = 'translateY(0)';
            void scoreEffect.offsetWidth;

            scoreEffect.style.opacity = '1';
            scoreEffect.style.transform = 'translateY(-25px)';

            setTimeout(() => {
                scoreEffect.style.opacity = '0';
            }, 500);
        }

        // --- Logic Tạo Câu Hỏi Mới ---

        function generateBasicOpQuestion(max) {
            let A, B, op, answer, question;
            do {
                A = getRandomInt(max) + 1;
                B = getRandomInt(max) + 1;
                op = (Math.random() > 0.5) ? '+' : '-';
                if (op === '+') {
                    answer = A + B;
                    question = `${A} + ${B} = ?`;
                } else {
                    if (A < B) [A, B] = [B, A];
                    answer = A - B;
                    question = `${A} - ${B} = ?`;
                }
            } while (answer < 0 || answer >= max * 2);
            return { question, answer: String(answer), type: 'input' };
        }

        function generateMultDivQuestion() {
            // Sử dụng bảng cửu chương theo cấp độ
            const factors = MULT_DIV_FACTORS[currentLevel];
            const baseFactor = factors[getRandomInt(factors.length)]; // Nhân tử cơ sở (2, 3, 4,...)
            const otherFactor = getRandomInt(10) + 1; // Số nhân còn lại (1 đến 10)

            let A, B, op, answer, question;
            
            if (Math.random() > 0.5) { // Multiplication: A x B = ?
                A = baseFactor; 
                B = otherFactor;
                answer = A * B;
                question = `${A} × ${B} = ?`;
            } else { // Division: C ÷ B = ?
                // Đảm bảo phép chia hết và nằm trong phạm vi bảng cửu chương
                B = baseFactor; // Số chia (phải là factor)
                answer = otherFactor; // Thương (từ 1 đến 10)
                A = B * answer; // Số bị chia
                question = `${A} ÷ ${B} = ?`;
            }
            return { question, answer: String(answer), type: 'input' };
        }
        
        function generateFindXMultDivQuestion() {
            // Sử dụng bảng cửu chương theo cấp độ
            const factors = MULT_DIV_FACTORS[currentLevel];
            const baseFactor = factors[getRandomInt(factors.length)]; // Nhân tử cơ sở
            const otherFactor = getRandomInt(10) + 1; // Số nhân còn lại (1 đến 10)
            
            let A, B, answer, question;
            
            if (Math.random() < 0.5) { // Multiplication: A x ? = C hoặc ? x B = C
                B = baseFactor;
                answer = otherFactor;
                A = B * answer; // Product
                
                if (Math.random() > 0.5) {
                     question = `${B} × ? = ${A}`; // Tìm nhân tử (otherFactor)
                } else {
                     question = `? × ${B} = ${A}`; // Tìm nhân tử (otherFactor)
                }
            } else { // Division: A ÷ ? = C hoặc ? ÷ B = C hoặc A ÷ B = ?
                B = baseFactor; // Số chia
                answer = otherFactor; // Thương
                A = B * answer; // Số bị chia
                
                // Randomly choose the unknown part
                const unknownType = getRandomInt(3); 
                
                if (unknownType === 0) { // Tìm số bị chia (A)
                    question = `? ÷ ${B} = ${answer}`;
                } else if (unknownType === 1) { // Tìm số chia (B)
                    answer = B; // Số chia là đáp án
                    question = `${A} ÷ ? = ${otherFactor}`; // Thương là otherFactor
                } else { // Tìm thương (answer)
                    question = `${A} ÷ ${B} = ?`;
                    // Answer is already correct (otherFactor)
                }
            }
            return { question, answer: String(answer), type: 'input' };
        }
		// 1. PHÉP TÍNH CÂN BẰNG
function generateBalanceEquation(max) {
    const A_right = getRandomInt(max) + 1;
    const B_right = getRandomInt(max) + 1;
    const C_right = A_right + B_right;
    
    const A_left = getRandomInt(max) + 1;
    const X = C_right - A_left;
    
    if (X <= 0 || X >= max * 2) {
        return generateBalanceEquation(max);
    }
    
    const question = `${A_left} + ? = ${A_right} + ${B_right}`;
    const answer = String(X);
    
    return { question, answer, type: 'input' };
}

// 2. TẠO SỐ CHẴN/LẺ TỪ 4 CHỮ SỐ
function generateEvenOddNumberQuestion(level) {
    const digits = [];
    const digitCount = 4;
    const max = 10;
    
    while (digits.length < digitCount) {
        const num = getRandomInt(max);
        if (!digits.includes(num)) {
            digits.push(num);
        }
    }
    
    const questionType = getRandomInt(4);
    let question, answer;
    
    if (questionType === 0) {
        // TẠO SỐ CHẴN NHỎ NHẤT
        question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>. 
                   Tạo số <span class="text-red-600 font-extrabold">CHẴN nhỏ nhất</span> có thể (dùng hết 4 chữ số).`;
        
        const evenDigits = digits.filter(d => d % 2 === 0);
        if (evenDigits.length === 0) {
            return generateEvenOddNumberQuestion(level);
        }
        
        const sortedAsc = [...digits].sort((a, b) => a - b);
        let evenDigit = null;
        for (let d of sortedAsc) {
            if (d % 2 === 0) {
                evenDigit = d;
                break;
            }
        }
        
        const remaining = sortedAsc.filter(d => d !== evenDigit);
        answer = remaining.join('') + evenDigit;
        
    } else if (questionType === 1) {
        // TẠO SỐ CHẴN LỚN NHẤT
        question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>. 
                   Tạo số <span class="text-red-600 font-extrabold">CHẴN lớn nhất</span> có thể (dùng hết 4 chữ số).`;
        
        const evenDigits = digits.filter(d => d % 2 === 0);
        if (evenDigits.length === 0) {
            return generateEvenOddNumberQuestion(level);
        }
        
        const sortedDesc = [...digits].sort((a, b) => b - a);
        let evenDigit = null;
        for (let d of sortedDesc) {
            if (d % 2 === 0) {
                evenDigit = d;
                break;
            }
        }
        
        const remaining = sortedDesc.filter(d => d !== evenDigit);
        answer = remaining.join('') + evenDigit;
        
    } else if (questionType === 2) {
        // TẠO SỐ LẺ NHỎ NHẤT
        question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>. 
                   Tạo số <span class="text-red-600 font-extrabold">LẺ nhỏ nhất</span> có thể (dùng hết 4 chữ số).`;
        
        const oddDigits = digits.filter(d => d % 2 !== 0);
        if (oddDigits.length === 0) {
            return generateEvenOddNumberQuestion(level);
        }
        
        const sortedAsc = [...digits].sort((a, b) => a - b);
        let oddDigit = null;
        for (let d of sortedAsc) {
            if (d % 2 !== 0) {
                oddDigit = d;
                break;
            }
        }
        
        const remaining = sortedAsc.filter(d => d !== oddDigit);
        answer = remaining.join('') + oddDigit;
        
    } else {
        // TẠO SỐ LẺ LỚN NHẤT
        question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>. 
                   Tạo số <span class="text-red-600 font-extrabold">LẺ lớn nhất</span> có thể (dùng hết 4 chữ số).`;
        
        const oddDigits = digits.filter(d => d % 2 !== 0);
        if (oddDigits.length === 0) {
            return generateEvenOddNumberQuestion(level);
        }
        
        const sortedDesc = [...digits].sort((a, b) => b - a);
        let oddDigit = null;
        for (let d of sortedDesc) {
            if (d % 2 !== 0) {
                oddDigit = d;
                break;
            }
        }
        
        const remaining = sortedDesc.filter(d => d !== oddDigit);
        answer = remaining.join('') + oddDigit;
    }
    
    return { question, answer, type: 'input' };
}

// 3. TẠO 2 SỐ LỚN/NHỎ NHẤT VÀ TÍNH TỔNG/HIỆU
function generateMaxMinTwoNumbers(level) {
    const digits = [];
    const digitCount = 4;
    const max = 10;
    
    while (digits.length < digitCount) {
        const num = getRandomInt(max);
        if (!digits.includes(num) && num !== 0) {
            digits.push(num);
        }
    }
    
    const questionType = getRandomInt(4);
    let question, answer;
    const sortedDesc = [...digits].sort((a, b) => b - a);
    const sortedAsc = [...digits].sort((a, b) => a - b);
    
    if (questionType === 0) {
        const num1 = parseInt(sortedDesc[0].toString() + sortedDesc[1].toString());
        const num2 = parseInt(sortedDesc[2].toString() + sortedDesc[3].toString());
        answer = String(num1 + num2);
        question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>. 
                   Tạo <span class="text-red-600 font-extrabold">2 số LỚN NHẤT</span> có thể (mỗi số 2 chữ số) rồi tính <span class="text-red-600 font-extrabold">TỔNG</span>.`;
        
    } else if (questionType === 1) {
        const num1 = parseInt(sortedDesc[0].toString() + sortedDesc[1].toString());
        const num2 = parseInt(sortedDesc[2].toString() + sortedDesc[3].toString());
        answer = String(Math.abs(num1 - num2));
        question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>. 
                   Tạo <span class="text-red-600 font-extrabold">2 số LỚN NHẤT</span> có thể (mỗi số 2 chữ số) rồi tính <span class="text-red-600 font-extrabold">HIỆU</span>.`;
        
    } else if (questionType === 2) {
        const num1 = parseInt(sortedAsc[0].toString() + sortedAsc[1].toString());
        const num2 = parseInt(sortedAsc[2].toString() + sortedAsc[3].toString());
        answer = String(num1 + num2);
        question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>. 
                   Tạo <span class="text-red-600 font-extrabold">2 số NHỎ NHẤT</span> có thể (mỗi số 2 chữ số) rồi tính <span class="text-red-600 font-extrabold">TỔNG</span>.`;
        
    } else {
        const num1 = parseInt(sortedAsc[0].toString() + sortedAsc[1].toString());
        const num2 = parseInt(sortedAsc[2].toString() + sortedAsc[3].toString());
        answer = String(Math.abs(num1 - num2));
        question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>. 
                   Tạo <span class="text-red-600 font-extrabold">2 số NHỎ NHẤT</span> có thể (mỗi số 2 chữ số) rồi tính <span class="text-red-600 font-extrabold">HIỆU</span>.`;
    }
    
    return { question, answer, type: 'input' };
}

// 4. DÃY SỐ QUY LUẬT CỘNG ĐỀU
function generateSequencePattern() {
    const patterns = [2, 3, 4, 5];
    const pattern = patterns[getRandomInt(patterns.length)];
    
    const sequenceLength = getRandomInt(2) + 5;
    const startNum = getRandomInt(10) + 1;
    
    const sequence = [startNum];
    for (let i = 1; i < sequenceLength; i++) {
        sequence.push(sequence[i - 1] + pattern);
    }
    
    // SỬA DÒNG NÀY:
    // CŨ: const answer = String(sequence[sequenceLength - 1] + pattern);
    const answer = String(sequence[sequenceLength - 1]); // ✅ BỎ "+ pattern"
    
    const displaySequence = sequence.slice(0, -1);
    
    const question = `Tìm số tiếp theo trong dãy: <span class="text-blue-700 font-extrabold">${displaySequence.join(', ')}, ?</span>`;
    
    return { question, answer, type: 'input' };
}
    

// 5. DÃY SỐ QUY LUẬT CỘNG TĂNG DẦN
function generateSequenceIncrement() {
    const sequenceLength = getRandomInt(2) + 6;
    const startNum = getRandomInt(5) + 1;
    
    const sequence = [startNum];
    let increment = 1;
    
    for (let i = 1; i < sequenceLength; i++) {
        sequence.push(sequence[i - 1] + increment);
        increment++;
    }
    
    // SỬA DÒNG NÀY:
    // CŨ: const answer = String(sequence[sequenceLength - 1] + increment);
    const answer = String(sequence[sequenceLength - 1]); // ✅ BỎ "+ increment"
    
    const displaySequence = sequence.slice(0, -1);
    
    const question = `Tìm số tiếp theo trong dãy (quy luật tăng dần): <span class="text-blue-700 font-extrabold">${displaySequence.join(', ')}, ?</span>`;
    
    return { question, answer, type: 'input' };
}

// 6. HÌNH VẼ QUY LUẬT LẶP LẠI
function generateShapePattern() {
    const shapes = ['🔵', '🔺', '⭐', '🟥', '💚', '🔶'];
    
    const patternLength = getRandomInt(2) + 3;
    const pattern = [];
    
    for (let i = 0; i < patternLength; i++) {
        pattern.push(shapes[i]);
    }
    
    const repeatTimes = getRandomInt(2) + 2;
    let fullSequence = [];
    
    for (let i = 0; i < repeatTimes; i++) {
        fullSequence = fullSequence.concat(pattern);
    }
    
    const answer = fullSequence[fullSequence.length - 1];
    const displaySequence = fullSequence.slice(0, -1);
    
    const question = `Tìm hình tiếp theo trong dãy: <span style="font-size: 2rem;">${displaySequence.join(' ')}, ?</span>`;
    
    return { 
        question, 
        answer, 
        type: 'multiple-choice',
        choices: pattern,
        special: 'shape-pattern'
    };
}
        function generateFindXQuestion(max) {
            let A, B, op, answer, question;
            do {
                A = getRandomInt(max) + 1;
                op = (Math.random() > 0.5) ? '+' : '-';
                if (op === '+') {
                    answer = getRandomInt(max) + 1;
                    const C = A + answer;
                    question = `${A} + ? = ${C}`;
                } else {
                    if (Math.random() > 0.5) {
                        const C = getRandomInt(A);
                        answer = A - C;
                        question = `${A} - ? = ${C}`;
                    } else {
                        B = getRandomInt(max) + 1;
                        const C = getRandomInt(max) + 1;
                        answer = B + C;
                        question = `? - ${B} = ${C}`;
                    }
                }
            } while (answer <= 0 || answer >= max * 2);
            return { question, answer: String(answer), type: 'input' };
        }

        function generateSortingQuestion(level) {
            // Đảm bảo luôn là 5 số
            const count = 5; 
            
            let max;
            if (level === 1) max = 100; // 0-100
            else if (level === 2) max = 500; // 0-500
            else max = 1000; // 0-1000 cho cấp 3 và cấp 4 (dùng max range cao nhất)

            const direction = (Math.random() > 0.5) ? 'tăng dần' : 'giảm dần';
            const numbers = [];
            while (numbers.length < count) {
                const num = getRandomInt(max) + 1;
                if (!numbers.includes(num)) {
                    numbers.push(num);
                }
            }
            let sorted = [...numbers].sort((a, b) => a - b);
            if (direction === 'giảm dần') {
                sorted.reverse();
            }
            const answer = sorted.join(',');
            
            const directionColorClass = (direction === 'tăng dần') ? 'text-blue-600' : 'text-red-600';
            
            const question = `Sắp xếp các số sau theo thứ tự <span class="font-extrabold ${directionColorClass}">${direction}</span>:`;
            return { question, numbers, answer, direction, type: 'sorting' };
        }

        // Hàm tạo một phép tính đơn giản dựa trên loại quiz và cấp độ
        function generateSimpleExpression(max, quizType) {
            let A, B, op, result;
            
            if (quizType === 'MULT_DIV') {
                const factors = MULT_DIV_FACTORS[currentLevel];
                let A_factor = factors[getRandomInt(factors.length)]; // Nhân tử cơ sở
                let B_factor = getRandomInt(10) + 1; // Nhân tử còn lại (1 đến 10)

                op = (Math.random() > 0.5) ? '×' : '÷';

                if (op === '×') {
                    A = A_factor;
                    B = B_factor;
                    result = A * B;
                } else {
                    // Division (A ÷ B = result)
                    const Divisor = A_factor;
                    const Quotient = B_factor;
                    const Dividend = Divisor * Quotient;
                    
                    // Randomly choose form: Dividend ÷ Divisor = ? or Dividend ÷ Quotient = ?
                    if (Math.random() > 0.5) { 
                        A = Dividend;
                        B = Divisor;
                        result = Quotient;
                    } else {
                        A = Dividend;
                        B = Quotient;
                        result = Divisor;
                    }
                }
            } else { // ADD_SUB
                A = getRandomInt(max) + 1;
                B = getRandomInt(max) + 1;
                op = (Math.random() > 0.5) ? '+' : '-';
                
                if (op === '-') {
                    if (A < B) [A, B] = [B, A];
                }
                
                result = (op === '+') ? A + B : A - B;
            }
            // Thay thế '×' và '÷' bằng '*' và '/' để eval() có thể tính
            const expression = `${A} ${op} ${B}`; 
            return { expression: expression.replace('×', '*').replace('÷', '/'), result: result };
        }

        function generateComparisonQuestion(level) {
            const isMultDivLevel = (currentQuizType === 'MULT_DIV');
            // Max range cho ADD_SUB trong comparison, MULT_DIV sẽ dùng factors
            const max = isMultDivLevel ? 10 : (level === 1) ? 15 : (level === 2) ? 100 : 500;
            
            let exp1 = generateSimpleExpression(max, currentQuizType);
            let exp2 = generateSimpleExpression(max, currentQuizType);
            
            // Đảm bảo kết quả không quá chênh lệch (chỉ áp dụng cho Cộng/Trừ)
            if (!isMultDivLevel && Math.abs(exp1.result - exp2.result) > 20 && exp1.result !== exp2.result) {
                 exp2 = generateSimpleExpression(max, currentQuizType);
            }
            
            let answer = '';
            // Dùng eval để so sánh chính xác kết quả
            const val1 = eval(exp1.expression);
            const val2 = eval(exp2.expression);
            
            if (val1 > val2) answer = '>';
            else if (val1 < val2) answer = '<';
            else answer = '=';

            return { 
                question: 'Chọn dấu so sánh đúng:', 
                exp1: exp1.expression.replace('*', '×').replace('/', '÷'), // Hiển thị ký hiệu toán học
                exp2: exp2.expression.replace('*', '×').replace('/', '÷'), // Hiển thị ký hiệu toán học
                answer: answer, 
                result1: val1, // Thêm kết quả của vế 1
                result2: val2, // Thêm kết quả của vế 2
                type: 'comparison' 
            };
        }
        
        // Hàm tạo SVG đồng hồ kim
        function createClockSVG(hour, minute) {
            const size = 150;
            const centerX = size / 2;
            const centerY = size / 2;
            const hourAngle = (hour % 12 + minute / 60) * 30 - 90;
            const minuteAngle = minute * 6 - 90;

            let svgHtml = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
            // Vòng tròn ngoài
            svgHtml += `<circle cx="${centerX}" cy="${centerY}" r="70" class="clock-face"/>`;
            // Vạch giờ
            for (let i = 1; i <= 12; i++) {
                const angle = i * 30 * Math.PI / 180;
                const r = 60;
                const x = centerX + r * Math.cos(angle - Math.PI / 2);
                const y = centerY + r * Math.sin(angle - Math.PI / 2);
                svgHtml += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="12" fill="#374151">${i}</text>`;
            }
            // Kim giờ
            svgHtml += `<line x1="${centerX}" y1="${centerY}" x2="${centerX + 40 * Math.cos(hourAngle * Math.PI / 180)}" y2="${centerY + 40 * Math.sin(hourAngle * Math.PI / 180)}" class="hour-hand"/>`;
            // Kim phút
            svgHtml += `<line x1="${centerX}" y1="${centerY}" x2="${centerX + 60 * Math.cos(minuteAngle * Math.PI / 180)}" y2="${centerY + 60 * Math.sin(minuteAngle * Math.PI / 180)}" class="minute-hand"/>`;
            // Chốt giữa
            svgHtml += `<circle cx="${centerX}" cy="${centerY}" r="3" fill="#ef4444"/>`;
            svgHtml += `</svg>`;
            return svgHtml;
        }

        function generateClockQuestion() {
            // Chỉ tạo giờ chẵn (ví dụ: 1:00, 1:30, 2:00, 2:30)
            const randomHour = getRandomInt(12) + 1; // 1 đến 12
            const randomMinute = getRandomInt(2) * 30; // 0 hoặc 30

            // Định dạng HH:MM cho đáp án
            const hour = String(randomHour).padStart(2, '0');
            const minute = String(randomMinute).padStart(2, '0');
            const answer = `${hour}:${minute}`;

            // Tạo và hiển thị đồng hồ SVG
            const svgHtml = createClockSVG(randomHour, randomMinute);
            clockImageContainer.innerHTML = svgHtml;

            const question = `Đồng hồ này đang chỉ mấy giờ? (Nhập dưới dạng HH:MM)`;
            return { question, answer: answer, type: 'input', special: 'clock' };
        }

        function generateWordProblem() {
            const ops = ['+', '-'];
            const op = ops[getRandomInt(ops.length)];
            const max = 50; // Giới hạn bài toán lời văn 
            
            let A = getRandomInt(max) + 5;
            let B = getRandomInt(A / 2) + 2; // Đảm bảo số hợp lý

            let problemText;
            let answer;

            if (op === '+') {
                answer = A + B;
                problemText = `Bạn An có ${A} viên kẹo. Mẹ cho An thêm ${B} viên kẹo nữa. Hỏi bạn An có tất cả bao nhiêu viên kẹo?`;
            } else {
                answer = A - B;
                problemText = `Bạn Bình có ${A} quả táo. Bình cho bạn ${B} quả. Hỏi Bình còn lại bao nhiêu quả táo?`;
            }
            
            const question = `**Bài toán có lời văn:** ${problemText}`;
            return { question, answer: String(answer), type: 'input', special: 'word-problem' };
        }
		
        /**
         * Hàm tạo câu hỏi ngày trong tuần (đã được sửa đổi)
         * - Cập nhật hướng từ 'trước'/'sau' thành 'trước đó'/'sau đó'
         */
        function generateDayOfWeekQuestion() {
            // 1. Chọn ngày tương đối (Hôm nay, Hôm qua, ...)
            const relativeKeys = Object.keys(RELATIVE_DAY_OPTIONS);
            const relativeDayKey = relativeKeys[getRandomInt(relativeKeys.length)];
            const relativeOffset = RELATIVE_DAY_OPTIONS[relativeDayKey];

            // 2. Chọn ngày gốc (TodayIndex) - Ngày thật của Hôm nay
            const todayIndex = getRandomInt(7); // 0-6
            const todayName = DAYS_OF_WEEK[todayIndex];

            // 3. Tính thứ của ngày tương đối (Reference Day Index)
            const refDayIndex = (todayIndex + relativeOffset + 7) % 7;
            const refDayName = DAYS_OF_WEEK[refDayIndex];

            // 4. Chọn khoảng cách n ngày và hướng (Giới hạn n <= 5)
            const maxDayGap = 5; 
            const dayGap = getRandomInt(maxDayGap) + 1; // 1 đến 5 ngày
            
            // Cập nhật ở đây: Dùng 'sau đó' và 'trước đó'
            const directionText = Math.random() > 0.5 ? 'sau đó' : 'trước đó'; 
            const directionInternal = directionText === 'sau đó' ? 'sau' : 'trước'; // Dùng cho tính toán
            const directionOffset = directionInternal === 'sau' ? dayGap : -dayGap;

            // 5. Tính thứ của ngày đích (Target Day Index, relative to todayIndex)
            let targetIndex = (todayIndex + directionOffset);
            targetIndex = (targetIndex % 7 + 7) % 7; // Đảm bảo index dương
            const targetDayName = DAYS_OF_WEEK[targetIndex];
            
            let question;
            
            if (relativeDayKey === 'Hôm nay') {
                // Cấu trúc đơn giản: Hôm nay là Thứ X. Hỏi n ngày sau/trước là thứ mấy.
                question = `<span class="text-purple-700 font-extrabold">${relativeDayKey}</span> là <span class="text-purple-700 font-extrabold">${refDayName}</span>. Hỏi <span class="font-extrabold">${dayGap}</span> ngày <span class="text-red-600 font-extrabold">${directionText}</span> là thứ mấy?`;
            } else {
                // Cấu trúc 2 phần: Hôm qua/Ngày mai... là Thứ X. Hỏi Hôm nay là thứ mấy VÀ n ngày sau/trước là thứ mấy.
                const refPart = `<span class="text-purple-700 font-extrabold">${relativeDayKey}</span> là <span class="text-purple-700 font-extrabold">${refDayName}</span>.`;
                
                // Ngày đích là [dayGap] ngày [directionText]
                const targetPart = `Hỏi <span class="font-extrabold">${dayGap}</span> ngày <span class="text-red-600 font-extrabold">${directionText}</span> (tính từ Hôm nay) là thứ mấy?`;
                
                question = `${refPart} Hỏi Hôm nay là thứ mấy và ${targetPart}`;
            }

            return { 
                question, 
                answer: targetDayName, 
                type: 'multiple-choice',
                choices: DAYS_OF_WEEK,
                special: 'day-of-week' // Thêm tag đặc biệt để hiện gợi ý
            };
        }

    // Hàm tạo câu hỏi về tuổi (đã được sửa đổi)
		  function generateAgeProblem() {
            const names = ['An', 'Bình', 'Chi', 'Dung', 'Em', 'Phong', 'Giang', 'Hà'];
            const name = names[getRandomInt(names.length)];
            
            const questionType = getRandomInt(3); // 0, 1, 2 cho 3 loại mới
            let question, answer;

            if (questionType === 0) { // Loại 1: Tuổi tương đối (Quá khứ/Tương lai -> Hiện tại/Tương lai/Quá khứ)
                const yearsOffset = getRandomInt(5) + 2; // Độ lệch thời gian gốc (2-6 năm)
                const isPastReference = Math.random() > 0.5; // True: X năm trước (Past) là mốc
                let currentAge;
                
                if (isPastReference) { 
                    // Mốc: X năm trước bạn A n tuổi. Hỏi Hiện tại/Y năm sau bạn A bao tuổi
                    const pastAge = getRandomInt(8) + 5; // 5-12 tuổi
                    currentAge = pastAge + yearsOffset;
                    
                    const targetYears = getRandomInt(5) + 1; // 1-5 năm
                    const targetType = Math.random() > 0.5 ? 'Hiện tại' : `${targetYears} năm sau`;
                    
                    let targetAge;
                    
                    if (targetType === 'Hiện tại') {
                        targetAge = currentAge;
                    } else {
                        targetAge = currentAge + targetYears;
                    }
                    
                    question = `${yearsOffset} năm trước, bạn <span class="text-purple-700 font-extrabold">${name}</span> ${pastAge} tuổi. Hỏi <span class="text-red-600 font-extrabold">${targetType}</span> bạn ấy bao nhiêu tuổi?`;
                    answer = String(targetAge);
                    
                } else { 
                    // Mốc: X năm sau bạn A n tuổi. Hỏi Hiện tại/Y năm trước bạn A bao tuổi
                    const futureAge = getRandomInt(10) + 15; // 15-25 tuổi
                    currentAge = futureAge - yearsOffset;
                    
                    const targetYears = getRandomInt(5) + 1; // 1-5 năm
                    const targetType = Math.random() > 0.5 ? 'Hiện tại' : `${targetYears} năm trước`;
                    
                    let targetAge;

                    if (targetType === 'Hiện tại') {
                        targetAge = currentAge;
                    } else {
                        targetAge = currentAge - targetYears;
                    }
                    
                    question = `${yearsOffset} năm sau, bạn <span class="text-purple-700 font-extrabold">${name}</span> ${futureAge} tuổi. Hỏi <span class="text-red-600 font-extrabold">${targetType}</span> bạn ấy bao nhiêu tuổi?`;
                    answer = String(Math.max(1, targetAge)); // Đảm bảo tuổi không âm
                }

            } else if (questionType === 1) { // Loại 2: Bố X tuổi, Mẹ ít hơn bố n tuổi. Hỏi mẹ bao nhiêu tuổi.
                const fatherAge = getRandomInt(20) + 30; // 30-50
                const ageDiff = getRandomInt(5) + 2; // 2-6 years difference
                const motherAge = fatherAge - ageDiff;
                
                question = `Bố <span class="text-purple-700 font-extrabold">${fatherAge}</span> tuổi. Mẹ <span class="text-red-600 font-extrabold">ít hơn</span> bố <span class="font-extrabold">${ageDiff}</span> tuổi. Hỏi mẹ bao nhiêu tuổi?`;
                answer = String(motherAge);

            } else { // questionType === 2 - Loại 3: Bố X tuổi, Mẹ Y tuổi. Hỏi bố hơn mẹ bao nhiêu tuổi.
                const fatherAge = getRandomInt(20) + 30; // 30-50
                const ageDiff = getRandomInt(5) + 2; // 2-6 years difference
                const motherAge = fatherAge - ageDiff;
                
                question = `Bố <span class="text-purple-700 font-extrabold">${fatherAge}</span> tuổi, Mẹ <span class="text-purple-700 font-extrabold">${motherAge}</span> tuổi. Hỏi bố <span class="text-red-600 font-extrabold">hơn</span> mẹ bao nhiêu tuổi?`;
                answer = String(ageDiff);
            }
            
            return { question, answer, type: 'input' };
        }
         

 // Hàm tạo câu hỏi về xếp hàng
 
function generateQueueProblem() {
    const names = ['An', 'Bình', 'Chi', 'Dung', 'Em', 'Phong', 'Giang', 'Hà', 'Linh', 'Mai'];
    const name = names[getRandomInt(names.length)];
    
    const questionType = getRandomInt(3); // 0, 1, 2
    let question, answer;
    
    if (questionType === 0) {
        // Dạng 1: Biết trước/sau, hỏi sau/trước hoặc hỏi thứ tự
        const totalPeople = getRandomInt(15) + 10; // 10-24 người
        const positionType = Math.random() > 0.5 ? 'trước' : 'sau';
        
        if (positionType === 'trước') {
            const peopleBefore = getRandomInt(totalPeople - 2) + 1;
            const peopleAfter = totalPeople - peopleBefore - 1;
            const position = peopleBefore + 1;
            
            const askType = getRandomInt(2);
            
            if (askType === 0) {
                question = `Một hàng có <span class="text-purple-700 font-extrabold">${totalPeople}</span> người. 
                           Phía <span class="text-red-600 font-extrabold">trước</span> bạn <span class="text-purple-700 font-extrabold">${name}</span> có 
                           <span class="text-purple-700 font-extrabold">${peopleBefore}</span> người. 
                           Hỏi phía <span class="text-red-600 font-extrabold">sau</span> bạn ${name} có bao nhiêu người?`;
                answer = String(peopleAfter);
            } else {
                question = `Một hàng có <span class="text-purple-700 font-extrabold">${totalPeople}</span> người. 
                           Phía <span class="text-red-600 font-extrabold">trước</span> bạn <span class="text-purple-700 font-extrabold">${name}</span> có 
                           <span class="text-purple-700 font-extrabold">${peopleBefore}</span> người. 
                           Hỏi bạn ${name} đứng thứ mấy?`;
                answer = String(position);
            }
            
        } else {
            const peopleAfter = getRandomInt(totalPeople - 2) + 1;
            const peopleBefore = totalPeople - peopleAfter - 1;
            const position = peopleBefore + 1;
            
            const askType = getRandomInt(2);
            
            if (askType === 0) {
                question = `Một hàng có <span class="text-purple-700 font-extrabold">${totalPeople}</span> người. 
                           Phía <span class="text-red-600 font-extrabold">sau</span> bạn <span class="text-purple-700 font-extrabold">${name}</span> có 
                           <span class="text-purple-700 font-extrabold">${peopleAfter}</span> người. 
                           Hỏi phía <span class="text-red-600 font-extrabold">trước</span> bạn ${name} có bao nhiêu người?`;
                answer = String(peopleBefore);
            } else {
                question = `Một hàng có <span class="text-purple-700 font-extrabold">${totalPeople}</span> người. 
                           Phía <span class="text-red-600 font-extrabold">sau</span> bạn <span class="text-purple-700 font-extrabold">${name}</span> có 
                           <span class="text-purple-700 font-extrabold">${peopleAfter}</span> người. 
                           Hỏi bạn ${name} đứng thứ mấy?`;
                answer = String(position);
            }
        }
        
    } else if (questionType === 1) {
        // Dạng 2: A đứng giữa, hỏi A đứng thứ mấy
        const totalPeople = getRandomInt(10) + 11;
        const adjustedTotal = (totalPeople % 2 === 0) ? totalPeople + 1 : totalPeople;
        const middlePosition = Math.ceil(adjustedTotal / 2);
        
        question = `Một hàng có <span class="text-purple-700 font-extrabold">${adjustedTotal}</span> người. 
                   Bạn <span class="text-purple-700 font-extrabold">${name}</span> đứng ở <span class="text-red-600 font-extrabold">giữa hàng</span>. 
                   Hỏi bạn ${name} đứng thứ mấy?`;
        answer = String(middlePosition);
        
    } else {
        // Dạng 3: A thứ x, B thứ y, hỏi giữa có bao nhiêu người
        const totalPeople = getRandomInt(15) + 15;
        const name2 = names[getRandomInt(names.length)];
        
        let positionA = getRandomInt(totalPeople - 5) + 2;
        let positionB = getRandomInt(totalPeople - 5) + 2;
        
        while (Math.abs(positionA - positionB) < 2) {
            positionB = getRandomInt(totalPeople - 5) + 2;
        }
        
        const peopleBetween = Math.abs(positionA - positionB) - 1;
        
        question = `Một hàng có <span class="text-purple-700 font-extrabold">${totalPeople}</span> người. 
                   Bạn <span class="text-purple-700 font-extrabold">${name}</span> đứng thứ <span class="text-purple-700 font-extrabold">${positionA}</span>, 
                   bạn <span class="text-purple-700 font-extrabold">${name2}</span> đứng thứ <span class="text-purple-700 font-extrabold">${positionB}</span>. 
                   Hỏi giữa bạn ${name} và bạn ${name2} có bao nhiêu người?`;
        answer = String(peopleBetween);
    }
    
    return { question, answer, type: 'input' };
}

    function generateTIMOQuestion() {
    const questionType = QUESTION_TYPES_TIMO[getRandomInt(QUESTION_TYPES_TIMO.length)];
    
    if (questionType === 'day-of-week') {
        return generateDayOfWeekQuestion();
    } else if (questionType === 'age-problem') {
        return generateAgeProblem();
    } else {
        return generateQueueProblem();
    }
}
        /**
         * Hàm chính để tạo câu hỏi ngẫu nhiên và kiểm tra kết thúc
         */
        function generateQuestion() {
            if (currentQuestionNumber >= TOTAL_QUIZ_QUESTIONS) {
                endQuiz(false); // Kết thúc do hoàn thành
                return;
            }

            currentQuestionNumber++;
            currentQuestionNumberSpan.textContent = currentQuestionNumber;
            
            // Cập nhật Progress Bar
            const percentage = (currentQuestionNumber / TOTAL_QUIZ_QUESTIONS) * 100;
            progressBar.style.width = `${percentage}%`;

            let randomType;
            let maxRange = getMaxRange(currentLevel);
            let questionPool;

            if (currentQuizType === 'MULT_DIV') {
     questionPool = QUESTION_TYPES_MULT_DIV;
} else if (currentQuizType === 'TIMO') {
     currentQuestion = generateTIMOQuestion();
     displayQuestion(currentQuestion);
     return;
} else {
    questionPool = QUESTION_TYPES_BASIC;
}


            // Xử lý 2 câu hỏi đặc biệt cuối cùng
            if (currentQuestionNumber === TOTAL_QUIZ_QUESTIONS - 1 && TOTAL_QUIZ_QUESTIONS >= 2) {
                currentQuestion = generateClockQuestion();
            } else if (currentQuestionNumber === TOTAL_QUIZ_QUESTIONS) {
                currentQuestion = generateWordProblem();
            } else {
                // Tạo câu hỏi ngẫu nhiên
                randomType = questionPool[getRandomInt(questionPool.length)];

                switch (randomType) {
					case 'balance-equation':
        currentQuestion = generateBalanceEquation(maxRange);
        break;
    case 'create-even-odd':
        currentQuestion = generateEvenOddNumberQuestion(currentLevel);
        break;
    case 'create-max-min':
        currentQuestion = generateMaxMinTwoNumbers(currentLevel);
        break;
    case 'sequence-pattern':
        currentQuestion = generateSequencePattern();
        break;
    case 'sequence-increment':
        currentQuestion = generateSequenceIncrement();
        break;
    case 'shape-pattern':
        currentQuestion = generateShapePattern();
        break;	
                    case 'basic-op':
                        currentQuestion = generateBasicOpQuestion(maxRange);
                        break;
                    case 'mult-div':
                        currentQuestion = generateMultDivQuestion();
                        break;
                    case 'find-x':
                        currentQuestion = generateFindXQuestion(maxRange);
                        break;
                    case 'find-x-mult-div':
                        currentQuestion = generateFindXMultDivQuestion();
                        break;
                    case 'sorting':
                        currentQuestion = generateSortingQuestion(currentLevel);
                        break;
                    case 'comparison':
                        currentQuestion = generateComparisonQuestion(currentLevel);
                        break;
                    default:
                        // Default fallback
                        currentQuestion = generateBasicOpQuestion(10); 
                }
            }

            displayQuestion(currentQuestion);
        }

        // --- Logic Hiển Thị Câu Hỏi và Đáp Án ---

        function displayQuestion(q) {
            messageBox.textContent = '';
            nextQuestionBtn.classList.add('hidden');
            
            // Ẩn tất cả các khu vực trả lời và hiển thị
            inputAnswerContainer.classList.add('hidden');
            sortingNumbersContainer.classList.add('hidden');
            sortingTargetContainer.classList.add('hidden');
            sortingControls.classList.add('hidden');
            comparisonButtonsContainer.classList.add('hidden');
            clockImageContainer.classList.add('hidden'); 
            comparisonDisplayArea.classList.add('hidden');
            questionText.classList.remove('hidden'); // Hiển thị text mặc định
            
            // Xóa các nút trắc nghiệm cũ
            const oldChoices = document.querySelectorAll('.choice-btn');
            oldChoices.forEach(btn => btn.remove());
            
            // Ẩn khu vực gợi ý (MỚI)
            hintArea.classList.add('hidden');
            hintText.innerHTML = '';


            if (q.type === 'input') {
                // Hiển thị dạng nhập đáp án
                questionText.innerHTML = q.question;
                inputAnswerContainer.classList.remove('hidden');
                mathAnswerInput.value = '';
                mathAnswerInput.focus();
                submitAnswerBtn.onclick = checkMathAnswer;
                submitAnswerBtn.disabled = false;
                
                if (q.special === 'clock') {
                    clockImageContainer.classList.remove('hidden');
                }
            } else if (q.type === 'sorting') {
                // Hiển thị dạng sắp xếp
                questionText.innerHTML = q.question;
                sortingNumbersContainer.classList.remove('hidden');
                sortingTargetContainer.classList.remove('hidden');
                sortingControls.classList.remove('hidden');
                renderSortingNumbers(q.numbers);
                sortingTargetContainer.innerHTML = '';
                submitSortingBtn.onclick = checkSortingAnswer;
                submitSortingBtn.disabled = false;
                resetSortingBtn.disabled = false;
            } else if (q.type === 'comparison') {
                // Hiển thị dạng so sánh 2 phép tính
                questionText.innerHTML = q.question;
                questionText.classList.add('hidden'); // Ẩn text mặc định
                
                comparisonDisplayArea.classList.remove('hidden');
                comparisonButtonsContainer.classList.remove('hidden');
                
                expressionLeft.textContent = q.exp1;
                expressionRight.textContent = q.exp2;
                comparisonBox.textContent = '?';
                comparisonBox.classList.remove('correct-answer-box', 'incorrect-answer-box');
                comparisonButtons.forEach(btn => btn.disabled = false);
            }
			if (q.type === 'multiple-choice') {
                questionText.innerHTML = q.question;
                
                let choicesHTML = '<div id="choice-buttons-area" class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">';
                q.choices.forEach(choice => {
                    choicesHTML += `<button class="choice-btn px-4 py-3 bg-purple-100 text-purple-800 font-semibold rounded-lg hover:bg-purple-200 transition duration-300 border-2 border-transparent" data-choice="${choice}">${choice}</button>`;
                });
                choicesHTML += '</div>';
                
                questionText.innerHTML += choicesHTML;
                
                const choiceBtns = document.querySelectorAll('.choice-btn');
                choiceBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        checkMultipleChoiceAnswer(btn.getAttribute('data-choice'));
                    });
                });
                
                // Hiển thị gợi ý cho câu hỏi Ngày trong tuần (MỚI)
                if (q.special === 'day-of-week') {
                    hintArea.classList.remove('hidden');
                    hintText.innerHTML = DAY_OF_WEEK_HINT;
                }
            }
        }

        function renderSortingNumbers(numbers) {
            sortingNumbersContainer.innerHTML = '';
            numbers.forEach(num => {
                const numDiv = document.createElement('div');
                numDiv.className = 'sorting-number px-4 py-2 bg-white border border-gray-300 rounded-lg text-2xl font-semibold text-gray-800 shadow-sm';
                numDiv.textContent = num;
                numDiv.setAttribute('data-value', num);
                numDiv.addEventListener('click', () => handleNumberClick(numDiv));
                sortingNumbersContainer.appendChild(numDiv);
            });
        }

        function handleNumberClick(element) {
            if (submitSortingBtn.disabled) return; 

            if (element.classList.contains('selected')) {
                element.classList.remove('selected');
                // Chuyển về container số gốc
                sortingNumbersContainer.appendChild(element);
            } else {
                element.classList.add('selected');
                // Chuyển sang container đích
                sortingTargetContainer.appendChild(element);
            }
        }

        // --- Logic Kiểm tra Đáp án ---

        function processAnswerResult(isCorrect, correctAnswerText) {
            if (isCorrect) {
                currentScore++;
                // Cập nhật message box dựa trên loại câu hỏi
                if (currentQuestion.type === 'input') {
                     messageBox.innerHTML = `🎉 <span class="text-green-800">Chính xác!</span> Đáp án là: <span class="text-green-600 font-extrabold">${correctAnswerText}</span>`;
                } else if (currentQuestion.type === 'comparison') {
                    // Đối với so sánh, correctAnswerText đã là thông điệp đầy đủ có kết quả
                    messageBox.innerHTML = `🎉 <span class="text-green-800">Chính xác!</span> ${correctAnswerText}`;
                    comparisonBox.classList.add('correct-answer-box');
                } else if (currentQuestion.type === 'multiple-choice') {
                     messageBox.innerHTML = `🎉 <span class="text-green-800">Chính xác!</span> Đáp án là: ${correctAnswerText}`;
                } else { // sorting
                     messageBox.innerHTML = `🎉 <span class="text-green-800">Chính xác!</span> Thứ tự đúng là: ${correctAnswerText}`;
                }
                
                messageBox.className = 'mt-4 text-xl font-bold text-green-800 p-3 rounded-lg correct-answer-box min-h-[30px]'; 
                showScoreEffect(true);
                playCorrectSound();
            } else {
                if (currentQuestion.type === 'comparison') {
                    // Đối với so sánh, correctAnswerText đã là thông điệp đầy đủ có kết quả
                    messageBox.innerHTML = `❌ <span class="text-red-800">Sai rồi!</span> ${correctAnswerText}`;
                } else if (currentQuestion.type === 'multiple-choice') {
                    messageBox.innerHTML = `❌ <span class="text-red-800">Sai rồi!</span> Đáp án đúng là: ${correctAnswerText}`;
                } else {
                    messageBox.innerHTML = `❌ <span class="text-red-800">Sai rồi!</span> Đáp án đúng là: <span class="text-red-600 font-extrabold">${correctAnswerText}</span>`;
                }
                
                messageBox.className = 'mt-4 text-xl font-bold text-red-800 p-3 rounded-lg incorrect-answer-box min-h-[30px]';
                showScoreEffect(false);
                playIncorrectSound();

                if (currentQuestion.type === 'comparison') {
                    comparisonBox.classList.add('incorrect-answer-box');
                }
            }
            currentScoreSpan.textContent = currentScore;
            nextQuestionBtn.classList.remove('hidden');
        }

        function checkMathAnswer() {
            const userAnswer = mathAnswerInput.value.trim();
            const correctAnswer = currentQuestion.answer;
            
            if (userAnswer === '') {
                messageBox.textContent = 'Vui lòng nhập đáp án!';
                messageBox.className = 'mt-4 text-xl font-bold text-yellow-800 p-3 rounded-lg warning-answer-box min-h-[30px]'; 
                return;
            }

            submitAnswerBtn.disabled = true;
            processAnswerResult(userAnswer === correctAnswer, correctAnswer);
        }

        function checkSortingAnswer() {
            const selectedElements = Array.from(sortingTargetContainer.children);
            const userAnswerArray = selectedElements.map(el => el.getAttribute('data-value')).join(',');
            const correctAnswer = currentQuestion.answer;
            const isCorrect = (userAnswerArray === correctAnswer);

            submitSortingBtn.disabled = true;
            resetSortingBtn.disabled = true;

            // Loại bỏ ** và thêm span cho màu sắc nổi bật
            const correctAnswerText = correctAnswer.split(',').join(' <span class="text-indigo-600 font-extrabold">→</span> ');
            
            if (isCorrect) {
                selectedElements.forEach(el => {
                    el.classList.remove('selected');
                    el.classList.add('bg-green-200', 'text-green-800'); 
                    el.removeEventListener('click', handleNumberClick);
                });
            } else {
                const userText = userAnswerArray.split(',').join(' → ');
                // Cập nhật messageBox để hiển thị cả đáp án người dùng và đáp án đúng
                const fullMessage = `Thứ tự bạn chọn là: ${userText}. Đúng phải là: ${correctAnswerText}`;
                processAnswerResult(false, fullMessage);
                return; 
            }

            processAnswerResult(isCorrect, correctAnswerText);
        }

        function checkComparisonAnswer(userOp) {
            comparisonButtons.forEach(btn => btn.disabled = true);
            const isCorrect = (userOp === currentQuestion.answer);
            
            // Xây dựng thông điệp hiển thị kết quả chi tiết
            // Loại bỏ ** và thêm span với màu xanh/đỏ cho nổi bật
            const resultMsg = `(${currentQuestion.exp1} = <span class="text-indigo-600 font-extrabold">${currentQuestion.result1}</span>) ${currentQuestion.answer} (${currentQuestion.exp2} = <span class="text-indigo-600 font-extrabold">${currentQuestion.result2}</span>).`;

            // Hiển thị dấu so sánh đã chọn trong ô
            comparisonBox.textContent = userOp;

            processAnswerResult(isCorrect, resultMsg);
        }
		function checkMultipleChoiceAnswer(userChoice) {
    const choiceBtns = document.querySelectorAll('.choice-btn');
    choiceBtns.forEach(btn => {
        btn.disabled = true;
        if (btn.getAttribute('data-choice') === userChoice) {
            btn.classList.add('bg-purple-500', 'text-white', 'border-purple-700');
        }
    });
    
    const isCorrect = (userChoice === currentQuestion.answer);
    const correctAnswerText = `<span class="text-purple-600 font-extrabold">${currentQuestion.answer}</span>`;
    
    choiceBtns.forEach(btn => {
        if (btn.getAttribute('data-choice') === currentQuestion.answer) {
            btn.classList.add('bg-green-500', 'text-white', 'border-green-700');
            btn.classList.remove('bg-purple-500', 'bg-purple-100');
        }
    });
    
    processAnswerResult(isCorrect, correctAnswerText);
}

        // --- Logic Kết thúc Quiz ---

        function endQuiz(isTimeout) {
            stopTimer();
            quizScreen.classList.add('hidden');
            endScreen.classList.remove('hidden');
            finalScoreSpan.textContent = currentScore;
            document.getElementById('total-questions-display').textContent = TOTAL_QUIZ_QUESTIONS;
            if (isTimeout) {
                timeTakenMessage.textContent = 'Hết giờ! Quiz đã kết thúc.';
            } else {
                const totalSeconds = MAX_QUIZ_TIME_SECONDS - timeRemaining;
                const timeStr = formatTime(totalSeconds);
                timeTakenMessage.textContent = `Bạn đã hoàn thành trong ${timeStr}.`;
            }
        }
        
        // --- Logic Modal ---
        function showModal() {
            stopTimer();
            confirmModal.classList.remove('hidden');
        }

        function hideModal() {
            confirmModal.classList.add('hidden');
            if (quizScreen.classList.contains('hidden') === false) {
                 startTimer(); // Tiếp tục đếm giờ nếu người dùng hủy thoát
            }
        }

        function exitToSetupScreen() {
            stopTimer();
            hideModal();
            quizScreen.classList.add('hidden');
            setupScreen.classList.remove('hidden');
            // Đặt lại trạng thái màn hình cài đặt
            // Chọn mặc định Cấp 1 Cộng Trừ
            levelSelectBtns[0].click();
        }

        // --- Xử lý Sự kiện Giao diện ---

        levelSelectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentLevel = parseInt(btn.getAttribute('data-level'));
                currentLevelName = btn.getAttribute('data-name');
                currentQuizType = btn.getAttribute('data-type'); // Lấy loại quiz


                levelSelectBtns.forEach(b => {
                    // Xóa màu nền xanh (ADD_SUB) và xanh lá (MULT_DIV) cũ
                    b.classList.remove('bg-indigo-500', 'text-white', 'bg-green-500', 'bg-purple-500');
                    // Thêm màu nền xám mặc định
                    b.classList.add('bg-gray-200', 'text-gray-700');
                });
                
                // Thiết lập màu mới dựa trên loại quiz
                if (currentQuizType === 'ADD_SUB') {
                    btn.classList.add('bg-indigo-500', 'text-white');
                } else if (currentQuizType === 'TIMO') {
                    btn.classList.add('bg-purple-500', 'text-white');
                } else {
                    btn.classList.add('bg-green-500', 'text-white');
                }
                btn.classList.remove('bg-gray-200', 'text-gray-700');
                startQuizBtn.disabled = false;
                levelDescription.textContent = `Bạn đã chọn: ${currentLevelName}`;
            });
        });

	startQuizBtn.addEventListener('click', () => {
    if (!currentLevel) { return; }

    currentScore = 0;
    currentQuestionNumber = 0;
    currentScoreSpan.textContent = 0;
    totalQuestionsSpan.textContent = TOTAL_QUIZ_QUESTIONS;
    currentLevelNameSpan.textContent = currentLevelName;

    setupScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    
    startTimer(); // Bắt đầu đếm giờ
    generateQuestion();
	});

	restartQuizBtn.addEventListener('click', () => {
    // Reset toàn bộ trạng thái
    currentScore = 0;
    currentQuestionNumber = 0;
    timeRemaining = MAX_QUIZ_TIME_SECONDS;
    
    // Ẩn màn hình kết thúc
    endScreen.classList.add('hidden');
    
    // Hiển thị màn hình setup (màn hình chính)
    setupScreen.classList.remove('hidden');
    
    // Reset các giá trị hiển thị
    currentScoreSpan.textContent = 0;
    progressBar.style.width = '0%';
    messageBox.textContent = '';
    
    // Chọn lại cấp độ mặc định (Cấp 1 Cộng Trừ)
    levelSelectBtns[0].click();
    
    // Reset nút số câu hỏi về mặc định (20 câu)
    const questionCountBtns = document.querySelectorAll('.q-count-btn');
    questionCountBtns.forEach(btn => {
        btn.classList.remove('bg-indigo-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    // Chọn mặc định 20 câu (nút thứ 2)
    questionCountBtns[1].classList.add('bg-indigo-500', 'text-white');
    questionCountBtns[1].classList.remove('bg-gray-200', 'text-gray-700');
    TOTAL_QUIZ_QUESTIONS = 20;
});


        nextQuestionBtn.addEventListener('click', () => {
            generateQuestion();
        });

        mathAnswerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !submitAnswerBtn.disabled) {
                checkMathAnswer();
            } else if (e.key === 'Enter' && nextQuestionBtn.classList.contains('hidden') === false) {
                 nextQuestionBtn.click();
            }
        });
        
        comparisonButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                checkComparisonAnswer(btn.getAttribute('data-op'));
            });
        });

        resetSortingBtn.addEventListener('click', () => {
            Array.from(sortingTargetContainer.children).forEach(el => {
                el.classList.remove('selected');
                sortingNumbersContainer.appendChild(el);
            });
        });

        // Nút Quay lại Màn hình Chính
        exitQuizBtn.addEventListener('click', showModal);
        modalCancelBtn.addEventListener('click', hideModal);
        modalConfirmBtn.addEventListener('click', exitToSetupScreen);


        // Thiết lập trạng thái ban đầu khi tải trang
        document.addEventListener('DOMContentLoaded', () => {
  levelSelectBtns[0].click();
  startQuizBtn.disabled = false;
  initState();
});
