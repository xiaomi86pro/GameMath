// questions/geometric-sequence.js
export function generate(quizState){
    const factor = [2,3][Math.floor(Math.random()*2)];
    const op = Math.random()<0.5 ? '×' : '÷';
    let start = Math.floor(Math.random()*5)+1;
  
    let seq=[start];
    for(let i=1;i<5;i++){
      seq.push(op==='×'? seq[i-1]*factor : Math.floor(seq[i-1]/factor));
    }
  
    const answer = op==='×'? seq[seq.length-1]*factor : Math.floor(seq[seq.length-1]/factor);
    return { text:`${seq.join(', ')}, ?`, answer, type:'GEOMETRIC-SEQUENCE' };
  }
  
  export function display(q,refs){ /* giống Arithmetic */ }
  