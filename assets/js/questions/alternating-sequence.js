// questions/alternating-sequence.js
export function generate() {
    // Dãy xen kẽ đơn giản: 2, 4, 2, 4, 2...
    let seq = [2, 4, 2, 4, 2];
    const answer = 4; // tiếp tục pattern
  
    return {
      text: `${seq.join(', ')}, ?`,
      answer,
      type: 'ALTERNATING-SEQUENCE'
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
  