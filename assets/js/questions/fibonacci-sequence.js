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
  