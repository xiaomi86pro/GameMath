// questions/square-sequence.js
export function generate() {
    // Dãy số bình phương: 1, 4, 9, 16, 25...
    let seq = [1, 4, 9, 16, 25];
    const answer = 36; // số bình phương tiếp theo
  
    return {
      text: `${seq.join(', ')}, ?`,
      answer,
      type: 'SQUARE-SEQUENCE'
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
  