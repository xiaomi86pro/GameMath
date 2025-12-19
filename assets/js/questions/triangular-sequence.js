// questions/triangular-sequence.js
export function generate() {
    // Dãy số tam giác: 1, 3, 6, 10, 15...
    let seq = [1, 3, 6, 10, 15];
    const answer = 21; // số tam giác tiếp theo
  
    return {
      text: `${seq.join(', ')}, ?`,
      answer,
      type: 'TRIANGULAR-SEQUENCE'
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
  