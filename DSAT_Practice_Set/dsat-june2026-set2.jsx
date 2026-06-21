import { useState } from "react";

const problems = [
  {
    id: 1, type: "spr",
    category: "Currency · Fee · Conversion",
    difficulty: "★★★",
    question: `A tourist exchanges $400 USD to euros. The exchange service charges a 2.5% fee on the original USD amount before converting. The exchange rate is 1 USD = 0.92 EUR. How many euros does the tourist receive?`,
    correctValue: 358.8, tolerance: 0.05, unit: "EUR",
    explanation: `Step 1 — Fee: $400 × 0.025 = $10
Step 2 — After fee: $400 − $10 = $390
Step 3 — Convert: $390 × 0.92 = €358.80

Answer: 358.8

💡 The fee is deducted BEFORE conversion. Applying the fee to the euro amount gives a different (wrong) answer.`
  },
  {
    id: 2, type: "spr",
    category: "Fuel Efficiency · Dual Conversion",
    difficulty: "★★★",
    question: `A car's fuel efficiency is rated at 34 miles per gallon. Using 1 gallon = 3.785 liters and 1 mile = 1.6 km, what is the fuel efficiency in kilometers per liter? Round to the nearest tenth.`,
    correctValue: 14.4, tolerance: 0.05, unit: "km/L",
    explanation: `Step 1 — Convert numerator (miles → km):
34 mi/gal × 1.6 km/mi = 54.4 km/gal

Step 2 — Convert denominator (gallons → liters):
54.4 km/gal ÷ 3.785 L/gal ≈ 14.4 km/L

Answer: 14.4 km/L

💡 Both the numerator AND denominator change units. Multiply for the top, divide for the bottom.`
  },
  {
    id: 3, type: "mc",
    category: "Population Density · Area Conversion",
    difficulty: "★★★",
    question: `A city has a population of 450,000 and covers 180 square kilometers. If 1 km ≈ 0.621 miles, what is the approximate population density in people per square mile?`,
    options: ["A) 2,500", "B) 3,880", "C) 6,480", "D) 10,440"],
    answer: 2,
    explanation: `Step 1 — Convert km² to mi² (SQUARE the factor):
1 km² = (0.621)² mi² = 0.3856 mi²
180 km² × 0.3856 = 69.4 mi²

Step 2 — Density:
450,000 ÷ 69.4 ≈ 6,484 → ≈ 6,480

Answer: C) 6,480

💡 You must SQUARE the linear conversion factor for area. Using 0.621 instead of 0.621² is wrong.`
  },
  {
    id: 4, type: "spr",
    category: "Dosage · Weight Conversion",
    difficulty: "★★★",
    question: `A doctor prescribes medication at 15 mg per kilogram of body weight, taken in 3 equal doses per day. If the patient weighs 176 pounds and 1 kg = 2.2 pounds, how many milligrams is each dose?`,
    correctValue: 400, tolerance: 0, unit: "mg",
    explanation: `Step 1 — Convert weight: 176 ÷ 2.2 = 80 kg
Step 2 — Total daily dose: 80 × 15 = 1,200 mg
Step 3 — Per dose: 1,200 ÷ 3 = 400 mg

Answer: 400 mg

💡 Three-step chain: convert unit → rate × weight → divide by frequency.`
  },
  {
    id: 5, type: "spr",
    category: "Energy · Power · Time",
    difficulty: "★★☆",
    question: `A solar panel produces 250 watts of power. How many kilowatt-hours of energy does it produce in 6 hours?`,
    correctValue: 1.5, tolerance: 0.01, unit: "kWh",
    explanation: `Step 1 — Energy in watt-hours:
250 W × 6 h = 1,500 Wh

Step 2 — Convert:
1,500 Wh ÷ 1,000 = 1.5 kWh

Answer: 1.5 kWh

💡 Energy = Power × Time. Then W → kW (÷ 1,000).`
  },
  {
    id: 6, type: "mc",
    category: "Compound Interest",
    difficulty: "★★★",
    question: `$5,000 is invested at 6% annual interest, compounded annually. What is the value after 3 years, to the nearest dollar?`,
    options: ["A) $5,450", "B) $5,618", "C) $5,900", "D) $5,955"],
    answer: 3,
    explanation: `Year 1: $5,000 × 1.06 = $5,300
Year 2: $5,300 × 1.06 = $5,618
Year 3: $5,618 × 1.06 = $5,955.08 ≈ $5,955

Or: 5,000 × (1.06)³ = $5,955

Answer: D) $5,955

💡 Option B ($5,618) is the Year 2 value — a trap for students who stop one year early.`
  },
  {
    id: 7, type: "spr",
    category: "Volume · Rate · Time",
    difficulty: "★★★",
    question: `A pool is 20 m long, 10 m wide, and 1.5 m deep. Water is pumped in at 500 liters per minute. If 1 m³ = 1,000 liters, how many hours to fill the pool?`,
    correctValue: 10, tolerance: 0, unit: "hours",
    explanation: `Step 1 — Volume: 20 × 10 × 1.5 = 300 m³
Step 2 — In liters: 300 × 1,000 = 300,000 L
Step 3 — Time: 300,000 ÷ 500 = 600 min
Step 4 — In hours: 600 ÷ 60 = 10 hours

Answer: 10 hours

💡 Four conversion steps in one problem — the signature June 2026 pattern.`
  },
  {
    id: 8, type: "mc",
    category: "Data · Rate · Distance",
    difficulty: "★★★",
    question: `Of 800 surveyed employees, 35% commute by car. Each car commuter travels 24 km one way. They commute to and from work 5 days per week. What is the total weekly distance for ALL car commuters?`,
    options: ["A) 33,600 km", "B) 67,200 km", "C) 134,400 km", "D) 13,440 km"],
    answer: 1,
    explanation: `Step 1 — Car commuters: 800 × 0.35 = 280
Step 2 — Weekly per person: 24 × 2 × 5 = 240 km
Step 3 — Total: 280 × 240 = 67,200 km

Answer: B) 67,200 km

💡 Don't forget ×2 for the round trip. Option A (33,600) is the one-way trap.`
  },
  {
    id: 9, type: "spr",
    category: "Map Scale · Area",
    difficulty: "★★★",
    question: `A map has a scale of 1 cm : 2.5 km. A rectangular lake measures 3 cm by 4 cm on the map. What is the actual area of the lake in square kilometers?`,
    correctValue: 75, tolerance: 0, unit: "km²",
    explanation: `Step 1 — Convert each dimension:
3 cm × 2.5 = 7.5 km
4 cm × 2.5 = 10 km

Step 2 — Area: 7.5 × 10 = 75 km²

Answer: 75 km²

💡 Apply the scale to EACH dimension, then multiply. Don't apply it only once.`
  },
  {
    id: 10, type: "mc",
    category: "Combined Rates · Unit Mismatch",
    difficulty: "★★★",
    question: `Pipe A fills a tank at 8 liters per minute. Pipe B fills the same tank at 360 liters per hour. Both pipes run for 30 minutes. How many liters are delivered?`,
    options: ["A) 360", "B) 420", "C) 540", "D) 600"],
    answer: 1,
    explanation: `Step 1 — Convert Pipe B: 360 L/hr ÷ 60 = 6 L/min
Step 2 — Combined: 8 + 6 = 14 L/min
Step 3 — In 30 min: 14 × 30 = 420 L

Answer: B) 420

💡 The trap is the unit mismatch (L/min vs L/hr). Convert to the same unit FIRST.`
  }
];

