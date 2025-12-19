export function generate(quizState) {
    const scenario = Math.floor(Math.random() * 5); // chọn 1 trong 5 dạng
    let text, answer;
  
    switch (scenario) {
      // 1. A đứng giữa
      case 0: {
        const x = Math.floor(Math.random() * 39) + 2; // ít nhất 2 người, tối đa 40
        const pos = Math.ceil(x / 2);
        text = `Một hàng có ${x} người, bạn A đứng giữa. Hỏi A đứng thứ mấy?`;
        answer = pos;
        break;
      }
  
      // 2. Trước/sau A có y người
      case 1: {
        const x = Math.floor(Math.random() * 39) + 2;
        const y = Math.floor(Math.random() * (x - 1)) + 1;
        const front = Math.random() < 0.5;
        if (front) {
          text = `Một hàng có ${x} người, phía trước A có ${y} người. Hỏi A đứng thứ mấy?`;
          answer = y + 1;
        } else {
          text = `Một hàng có ${x} người, phía sau A có ${y} người. Hỏi A đứng thứ mấy?`;
          answer = x - y;
        }
        break;
      }
  
      // 3. Trước A có x người, sau A có y người → tổng
      case 2: {
        const front = Math.floor(Math.random() * 20) + 1;
        const back = Math.floor(Math.random() * 20) + 1;
        const total = front + back + 1;
        text = `Trong một hàng chờ siêu thị, phía trước A có ${front} người, phía sau A có ${back} người. Hỏi có bao nhiêu người xếp hàng?`;
        answer = total;
        break;
      }
  
      // 4. A đứng thứ n, B đứng thứ y → số người giữa
      case 3: {
        const total = Math.floor(Math.random() * 30) + 10; // 10–40 người
        let a = Math.floor(Math.random() * total) + 1;
        let b = Math.floor(Math.random() * total) + 1;
        while (a === b) b = Math.floor(Math.random() * total) + 1;
        const min = Math.min(a, b);
        const max = Math.max(a, b);
        const between = max - min - 1;
        text = `Trong một hàng chờ siêu thị có ${total} người, A đứng thứ ${a}, B đứng thứ ${b}. Hỏi ở giữa có bao nhiêu người?`;
        answer = between;
        break;
      }
  
      // 5. A đứng thứ x → hỏi trước/sau có bao nhiêu người
      case 4: {
        const total = Math.floor(Math.random() * 39) + 2;
        const pos = Math.floor(Math.random() * total) + 1;
        const front = pos - 1;
        const back = total - pos;
        if (Math.random() < 0.5) {
          text = `Trong một hàng có ${total} người, A đứng thứ ${pos}. Hỏi phía trước A có bao nhiêu người?`;
          answer = front;
        } else {
          text = `Trong một hàng có ${total} người, A đứng thứ ${pos}. Hỏi phía sau A có bao nhiêu người?`;
          answer = back;
        }
        break;
      }
    }
  
    return {
      type: 'QUEUE-PROBLEM',
      text,
      answer
    };
  }

  export function display(q, refs) {
    const { questionText, inputAnswerContainer, mathAnswerInput, submitAnswerBtn, submitAnswer } = refs;
  
    questionText.textContent = q.text;
    questionText.classList.remove('hidden');
  
    inputAnswerContainer.classList.remove('hidden');
    mathAnswerInput.classList.remove('hidden');
    submitAnswerBtn.classList.remove('hidden');
    submitAnswerBtn.disabled = false;
    submitAnswerBtn.onclick = submitAnswer;
  }