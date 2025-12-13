// ===============================
// QUIZ ENGINE – DÙNG CHUNG GAME + ADMIN
// ===============================

// ===== CONSTANTS =====
export const DAYS_OF_WEEK = [
  'Chủ Nhật', 'Thứ Hai', 'Thứ Ba',
  'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'
];

export const RELATIVE_DAY_OPTIONS = {
  'Hôm nay': 0,
  'Ngày mai': 1,
  'Ngày kia': 2,
  'Hôm qua': -1,
  'Hôm kia': -2
};

export const MULT_DIV_FACTORS = {
  1: [2, 3],
  2: [4, 5],
  3: [6, 7],
  4: [8, 9]
};
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

