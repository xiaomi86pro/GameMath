/**
 * MULT_DIV Question Module
 * Câu hỏi nhân chia
 */

function getMultipliersByLevel(level) {
    switch (level) {
      case 1: return [2, 3];
      case 2: return [4, 5];
      case 3: return [6, 7];
      case 4: return [8, 9];
      default: return [2];
    }
  }
  
  export function generate(quizState) {
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