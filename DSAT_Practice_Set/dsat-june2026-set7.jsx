import { useState } from "react";

const problems = [
  { id: 1, type: "spr", category: "Cylinder Volume · Conversion",
    question: `A cylindrical water tank has a radius of 0.5 meters and a height of 2 meters. How many liters does it hold? (Use π ≈ 3.14 and 1 m³ = 1,000 L)`,
    correctValue: 1570, tolerance: 5, unit: "liters",
    explanation: `V = πr²h = 3.14 × (0.5)² × 2\n= 3.14 × 0.25 × 2 = 1.57 m³\n\nConvert: 1.57 × 1,000 = 1,570 liters\n\nAnswer: 1,570 liters\n\n💡 Don't forget to square the radius. Using diameter instead of radius is the most common error.` },
  { id: 2, type: "mc", category: "Trail Grade · Percent",
    question: `A hiking trail gains 450 meters of elevation over a horizontal distance of 3 km. What is the grade of the trail as a percentage?`,
    options: ["A) 6.7%", "B) 15%", "C) 1.5%", "D) 150%"], answer: 1,
    explanation: `Grade = (rise ÷ run) × 100\n\nConvert to same units:\nRun = 3 km = 3,000 m\n\nGrade = (450 ÷ 3,000) × 100 = 15%\n\nAnswer: B) 15%\n\n💡 Option C (1.5%) forgets to multiply by 100. Option A uses km instead of m for the run.` },
  { id: 3, type: "spr", category: "Hiking · Segments · Conversion",
    question: `A hiker walks at 4 km/h for 2 hours, then at 3.2 km/h uphill for 2.5 hours. Using 1 mile = 1.6 km, what is the total distance hiked in miles?`,
    correctValue: 10, tolerance: 0, unit: "miles",
    explanation: `Segment 1: 4 × 2 = 8 km\nSegment 2: 3.2 × 2.5 = 8 km\nTotal: 16 km\n\nConvert: 16 ÷ 1.6 = 10 miles\n\nAnswer: 10 miles\n\n💡 Calculate each segment in km, add, THEN convert to miles once. Converting each segment separately works too but takes longer.` },
  { id: 4, type: "mc", category: "Cylinder Surface Area · Paint",
    question: `A cylindrical tank has a diameter of 2 meters and height of 3 meters. Only the lateral (side) surface needs painting. If 1 liter covers 5 m², how many liters are needed? (Use π ≈ 3.14, round up.)`,
    options: ["A) 3", "B) 4", "C) 5", "D) 6"], answer: 1,
    explanation: `Lateral area = 2πrh\n= 2 × 3.14 × 1 × 3 = 18.84 m²\n\n(Note: radius = diameter ÷ 2 = 1 m)\n\nLiters: 18.84 ÷ 5 = 3.77 → round UP = 4\n\nAnswer: B) 4\n\n💡 Use RADIUS (1 m), not diameter (2 m). And round up — you can't buy 0.77 of a liter.` },
  { id: 5, type: "spr", category: "Discount · Shipping · Forex",
    question: `A laptop costs £900 with a 10% student discount. Shipping to the US costs £30. Using 1 GBP = 1.25 USD, what is the total cost in US dollars?`,
    correctValue: 1050, tolerance: 0, unit: "$",
    explanation: `Step 1 — Discount: £900 × 0.90 = £810\nStep 2 — Add shipping: £810 + £30 = £840\nStep 3 — Convert: £840 × 1.25 = $1,050\n\nAnswer: $1,050\n\n💡 Apply discount first, then add shipping, then convert. The discount does NOT apply to shipping.` },
  { id: 6, type: "mc", category: "Quality Control · Rate",
    question: `A quality inspector checks 15 items per minute. In an 8-hour day, if 2% of all items are defective, how many defective items does the inspector find?`,
    options: ["A) 72", "B) 144", "C) 288", "D) 1,440"], answer: 1,
    explanation: `Step 1 — Items per day:\n15/min × 60 min × 8 hr = 7,200\n\nStep 2 — Defective:\n7,200 × 0.02 = 144\n\nAnswer: B) 144\n\n💡 Option A (72) is for 4 hours. Option D (1,440) applies 20% instead of 2%. Check your decimal!` },
  { id: 7, type: "spr", category: "Loan · Simple Interest · Monthly",
    question: `A $24,000 car loan has 5% annual simple interest for 4 years. What is the monthly payment?`,
    correctValue: 600, tolerance: 0, unit: "$/month",
    explanation: `Step 1 — Total interest:\n$24,000 × 0.05 × 4 = $4,800\n\nStep 2 — Total owed:\n$24,000 + $4,800 = $28,800\n\nStep 3 — Monthly payment:\n$28,800 ÷ 48 months = $600\n\nAnswer: $600/month\n\n💡 Simple interest: I = Prt. Then divide the TOTAL (principal + interest) by number of months, not just the interest.` },
  { id: 8, type: "mc", category: "Solution Mixing · Concentration",
    question: `200 mL of a 40% salt solution is mixed with 300 mL of a 10% salt solution. What is the concentration of the resulting mixture?`,
    options: ["A) 18%", "B) 22%", "C) 25%", "D) 30%"], answer: 1,
    explanation: `Salt from Solution A: 200 × 0.40 = 80 mL\nSalt from Solution B: 300 × 0.10 = 30 mL\n\nTotal salt: 80 + 30 = 110 mL\nTotal volume: 200 + 300 = 500 mL\n\nConcentration: 110 ÷ 500 = 0.22 = 22%\n\nAnswer: B) 22%\n\n💡 You can't average 40% and 10% — the volumes are different. Weight each by its volume.` },
  { id: 9, type: "spr", category: "Scale Drawing · Perimeter",
    question: `An architect's drawing uses a scale of 1:200. The perimeter of a building on the drawing is 45 cm. What is the actual perimeter of the building in meters?`,
    correctValue: 90, tolerance: 0, unit: "meters",
    explanation: `Step 1 — Scale up:\n45 cm × 200 = 9,000 cm\n\nStep 2 — Convert to meters:\n9,000 ÷ 100 = 90 m\n\nAnswer: 90 meters\n\n💡 For perimeter (length), multiply by the scale factor once. For area, you'd square it.` },
  { id: 10, type: "spr", category: "Batch Production · Material",
    question: `A bakery makes 150 loaves per batch. Each loaf needs 350 g of flour. Flour comes in 25 kg bags. How many bags are needed for 3 batches? (Round up.)`,
    correctValue: 7, tolerance: 0, unit: "bags",
    explanation: `Step 1 — Total loaves: 150 × 3 = 450\nStep 2 — Total flour: 450 × 350 g = 157,500 g = 157.5 kg\nStep 3 — Bags: 157.5 ÷ 25 = 6.3 → round UP = 7\n\nAnswer: 7 bags\n\n💡 g → kg (÷ 1,000), then divide by bag size and round UP. 6 bags only gives 150 kg — not enough.` }
];

