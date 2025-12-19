/**
 * ADD_SUB Question Module
 * Câu hỏi cộng trừ cơ bản
 */

function getRandomNumberByLevel(level) {
    switch (level) {
      case 1: return Math.floor(Math.random() * 10);   // 0–9
      case 2: return Math.floor(Math.random() * 100);  // 0–99
      case 3: return Math.floor(Math.random() * 1000); // 0–999
      default: return 0;
    }
  }
  
  export function generate(quizState) {
    if (quizState.currentLevel === 2) {
      // 3 số, cộng trừ xen kẽ
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const z = Math.floor(Math.random() * 10);
  
      // Random vị trí dấu ?
      const pos = Math.floor(Math.random() * 3); // 0,1,2
  
      let expression, answer;
      if (pos === 0) {
        // ? + x + y = z
        answer = z - (x + y);
        expression = `? + ${x} + ${y} = ${z}`;
      } else if (pos === 1) {
        // x + ? - y = z
        answer = z - x + y;
        expression = `${x} + ? - ${y} = ${z}`;
      } else {
        // x - y + ? = z
        answer = z - (x - y);
        expression = `${x} - ${y} + ? = ${z}`;
      }
  
      return { text: expression, answer, type: 'FIND-X' };
    }
  
    if (quizState.currentLevel === 3) {
      // 4 số, cộng trừ xen kẽ
      const nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
      // Ví dụ: ? + a - b + c = d
      const [a, b, c, d] = nums;
      const answer = d - (a - b + c);
      const expression = `? + ${a} - ${b} + ${c} = ${d}`;
      return { text: expression, answer, type: 'FIND-X' };
    }
  
    // Level 1 mặc định: 2 số đơn giản
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const answer = a + b;
    return { text: `${a} + ? = ${answer}`, answer: b, type: 'FIND-X' };
  }
  
  export function display(question, context) {
    const {
      questionText,
      inputAnswerContainer,
      mathAnswerInput,
      submitAnswerBtn,
      submitAnswer
    } = context;
  
    questionText.textContent = question.text;
    questionText.classList.remove('hidden');
    
    inputAnswerContainer.classList.remove('hidden');
    mathAnswerInput.classList.remove('hidden');
    
    submitAnswerBtn.textContent = 'Kiểm tra';
    submitAnswerBtn.classList.remove('hidden');
    submitAnswerBtn.disabled = false;
    submitAnswerBtn.onclick = submitAnswer;
  }