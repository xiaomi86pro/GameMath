/**
 * CLOCK Question Module
 * Câu hỏi đọc giờ trên đồng hồ kim
 */

export function generate(quizState) {
    const hour = Math.floor(Math.random() * 12) + 1;
    let minute;
  
    if (quizState.currentLevel === 1) {
      minute = Math.random() < 0.5 ? 0 : 30;
    } else if (quizState.currentLevel === 2) {
      minute = Math.floor(Math.random() * 12) * 5;
    } else {
      return null;
    }
  
    const correct = `${hour}:${minute.toString().padStart(2, '0')}`;
  
    const choices = new Set([correct]);
  
    while (choices.size < 4) {
      let h = hour;
      let m = minute;
  
      if (Math.random() < 0.5) {
        h = ((hour + (Math.random() < 0.5 ? -1 : 1) + 12 - 1) % 12) + 1;
      } else {
        m = quizState.currentLevel === 1
          ? (minute === 0 ? 30 : 0)
          : (minute + (Math.random() < 0.5 ? -5 : 5) + 60) % 60;
      }
  
      choices.add(`${h}:${m.toString().padStart(2, '0')}`);
    }
  
    return {
      type: 'CLOCK',
      hour,
      minute,
      choices: Array.from(choices)
    };
  }
  
  export function display(question, context) {
    const {
      questionText,
      clockImageContainer,
      hourHand,
      minuteHand,
      clockChoices,
      lockUserInput,
      handleCorrectAnswer,
      handleWrongAnswer
    } = context;
  
    questionText.classList.add('hidden');
    clockImageContainer.classList.remove('hidden');
  
    // Rotate hands
    const minuteDeg = question.minute * 6;
    const hourDeg =
      (question.hour % 12) * 30 +
      question.minute * 0.5;
  
    minuteHand.setAttribute(
      'transform',
      `rotate(${minuteDeg} 100 100)`
    );
  
    hourHand.setAttribute(
      'transform',
      `rotate(${hourDeg} 100 100)`
    );
  
    // Render choices
    clockChoices.innerHTML = '';
    question.choices.forEach(choice => {
      const btn = document.createElement('button');
  
      const [hour, minute] = choice.split(':');
  
      btn.innerHTML = `
        <span class="text-red-500 font-bold">${hour}</span>
        :
        <span class="text-green-500 font-bold">${minute}</span>
      `;
  
      btn.className =
        'bg-white border rounded px-4 py-2 font-bold hover:bg-indigo-100';
      
      btn.onclick = () => {
        lockUserInput();
        const correctAnswer = `${question.hour}:${question.minute.toString().padStart(2, '0')}`;
        
        if (choice === correctAnswer) {
          handleCorrectAnswer();
        } else {
          handleWrongAnswer();
        }
      };
  
      clockChoices.appendChild(btn);
    });
  }