const answerKey = [
  { q:1, type:"SPR", ans:"1,570", topic:"πr²h → liters" },
  { q:2, type:"MC", ans:"B", topic:"Grade = rise/run %" },
  { q:3, type:"SPR", ans:"10", topic:"Segments + km→mi" },
  { q:4, type:"MC", ans:"B", topic:"2πrh → paint liters" },
  { q:5, type:"SPR", ans:"1,050", topic:"Discount+ship+forex" },
  { q:6, type:"MC", ans:"B", topic:"QC rate, 2% defect" },
  { q:7, type:"SPR", ans:"600", topic:"Loan monthly pmt" },
  { q:8, type:"MC", ans:"B", topic:"Mix concentration" },
  { q:9, type:"SPR", ans:"90", topic:"Scale 1:200" },
  { q:10, type:"SPR", ans:"7", topic:"Batch flour bags" },
];

const catColors = { "Cylinder Volume · Conversion":"#E63946", "Trail Grade · Percent":"#457B9D", "Hiking · Segments · Conversion":"#2A9D8F", "Cylinder Surface Area · Paint":"#E9C46A", "Discount · Shipping · Forex":"#F4A261", "Quality Control · Rate":"#264653", "Loan · Simple Interest · Monthly":"#6A4C93", "Solution Mixing · Concentration":"#1982C4", "Scale Drawing · Perimeter":"#8AC926", "Batch Production · Material":"#FF595E" };

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
        <div style={{display:"inline-block",background:"#E63946",color:"#fff",fontSize:10,fontWeight:700,letterSpacing:1.5,padding:"4px 12px",borderRadius:20,marginBottom:12,textTransform:"uppercase"}}>June 2026 · SET 7</div>
        <h1 style={{fontSize:24,fontWeight:700,color:"#1a1a1a",margin:"0 0 8px"}}>Geometry & Finance</h1>
        <p style={{fontSize:13,color:"#777",margin:0}}>Cylinders · Loans · Mixtures · Scale · All verified ✓</p>
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
      {showKey&&(<div style={{background:"#fff",borderRadius:14,border:"1px solid #E8E8E8",padding:20,marginBottom:40}}><h3 style={{fontSize:15,fontWeight:700,margin:"0 0 16px"}}>Answer Key — SET 7</h3><div style={{display:"grid",gap:6}}>{answerKey.map(i=>(<div key={i.q} style={{display:"grid",gridTemplateColumns:"36px 50px 54px 1fr",alignItems:"center",gap:8,padding:"8px 12px",background:"#FAFAFA",borderRadius:8,fontSize:13}}><span style={{fontWeight:600}}>Q{i.q}</span><span style={{fontSize:10,fontWeight:700,color:i.type==="SPR"?"#E63946":"#457B9D",background:i.type==="SPR"?"#FFEBEE":"#E3F2FD",padding:"2px 6px",borderRadius:4,textAlign:"center"}}>{i.type}</span><span style={{fontWeight:700,color:"#1982C4",background:"#E3F2FD",padding:"2px 8px",borderRadius:6,textAlign:"center"}}>{i.ans}</span><span style={{color:"#888"}}>{i.topic}</span></div>))}</div></div>)}
    </div>
  );
}
