import { useState } from "react";

const problems = [
  {
    id: 1, type: "spr", category: "Shipping · Weight Conversion",
    question: `A package weighs 3.2 kg. Shipping costs $2.50 for the first pound and $0.75 for each additional pound. Using 1 kg = 2.2 lbs, what is the shipping cost? (Round weight UP to the nearest whole pound before calculating.)`,
    correctValue: 7.75, tolerance: 0.01, unit: "$",
    explanation: `Step 1 — Convert weight:\n3.2 kg × 2.2 = 7.04 lbs → round UP = 8 lbs\n\nStep 2 — Calculate cost:\nFirst pound: $2.50\nAdditional 7 lbs: 7 × $0.75 = $5.25\nTotal: $2.50 + $5.25 = $7.75\n\nAnswer: $7.75\n\n💡 Round UP before calculating — shipping always charges for the next whole pound.`
  },
  {
    id: 2, type: "mc", category: "BMI · Dual Unit Conversion",
    question: `BMI is calculated as weight (kg) divided by height (m) squared. A person weighs 165 pounds and is 5 feet 10 inches tall. Using 1 kg = 2.2 lbs and 1 inch = 2.54 cm, what is their BMI? Round to the nearest tenth.`,
    options: ["A) 21.5", "B) 23.7", "C) 25.3", "D) 27.1"], answer: 1,
    explanation: `Step 1 — Convert weight:\n165 ÷ 2.2 = 75 kg\n\nStep 2 — Convert height:\n5'10" = 70 inches\n70 × 2.54 = 177.8 cm = 1.778 m\n\nStep 3 — BMI:\n75 ÷ (1.778)² = 75 ÷ 3.161 = 23.7\n\nAnswer: B) 23.7\n\n💡 Two separate conversions (weight AND height) plus squaring the height — three places to make errors.`
  },
  {
    id: 3, type: "spr", category: "Area · Unit Conversion · Cost",
    question: `A room is 12 feet by 15 feet. Carpet costs $24 per square yard. Using 1 yard = 3 feet, how much does it cost to carpet the room?`,
    correctValue: 480, tolerance: 0, unit: "$",
    explanation: `Step 1 — Area in square feet:\n12 × 15 = 180 ft²\n\nStep 2 — Convert to square yards:\n1 yd = 3 ft → 1 yd² = 9 ft²\n180 ÷ 9 = 20 yd²\n\nStep 3 — Cost:\n20 × $24 = $480\n\nAnswer: $480\n\n💡 Divide by 9 (not 3) to convert ft² to yd². You must square the conversion factor for area.`
  },
  {
    id: 4, type: "spr", category: "Speed Camera · Time · Rate",
    question: `A car passes speed camera A at 2:15 PM and camera B at 2:42 PM. The two cameras are 54 km apart. If the speed limit is 110 km/h, by how many km/h did the car exceed the speed limit?`,
    correctValue: 10, tolerance: 0, unit: "km/h",
    explanation: `Step 1 — Time between cameras:\n2:42 − 2:15 = 27 minutes = 27/60 = 0.45 hours\n\nStep 2 — Average speed:\n54 ÷ 0.45 = 120 km/h\n\nStep 3 — Amount over limit:\n120 − 110 = 10 km/h\n\nAnswer: 10 km/h\n\n💡 Convert minutes to hours FIRST. 54 ÷ 27 = 2 km/min, which then needs ×60 — easy to forget.`
  },
  {
    id: 5, type: "mc", category: "Mixture · Weighted Price",
    question: `Coffee Type A costs $12/kg and Type B costs $8/kg. A shopkeeper mixes them to get 5 kg at $9.60/kg. How many kg of Type A are in the mix?`,
    options: ["A) 1.5", "B) 2.0", "C) 2.5", "D) 3.0"], answer: 1,
    explanation: `Let a = kg of Type A.\n\n12a + 8(5 − a) = 9.60 × 5\n12a + 40 − 8a = 48\n4a = 8\na = 2 kg\n\nVerify: 2(12) + 3(8) = 24 + 24 = 48\n48 ÷ 5 = $9.60/kg ✓\n\nAnswer: B) 2.0\n\n💡 Set up a weighted price equation. The total cost of the mix equals the sum of individual costs.`
  },
  {
    id: 6, type: "spr", category: "Relative Speed · Distance",
    question: `An escalator moves upward at 0.6 m/s. A person walks up the escalator at 0.9 m/s relative to the escalator. The escalator is 15 meters long. How many seconds does it take the person to reach the top?`,
    correctValue: 10, tolerance: 0, unit: "seconds",
    explanation: `Combined speed = escalator + person\n= 0.6 + 0.9 = 1.5 m/s\n\nTime = distance ÷ speed\n= 15 ÷ 1.5 = 10 seconds\n\nAnswer: 10 seconds\n\n💡 "Relative to the escalator" means the person's walking speed adds to the escalator speed.`
  },
  {
    id: 7, type: "mc", category: "Tax Brackets · Multi-Step",
    question: `Income tax rates: 0% on the first $10,000; 10% on $10,001–$40,000; 20% on income above $40,000. If someone earns $55,000, what is their total tax?`,
    options: ["A) $5,500", "B) $6,000", "C) $8,000", "D) $11,000"], answer: 1,
    explanation: `First $10,000: $0 tax\n$10,001–$40,000 (= $30,000): $30,000 × 0.10 = $3,000\n$40,001–$55,000 (= $15,000): $15,000 × 0.20 = $3,000\n\nTotal: $0 + $3,000 + $3,000 = $6,000\n\nAnswer: B) $6,000\n\n💡 Option D ($11,000) applies 20% to the ENTIRE income — that's how flat tax works, not brackets. Each bracket only taxes that portion.`
  },
  {
    id: 8, type: "spr", category: "Fuel · Distance · Cost",
    question: `A car consumes 8.5 liters per 100 km. Gasoline costs $1.40 per liter. How much does it cost to drive 350 km?`,
    correctValue: 41.65, tolerance: 0.01, unit: "$",
    explanation: `Step 1 — Fuel needed:\n(350 ÷ 100) × 8.5 = 3.5 × 8.5 = 29.75 liters\n\nStep 2 — Cost:\n29.75 × $1.40 = $41.65\n\nAnswer: $41.65\n\n💡 "Liters per 100 km" is a rate — divide the actual distance by 100 first, then multiply.`
  },
  {
    id: 9, type: "mc", category: "Defect Rate · Cost Analysis",
    question: `A factory produces 500 parts per hour. 3% are defective, and each defective part costs $15 to replace. What is the daily replacement cost for an 8-hour shift?`,
    options: ["A) $600", "B) $1,200", "C) $1,800", "D) $2,400"], answer: 2,
    explanation: `Step 1 — Daily production:\n500 × 8 = 4,000 parts\n\nStep 2 — Defective parts:\n4,000 × 0.03 = 120\n\nStep 3 — Cost:\n120 × $15 = $1,800\n\nAnswer: C) $1,800\n\n💡 Option A ($600) is for one hour only — the question asks for the full 8-hour shift.`
  },
  {
    id: 10, type: "spr", category: "Cooling Rate · Segments",
    question: `A metal rod is heated to 200°C. It cools at 12°C per minute for the first 5 minutes, then at 8°C per minute for the next 5 minutes. What is the temperature after 10 minutes?`,
    correctValue: 100, tolerance: 0, unit: "°C",
    explanation: `Phase 1 (first 5 min):\n200 − 5(12) = 200 − 60 = 140°C\n\nPhase 2 (next 5 min):\n140 − 5(8) = 140 − 40 = 100°C\n\nAnswer: 100°C\n\n💡 Two different rates for two segments — calculate each phase separately. Don't average the rates.`
  }
];

