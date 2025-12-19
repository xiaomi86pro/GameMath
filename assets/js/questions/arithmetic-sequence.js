// questions/arithmetic-sequence.js
export function generate(quizState) {
    const step = [2,3,4,5][Math.floor(Math.random()*4)];
    const start = Math.floor(Math.random()*10)+1;
    const op = Math.random()<0.5 ? '+' : '-';
  
    let seq = [];
    for(let i=0;i<5;i++){
      seq.push(op==='+' ? start + i*step : start - i*step);
    }
  
    const answer = seq[seq.length-1] + (op==='+' ? step : -step);
    return { text: `${seq.join(', ')}, ?`, answer, type:'ARITHMETIC-SEQUENCE' };
  }
  
  export function display(q, refs){
    const {questionText,inputAnswerContainer,mathAnswerInput,submitAnswerBtn,lockUserInput,checkAnswer} = refs;
    questionText.textContent=q.text;
    questionText.classList.remove('hidden');
    inputAnswerContainer.classList.remove('hidden');
    mathAnswerInput.classList.remove('hidden');
    submitAnswerBtn.classList.remove('hidden');
    submitAnswerBtn.onclick=()=>{lockUserInput();refs.checkAnswer();};
  }
  