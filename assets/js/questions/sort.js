/**
 * SORT Question Module
 * Câu hỏi sắp xếp số
 */

export function generate(quizState) {
    const count = quizState.currentLevel + 3; // level 1 → 4 số
  
    const set = new Set();
    while (set.size < count) {
      set.add(Math.floor(Math.random() * 50));
    }
  
    const numbers = Array.from(set);
    const order = Math.random() < 0.5 ? 'ASC' : 'DESC';
  
    const answer = [...numbers].sort((a, b) =>
      order === 'ASC' ? a - b : b - a
    );
  
    return {
      numbers,
      order,
      answer,
      type: 'SORT'
    };
  }
  
  export function display(question, context) {
    const {
      questionText,
      inputAnswerContainer,
      mathAnswerInput,
      sortingNumbersContainer,
      sortingTargetContainer,
      submitAnswerBtn,
      renderSortingNumbers,
      lockUserInput,
      checkSortingAnswer
    } = context;
  
    questionText.textContent =
      question.order === 'ASC'
        ? 'Sắp xếp các số theo thứ tự tăng dần'
        : 'Sắp xếp các số theo thứ tự giảm dần';
  
    questionText.classList.remove('hidden');
  
    sortingNumbersContainer.classList.remove('hidden');
    sortingTargetContainer.classList.remove('hidden');
  
    renderSortingNumbers(question.numbers);
  
    inputAnswerContainer.classList.remove('hidden');
    mathAnswerInput.classList.add('hidden');
  
    submitAnswerBtn.textContent = 'Kiểm tra';
    submitAnswerBtn.classList.remove('hidden');
    submitAnswerBtn.disabled = false;
  
    submitAnswerBtn.onclick = () => {
      const selected = Array.from(
        sortingTargetContainer.children
      ).map(el => Number(el.textContent));
  
      lockUserInput();
      checkSortingAnswer(selected);
    };
    // 👉 Sau khi xử lý, focus sang nút "Câu hỏi tiếp theo"
    const nextBtn = document.getElementById('next-question-btn');
    if (nextBtn) nextBtn.focus();
  }