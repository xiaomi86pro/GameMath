// questions/even-sequence.js
export function generate() {
    // Dãy số chẵn: 2, 4, 6, 8, 10...
    let start = 2;
    let seq = [start, start + 2, start + 4, start + 6, start + 8];
    const answer = start + 10;
  
    return {
      text: `${seq.join(', ')}, ?`,
      answer,
      type: 'EVEN-SEQUENCE'
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
  