const answerKey = [
  { q: 1, type: "SPR", ans: "7.75", topic: "kg→lbs, shipping" },
  { q: 2, type: "MC", ans: "B", topic: "BMI, lbs+in→kg+m" },
  { q: 3, type: "SPR", ans: "480", topic: "ft²→yd²→cost" },
  { q: 4, type: "SPR", ans: "10", topic: "Speed camera" },
  { q: 5, type: "MC", ans: "B", topic: "Coffee mixture" },
  { q: 6, type: "SPR", ans: "10", topic: "Escalator speed" },
  { q: 7, type: "MC", ans: "B", topic: "Tax brackets" },
  { q: 8, type: "SPR", ans: "41.65", topic: "Fuel L/100km" },
  { q: 9, type: "MC", ans: "C", topic: "Defect cost" },
  { q: 10, type: "SPR", ans: "100", topic: "Two-phase cooling" },
];

const catColors = { "Shipping · Weight Conversion": "#E63946", "BMI · Dual Unit Conversion": "#457B9D", "Area · Unit Conversion · Cost": "#2A9D8F", "Speed Camera · Time · Rate": "#E9C46A", "Mixture · Weighted Price": "#F4A261", "Relative Speed · Distance": "#264653", "Tax Brackets · Multi-Step": "#6A4C93", "Fuel · Distance · Cost": "#1982C4", "Defect Rate · Cost Analysis": "#8AC926", "Cooling Rate · Segments": "#FF595E" };

