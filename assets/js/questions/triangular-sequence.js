// questions/triangular-sequence.js
export function generate() {
  // Dãy số tam giác: 1, 3, 6, 10, 15...
  const seq = [1, 3, 6, 10, 15];
  const answer = 21; // số tam giác tiếp theo

  return {
    text: `${seq.join(', ')}, ?`,
    answer,
    type: 'TRIANGULAR-SEQUENCE'
  };
}

export function display(q, refs) {
  const {
    questionText,
    inputAnswerContainer,
    mathAnswerInput,
    submitAnswerBtn,
    submitAnswer // 👉 dùng submitAnswer thay vì checkAnswer
  } = refs;

  // Hiển thị câu hỏi
  questionText.textContent = q.text;
  questionText.classList.remove('hidden');

  // Hiển thị ô nhập
  inputAnswerContainer.classList.remove('hidden');
  mathAnswerInput.classList.remove('hidden');

  // Hiển thị nút kiểm tra
  submitAnswerBtn.textContent = 'Kiểm tra';
  submitAnswerBtn.classList.remove('hidden');
  submitAnswerBtn.disabled = false;

  // 👉 Gán đúng hàm xử lý chung
  submitAnswerBtn.onclick = submitAnswer;
}