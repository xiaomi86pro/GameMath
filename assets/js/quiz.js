// ===============================
// QUIZ ENGINE – DÙNG CHUNG GAME + ADMIN
// ===============================

// ===== CONSTANTS =====
export const QUESTION_TYPES_BASIC = [
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

export const DAYS_OF_WEEK = [
  'Chủ Nhật', 'Thứ Hai', 'Thứ Ba',
  'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'
];

export const MULT_DIV_FACTORS = {
  1: [2, 3],
  2: [4, 5],
  3: [6, 7],
  4: [8, 9]
};

export const DAY_OF_WEEK_HINT = `
            <div class="flex flex-col sm:flex-row justify-center items-center text-center space-y-2 sm:space-y-0 sm:space-x-4 p-2">
                <span class="text-red-600 font-semibold text-xs md:text-sm text-right sm:text-left">Hôm kia, Hôm qua, Trước đó là TRỪ (-)</span>
                <span class="text-lg font-extrabold text-blue-700 px-3 py-1 bg-white rounded-full shadow-lg border-2 border-blue-300">HÔM NAY</span>
                <span class="text-green-600 font-semibold text-xs md:text-sm text-left sm:text-right">Ngày mai, Ngày kia, Sau đó là CỘNG (+)</span>
            </div>
        `;

export const RELATIVE_DAY_OPTIONS = {
            'Hôm nay': 0,
            'Ngày mai': 1,
            'Ngày kia': 2,
            'Hôm qua': -1,
            'Hôm kia': -2
        };

export const QUESTION_TYPES_MULT_DIV = ['mult-div', 'find-x-mult-div', 'sorting', 'comparison'];
export const QUESTION_TYPES_TIMO = ['day-of-week', 'age-problem', 'queue-problem'];
export const DAYS_OF_WEEK = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
export const MAX_QUIZ_TIME_SECONDS = 30 * 60; // 30 phút



// Các hàm
export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function getMaxRange(level) {
  if (level === 1) return 10;
  if (level === 2) return 100;
  if (level === 3) return 1000;
  return 10;
}

//Nhóm cơ bản
export function generateBasicOpQuestion(max) {
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

export function generateBalanceEquation(max) {
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

export function generateMultDivQuestion() {
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

export function generateFindXMultDivQuestion() {
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

export function generateFindXQuestion(max) {
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

export function generateFindXMultDivQuestion() {
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

export function generateComparisonQuestion(level) {
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

export function generateEvenOddNumberQuestion(level) {
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
    // ===== CHẴN NHỎ NHẤT =====
    question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>.
               Tạo số <span class="text-red-600 font-extrabold">CHẴN nhỏ nhất</span> có thể (dùng hết 4 chữ số).`;

    const evenDigits = digits.filter(d => d % 2 === 0);
    if (evenDigits.length === 0) return generateEvenOddNumberQuestion(level);

    const lastDigit = Math.max(...evenDigits); // chẵn LỚN NHẤT
    const remaining = digits
        .filter(d => d !== lastDigit)
        .sort((a, b) => a - b); // tăng dần

    answer = remaining.join('') + lastDigit;

} else if (questionType === 1) {
    // ===== CHẴN LỚN NHẤT =====
    question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>.
               Tạo số <span class="text-red-600 font-extrabold">CHẴN lớn nhất</span> có thể (dùng hết 4 chữ số).`;

    const evenDigits = digits.filter(d => d % 2 === 0);
    if (evenDigits.length === 0) return generateEvenOddNumberQuestion(level);

    const lastDigit = Math.min(...evenDigits); // chẵn NHỎ NHẤT
    const remaining = digits
        .filter(d => d !== lastDigit)
        .sort((a, b) => b - a); // giảm dần

    answer = remaining.join('') + lastDigit;

} else if (questionType === 2) {
    // ===== LẺ NHỎ NHẤT =====
    question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>.
               Tạo số <span class="text-red-600 font-extrabold">LẺ nhỏ nhất</span> có thể (dùng hết 4 chữ số).`;

    const oddDigits = digits.filter(d => d % 2 !== 0);
    if (oddDigits.length === 0) return generateEvenOddNumberQuestion(level);

    const lastDigit = Math.max(...oddDigits); // lẻ LỚN NHẤT
    const remaining = digits
        .filter(d => d !== lastDigit)
        .sort((a, b) => a - b); // tăng dần

    answer = remaining.join('') + lastDigit;

} else {
    // ===== LẺ LỚN NHẤT =====
    question = `Cho 4 chữ số: <span class="text-blue-700 font-extrabold">${digits.join(', ')}</span>.
               Tạo số <span class="text-red-600 font-extrabold">LẺ lớn nhất</span> có thể (dùng hết 4 chữ số).`;

    const oddDigits = digits.filter(d => d % 2 !== 0);
    if (oddDigits.length === 0) return generateEvenOddNumberQuestion(level);

    const lastDigit = Math.min(...oddDigits); // lẻ NHỎ NHẤT
    const remaining = digits
        .filter(d => d !== lastDigit)
        .sort((a, b) => b - a); // giảm dần

    answer = remaining.join('') + lastDigit;
}

    
    return { question, answer, type: 'input' };
}

export function generateMaxMinTwoNumbers(level) {
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

export function generateSequencePattern() {
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

export function generateShapePattern() {
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

export function generateSequenceIncrement() {
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

export 


export function generateSortingQuestion(level) {
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

export function createClockSVG(hour, minute) {
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

export function generateClockQuestion() {
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

export  function generateWordProblem() {
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

export function generateDayOfWeekQuestion() {
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

export function generateQueueProblem() {
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

export function generateTIMOQuestion() {
    const questionType = QUESTION_TYPES_TIMO[getRandomInt(QUESTION_TYPES_TIMO.length)];
    
    if (questionType === 'day-of-week') {
        return generateDayOfWeekQuestion();
    } else if (questionType === 'age-problem') {
        return generateAgeProblem();
    } else {
        return generateQueueProblem();
    }
}

export {
  // utils
  getRandomInt,
  getMaxRange,

  // basic
  generateBasicOpQuestion,
  generateFindXQuestion,
  generateBalanceEquation,

  // mult/div
  generateMultDivQuestion,
  generateFindXMultDivQuestion,

  // logic
  generateEvenOddNumberQuestion,
  generateMaxMinTwoNumbers,

  // sequences
  generateSequencePattern,
  generateSequenceIncrement,
  generateShapePattern,

  // sorting / comparison
  generateSortingQuestion,
  generateComparisonQuestion,

  // clock / word
  generateClockQuestion,
  createClockSVG,
  generateWordProblem,

  // TIMO
  generateDayOfWeekQuestion,
  generateQueueProblem,
  generateTIMOQuestion
};

