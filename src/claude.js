// Claude API wrapper for generating similar problems.
// Requires VITE_ANTHROPIC_API_KEY in .env
// Calling from the browser is intentional — set the dangerous-request header to acknowledge.

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const CACHE_PREFIX = "odap-similar-v2-";

export const hasApiKey = () => !!API_KEY;

function cacheKey(setId, problemId) {
  return `${CACHE_PREFIX}${setId}::${problemId}`;
}

function loadCache(setId, problemId) {
  try {
    const raw = localStorage.getItem(cacheKey(setId, problemId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveCache(setId, problemId, problems) {
  try {
    localStorage.setItem(cacheKey(setId, problemId), JSON.stringify(problems));
  } catch {}
}

export async function generateSimilarProblems(setId, problem) {
  const cached = loadCache(setId, problem.id);
  if (cached) return cached;

  if (!API_KEY) throw new Error("VITE_ANTHROPIC_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.");

  const answerText =
    problem.type === "mc"
      ? `Options:\n${problem.options.map((o, i) => `${i}: ${o}`).join("\n")}\nCorrect option index: ${problem.answer}`
      : `Correct value: ${problem.correctValue}${problem.unit ? " " + problem.unit : ""}`;

  const prompt = `You are a math tutor creating SAT practice problems. Generate exactly 3 new problems similar to the original below. Keep the same topic, skill, and difficulty. Use realistic numbers different from the original.

Return ONLY a valid JSON array — no markdown, no extra text. Use this shape:

For multiple-choice:
{ "type": "mc", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": 0, "explanation": "Step 1 — ...\nStep 2 — ...\n\nAnswer: ..." }

For grid-in:
{ "type": "spr", "question": "...", "correctValue": 42, "unit": "kg", "explanation": "Step 1 — ...\n\nAnswer: 42" }

Original problem:
Type: ${problem.type}
Category: ${problem.category}
Question: ${problem.question}
${answerText}
Explanation: ${problem.explanation}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-request-header": "true",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API 오류 ${res.status}`);
  }

  const data = await res.json();
  const text = data.content[0]?.text?.trim() || "";

  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("AI 응답을 파싱할 수 없습니다. 다시 시도해보세요.");

  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) throw new Error("유효하지 않은 응답 형식");

  const result = parsed.slice(0, 3).map((p, i) => ({
    ...p,
    id: `gen-${setId}-${problem.id}-${i}`,
    category: problem.category,
    difficulty: problem.difficulty || "★★",
    tolerance: p.tolerance ?? 0.05,
  }));

  saveCache(setId, problem.id, result);
  return result;
}

export function clearSimilarCache(setId, problemId) {
  try { localStorage.removeItem(cacheKey(setId, problemId)); } catch {}
}
