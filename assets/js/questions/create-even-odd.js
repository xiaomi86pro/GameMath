// questions/create-even-odd.js
export function generate(quizState) {
    // Random 3 hoặc 4 số
    const count = Math.random() < 0.5 ? 3 : 4;
    const numbers = Array.from({ length: count }, () => Math.floor(Math.random() * 50) + 1);
  
    // Random chọn chẵn hay lẻ
    const isEven = Math.random() < 0.5;
    const filtered = numbers.filter(n => isEven ? n % 2 === 0 : n % 2 !== 0);
  
    // Nếu không có số phù hợp, random lại
    if (filtered.length === 0) {
      return generate(quizState);
    }
  
    const answer = Math.max(...filtered);
    const typeText = isEven ? 'số chẵn lớn nhất' : 'số lẻ lớn nhất';
  
    return {
      text: `Cho các số: ${numbers.join(', ')}. Hãy tìm ${typeText}.`,
      answer,
      type: 'CREATE-EVEN-ODD'
    };
  }
  
  export function display(q, refs) {
    const { questionText, inputAnswerContainer, mathAnswerInput, submitAnswerBtn, lockUserInput, checkAnswer } = refs;
    questionText.textContent = q.text;
    questionText.classList.remove('hidden');
    inputAnswerContainer.classList.remove('hidden');
    mathAnswerInput.classList.remove('hidden');
    submitAnswerBtn.classList.remove('hidden');
    submitAnswerBtn.onclick = () => {
      lockUserInput();
      refs.checkAnswer();
    };
  }
  