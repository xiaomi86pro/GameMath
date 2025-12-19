// questions/age-combined.js
export function generate() {
    const years = Math.floor(Math.random() * 4) + 2; // số năm 2–5
    const pattern = Math.random() < 0.5 ? 'TOTAL' : 'HIDDEN';
  
    if (pattern === 'TOTAL') {
      const ageA = Math.floor(Math.random() * 20) + 6;
      const ageB = Math.floor(Math.random() * 20) + 6;
      const answer = (ageA + years) + (ageB + years);
  
      return {
        text: `A năm nay ${ageA} tuổi, B năm nay ${ageB} tuổi. Sau ${years} năm nữa tổng số tuổi của hai bạn là bao nhiêu?`,
        answer,
        type: 'AGE-COMBINED'
      };
    } else {
      const futureAge = Math.floor(Math.random() * 81) + 10; // 10–90
      const answer = futureAge - years;
  
      return {
        text: `Sau ${years} năm nữa, tuổi của An sẽ là ${futureAge}. Hỏi hiện nay An bao nhiêu tuổi?`,
        answer,
        type: 'AGE-COMBINED'
      };
    }
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
  