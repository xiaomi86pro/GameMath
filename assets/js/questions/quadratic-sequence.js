// questions/quadratic-sequence.js
export function generate(quizState) {
    // Chọn pattern công sai tăng dần: (2,4,6,8) hoặc (3,5,7,9)
    const diffs = Math.random() < 0.5 ? [2, 4, 6, 8] : [3, 5, 7, 9];
    let start = Math.floor(Math.random() * 5) + 1;
  
    let seq = [start];
    for (let d of diffs) {
      seq.push(seq[seq.length - 1] + d);
    }
  
    // Tiếp tục pattern: công sai tăng thêm 2
    const nextDiff = diffs[diffs.length - 1] + (diffs[1] - diffs[0]);
    const answer = seq[seq.length - 1] + nextDiff;
  
    return {
      text: `${seq.join(', ')}, ?`,
      answer,
      type: 'QUADRATIC-SEQUENCE'
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
  