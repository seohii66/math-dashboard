// Central registry of all problem sets.
// To add a new set: copy the `problems` / `answerKey` / `catColors` arrays from
// your .jsx file into a new object below and push it into SETS.

const set2 = {
  id: "june2026-set2",
  label: "June 2026 · SET 2",
  title: "Unit Conversion & Multi-Step",
  subtitle: "Currency · Fuel · Dosage · Volume",
  accent: "#E63946",
  catColors: {
    "Currency · Fee · Conversion": "#E63946",
    "Fuel Efficiency · Dual Conversion": "#457B9D",
    "Population Density · Area Conversion": "#2A9D8F",
    "Dosage · Weight Conversion": "#E9C46A",
    "Energy · Power · Time": "#F4A261",
    "Compound Interest": "#264653",
    "Volume · Rate · Time": "#6A4C93",
    "Data · Rate · Distance": "#1982C4",
    "Map Scale · Area": "#8AC926",
    "Combined Rates · Unit Mismatch": "#FF595E",
  },
  problems: [
    {
      id: 1, type: "spr", category: "Currency · Fee · Conversion", difficulty: "★★★",
      question: `A tourist exchanges $400 USD to euros. The exchange service charges a 2.5% fee on the original USD amount before converting. The exchange rate is 1 USD = 0.92 EUR. How many euros does the tourist receive?`,
      correctValue: 358.8, tolerance: 0.05, unit: "EUR",
      explanation: `Step 1 — Fee: $400 × 0.025 = $10\nStep 2 — After fee: $400 − $10 = $390\nStep 3 — Convert: $390 × 0.92 = €358.80\n\nAnswer: 358.8\n\n💡 The fee is deducted BEFORE conversion. Applying the fee to the euro amount gives a different (wrong) answer.`,
    },
    {
      id: 2, type: "spr", category: "Fuel Efficiency · Dual Conversion", difficulty: "★★★",
      question: `A car's fuel efficiency is rated at 34 miles per gallon. Using 1 gallon = 3.785 liters and 1 mile = 1.6 km, what is the fuel efficiency in kilometers per liter? Round to the nearest tenth.`,
      correctValue: 14.4, tolerance: 0.05, unit: "km/L",
      explanation: `Step 1 — Convert numerator (miles → km):\n34 mi/gal × 1.6 km/mi = 54.4 km/gal\n\nStep 2 — Convert denominator (gallons → liters):\n54.4 km/gal ÷ 3.785 L/gal ≈ 14.4 km/L\n\nAnswer: 14.4 km/L\n\n💡 Both the numerator AND denominator change units. Multiply for the top, divide for the bottom.`,
    },
    {
      id: 3, type: "mc", category: "Population Density · Area Conversion", difficulty: "★★★",
      question: `A city has a population of 450,000 and covers 180 square kilometers. If 1 km ≈ 0.621 miles, what is the approximate population density in people per square mile?`,
      options: ["A) 2,500", "B) 3,880", "C) 6,480", "D) 10,440"], answer: 2,
      explanation: `Step 1 — Convert km² to mi² (SQUARE the factor):\n1 km² = (0.621)² mi² = 0.3856 mi²\n180 km² × 0.3856 = 69.4 mi²\n\nStep 2 — Density:\n450,000 ÷ 69.4 ≈ 6,484 → ≈ 6,480\n\nAnswer: C) 6,480\n\n💡 You must SQUARE the linear conversion factor for area. Using 0.621 instead of 0.621² is wrong.`,
    },
    {
      id: 4, type: "spr", category: "Dosage · Weight Conversion", difficulty: "★★★",
      question: `A doctor prescribes medication at 15 mg per kilogram of body weight, taken in 3 equal doses per day. If the patient weighs 176 pounds and 1 kg = 2.2 pounds, how many milligrams is each dose?`,
      correctValue: 400, tolerance: 0, unit: "mg",
      explanation: `Step 1 — Convert weight: 176 ÷ 2.2 = 80 kg\nStep 2 — Total daily dose: 80 × 15 = 1,200 mg\nStep 3 — Per dose: 1,200 ÷ 3 = 400 mg\n\nAnswer: 400 mg\n\n💡 Three-step chain: convert unit → rate × weight → divide by frequency.`,
    },
    {
      id: 5, type: "spr", category: "Energy · Power · Time", difficulty: "★★☆",
      question: `A solar panel produces 250 watts of power. How many kilowatt-hours of energy does it produce in 6 hours?`,
      correctValue: 1.5, tolerance: 0.01, unit: "kWh",
      explanation: `Step 1 — Energy in watt-hours:\n250 W × 6 h = 1,500 Wh\n\nStep 2 — Convert:\n1,500 Wh ÷ 1,000 = 1.5 kWh\n\nAnswer: 1.5 kWh\n\n💡 Energy = Power × Time. Then W → kW (÷ 1,000).`,
    },
    {
      id: 6, type: "mc", category: "Compound Interest", difficulty: "★★★",
      question: `$5,000 is invested at 6% annual interest, compounded annually. What is the value after 3 years, to the nearest dollar?`,
      options: ["A) $5,450", "B) $5,618", "C) $5,900", "D) $5,955"], answer: 3,
      explanation: `Year 1: $5,000 × 1.06 = $5,300\nYear 2: $5,300 × 1.06 = $5,618\nYear 3: $5,618 × 1.06 = $5,955.08 ≈ $5,955\n\nOr: 5,000 × (1.06)³ = $5,955\n\nAnswer: D) $5,955\n\n💡 Option B ($5,618) is the Year 2 value — a trap for students who stop one year early.`,
    },
    {
      id: 7, type: "spr", category: "Volume · Rate · Time", difficulty: "★★★",
      question: `A pool is 20 m long, 10 m wide, and 1.5 m deep. Water is pumped in at 500 liters per minute. If 1 m³ = 1,000 liters, how many hours to fill the pool?`,
      correctValue: 10, tolerance: 0, unit: "hours",
      explanation: `Step 1 — Volume: 20 × 10 × 1.5 = 300 m³\nStep 2 — In liters: 300 × 1,000 = 300,000 L\nStep 3 — Time: 300,000 ÷ 500 = 600 min\nStep 4 — In hours: 600 ÷ 60 = 10 hours\n\nAnswer: 10 hours\n\n💡 Four conversion steps in one problem — the signature June 2026 pattern.`,
    },
    {
      id: 8, type: "mc", category: "Data · Rate · Distance", difficulty: "★★★",
      question: `Of 800 surveyed employees, 35% commute by car. Each car commuter travels 24 km one way. They commute to and from work 5 days per week. What is the total weekly distance for ALL car commuters?`,
      options: ["A) 33,600 km", "B) 67,200 km", "C) 134,400 km", "D) 13,440 km"], answer: 1,
      explanation: `Step 1 — Car commuters: 800 × 0.35 = 280\nStep 2 — Weekly per person: 24 × 2 × 5 = 240 km\nStep 3 — Total: 280 × 240 = 67,200 km\n\nAnswer: B) 67,200 km\n\n💡 Don't forget ×2 for the round trip. Option A (33,600) is the one-way trap.`,
    },
    {
      id: 9, type: "spr", category: "Map Scale · Area", difficulty: "★★★",
      question: `A map has a scale of 1 cm : 2.5 km. A rectangular lake measures 3 cm by 4 cm on the map. What is the actual area of the lake in square kilometers?`,
      correctValue: 75, tolerance: 0, unit: "km²",
      explanation: `Step 1 — Convert each dimension:\n3 cm × 2.5 = 7.5 km\n4 cm × 2.5 = 10 km\n\nStep 2 — Area: 7.5 × 10 = 75 km²\n\nAnswer: 75 km²\n\n💡 Apply the scale to EACH dimension, then multiply. Don't apply it only once.`,
    },
    {
      id: 10, type: "mc", category: "Combined Rates · Unit Mismatch", difficulty: "★★★",
      question: `Pipe A fills a tank at 8 liters per minute. Pipe B fills the same tank at 360 liters per hour. Both pipes run for 30 minutes. How many liters are delivered?`,
      options: ["A) 360", "B) 420", "C) 540", "D) 600"], answer: 1,
      explanation: `Step 1 — Convert Pipe B: 360 L/hr ÷ 60 = 6 L/min\nStep 2 — Combined: 8 + 6 = 14 L/min\nStep 3 — In 30 min: 14 × 30 = 420 L\n\nAnswer: B) 420\n\n💡 The trap is the unit mismatch (L/min vs L/hr). Convert to the same unit FIRST.`,
    },
  ],
};

