// questions/find-x.js
export function generate(quizState) {
  let expression, answer;

  if (quizState.currentLevel === 2) {
    while (true) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const z = Math.floor(Math.random() * 30 + 10); // tăng z để tránh âm
      const pos = Math.floor(Math.random() * 3);

      if (pos === 0) {
        answer = z - (x + y);
        expression = `? + ${x} + ${y} = ${z}`;
      } else if (pos === 1) {
        answer = z - x + y;
        expression = `${x} + ? - ${y} = ${z}`;
      } else {
        answer = z - (x - y);
        expression = `${x} - ${y} + ? = ${z}`;
      }

      if (answer >= 0) break; // chỉ chấp nhận số không âm
    }

    return { text: expression, answer, type: 'FIND-X' };
  }

  if (quizState.currentLevel === 3) {
    while (true) {
      const nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
      const [a, b, c, d] = nums;
      answer = d - (a - b + c);
      expression = `? + ${a} - ${b} + ${c} = ${d}`;
      if (answer >= 0) break;
    }

    return { text: expression, answer, type: 'FIND-X' };
  }

  // Level 1 mặc định
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);
  answer = b;
  return { text: `${a} + ? = ${a + b}`, answer, type: 'FIND-X' };
}

export function display(question, refs) {
  const { 
    questionText, 
    inputAnswerContainer, 
    mathAnswerInput, 
    submitAnswerBtn,
    submitAnswer  // ← SỬA: dùng submitAnswer thay vì lockUserInput + checkAnswer
  } = refs;
  
  questionText.textContent = question.text;
  questionText.classList.remove('hidden');

  inputAnswerContainer.classList.remove('hidden');
  mathAnswerInput.classList.remove('hidden');
  
  submitAnswerBtn.textContent = 'Kiểm tra';
  submitAnswerBtn.classList.remove('hidden');
  submitAnswerBtn.disabled = false;
  submitAnswerBtn.onclick = submitAnswer;  
  // 👉 Sau khi xử lý, focus sang nút "Câu hỏi tiếp theo"
  const nextBtn = document.getElementById('next-question-btn');
  if (nextBtn) nextBtn.focus();
}