function OptionButton({ opt, isRevealed, isAnswer, isSelected, onSelect }) {
  let bg = "#F7F7F7", border = "1px solid #ECECEC", color = "#333";
  if (isRevealed && isAnswer) { bg = "#E8F5E9"; border = "1.5px solid #66BB6A"; color = "#2E7D32"; }
  else if (isRevealed && isSelected && !isAnswer) { bg = "#FFEBEE"; border = "1.5px solid #EF5350"; color = "#C62828"; }
  else if (!isRevealed && isSelected) { bg = "#E3F2FD"; border = "1.5px solid #64B5F6"; color = "#1565C0"; }
  return (<button onClick={onSelect} style={{ background: bg, border, borderRadius: 10, padding: "10px 14px", fontSize: 14, color, textAlign: "left", cursor: isRevealed ? "default" : "pointer", fontWeight: isRevealed && isAnswer ? 600 : 400, fontFamily: "inherit" }}>{opt}</button>);
}

export default function App() {
  const [selected, setSelected] = useState({});
  const [sprInputs, setSprInputs] = useState({});
  const [revealed, setRevealed] = useState({});
  const [score, setScore] = useState(null);
  const [showKey, setShowKey] = useState(false);

  const handleSelect = (pid, oi) => { if (!revealed[pid]) setSelected((p) => ({ ...p, [pid]: oi })); };
  const handleSprInput = (pid, v) => { if (!revealed[pid]) setSprInputs((p) => ({ ...p, [pid]: v })); };
  const checkSpr = (prob, input) => { const n = parseFloat(input); return !isNaN(n) && Math.abs(n - prob.correctValue) <= (prob.tolerance || 0.01); };
  const isAnswered = (p) => p.type === "mc" ? selected[p.id] !== undefined : (sprInputs[p.id] || "") !== "";
  const isCorrect = (p) => p.type === "mc" ? selected[p.id] === p.answer : checkSpr(p, sprInputs[p.id] || "");
  const handleReveal = (pid) => setRevealed((p) => ({ ...p, [pid]: true }));
  const scoreAll = () => { const nr = {}; problems.forEach((p) => (nr[p.id] = true)); setRevealed(nr); setScore(problems.filter((p) => isCorrect(p)).length); };
  const reset = () => { setSelected({}); setSprInputs({}); setRevealed({}); setScore(null); setShowKey(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#FAFAFA", minHeight: "100vh" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#E63946", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: "4px 12px", borderRadius: 20, marginBottom: 12, textTransform: "uppercase" }}>June 2026 · SET 5</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Applied Problem Solving</h1>
        <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Shipping · BMI · Tax · Fuel · Mixtures · All verified ✓</p>
      </div>
      {score !== null && (<div style={{ background: score >= 7 ? "#E8F5E9" : score >= 4 ? "#FFF8E1" : "#FFEBEE", border: `1px solid ${score >= 7 ? "#A5D6A7" : score >= 4 ? "#FFE082" : "#EF9A9A"}`, borderRadius: 12, padding: "16px 20px", marginBottom: 24, textAlign: "center" }}><span style={{ fontSize: 28, fontWeight: 700 }}>{score}</span><span style={{ fontSize: 16, color: "#666" }}> / 10</span></div>)}
      {problems.map((p, idx) => {
        const isR = revealed[p.id], cor = isCorrect(p), cc = catColors[p.category] || "#666";
        return (
          <div key={p.id} style={{ background: "#fff", borderRadius: 14, marginBottom: 20, padding: "20px 20px 16px", border: isR ? `1.5px solid ${cor ? "#66BB6A" : "#EF5350"}` : "1px solid #E8E8E8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: cc, background: cc + "14", padding: "3px 10px", borderRadius: 20 }}>{p.category}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: p.type === "spr" ? "#E63946" : "#457B9D", background: p.type === "spr" ? "#FFEBEE" : "#E3F2FD", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase" }}>{p.type === "spr" ? "Grid-In" : "MC"}</span>
            </div>
            <p style={{ fontSize: 13, color: "#999", margin: "0 0 4px", fontWeight: 600 }}>Q{idx + 1}</p>
            <pre style={{ fontSize: 14, color: "#2a2a2a", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "0 0 16px" }}>{p.question}</pre>
            {p.type === "mc" ? (
              <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                {p.options.map((opt, oi) => (<OptionButton key={oi} opt={opt} isRevealed={isR} isAnswer={oi === p.answer} isSelected={selected[p.id] === oi} onSelect={() => handleSelect(p.id, oi)} />))}
              </div>
            ) : (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="text" inputMode="decimal" value={sprInputs[p.id] || ""} onChange={(e) => handleSprInput(p.id, e.target.value)} disabled={isR} placeholder="Your answer" style={{ flex: 1, padding: "10px 14px", fontSize: 16, fontWeight: 600, fontFamily: "inherit", border: isR ? `1.5px solid ${cor ? "#66BB6A" : "#EF5350"}` : "1.5px solid #ddd", borderRadius: 10, background: isR ? (cor ? "#E8F5E9" : "#FFEBEE") : "#fff", outline: "none", color: "#1a1a1a" }} />
                  {p.unit && <span style={{ fontSize: 14, color: "#888", fontWeight: 500 }}>{p.unit}</span>}
                </div>
                {isR && !cor && <p style={{ fontSize: 13, color: "#E53935", margin: "8px 0 0", fontWeight: 600 }}>Correct: {p.correctValue} {p.unit}</p>}
              </div>
            )}
            {!isR && isAnswered(p) && (<button onClick={() => handleReveal(p.id)} style={{ background: "none", border: "1px solid #ccc", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>Show Solution</button>)}
            {isR && (<div style={{ background: "#FAFAFA", borderRadius: 10, padding: 16, marginTop: 8 }}><p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, margin: "0 0 10px", color: cor ? "#43A047" : "#E53935" }}>{cor ? "✓ CORRECT" : "✗ INCORRECT"}</p><pre style={{ fontSize: 13, color: "#555", lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{p.explanation}</pre></div>)}
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", padding: "12px 0 16px" }}>
        {score === null && (<button onClick={scoreAll} style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Score All</button>)}
        <button onClick={() => setShowKey(!showKey)} style={{ background: "#fff", color: "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{showKey ? "Hide" : "Answer Key"}</button>
        <button onClick={reset} style={{ background: "#fff", color: "#666", border: "1px solid #ddd", borderRadius: 10, padding: "12px 28px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Reset</button>
      </div>
      {showKey && (<div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E8E8", padding: 20, marginBottom: 40 }}><h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Answer Key — SET 5</h3><div style={{ display: "grid", gap: 6 }}>{answerKey.map((item) => (<div key={item.q} style={{ display: "grid", gridTemplateColumns: "36px 50px 54px 1fr", alignItems: "center", gap: 8, padding: "8px 12px", background: "#FAFAFA", borderRadius: 8, fontSize: 13 }}><span style={{ fontWeight: 600 }}>Q{item.q}</span><span style={{ fontSize: 10, fontWeight: 700, color: item.type === "SPR" ? "#E63946" : "#457B9D", background: item.type === "SPR" ? "#FFEBEE" : "#E3F2FD", padding: "2px 6px", borderRadius: 4, textAlign: "center" }}>{item.type}</span><span style={{ fontWeight: 700, color: "#1982C4", background: "#E3F2FD", padding: "2px 8px", borderRadius: 6, textAlign: "center" }}>{item.ans}</span><span style={{ color: "#888" }}>{item.topic}</span></div>))}</div></div>)}
    </div>
  );
}