const answerKey = [
  { q:1, type:"SPR", ans:"358.8", topic:"Currency + fee" },
  { q:2, type:"SPR", ans:"14.4", topic:"mi/gal → km/L" },
  { q:3, type:"MC", ans:"C", topic:"Density, km²→mi²" },
  { q:4, type:"SPR", ans:"400", topic:"Dosage, lb→kg" },
  { q:5, type:"SPR", ans:"1.5", topic:"W → kWh" },
  { q:6, type:"MC", ans:"D", topic:"Compound interest" },
  { q:7, type:"SPR", ans:"10", topic:"m³→L→min→hr" },
  { q:8, type:"MC", ans:"B", topic:"Survey + distance" },
  { q:9, type:"SPR", ans:"75", topic:"Map scale → area" },
  { q:10, type:"MC", ans:"B", topic:"Rate unit mismatch" },
];

const catColors={"Currency · Fee · Conversion":"#E63946","Fuel Efficiency · Dual Conversion":"#457B9D","Population Density · Area Conversion":"#2A9D8F","Dosage · Weight Conversion":"#E9C46A","Energy · Power · Time":"#F4A261","Compound Interest":"#264653","Volume · Rate · Time":"#6A4C93","Data · Rate · Distance":"#1982C4","Map Scale · Area":"#8AC926","Combined Rates · Unit Mismatch":"#FF595E"};

