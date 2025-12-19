// questions/age-difference.js
export function generate() {
    const ageA = Math.floor(Math.random() * 20) + 10; // A từ 10–30
    const diff = Math.floor(Math.random() * 10) + 2;  // chênh lệch 2–11
    const isOlder = Math.random() < 0.5;
  
    const ageB = isOlder ? ageA + diff : ageA - diff;
    const relation = isOlder ? `hơn` : `kém`;
  
    return {
      text: `A năm nay ${ageA} tuổi. B ${relation} A ${diff} tuổi. Hỏi B bao nhiêu tuổi?`,
      answer: ageB,
      type: 'AGE-DIFFERENCE'
    };
  }
  