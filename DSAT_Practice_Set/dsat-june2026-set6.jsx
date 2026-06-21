import { useState } from "react";

const problems = [
  { id: 1, type: "spr", category: "Data Storage · Scientific Notation",
    question: `A hard drive stores 2.4 × 10⁶ kilobytes of data. How many gigabytes is this? (1 GB = 10⁶ KB)`,
    correctValue: 2.4, tolerance: 0.01, unit: "GB",
    explanation: `2.4 × 10⁶ KB ÷ 10⁶ KB/GB = 2.4 GB\n\nAnswer: 2.4 GB\n\n💡 When the exponents match, they cancel. Scientific notation makes this simple — if you can read the units.` },
  { id: 2, type: "mc", category: "Unit Rate Comparison",
    question: `Store A sells 750 mL of juice for $2.25. Store B sells 1.5 liters for $4.20. Which store offers the lower price per liter?`,
    options: ["A) Store A at $3.00/L", "B) Store B at $2.80/L", "C) Store A at $2.25/L", "D) Store B at $4.20/L"], answer: 1,
    explanation: `Store A: 750 mL = 0.75 L\n$2.25 ÷ 0.75 = $3.00/L\n\nStore B: 1.5 L\n$4.20 ÷ 1.5 = $2.80/L\n\nStore B is cheaper.\n\nAnswer: B) Store B at $2.80/L\n\n💡 Convert mL → L first. Options C and D show the total price, not the unit price — read carefully.` },
  { id: 3, type: "spr", category: "IV Drip Rate · Multi-Conversion",
    question: `A patient needs 600 mL of saline delivered over 4 hours. The IV set delivers 20 drops per mL. What is the drip rate in drops per minute?`,
    correctValue: 50, tolerance: 0, unit: "drops/min",
    explanation: `Step 1 — Total drops:\n600 mL × 20 drops/mL = 12,000 drops\n\nStep 2 — Time in minutes:\n4 hours × 60 = 240 minutes\n\nStep 3 — Rate:\n12,000 ÷ 240 = 50 drops/min\n\nAnswer: 50 drops/min\n\n💡 Medical drip rate = (volume × drop factor) ÷ time in minutes. A real-world formula tested with unit conversion.` },
  { id: 4, type: "mc", category: "Survey Data · Rate · Distance",
    question: `A survey of 2,000 commuters shows 45% drive to work. Each driver travels an average of 18 miles per day. Using 1 mile = 1.6 km, what is the total daily distance by ALL drivers in km?`,
    options: ["A) 16,200 km", "B) 25,920 km", "C) 32,400 km", "D) 51,840 km"], answer: 1,
    explanation: `Step 1 — Drivers: 2,000 × 0.45 = 900\nStep 2 — Per driver in km: 18 × 1.6 = 28.8 km\nStep 3 — Total: 900 × 28.8 = 25,920 km\n\nAnswer: B) 25,920 km\n\n💡 Option C (32,400) is what you get if you forget the mi→km conversion and use 36 instead of 28.8.` },
  { id: 5, type: "spr", category: "Exchange Rate · Tip",
    question: `A meal in Japan costs ¥8,500. The diner adds a 15% tip. Using 1 USD = 125 JPY, what is the total cost in US dollars?`,
    correctValue: 78.20, tolerance: 0.01, unit: "$",
    explanation: `Step 1 — Total in yen:\n¥8,500 × 1.15 = ¥9,775\n\nStep 2 — Convert to USD:\n¥9,775 ÷ 125 = $78.20\n\nAnswer: $78.20\n\n💡 Apply the tip before converting currency — or after, the result is the same. But don't forget one of the two steps.` },
  { id: 6, type: "spr", category: "Wall Area · Brick Count",
    question: `A wall is 6 meters long and 3 meters high. Each brick covers a face of 25 cm × 10 cm. Ignoring mortar, how many bricks are needed to cover the wall?`,
    correctValue: 720, tolerance: 0, unit: "bricks",
    explanation: `Step 1 — Wall area in cm²:\n6 m × 3 m = 18 m² = 180,000 cm²\n\nStep 2 — Brick face area:\n25 × 10 = 250 cm²\n\nStep 3 — Count:\n180,000 ÷ 250 = 720\n\nAnswer: 720 bricks\n\n💡 Convert m² → cm² (× 10,000) before dividing. 18 ÷ 0.025 also works but is error-prone.` },
  { id: 7, type: "mc", category: "Machine Output · Unit Mismatch",
    question: `Machine A produces 360 items per hour. Machine B produces 5 items per minute. How many items do both machines produce together in a 10-hour shift?`,
    options: ["A) 4,100", "B) 5,400", "C) 6,600", "D) 8,600"], answer: 2,
    explanation: `Machine A: 360/hr × 10 hr = 3,600\nMachine B: 5/min × 60 min × 10 hr = 3,000\n\nTotal: 3,600 + 3,000 = 6,600\n\nAnswer: C) 6,600\n\n💡 The unit mismatch (per hour vs per minute) is the whole trap. Convert B to hourly first: 5 × 60 = 300/hr.` },
  { id: 8, type: "spr", category: "Nutrition · Proportional Scaling",
    question: `A cereal label says 1 serving (40 g) contains 12 g of sugar. If someone eats 70 g of cereal, how many grams of sugar do they consume?`,
    correctValue: 21, tolerance: 0, unit: "grams",
    explanation: `Scale factor: 70 ÷ 40 = 1.75\n\nSugar: 12 × 1.75 = 21 g\n\nAnswer: 21 grams\n\n💡 Nutrition labels are per serving — always scale by actual amount ÷ serving size.` },
  { id: 9, type: "mc", category: "Simple vs Compound Interest",
    question: `$10,000 is deposited for 2 years. Bank A offers 5% simple interest. Bank B offers 4.8% compound interest (annual). Which gives more money, and by approximately how much?`,
    options: ["A) Bank A by $17", "B) Bank B by $17", "C) Bank A by $200", "D) Bank B by $200"], answer: 0,
    explanation: `Bank A (simple): 10,000 + 10,000(0.05)(2) = $11,000\n\nBank B (compound): 10,000(1.048)² = 10,000 × 1.098304 = $10,983.04\n\nDifference: $11,000 − $10,983.04 = $16.96 ≈ $17\n\nBank A gives more.\n\nAnswer: A) Bank A by $17\n\n💡 Compound interest isn't always better — it depends on the rate! Here 5% simple beats 4.8% compound over just 2 years.` },
  { id: 10, type: "spr", category: "Paint Mixing · Ratio · Cost",
    question: `A painter mixes blue and white paint in a ratio of 3:5 to make light blue. They need 6 liters total. Blue costs $12/liter and white costs $8/liter. What is the total cost?`,
    correctValue: 57, tolerance: 0, unit: "$",
    explanation: `Step 1 — Amounts:\nTotal parts: 3 + 5 = 8\nBlue: (3/8) × 6 = 2.25 L\nWhite: (5/8) × 6 = 3.75 L\n\nStep 2 — Cost:\nBlue: 2.25 × $12 = $27\nWhite: 3.75 × $8 = $30\nTotal: $27 + $30 = $57\n\nAnswer: $57\n\n💡 Ratio → actual amounts → individual costs → total. Four steps, each simple, but missing one ruins the answer.` }
];

