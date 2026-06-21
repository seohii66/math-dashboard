import { useState } from "react";

const problems = [
  {
    id: 1, type: "spr", category: "Work Rate · Time Conversion", difficulty: "★★★",
    question: `Worker A can paint a room in 6 hours. Worker B can paint the same room in 4 hours. If they work together, how many minutes will it take to paint the room?`,
    correctValue: 144, tolerance: 0, unit: "minutes",
    explanation: `Rate A = 1/6 room per hour\nRate B = 1/4 room per hour\n\nCombined rate = 1/6 + 1/4 = 2/12 + 3/12 = 5/12 per hour\n\nTime = 1 ÷ (5/12) = 12/5 = 2.4 hours\n\nConvert: 2.4 × 60 = 144 minutes\n\nAnswer: 144 minutes\n\n💡 Add RATES, not times. Then convert hours → minutes at the end.`
  },
  {
    id: 2, type: "mc", category: "Dilution · Concentration", difficulty: "★★★",
    question: `A scientist has 800 mL of a 30% acid solution. She adds pure water to create a 20% acid solution. How many mL of water must she add?`,
    options: ["A) 200", "B) 300", "C) 400", "D) 600"], answer: 2,
    explanation: `The amount of acid stays constant:\nAcid = 800 × 0.30 = 240 mL\n\nAfter adding w mL of water:\n240 / (800 + w) = 0.20\n240 = 0.20(800 + w)\n240 = 160 + 0.20w\n80 = 0.20w\nw = 400 mL\n\nVerify: 240 / 1,200 = 0.20 = 20% ✓\n\nAnswer: C) 400\n\n💡 Key insight: adding water changes the total but NOT the acid amount.`
  },
  {
    id: 3, type: "spr", category: "Pace → Speed · Dual Conversion", difficulty: "★★★",
    question: `A runner has a pace of 7 minutes and 30 seconds per mile. Using 1 mile = 1.6 km, what is the runner's speed in kilometers per hour?`,
    correctValue: 12.8, tolerance: 0.05, unit: "km/h",
    explanation: `Step 1 — Convert pace to decimal:\n7 min 30 sec = 7.5 min per mile\n\nStep 2 — Pace → speed:\nSpeed = 60 min ÷ 7.5 min/mile = 8 mph\n\nStep 3 — Convert to km/h:\n8 × 1.6 = 12.8 km/h\n\nAnswer: 12.8 km/h\n\n💡 Pace (time/distance) is the INVERSE of speed (distance/time).`
  },
  {
    id: 4, type: "spr", category: "Proportional Reasoning · Weight", difficulty: "★★★",
    question: `A recipe for 12 cookies requires 1.5 cups of flour. If 1 cup of flour weighs 125 grams, how many grams of flour are needed to make 80 cookies?`,
    correctValue: 1250, tolerance: 0, unit: "grams",
    explanation: `Step 1 — Scale the recipe:\n(80 / 12) × 1.5 = 10 cups\n\nStep 2 — Convert to grams:\n10 × 125 = 1,250 grams\n\nAnswer: 1,250 grams\n\n💡 Proportion first (cookies → cups), then unit conversion (cups → grams).`
  },
  {
    id: 5, type: "mc", category: "Exponential · Time Unit", difficulty: "★★★",
    question: `A bacteria culture doubles every 90 minutes. Starting with 200 bacteria, how many will there be after 6 hours?`,
    options: ["A) 1,600", "B) 3,200", "C) 6,400", "D) 12,800"], answer: 1,
    explanation: `Step 1 — Convert to same unit:\n6 hours = 360 minutes\n\nStep 2 — Number of doublings:\n360 ÷ 90 = 4 doublings\n\nStep 3 — Final count:\n200 × 2⁴ = 200 × 16 = 3,200\n\nAnswer: B) 3,200\n\n💡 The time mismatch (hours vs minutes) is the trap.`
  },
  {
    id: 6, type: "spr", category: "Density · Volume · Mass", difficulty: "★★★",
    question: `An aluminum block measures 10 cm × 5 cm × 4 cm. Aluminum has a density of 2.7 g/cm³. What is the mass of the block in kilograms?`,
    correctValue: 0.54, tolerance: 0.005, unit: "kg",
    explanation: `Step 1 — Volume: 10 × 5 × 4 = 200 cm³\nStep 2 — Mass in grams: 200 × 2.7 = 540 g\nStep 3 — Convert: 540 ÷ 1,000 = 0.54 kg\n\nAnswer: 0.54 kg\n\n💡 Density = mass/volume → mass = density × volume. Then g → kg (÷ 1,000).`
  },
  {
    id: 7, type: "mc", category: "Blueprint Scale · Area", difficulty: "★★★",
    question: `A blueprint uses a scale of 1 inch : 4 feet. A room on the blueprint measures 3.5 inches by 5 inches. What is the actual area of the room in square feet?`,
    options: ["A) 70", "B) 140", "C) 280", "D) 560"], answer: 2,
    explanation: `Step 1 — Convert each dimension:\n3.5 in × 4 = 14 feet\n5 in × 4 = 20 feet\n\nStep 2 — Area: 14 × 20 = 280 sq ft\n\nAnswer: C) 280\n\n💡 Scale the dimensions FIRST, then find area. Don't multiply the blueprint area by 4 (that only works for length, not area).`
  },
  {
    id: 8, type: "spr", category: "Average Speed · Segments", difficulty: "★★★",
    question: `A driver travels 120 km at 60 km/h, then 80 km at 40 km/h. What is the average speed for the entire trip, in km/h?`,
    correctValue: 50, tolerance: 0, unit: "km/h",
    explanation: `Average speed = total distance ÷ total time\n\nSegment 1: 120 ÷ 60 = 2 hours\nSegment 2: 80 ÷ 40 = 2 hours\n\nTotal: 200 km ÷ 4 hours = 50 km/h\n\nAnswer: 50 km/h\n\n💡 Average speed ≠ average of the speeds. Always use total distance ÷ total time.`
  },
  {
    id: 9, type: "mc", category: "Profit · Break-Even", difficulty: "★★★",
    question: `Cost to produce x units: C(x) = 2,500 + 8x. Revenue from selling x units: R(x) = 15x. What is the minimum number of units to sell for profit to exceed $2,000?`,
    options: ["A) 358", "B) 500", "C) 643", "D) 750"], answer: 2,
    explanation: `Profit = R − C = 15x − (2,500 + 8x) = 7x − 2,500\n\n7x − 2,500 > 2,000\n7x > 4,500\nx > 642.86\n\nSince x must be a whole number: x ≥ 643\n\nAnswer: C) 643\n\n💡 Option A (358) is break-even — a different question. Read carefully!`
  },
  {
    id: 10, type: "spr", category: "Exponential Decay · Percent", difficulty: "★★★",
    question: `A tank contains 800 liters. It loses 2% of its CURRENT volume every hour. How many liters remain after 3 hours? Round to the nearest whole number.`,
    correctValue: 753, tolerance: 0.5, unit: "liters",
    explanation: `This is exponential decay:\n\n800 × (0.98)³ = 800 × 0.941192 ≈ 753\n\nOr step by step:\nAfter 1 hr: 800 × 0.98 = 784\nAfter 2 hrs: 784 × 0.98 = 768.32\nAfter 3 hrs: 768.32 × 0.98 ≈ 753\n\nAnswer: 753 liters\n\n💡 "2% of CURRENT volume" = exponential. "2% of ORIGINAL" = linear. Read carefully!`
  }
];

