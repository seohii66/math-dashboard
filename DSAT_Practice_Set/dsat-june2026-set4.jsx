import { useState } from "react";

const problems = [
  {
    id: 1, type: "spr", category: "Volume · Density · Mass",
    question: `A concrete sidewalk is 30 meters long, 1.5 meters wide, and 0.1 meters thick. Concrete has a density of 2,400 kg per cubic meter. What is the total mass of the sidewalk in metric tons? (1 metric ton = 1,000 kg)`,
    correctValue: 10.8, tolerance: 0.05, unit: "metric tons",
    explanation: `Step 1 — Volume: 30 × 1.5 × 0.1 = 4.5 m³\nStep 2 — Mass: 4.5 × 2,400 = 10,800 kg\nStep 3 — Convert: 10,800 ÷ 1,000 = 10.8 metric tons\n\nAnswer: 10.8\n\n💡 Three-step chain: dimensions → volume → mass → unit conversion.`
  },
  {
    id: 2, type: "mc", category: "VAT Refund · Exchange Rate",
    question: `An item in France costs €85, which includes 20% VAT (value-added tax). A tourist receives a full VAT refund. Using 1 EUR = 1.08 USD, what is the effective cost in US dollars?`,
    options: ["A) $76.50", "B) $85.00", "C) $91.80", "D) $68.00"], answer: 0,
    explanation: `Step 1 — Remove VAT (price includes 20% tax):\n€85 ÷ 1.20 = €70.833\n\nStep 2 — Convert to USD:\n€70.833 × 1.08 = $76.50\n\nAnswer: A) $76.50\n\n💡 "Includes 20% VAT" means divide by 1.20, not subtract 20%. This is the #1 mistake.`
  },
  {
    id: 3, type: "spr", category: "Speed · Distance · Conversion",
    question: `A person sees lightning and hears thunder 4.5 seconds later. The speed of sound is 343 meters per second. How far away is the lightning, in kilometers? Round to the nearest tenth.`,
    correctValue: 1.5, tolerance: 0.05, unit: "km",
    explanation: `Step 1 — Distance in meters:\n343 m/s × 4.5 s = 1,543.5 m\n\nStep 2 — Convert to km:\n1,543.5 ÷ 1,000 = 1.5435 ≈ 1.5 km\n\nAnswer: 1.5 km\n\n💡 Light travels almost instantly; only the sound delay matters. d = speed × time, then convert.`
  },
  {
    id: 4, type: "spr", category: "Surface Area · Coverage",
    question: `A room has 4 walls: two are 5m × 3m and two are 4m × 3m. One wall has a window (1.5m × 1.2m) and another has a door (2m × 0.9m). If 1 liter of paint covers 10 m², how many whole liters must be purchased?`,
    correctValue: 6, tolerance: 0, unit: "liters",
    explanation: `Step 1 — Total wall area:\n2(5 × 3) + 2(4 × 3) = 30 + 24 = 54 m²\n\nStep 2 — Subtract openings:\nWindow: 1.5 × 1.2 = 1.8 m²\nDoor: 2 × 0.9 = 1.8 m²\nPaintable: 54 − 1.8 − 1.8 = 50.4 m²\n\nStep 3 — Liters needed:\n50.4 ÷ 10 = 5.04 → round UP = 6 liters\n\nAnswer: 6\n\n💡 Subtract window/door areas, then round UP (can't buy 0.04 of a liter).`
  },
  {
    id: 5, type: "mc", category: "Volume · Cost · Conversion",
    question: `A water heater holds 50 gallons. Water costs $0.005 per liter. Using 1 gallon = 3.785 liters, how much does it cost to fill the heater?`,
    options: ["A) $0.25", "B) $0.95", "C) $1.89", "D) $9.46"], answer: 1,
    explanation: `Step 1 — Convert to liters:\n50 × 3.785 = 189.25 liters\n\nStep 2 — Cost:\n189.25 × $0.005 = $0.95 (rounded)\n\nAnswer: B) $0.95\n\n💡 Option C ($1.89) is the trap if you accidentally use $0.01/L. Check the decimal!`
  },
  {
    id: 6, type: "spr", category: "Time Zones · Speed · Distance",
    question: `A flight departs New York at 8:00 AM EST and arrives in London at 8:00 PM GMT. London is 5 hours ahead of New York. The distance is 5,600 km. Using 1 mile = 1.6 km, what is the average speed in miles per hour?`,
    correctValue: 500, tolerance: 0, unit: "mph",
    explanation: `Step 1 — Flight duration:\n8:00 AM EST = 1:00 PM GMT\nArrival: 8:00 PM GMT\nDuration: 7 hours\n\nStep 2 — Convert distance:\n5,600 km ÷ 1.6 = 3,500 miles\n\nStep 3 — Speed:\n3,500 ÷ 7 = 500 mph\n\nAnswer: 500 mph\n\n💡 The time zone conversion is the hidden step. Without it, you'd get 12 hours instead of 7.`
  },
  {
    id: 7, type: "mc", category: "Weighted Average",
    question: `A student scores 78 on a test worth 30% of the grade, 92 on a test worth 50%, and 85 on a test worth 20%. What is the weighted average?`,
    options: ["A) 85.0", "B) 85.7", "C) 86.4", "D) 87.0"], answer: 2,
    explanation: `0.30(78) + 0.50(92) + 0.20(85)\n= 23.4 + 46.0 + 17.0\n= 86.4\n\nAnswer: C) 86.4\n\n💡 Simple average would be (78+92+85)/3 = 85.0 — that's option A, the trap. Weights matter!`
  },
  {
    id: 8, type: "spr", category: "Volume · Mass · Multi-Conversion",
    question: `A rectangular tank has a base of 80 cm × 50 cm and is filled with water to a height of 30 cm. Given that 1 cm³ = 1 mL and 1 liter of water has a mass of 1 kg, what is the mass of the water in kilograms?`,
    correctValue: 120, tolerance: 0, unit: "kg",
    explanation: `Step 1 — Volume:\n80 × 50 × 30 = 120,000 cm³\n\nStep 2 — Convert cm³ → mL → L:\n120,000 cm³ = 120,000 mL = 120 L\n\nStep 3 — Mass:\n120 L × 1 kg/L = 120 kg\n\nAnswer: 120 kg\n\n💡 The conversion chain: cm³ → mL → L → kg. Each step is ×1 or ÷1,000.`
  },
  {
    id: 9, type: "mc", category: "Electricity · Cost · Time",
    question: `An air conditioner uses 1,500 watts and runs 8 hours per day. Electricity costs $0.12 per kWh. What is the monthly cost for 30 days?`,
    options: ["A) $14.40", "B) $36.00", "C) $43.20", "D) $144.00"], answer: 2,
    explanation: `Step 1 — Convert watts to kW:\n1,500 W = 1.5 kW\n\nStep 2 — Daily energy:\n1.5 kW × 8 h = 12 kWh\n\nStep 3 — Monthly energy:\n12 × 30 = 360 kWh\n\nStep 4 — Cost:\n360 × $0.12 = $43.20\n\nAnswer: C) $43.20\n\n💡 Option B ($36) comes from forgetting to convert W → kW. Option D ($144) uses watts directly.`
  },
  {
    id: 10, type: "spr", category: "Gear Ratio · RPM",
    question: `A bicycle's front gear has 48 teeth and the rear gear has 16 teeth. If the cyclist pedals at 80 revolutions per minute, how many RPM does the rear wheel turn?`,
    correctValue: 240, tolerance: 0, unit: "RPM",
    explanation: `Gear ratio = front teeth ÷ rear teeth\n= 48 ÷ 16 = 3\n\nRear wheel RPM = pedal RPM × gear ratio\n= 80 × 3 = 240 RPM\n\nAnswer: 240 RPM\n\n💡 Larger front gear + smaller rear gear = the wheel spins FASTER than the pedals. Multiply by the ratio.`
  }
];

