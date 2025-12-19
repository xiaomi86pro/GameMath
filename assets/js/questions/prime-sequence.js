// questions/prime-sequence.js
export function generate() {
    // Dãy số nguyên tố nhỏ: 2, 3, 5, 7, 11...
    let seq = [2, 3, 5, 7, 11];
    const answer = 13; // số nguyên tố tiếp theo
  
    return {
      text: `${seq.join(', ')}, ?`,
      answer,
      type: 'PRIME-SEQUENCE'
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
  