const answerKey = [
  { q:1, type:"SPR", ans:"2.4", topic:"KB→GB" },
  { q:2, type:"MC", ans:"B", topic:"Unit rate, mL→L" },
  { q:3, type:"SPR", ans:"50", topic:"IV drip rate" },
  { q:4, type:"MC", ans:"B", topic:"Survey + mi→km" },
  { q:5, type:"SPR", ans:"78.20", topic:"¥ + tip → $" },
  { q:6, type:"SPR", ans:"720", topic:"m²→cm², bricks" },
  { q:7, type:"MC", ans:"C", topic:"/hr vs /min" },
  { q:8, type:"SPR", ans:"21", topic:"Nutrition scaling" },
  { q:9, type:"MC", ans:"A", topic:"Simple vs compound" },
  { q:10, type:"SPR", ans:"57", topic:"Ratio + cost" },
];

const catColors = { "Data Storage · Scientific Notation":"#E63946", "Unit Rate Comparison":"#457B9D", "IV Drip Rate · Multi-Conversion":"#2A9D8F", "Survey Data · Rate · Distance":"#E9C46A", "Exchange Rate · Tip":"#F4A261", "Wall Area · Brick Count":"#264653", "Machine Output · Unit Mismatch":"#6A4C93", "Nutrition · Proportional Scaling":"#1982C4", "Simple vs Compound Interest":"#8AC926", "Paint Mixing · Ratio · Cost":"#FF595E" };

