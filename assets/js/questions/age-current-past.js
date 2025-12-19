// questions/age-current-past.js
export function generate() {
    const age = Math.floor(Math.random() * 20) + 6; // tuổi hiện tại 6–25
    const years = Math.floor(Math.random() * 4) + 2; // số năm 2–5
    const isFuture = Math.random() < 0.5; // chọn tương lai hay quá khứ
  
    const answer = isFuture ? age + years : age - years;
    const text = isFuture
      ? `Bạn năm nay ${age} tuổi. Sau ${years} năm nữa bạn bao nhiêu tuổi?`
      : `Bạn năm nay ${age} tuổi. Cách đây ${years} năm bạn bao nhiêu tuổi?`;
  
    return {
      text,
      answer,
      type: 'AGE-CURRENT-PAST'
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
  