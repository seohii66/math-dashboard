// Problem sets are generated from DSAT_Practice_Set/*.jsx by `npm run extract`
// into problemSets.json. To add/update sets: edit the .jsx files (or drop in a
// new one) and re-run `npm run extract` — no changes needed here.
import problemSets from "./problemSets.json";

export const SETS = problemSets;

export const getSet = (id) => SETS.find((s) => s.id === id);

// Is a grid-in (SPR) answer correct?
export const checkSpr = (prob, input) => {
  const n = parseFloat(String(input).replace(/,/g, ""));
  return !isNaN(n) && Math.abs(n - prob.correctValue) <= (prob.tolerance || 0.01);
};

// Correct-answer label for display ("C) 400" or "144 minutes").
export const correctLabel = (p) =>
  p.type === "mc" ? p.options[p.answer] : `${p.correctValue}${p.unit ? " " + p.unit : ""}`;