const answerKey = [
  { q: 1, type: "SPR", ans: "10.8", topic: "Concrete mass" },
  { q: 2, type: "MC", ans: "A", topic: "VAT refund + forex" },
  { q: 3, type: "SPR", ans: "1.5", topic: "Sound → distance" },
  { q: 4, type: "SPR", ans: "6", topic: "Paint coverage" },
  { q: 5, type: "MC", ans: "B", topic: "Gallons → L → cost" },
  { q: 6, type: "SPR", ans: "500", topic: "Time zone + speed" },
  { q: 7, type: "MC", ans: "C", topic: "Weighted average" },
  { q: 8, type: "SPR", ans: "120", topic: "cm³→mL→L→kg" },
  { q: 9, type: "MC", ans: "C", topic: "W→kWh→cost" },
  { q: 10, type: "SPR", ans: "240", topic: "Gear ratio" },
];

const catColors = { "Volume · Density · Mass": "#E63946", "VAT Refund · Exchange Rate": "#457B9D", "Speed · Distance · Conversion": "#2A9D8F", "Surface Area · Coverage": "#E9C46A", "Volume · Cost · Conversion": "#F4A261", "Time Zones · Speed · Distance": "#264653", "Weighted Average": "#6A4C93", "Volume · Mass · Multi-Conversion": "#1982C4", "Electricity · Cost · Time": "#8AC926", "Gear Ratio · RPM": "#FF595E" };

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
        <div style={{ display: "inline-block", background: "#E63946", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: "4px 12px", borderRadius: 20, marginBottom: 12, textTransform: "uppercase" }}>June 2026 · SET 4</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Real-World Multi-Step</h1>
        <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Construction · Science · Travel · Engineering · All verified ✓</p>
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
      {showKey && (<div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E8E8", padding: 20, marginBottom: 40 }}><h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Answer Key — SET 4</h3><div style={{ display: "grid", gap: 6 }}>{answerKey.map((item) => (<div key={item.q} style={{ display: "grid", gridTemplateColumns: "36px 50px 54px 1fr", alignItems: "center", gap: 8, padding: "8px 12px", background: "#FAFAFA", borderRadius: 8, fontSize: 13 }}><span style={{ fontWeight: 600 }}>Q{item.q}</span><span style={{ fontSize: 10, fontWeight: 700, color: item.type === "SPR" ? "#E63946" : "#457B9D", background: item.type === "SPR" ? "#FFEBEE" : "#E3F2FD", padding: "2px 6px", borderRadius: 4, textAlign: "center" }}>{item.type}</span><span style={{ fontWeight: 700, color: "#1982C4", background: "#E3F2FD", padding: "2px 8px", borderRadius: 6, textAlign: "center" }}>{item.ans}</span><span style={{ color: "#888" }}>{item.topic}</span></div>))}</div></div>)}
    </div>
  );
}
