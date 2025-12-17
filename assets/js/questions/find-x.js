// questions/find-x.js
export function generate(quizState) {
    // Sinh số ngẫu nhiên trong phạm vi level
    const max = quizState.currentLevel * 10; // ví dụ cấp 1: 0-9, cấp 2: 0-19...
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
  
    // Các dạng biểu thức
    const patterns = [
      { expr: `${a} + ? = ${a + b}`, answer: b },
      { expr: `? + ${a} = ${a + b}`, answer: b },
      { expr: `${a} - ? = ${a - b}`, answer: b },
      { expr: `? - ${a} = ${b - a}`, answer: b },
    ];
  
    // Chọn ngẫu nhiên một dạng
    const chosen = patterns[Math.floor(Math.random() * patterns.length)];
  
    return {
      text: chosen.expr,
      answer: chosen.answer,
      type: 'find-x'
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
      checkAnswer();
    };
  }
  