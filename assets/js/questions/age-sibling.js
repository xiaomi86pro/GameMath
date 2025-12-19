// questions/age-sibling.js
export function generate() {
    const diff = Math.floor(Math.random() * 5) + 2; // chênh lệch hiện tại 2–6
    const years = Math.floor(Math.random() * 4) + 2; // số năm 2–5
    const sisterFutureAge = Math.floor(Math.random() * 20) + 15; // tuổi chị sau X năm (15–35)
  
    const sisterCurrentAge = sisterFutureAge - years;
    const brotherCurrentAge = sisterCurrentAge - diff;
  
    return {
      text: `Chị hiện tại hơn em ${diff} tuổi. Sau ${years} năm nữa chị ${sisterFutureAge} tuổi. Hỏi em hiện tại bao nhiêu tuổi?`,
      answer: brotherCurrentAge,
      type: 'AGE-SIBLING'
    };
  }
  