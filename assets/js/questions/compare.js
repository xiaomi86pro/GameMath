/**
 * COMPARE Question Module
 * Câu hỏi so sánh > < =
 */

function getRandomNumberByLevel(level) {
    switch (level) {
      case 1: return Math.floor(Math.random() * 10);
      case 2: return Math.floor(Math.random() * 100);
      case 3: return Math.floor(Math.random() * 1000);
      default: return 0;
    }
  }
  
  function generateSimpleExpression(level) {
    let a = getRandomNumberByLevel(level);
    let b = getRandomNumberByLevel(level);
  
    const isAdd = Math.random() < 0.5;
  
    if (!isAdd && level === 1 && b > a) {
      [a, b] = [b, a];
    }
  
    return {
      text: isAdd ? `${a} + ${b}` : `${a} - ${b}`,
      value: isAdd ? a + b : a - b
    };
  }
  
  export function generate(quizState) {
    const leftExp = generateSimpleExpression(quizState.currentLevel);
    const rightExp = generateSimpleExpression(quizState.currentLevel);
  
    let answer = '=';
  
    if (leftExp.value > rightExp.value) answer = '>';
    else if (leftExp.value < rightExp.value) answer = '<';
  
    return {
      left: leftExp.text,
      right: rightExp.text,
      answer,
      type: 'COMPARE'
    };
  }
  
  export function display(question, context) {
    const {
      questionText,
      comparisonDisplayArea,
      expressionLeft,
      expressionRight,
      comparisonBox,
      comparisonButtonsContainer,
      mathAnswerInput
    } = context;
  
    questionText.classList.add('hidden');
    mathAnswerInput.classList.add('hidden');
    
    comparisonDisplayArea.classList.remove('hidden');
  
    expressionLeft.textContent = question.left;
    expressionRight.textContent = question.right;
    comparisonBox.textContent = '?';
  
    comparisonButtonsContainer.classList.remove('hidden');
  }