const set3 = {
  id: "june2026-set3",
  label: "June 2026 · SET 3",
  title: "Multi-Step & Reasoning",
  subtitle: "Work rates · Dilution · Density · Average speed",
  accent: "#264653",
  catColors: {
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
  },
  problems: [
    {
      id: 1, type: "spr", category: "Work Rate · Time Conversion", difficulty: "★★★",
      question: `Worker A can paint a room in 6 hours. Worker B can paint the same room in 4 hours. If they work together, how many minutes will it take to paint the room?`,
      correctValue: 144, tolerance: 0, unit: "minutes",
      explanation: `Rate A = 1/6 room per hour\nRate B = 1/4 room per hour\n\nCombined rate = 1/6 + 1/4 = 2/12 + 3/12 = 5/12 per hour\n\nTime = 1 ÷ (5/12) = 12/5 = 2.4 hours\n\nConvert: 2.4 × 60 = 144 minutes\n\nAnswer: 144 minutes\n\n💡 Add RATES, not times. Then convert hours → minutes at the end.`,
    },
    {
      id: 2, type: "mc", category: "Dilution · Concentration", difficulty: "★★★",
      question: `A scientist has 800 mL of a 30% acid solution. She adds pure water to create a 20% acid solution. How many mL of water must she add?`,
      options: ["A) 200", "B) 300", "C) 400", "D) 600"], answer: 2,
      explanation: `The amount of acid stays constant:\nAcid = 800 × 0.30 = 240 mL\n\nAfter adding w mL of water:\n240 / (800 + w) = 0.20\n240 = 0.20(800 + w)\n240 = 160 + 0.20w\n80 = 0.20w\nw = 400 mL\n\nVerify: 240 / 1,200 = 0.20 = 20% ✓\n\nAnswer: C) 400\n\n💡 Key insight: adding water changes the total but NOT the acid amount.`,
    },
    {
      id: 3, type: "spr", category: "Pace → Speed · Dual Conversion", difficulty: "★★★",
      question: `A runner has a pace of 7 minutes and 30 seconds per mile. Using 1 mile = 1.6 km, what is the runner's speed in kilometers per hour?`,
      correctValue: 12.8, tolerance: 0.05, unit: "km/h",
      explanation: `Step 1 — Convert pace to decimal:\n7 min 30 sec = 7.5 min per mile\n\nStep 2 — Pace → speed:\nSpeed = 60 min ÷ 7.5 min/mile = 8 mph\n\nStep 3 — Convert to km/h:\n8 × 1.6 = 12.8 km/h\n\nAnswer: 12.8 km/h\n\n💡 Pace (time/distance) is the INVERSE of speed (distance/time).`,
    },
    {
      id: 4, type: "spr", category: "Proportional Reasoning · Weight", difficulty: "★★★",
      question: `A recipe for 12 cookies requires 1.5 cups of flour. If 1 cup of flour weighs 125 grams, how many grams of flour are needed to make 80 cookies?`,
      correctValue: 1250, tolerance: 0, unit: "grams",
      explanation: `Step 1 — Scale the recipe:\n(80 / 12) × 1.5 = 10 cups\n\nStep 2 — Convert to grams:\n10 × 125 = 1,250 grams\n\nAnswer: 1,250 grams\n\n💡 Proportion first (cookies → cups), then unit conversion (cups → grams).`,
    },
    {
      id: 5, type: "mc", category: "Exponential · Time Unit", difficulty: "★★★",
      question: `A bacteria culture doubles every 90 minutes. Starting with 200 bacteria, how many will there be after 6 hours?`,
      options: ["A) 1,600", "B) 3,200", "C) 6,400", "D) 12,800"], answer: 1,
      explanation: `Step 1 — Convert to same unit:\n6 hours = 360 minutes\n\nStep 2 — Number of doublings:\n360 ÷ 90 = 4 doublings\n\nStep 3 — Final count:\n200 × 2⁴ = 200 × 16 = 3,200\n\nAnswer: B) 3,200\n\n💡 The time mismatch (hours vs minutes) is the trap.`,
    },
    {
      id: 6, type: "spr", category: "Density · Volume · Mass", difficulty: "★★★",
      question: `An aluminum block measures 10 cm × 5 cm × 4 cm. Aluminum has a density of 2.7 g/cm³. What is the mass of the block in kilograms?`,
      correctValue: 0.54, tolerance: 0.005, unit: "kg",
      explanation: `Step 1 — Volume: 10 × 5 × 4 = 200 cm³\nStep 2 — Mass in grams: 200 × 2.7 = 540 g\nStep 3 — Convert: 540 ÷ 1,000 = 0.54 kg\n\nAnswer: 0.54 kg\n\n💡 Density = mass/volume → mass = density × volume. Then g → kg (÷ 1,000).`,
    },
    {
      id: 7, type: "mc", category: "Blueprint Scale · Area", difficulty: "★★★",
      question: `A blueprint uses a scale of 1 inch : 4 feet. A room on the blueprint measures 3.5 inches by 5 inches. What is the actual area of the room in square feet?`,
      options: ["A) 70", "B) 140", "C) 280", "D) 560"], answer: 2,
      explanation: `Step 1 — Convert each dimension:\n3.5 in × 4 = 14 feet\n5 in × 4 = 20 feet\n\nStep 2 — Area: 14 × 20 = 280 sq ft\n\nAnswer: C) 280\n\n💡 Scale the dimensions FIRST, then find area. Don't multiply the blueprint area by 4 (that only works for length, not area).`,
    },
    {
      id: 8, type: "spr", category: "Average Speed · Segments", difficulty: "★★★",
      question: `A driver travels 120 km at 60 km/h, then 80 km at 40 km/h. What is the average speed for the entire trip, in km/h?`,
      correctValue: 50, tolerance: 0, unit: "km/h",
      explanation: `Average speed = total distance ÷ total time\n\nSegment 1: 120 ÷ 60 = 2 hours\nSegment 2: 80 ÷ 40 = 2 hours\n\nTotal: 200 km ÷ 4 hours = 50 km/h\n\nAnswer: 50 km/h\n\n💡 Average speed ≠ average of the speeds. Always use total distance ÷ total time.`,
    },
    {
      id: 9, type: "mc", category: "Profit · Break-Even", difficulty: "★★★",
      question: `Cost to produce x units: C(x) = 2,500 + 8x. Revenue from selling x units: R(x) = 15x. What is the minimum number of units to sell for profit to exceed $2,000?`,
      options: ["A) 358", "B) 500", "C) 643", "D) 750"], answer: 2,
      explanation: `Profit = R − C = 15x − (2,500 + 8x) = 7x − 2,500\n\n7x − 2,500 > 2,000\n7x > 4,500\nx > 642.86\n\nSince x must be a whole number: x ≥ 643\n\nAnswer: C) 643\n\n💡 Option A (358) is break-even — a different question. Read carefully!`,
    },
    {
      id: 10, type: "spr", category: "Exponential Decay · Percent", difficulty: "★★★",
      question: `A tank contains 800 liters. It loses 2% of its CURRENT volume every hour. How many liters remain after 3 hours? Round to the nearest whole number.`,
      correctValue: 753, tolerance: 0.5, unit: "liters",
      explanation: `This is exponential decay:\n\n800 × (0.98)³ = 800 × 0.941192 ≈ 753\n\nOr step by step:\nAfter 1 hr: 800 × 0.98 = 784\nAfter 2 hrs: 784 × 0.98 = 768.32\nAfter 3 hrs: 768.32 × 0.98 ≈ 753\n\nAnswer: 753 liters\n\n💡 "2% of CURRENT volume" = exponential. "2% of ORIGINAL" = linear. Read carefully!`,
    },
  ],
};

export const SETS = [set2, set3];

export const getSet = (id) => SETS.find((s) => s.id === id);

// Helper: is a grid-in (SPR) answer correct?
export const checkSpr = (prob, input) => {
  const n = parseFloat(String(input).replace(/,/g, ""));
  return !isNaN(n) && Math.abs(n - prob.correctValue) <= (prob.tolerance || 0.01);
};

// Helper: correct-answer label for display ("C) 400" or "144 minutes")
export const correctLabel = (p) =>
  p.type === "mc" ? p.options[p.answer] : `${p.correctValue}${p.unit ? " " + p.unit : ""}`;
