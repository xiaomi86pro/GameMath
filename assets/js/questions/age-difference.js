// questions/age-difference.js

export function generate(quizState) {
  const scenario = Math.floor(Math.random() * 3); // chọn 1 trong 3 biến thể
  let text, answer;

  // Sinh tuổi ngẫu nhiên
  const ageA = Math.floor(Math.random() * 15) + 5; // 5–19 tuổi
  const ageB = Math.floor(Math.random() * 15) + 5; // 5–19 tuổi

  switch (scenario) {
    // 1. Hỏi chênh lệch tuổi
    case 0: {
      const diff = Math.abs(ageA - ageB);
      if (ageA > ageB) {
        text = `Nam ${ageA} tuổi, An ${ageB} tuổi. Hỏi Nam hơn An bao nhiêu tuổi?`;
      } else {
        text = `Nam ${ageA} tuổi, An ${ageB} tuổi. Hỏi An hơn Nam bao nhiêu tuổi?`;
      }
      answer = diff;
      break;
    }

    // 2. Hỏi tổng tuổi
    case 1: {
      const total = ageA + ageB;
      text = `Nam ${ageA} tuổi, An ${ageB} tuổi. Hỏi tổng số tuổi của hai bạn là bao nhiêu?`;
      answer = total;
      break;
    }

    // 3. Hỏi tuổi người kia khi biết chênh lệch
    case 2: {
      const diff = Math.abs(ageA - ageB);
      if (ageA > ageB) {
        text = `Nam ${ageA} tuổi, hơn An ${diff} tuổi. Hỏi An bao nhiêu tuổi?`;
        answer = ageB;
      } else {
        text = `An ${ageB} tuổi, hơn Nam ${diff} tuổi. Hỏi Nam bao nhiêu tuổi?`;
        answer = ageA;
      }
      break;
    }
  }

  return {
    type: 'AGE-DIFFERENCE',
    text,
    answer
  };
}

export function display(q, refs) {
  const { questionText, inputAnswerContainer, mathAnswerInput, submitAnswerBtn, submitAnswer } = refs;

  // Hiển thị câu hỏi
  questionText.textContent = q.text;
  questionText.classList.remove('hidden');

  // Hiển thị ô nhập số
  inputAnswerContainer.classList.remove('hidden');
  mathAnswerInput.classList.remove('hidden');

  // Nút kiểm tra
  submitAnswerBtn.classList.remove('hidden');
  submitAnswerBtn.disabled = false;
  submitAnswerBtn.onclick = submitAnswer;
}