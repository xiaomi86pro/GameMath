// questions/fibonacci-sequence.js
export function generate(){
    let seq=[1,1];
    for(let i=2;i<6;i++){
      seq.push(seq[i-1]+seq[i-2]);
    }
    const answer=seq[seq.length-1]+seq[seq.length-2];
    return { text:`${seq.join(', ')}, ?`, answer, type:'FIBONACCI-SEQUENCE' };
  }
  
  export function display(q,refs){ /* giống Arithmetic */ }
  
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
  