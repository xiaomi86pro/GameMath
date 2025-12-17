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
    let a = getRandomNumberByLevel(quizState.currentLevel);
    let b = getRandomNumberByLevel(quizState.currentLevel);
  
    const isAdd = Math.random() < 0.5;
  
    // Level 1: không cho phép kết quả âm
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