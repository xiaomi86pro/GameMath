// questions/mixed-sequence.js
export function generate() {
    // Dãy xen kẽ cộng rồi nhân
    let seq = [2];
    seq.push(seq[0] + 2);      // +2
    seq.push(seq[1] * 2);      // ×2
    seq.push(seq[2] + 2);      // +2
    seq.push(seq[3] * 2);      // ×2
  
    const answer = seq[4] + 2; // tiếp tục pattern (+2)
  
    return {
      text: `${seq.join(', ')}, ?`,
      answer,
      type: 'MIXED-SEQUENCE'
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
  