const answerKey = [
  { q: 1, type: "SPR", ans: "144", topic: "Work rate → minutes" },
  { q: 2, type: "MC", ans: "C", topic: "Dilution, 400 mL" },
  { q: 3, type: "SPR", ans: "12.8", topic: "Pace → km/h" },
  { q: 4, type: "SPR", ans: "1,250", topic: "Cookies, cups→g" },
  { q: 5, type: "MC", ans: "B", topic: "Doubling, hrs→min" },
  { q: 6, type: "SPR", ans: "0.54", topic: "Density, g→kg" },
  { q: 7, type: "MC", ans: "C", topic: "Blueprint, 280 ft²" },
  { q: 8, type: "SPR", ans: "50", topic: "Average speed" },
  { q: 9, type: "MC", ans: "C", topic: "Profit > $2,000" },
  { q: 10, type: "SPR", ans: "753", topic: "Exp decay 2%/hr" },
];

const catColors = {
  "Work Rate · Time Conversion": "#E63946",
  "Dilution · Concentration": "#457B9D",
  "Pace → Speed · Dual Conversion": "#2A9D8F",
  "Proportional Reasoning · Weight": "#E9C46A",
  "Exponential · Time Unit": "#F4A261",
  "Density · Volume · Mass": "#264653",
  "Blueprint Scale · Area": "#6A4C93",
  "Average Speed · Segments": "#1982C4",
  "Profit · Break-Even": "#8AC926",
  "Exponential Decay · Percent": "#FF595E",
};

function OptionButton({ opt, isRevealed, isAnswer, isSelected, onSelect }) {
  let bg = "#F7F7F7", border = "1px solid #ECECEC", color = "#333";
  if (isRevealed && isAnswer) { bg = "#E8F5E9"; border = "1.5px solid #66BB6A"; color = "#2E7D32"; }
  else if (isRevealed && isSelected && !isAnswer) { bg = "#FFEBEE"; border = "1.5px solid #EF5350"; color = "#C62828"; }
  else if (!isRevealed && isSelected) { bg = "#E3F2FD"; border = "1.5px solid #64B5F6"; color = "#1565C0"; }

  return (
    <button onClick={onSelect} style={{
      background: bg, border, borderRadius: 10, padding: "10px 14px", fontSize: 14,
      color, textAlign: "left", cursor: isRevealed ? "default" : "pointer",
      fontWeight: isRevealed && isAnswer ? 600 : 400, fontFamily: "inherit",
    }}>
      {opt}
    </button>
  );
}