function OptionButton({ opt, isRevealed, isAnswer, isSelected, onSelect }) {
  let bg="#F7F7F7",border="1px solid #ECECEC",color="#333";
  if(isRevealed&&isAnswer){bg="#E8F5E9";border="1.5px solid #66BB6A";color="#2E7D32"}
  else if(isRevealed&&isSelected&&!isAnswer){bg="#FFEBEE";border="1.5px solid #EF5350";color="#C62828"}
  else if(!isRevealed&&isSelected){bg="#E3F2FD";border="1.5px solid #64B5F6";color="#1565C0"}
  return (<button onClick={onSelect} style={{background:bg,border,borderRadius:10,padding:"10px 14px",fontSize:14,color,textAlign:"left",cursor:isRevealed?"default":"pointer",fontWeight:isRevealed&&isAnswer?600:400,fontFamily:"inherit"}}>{opt}</button>);
}

export default function App(){
  const [selected,setSelected]=useState({});
  const [sprInputs,setSprInputs]=useState({});
  const [revealed,setRevealed]=useState({});
  const [score,setScore]=useState(null);
  const [showKey,setShowKey]=useState(false);
  const handleSelect=(pid,oi)=>{if(!revealed[pid])setSelected(p=>({...p,[pid]:oi}))};
  const handleSprInput=(pid,v)=>{if(!revealed[pid])setSprInputs(p=>({...p,[pid]:v}))};
  const checkSpr=(prob,input)=>{const n=parseFloat(input);return !isNaN(n)&&Math.abs(n-prob.correctValue)<=(prob.tolerance||0.01)};
  const isAnswered=p=>p.type==="mc"?selected[p.id]!==undefined:(sprInputs[p.id]||"")!=="";
  const isCorrect=p=>p.type==="mc"?selected[p.id]===p.answer:checkSpr(p,sprInputs[p.id]||"");
  const handleReveal=pid=>setRevealed(p=>({...p,[pid]:true}));
  const scoreAll=()=>{const nr={};problems.forEach(p=>nr[p.id]=true);setRevealed(nr);setScore(problems.filter(p=>isCorrect(p)).length)};
  const reset=()=>{setSelected({});setSprInputs({});setRevealed({});setScore(null);setShowKey(false);window.scrollTo({top:0,behavior:"smooth"})};

  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"24px 16px",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:"#FAFAFA",minHeight:"100vh"}}>
      <div style={{marginBottom:32,textAlign:"center"}}>
        <div style={{display:"inline-block",background:"#E63946",color:"#fff",fontSize:10,fontWeight:700,letterSpacing:1.5,padding:"4px 12px",borderRadius:20,marginBottom:12,textTransform:"uppercase"}}>June 2026 · SET 6</div>
        <h1 style={{fontSize:24,fontWeight:700,color:"#1a1a1a",margin:"0 0 8px"}}>Data & Rates</h1>
        <p style={{fontSize:13,color:"#777",margin:0}}>Unit rates · IV drips · Interest · Nutrition · All verified ✓</p>
      </div>
      {score!==null&&(<div style={{background:score>=7?"#E8F5E9":score>=4?"#FFF8E1":"#FFEBEE",border:`1px solid ${score>=7?"#A5D6A7":score>=4?"#FFE082":"#EF9A9A"}`,borderRadius:12,padding:"16px 20px",marginBottom:24,textAlign:"center"}}><span style={{fontSize:28,fontWeight:700}}>{score}</span><span style={{fontSize:16,color:"#666"}}> / 10</span></div>)}
      {problems.map((p,idx)=>{
        const isR=revealed[p.id],cor=isCorrect(p),cc=catColors[p.category]||"#666";
        return (
          <div key={p.id} style={{background:"#fff",borderRadius:14,marginBottom:20,padding:"20px 20px 16px",border:isR?`1.5px solid ${cor?"#66BB6A":"#EF5350"}`:"1px solid #E8E8E8"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:11,fontWeight:600,color:cc,background:cc+"14",padding:"3px 10px",borderRadius:20}}>{p.category}</span>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:1,color:p.type==="spr"?"#E63946":"#457B9D",background:p.type==="spr"?"#FFEBEE":"#E3F2FD",padding:"3px 8px",borderRadius:4,textTransform:"uppercase"}}>{p.type==="spr"?"Grid-In":"MC"}</span>
            </div>
            <p style={{fontSize:13,color:"#999",margin:"0 0 4px",fontWeight:600}}>Q{idx+1}</p>
            <pre style={{fontSize:14,color:"#2a2a2a",lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"inherit",margin:"0 0 16px"}}>{p.question}</pre>
            {p.type==="mc"?(
              <div style={{display:"grid",gap:8,marginBottom:14}}>
                {p.options.map((opt,oi)=>(<OptionButton key={oi} opt={opt} isRevealed={isR} isAnswer={oi===p.answer} isSelected={selected[p.id]===oi} onSelect={()=>handleSelect(p.id,oi)}/>))}
              </div>
            ):(
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <input type="text" inputMode="decimal" value={sprInputs[p.id]||""} onChange={e=>handleSprInput(p.id,e.target.value)} disabled={isR} placeholder="Your answer" style={{flex:1,padding:"10px 14px",fontSize:16,fontWeight:600,fontFamily:"inherit",border:isR?`1.5px solid ${cor?"#66BB6A":"#EF5350"}`:"1.5px solid #ddd",borderRadius:10,background:isR?(cor?"#E8F5E9":"#FFEBEE"):"#fff",outline:"none",color:"#1a1a1a"}}/>
                  {p.unit&&<span style={{fontSize:14,color:"#888",fontWeight:500}}>{p.unit}</span>}
                </div>
                {isR&&!cor&&<p style={{fontSize:13,color:"#E53935",margin:"8px 0 0",fontWeight:600}}>Correct: {p.correctValue} {p.unit}</p>}
              </div>
            )}
            {!isR&&isAnswered(p)&&(<button onClick={()=>handleReveal(p.id)} style={{background:"none",border:"1px solid #ccc",borderRadius:8,padding:"8px 16px",fontSize:13,color:"#666",cursor:"pointer",fontFamily:"inherit"}}>Show Solution</button>)}
            {isR&&(<div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginTop:8}}><p style={{fontSize:11,fontWeight:700,letterSpacing:0.5,margin:"0 0 10px",color:cor?"#43A047":"#E53935"}}>{cor?"✓ CORRECT":"✗ INCORRECT"}</p><pre style={{fontSize:13,color:"#555",lineHeight:1.75,whiteSpace:"pre-wrap",fontFamily:"inherit",margin:0}}>{p.explanation}</pre></div>)}
          </div>
        );
      })}
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",padding:"12px 0 16px"}}>
        {score===null&&(<button onClick={scoreAll} style={{background:"#1a1a1a",color:"#fff",border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Score All</button>)}
        <button onClick={()=>setShowKey(!showKey)} style={{background:"#fff",color:"#1a1a1a",border:"1px solid #1a1a1a",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{showKey?"Hide":"Answer Key"}</button>
        <button onClick={reset} style={{background:"#fff",color:"#666",border:"1px solid #ddd",borderRadius:10,padding:"12px 28px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Reset</button>
      </div>
      {showKey&&(<div style={{background:"#fff",borderRadius:14,border:"1px solid #E8E8E8",padding:20,marginBottom:40}}><h3 style={{fontSize:15,fontWeight:700,margin:"0 0 16px"}}>Answer Key — SET 6</h3><div style={{display:"grid",gap:6}}>{answerKey.map(i=>(<div key={i.q} style={{display:"grid",gridTemplateColumns:"36px 50px 54px 1fr",alignItems:"center",gap:8,padding:"8px 12px",background:"#FAFAFA",borderRadius:8,fontSize:13}}><span style={{fontWeight:600}}>Q{i.q}</span><span style={{fontSize:10,fontWeight:700,color:i.type==="SPR"?"#E63946":"#457B9D",background:i.type==="SPR"?"#FFEBEE":"#E3F2FD",padding:"2px 6px",borderRadius:4,textAlign:"center"}}>{i.type}</span><span style={{fontWeight:700,color:"#1982C4",background:"#E3F2FD",padding:"2px 8px",borderRadius:6,textAlign:"center"}}>{i.ans}</span><span style={{color:"#888"}}>{i.topic}</span></div>))}</div></div>)}
    </div>
  );
}
