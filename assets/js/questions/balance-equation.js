// questions/balance-equation.js
export function generate(quizState) {
    const level = quizState.currentLevel;
  
    let a, b, c, op1, op2, pattern, expr, answer;
  
    while (true) {
      if (level === 1) {
        // Cấp độ 1: chỉ số hàng đơn vị (0–9)
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * 9) + 1;
        c = Math.floor(Math.random() * 9) + 1;
      } else {
        // Cấp độ 2: số có hàng chục, nhưng cộng/trừ số đơn vị
        a = (Math.floor(Math.random() * 9) + 1) * 10; // số chục
        b = Math.floor(Math.random() * 9) + 1;        // số đơn vị
        c = Math.floor(Math.random() * 9) + 1;        // số đơn vị
      }
  
      // Chọn ngẫu nhiên phép toán + hoặc -
      op1 = Math.random() < 0.5 ? '+' : '-';
      op2 = Math.random() < 0.5 ? '+' : '-';
  
      // Chọn ngẫu nhiên vị trí của ?
      pattern = Math.floor(Math.random() * 2); // 0 hoặc 1
  
      if (pattern === 0) {
        // Dạng: a ± b = ? ± c
        const leftVal = op1 === '+' ? a + b : a - b;
        answer = op2 === '+' ? leftVal - c : leftVal + c;
        expr = `${a} ${op1} ${b} = ? ${op2} ${c}`;
      } else {
        // Dạng: a ± b = c ± ?
        const leftVal = op1 === '+' ? a + b : a - b;
        answer = op2 === '+' ? leftVal - c : c - leftVal;
        expr = `${a} ${op1} ${b} = ${c} ${op2} ?`;
      }
  
      // ✅ Điều kiện loại bỏ số âm
      if (answer >= 0) break;
    }
  
    return {
      text: expr,
      answer,
      type: 'BALANCE-EQUATION' // đồng bộ với hệ thống chữ HOA
    };
  }
  
  export function display(question, refs) {
    const { questionText, inputAnswerContainer, mathAnswerInput, submitAnswerBtn, lockUserInput, checkAnswer } = refs;
  
    questionText.textContent = question.text;
    questionText.classList.remove('hidden');
  
    inputAnswerContainer.classList.remove('hidden');
    mathAnswerInput.classList.remove('hidden');
    submitAnswerBtn.classList.remove('hidden');
  
    submitAnswerBtn.onclick = () => {
      lockUserInput();
      refs.checkAnswer();
    };
  }
  