export default function App() {
  const [selected, setSelected] = useState({});
  const [sprInputs, setSprInputs] = useState({});
  const [revealed, setRevealed] = useState({});
  const [score, setScore] = useState(null);
  const [showKey, setShowKey] = useState(false);

  const handleSelect = (pid, oi) => {
    if (!revealed[pid]) setSelected((prev) => ({ ...prev, [pid]: oi }));
  };

  const handleSprInput = (pid, v) => {
    if (!revealed[pid]) setSprInputs((prev) => ({ ...prev, [pid]: v }));
  };

  const checkSpr = (prob, input) => {
    const n = parseFloat(input);
    return !isNaN(n) && Math.abs(n - prob.correctValue) <= (prob.tolerance || 0.01);
  };

  const isAnswered = (p) => {
    if (p.type === "mc") return selected[p.id] !== undefined;
    return (sprInputs[p.id] || "") !== "";
  };

  const isCorrect = (p) => {
    if (p.type === "mc") return selected[p.id] === p.answer;
    return checkSpr(p, sprInputs[p.id] || "");
  };

  const handleReveal = (pid) => setRevealed((prev) => ({ ...prev, [pid]: true }));

  const scoreAll = () => {
    const nr = {};
    problems.forEach((p) => (nr[p.id] = true));
    setRevealed(nr);
    setScore(problems.filter((p) => isCorrect(p)).length);
  };

  const reset = () => {
    setSelected({});
    setSprInputs({});
    setRevealed({});
    setScore(null);
    setShowKey(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#FAFAFA", minHeight: "100vh" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#E63946", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: "4px 12px", borderRadius: 20, marginBottom: 12, textTransform: "uppercase" }}>June 2026 · SET 3</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Multi-Step & Reasoning</h1>
        <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Work rates · Dilution · Density · Average speed · All verified ✓</p>
      </div>

      {score !== null && (
        <div style={{ background: score >= 7 ? "#E8F5E9" : score >= 4 ? "#FFF8E1" : "#FFEBEE", border: `1px solid ${score >= 7 ? "#A5D6A7" : score >= 4 ? "#FFE082" : "#EF9A9A"}`, borderRadius: 12, padding: "16px 20px", marginBottom: 24, textAlign: "center" }}>
          <span style={{ fontSize: 28, fontWeight: 700 }}>{score}</span>
          <span style={{ fontSize: 16, color: "#666" }}> / 10</span>
        </div>
      )}

      {problems.map((p, idx) => {
        const isR = revealed[p.id];
        const cor = isCorrect(p);
        const cc = catColors[p.category] || "#666";

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
                {p.options.map((opt, oi) => (
                  <OptionButton key={oi} opt={opt} isRevealed={isR} isAnswer={oi === p.answer} isSelected={selected[p.id] === oi} onSelect={() => handleSelect(p.id, oi)} />
                ))}
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

            {!isR && isAnswered(p) && (
              <button onClick={() => handleReveal(p.id)} style={{ background: "none", border: "1px solid #ccc", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>Show Solution</button>
            )}

            {isR && (
              <div style={{ background: "#FAFAFA", borderRadius: 10, padding: 16, marginTop: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, margin: "0 0 10px", color: cor ? "#43A047" : "#E53935" }}>{cor ? "✓ CORRECT" : "✗ INCORRECT"}</p>
                <pre style={{ fontSize: 13, color: "#555", lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{p.explanation}</pre>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", padding: "12px 0 16px" }}>
        {score === null && (
          <button onClick={scoreAll} style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Score All</button>
        )}
        <button onClick={() => setShowKey(!showKey)} style={{ background: "#fff", color: "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{showKey ? "Hide" : "Answer Key"}</button>
        <button onClick={reset} style={{ background: "#fff", color: "#666", border: "1px solid #ddd", borderRadius: 10, padding: "12px 28px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Reset</button>
      </div>

      {showKey && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E8E8", padding: 20, marginBottom: 40 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Answer Key — SET 3</h3>
          <div style={{ display: "grid", gap: 6 }}>
            {answerKey.map((item) => (
              <div key={item.q} style={{ display: "grid", gridTemplateColumns: "36px 50px 54px 1fr", alignItems: "center", gap: 8, padding: "8px 12px", background: "#FAFAFA", borderRadius: 8, fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>Q{item.q}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: item.type === "SPR" ? "#E63946" : "#457B9D", background: item.type === "SPR" ? "#FFEBEE" : "#E3F2FD", padding: "2px 6px", borderRadius: 4, textAlign: "center" }}>{item.type}</span>
                <span style={{ fontWeight: 700, color: "#1982C4", background: "#E3F2FD", padding: "2px 8px", borderRadius: 6, textAlign: "center" }}>{item.ans}</span>
                <span style={{ color: "#888" }}>{item.topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