export default function App(){
  const [sel,setSel]=useState({}), [spr,setSpr]=useState({}), [rev,setRev]=useState({}), [score,setScore]=useState(null), [showKey,setShowKey]=useState(false);
  const hs=(pid,oi)=>{if(!rev[pid])setSel(p=>({...p,[pid]:oi}))};
  const hi=(pid,v)=>{if(!rev[pid])setSpr(p=>({...p,[pid]:v}))};
  const chk=(prob,input)=>{const n=parseFloat(input);return!isNaN(n)&&Math.abs(n-prob.correctValue)<=(prob.tolerance||0.01)};
  const isAns=p=>p.type==="mc"?sel[p.id]!==undefined:(spr[p.id]||"")!=="";
  const isCor=p=>p.type==="mc"?sel[p.id]===p.answer:chk(p,spr[p.id]||"");
  const hr=pid=>setRev(p=>({...p,[pid]:true}));
  const scoreAll=()=>{const nr={};problems.forEach(p=>nr[p.id]=true);setRev(nr);setScore(problems.filter(p=>isCor(p)).length)};
  const reset=()=>{setSel({});setSpr({});setRev({});setScore(null);setShowKey(false);window.scrollTo({top:0,behavior:"smooth"})};

  return(
    <div style={{maxWidth:680,margin:"0 auto",padding:"24px 16px",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:"#FAFAFA",minHeight:"100vh"}}>
      <div style={{marginBottom:32,textAlign:"center"}}>
        <div style={{display:"inline-block",background:"#E63946",color:"#fff",fontSize:10,fontWeight:700,letterSpacing:1.5,padding:"4px 12px",borderRadius:20,marginBottom:12,textTransform:"uppercase"}}>June 2026 · SET 2</div>
        <h1 style={{fontSize:24,fontWeight:700,color:"#1a1a1a",margin:"0 0 8px"}}>Unit Conversion & Multi-Step</h1>
        <p style={{fontSize:13,color:"#777",margin:0}}>Currency · Fuel · Dosage · Volume · All verified ✓</p>
      </div>
      {score!==null&&<div style={{background:score>=7?"#E8F5E9":score>=4?"#FFF8E1":"#FFEBEE",border:`1px solid ${score>=7?"#A5D6A7":score>=4?"#FFE082":"#EF9A9A"}`,borderRadius:12,padding:"16px 20px",marginBottom:24,textAlign:"center"}}><span style={{fontSize:28,fontWeight:700}}>{score}</span><span style={{fontSize:16,color:"#666"}}> / 10</span></div>}
      {problems.map((p,idx)=>{
        const isR=rev[p.id],cor=isCor(p),cc=catColors[p.category]||"#666";
        return(<div key={p.id} style={{background:"#fff",borderRadius:14,marginBottom:20,padding:"20px 20px 16px",border:isR?`1.5px solid ${cor?"#66BB6A":"#EF5350"}`:"1px solid #E8E8E8"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <span style={{fontSize:11,fontWeight:600,color:cc,background:cc+"14",padding:"3px 10px",borderRadius:20}}>{p.category}</span>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:1,color:p.type==="spr"?"#E63946":"#457B9D",background:p.type==="spr"?"#FFEBEE":"#E3F2FD",padding:"3px 8px",borderRadius:4,textTransform:"uppercase"}}>{p.type==="spr"?"Grid-In":"MC"}</span>
          </div>
          <p style={{fontSize:13,color:"#999",margin:"0 0 4px",fontWeight:600}}>Q{idx+1}</p>
          <pre style={{fontSize:14,color:"#2a2a2a",lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"inherit",margin:"0 0 16px"}}>{p.question}</pre>
          {p.type==="mc"?<div style={{display:"grid",gap:8,marginBottom:14}}>{p.options.map((o,oi)=>{let bg="#F7F7F7",bd="1px solid #ECECEC",cl="#333";if(isR&&oi===p.answer){bg="#E8F5E9";bd="1.5px solid #66BB6A";cl="#2E7D32"}else if(isR&&sel[p.id]===oi&&oi!==p.answer){bg="#FFEBEE";bd="1.5px solid #EF5350";cl="#C62828"}else if(!isR&&sel[p.id]===oi){bg="#E3F2FD";bd="1.5px solid #64B5F6";cl="#1565C0"}return<button key={oi} onClick={()=>hs(p.id,oi)} style={{background:bg,border:bd,borderRadius:10,padding:"10px 14px",fontSize:14,color:cl,textAlign:"left",cursor:isR?"default":"pointer",fontWeight:isR&&oi===p.answer?600:400,fontFamily:"inherit"}}>{o}</button>})}</div>
          :<div style={{marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:8}}><input type="text" inputMode="decimal" value={spr[p.id]||""} onChange={e=>hi(p.id,e.target.value)} disabled={isR} placeholder="Your answer" style={{flex:1,padding:"10px 14px",fontSize:16,fontWeight:600,fontFamily:"inherit",border:isR?`1.5px solid ${cor?"#66BB6A":"#EF5350"}`:"1.5px solid #ddd",borderRadius:10,background:isR?(cor?"#E8F5E9":"#FFEBEE"):"#fff",outline:"none",color:"#1a1a1a"}}/>{p.unit&&<span style={{fontSize:14,color:"#888",fontWeight:500}}>{p.unit}</span>}</div>{isR&&!cor&&<p style={{fontSize:13,color:"#E53935",margin:"8px 0 0",fontWeight:600}}>Correct: {p.correctValue} {p.unit}</p>}</div>}
          {!isR&&isAns(p)&&<button onClick={()=>hr(p.id)} style={{background:"none",border:"1px solid #ccc",borderRadius:8,padding:"8px 16px",fontSize:13,color:"#666",cursor:"pointer",fontFamily:"inherit"}}>Show Solution</button>}
          {isR&&<div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginTop:8}}><p style={{fontSize:11,fontWeight:700,letterSpacing:0.5,margin:"0 0 10px",color:cor?"#43A047":"#E53935"}}>{cor?"✓ CORRECT":"✗ INCORRECT"}</p><pre style={{fontSize:13,color:"#555",lineHeight:1.75,whiteSpace:"pre-wrap",fontFamily:"inherit",margin:0}}>{p.explanation}</pre></div>}
        </div>)
      })}
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",padding:"12px 0 16px"}}>
        {score===null&&<button onClick={scoreAll} style={{background:"#1a1a1a",color:"#fff",border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Score All</button>}
        <button onClick={()=>setShowKey(!showKey)} style={{background:"#fff",color:"#1a1a1a",border:"1px solid #1a1a1a",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{showKey?"Hide":"Answer Key"}</button>
        <button onClick={reset} style={{background:"#fff",color:"#666",border:"1px solid #ddd",borderRadius:10,padding:"12px 28px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Reset</button>
      </div>
      {showKey&&<div style={{background:"#fff",borderRadius:14,border:"1px solid #E8E8E8",padding:20,marginBottom:40}}><h3 style={{fontSize:15,fontWeight:700,margin:"0 0 16px"}}>Answer Key — SET 2</h3><div style={{display:"grid",gap:6}}>{answerKey.map(i=><div key={i.q} style={{display:"grid",gridTemplateColumns:"36px 50px 54px 1fr",alignItems:"center",gap:8,padding:"8px 12px",background:"#FAFAFA",borderRadius:8,fontSize:13}}><span style={{fontWeight:600}}>Q{i.q}</span><span style={{fontSize:10,fontWeight:700,color:i.type==="SPR"?"#E63946":"#457B9D",background:i.type==="SPR"?"#FFEBEE":"#E3F2FD",padding:"2px 6px",borderRadius:4,textAlign:"center"}}>{i.type}</span><span style={{fontWeight:700,color:"#1982C4",background:"#E3F2FD",padding:"2px 8px",borderRadius:6,textAlign:"center"}}>{i.ans}</span><span style={{color:"#888"}}>{i.topic}</span></div>)}</div></div>}
    </div>
  );
}
