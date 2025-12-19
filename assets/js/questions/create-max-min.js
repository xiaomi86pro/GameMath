// questions/create-max-min.js
export function generate(quizState) {
    // Random 4 số
    const numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 50) + 1);
  
    // Chọn ngẫu nhiên: lấy 2 số lớn nhất hay nhỏ nhất
    const takeMax = Math.random() < 0.5;
  
    // Chọn ngẫu nhiên: tính tổng hay hiệu
    const doSum = Math.random() < 0.5;
  
    // Sắp xếp
    const sorted = [...numbers].sort((a, b) => a - b);
    let chosen;
    if (takeMax) {
      chosen = [sorted[sorted.length - 2], sorted[sorted.length - 1]];
    } else {
      chosen = [sorted[0], sorted[1]];
    }
  
    let answer;
    if (doSum) {
      answer = chosen[0] + chosen[1];
    } else {
      // hiệu, đảm bảo không âm
      answer = Math.abs(chosen[1] - chosen[0]);
    }
  
    const typeText = takeMax ? '2 số lớn nhất' : '2 số nhỏ nhất';
    const opText = doSum ? 'tính tổng' : 'tính hiệu';
  
    return {
      text: `Cho các số: ${numbers.join(', ')}. Hãy lấy ${typeText} rồi ${opText}.`,
      answer,
      type: 'CREATE-MAX-MIN'
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
  