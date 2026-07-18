import { useState, useEffect, useRef } from "react";
import { checkSpr } from "../data/sets.js";
import { recordAttempt, resetSet, useStore, toggleBookmark } from "../store.js";

const TIME_PRESETS = [5, 10, 15, 20, 25, 30, 45, 60]; // 분 단위 선택지
const TIME_LIMIT_KEY = "math-platform-time-limit";
const NO_LIMIT = "none";

// 학생이 마지막으로 고른 제한 시간(분)을 기억해서 다음 세트에도 이어서 씀
function loadTimeLimit() {
  const v = localStorage.getItem(TIME_LIMIT_KEY);
  if (v === NO_LIMIT) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n * 60 : 15 * 60;
}
function saveTimeLimit(seconds) {
  localStorage.setItem(TIME_LIMIT_KEY, seconds === null ? NO_LIMIT : String(seconds / 60));
}

function OptionButton({ opt, isRevealed, isAnswer, isSelected, onSelect }) {
  let bg = "#F7F7F7", border = "1px solid #ECECEC", color = "#333";
  if (isRevealed && isAnswer) { bg = "#E8F5E9"; border = "1.5px solid #66BB6A"; color = "#2E7D32"; }
  else if (isRevealed && isSelected && !isAnswer) { bg = "#FFEBEE"; border = "1.5px solid #EF5350"; color = "#C62828"; }
  else if (!isRevealed && isSelected) { bg = "#E3F2FD"; border = "1.5px solid #64B5F6"; color = "#1565C0"; }
  return (
    <button onClick={onSelect} style={{ background: bg, border, borderRadius: 10, padding: "10px 14px", fontSize: 14, color, textAlign: "left", cursor: isRevealed ? "default" : "pointer", fontWeight: isRevealed && isAnswer ? 600 : 400, fontFamily: "inherit" }}>
      {opt}
    </button>
  );
}

// For virtual review sets, problems carry _sourceSetId / _originalId so that
// correct answers write back to the original set record.
function effectiveSetId(set, p) { return p._sourceSetId || set.id; }
function effectiveProblem(p) { return p._originalId ? { ...p, id: p._originalId } : p; }

export default function Quiz({ set, onBack, teacherMode = false }) {
  const snapshot = useStore();

  const isRetrySet = set.id === "__wrong-review__";
  const bookmarks = snapshot.bookmarks?.[set.id] || {};

  const [selected, setSelected] = useState({});
  const [sprInputs, setSprInputs] = useState({});
  const [revealed, setRevealed] = useState(() =>
    teacherMode ? Object.fromEntries(set.problems.map((p) => [p.id, true])) : {}
  );
  const [score, setScore] = useState(null);
  const [redeemedCount, setRedeemedCount] = useState(0);
  const [redeemedIds, setRedeemedIds] = useState({});
  const [showKey, setShowKey] = useState(teacherMode);
  const [timeLimit, setTimeLimit] = useState(() => (teacherMode ? null : loadTimeLimit()));
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [timesUp, setTimesUp] = useState(false);
  const scoreAllRef = useRef(null);

  const changeTimeLimit = (minutesOrNull) => {
    const seconds = minutesOrNull === null ? null : minutesOrNull * 60;
    saveTimeLimit(seconds);
    setTimeLimit(seconds);
    setTimeLeft(seconds);
    setTimesUp(false);
  };

  const getAnswer = (p) => (p.type === "mc" ? selected[p.id] : sprInputs[p.id] || "");
  const handleSelect = (pid, oi) => { if (!revealed[pid]) setSelected((prev) => ({ ...prev, [pid]: oi })); };
  const handleSprInput = (pid, v) => { if (!revealed[pid]) setSprInputs((prev) => ({ ...prev, [pid]: v })); };

  // 타이머: teacherMode가 아니고 제한 시간이 설정된 경우, 채점 전까지만 카운트다운
  useEffect(() => {
    if (teacherMode || score !== null || timeLeft === null || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return null;
        if (t <= 1) {
          clearInterval(id);
          setTimesUp(true);
          scoreAllRef.current?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [teacherMode, score, timeLimit]);

  const isAnswered = (p) => (p.type === "mc" ? selected[p.id] !== undefined : (sprInputs[p.id] || "") !== "");
  const isCorrect = (p) => (p.type === "mc" ? (teacherMode ? false : selected[p.id] === p.answer) : checkSpr(p, sprInputs[p.id] || ""));

  // Was this problem previously wrong in its source set (before this attempt)?
  const wasPrevWrong = (p) =>
    !!p._sourceSetId &&
    snapshot.attempts[p._sourceSetId]?.[p._originalId]?.correct === false;

  const handleReveal = (pid) => {
    const p = set.problems.find((x) => x.id === pid);
    if (!teacherMode) {
      const prevWrong = wasPrevWrong(p);
      const correct = recordAttempt(effectiveSetId(set, p), effectiveProblem(p), getAnswer(p));
      if (prevWrong && correct) setRedeemedIds((prev) => ({ ...prev, [pid]: true }));
    }
    setRevealed((prev) => ({ ...prev, [pid]: true }));
  };

  const scoreAll = () => {
    const nr = {};
    let n = 0, redeemed = 0;
    const newRedeemedIds = {};
    set.problems.forEach((p) => {
      nr[p.id] = true;
      const prevWrong = wasPrevWrong(p);
      const correct = recordAttempt(effectiveSetId(set, p), effectiveProblem(p), getAnswer(p));
      if (correct) n += 1;
      if (prevWrong && correct) { redeemed += 1; newRedeemedIds[p.id] = true; }
    });
    setRevealed(nr);
    setScore(n);
    setRedeemedCount(redeemed);
    setRedeemedIds(newRedeemedIds);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  scoreAllRef.current = scoreAll;

  const reset = () => {
    setSelected({}); setSprInputs({}); setRevealed({}); setScore(null);
    setRedeemedCount(0); setRedeemedIds({}); setShowKey(false);
    const lim = teacherMode ? null : loadTimeLimit();
    setTimeLimit(lim);
    setTimeLeft(lim);
    setTimesUp(false);
    // Don't reset the store for virtual review sets — original records should persist.
    if (!set.id.startsWith("__")) resetSet(set.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const answeredCount = set.problems.filter((p) => revealed[p.id]).length;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 16px 60px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#888", fontSize: 14, cursor: "pointer", padding: "8px 0", marginBottom: 8, fontFamily: "inherit" }}>← 대시보드로</button>

      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <div style={{ display: "inline-block", background: set.accent, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: "4px 12px", borderRadius: 20, marginBottom: 12, textTransform: "uppercase" }}>
          {set.label}{teacherMode ? " · 선생님 미리보기" : ""}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>{set.title}</h1>
        <p style={{ fontSize: 13, color: "#777", margin: 0 }}>{set.subtitle}</p>

        {!teacherMode && (
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {score === null && (
              <select
                value={timeLimit === null ? NO_LIMIT : String(timeLimit / 60)}
                onChange={(e) => changeTimeLimit(e.target.value === NO_LIMIT ? null : parseInt(e.target.value, 10))}
                style={{ fontSize: 13, fontWeight: 600, color: "#555", background: "#F5F5F5", border: "1.5px solid #E0E0E0", borderRadius: 12, padding: "8px 12px", fontFamily: "inherit", cursor: "pointer" }}
              >
                {TIME_PRESETS.map((m) => (
                  <option key={m} value={m}>{m}분</option>
                ))}
                <option value={NO_LIMIT}>제한 없음</option>
              </select>
            )}

            {timeLeft !== null && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: timesUp ? "#FFEBEE" : timeLeft <= 120 ? "#FFF3E0" : "#F5F5F5", border: `1.5px solid ${timesUp ? "#EF5350" : timeLeft <= 120 ? "#FFA726" : "#E0E0E0"}`, borderRadius: 12, padding: "8px 20px" }}>
                <span style={{ fontSize: 13, color: timesUp ? "#C62828" : timeLeft <= 120 ? "#E65100" : "#555", fontWeight: 600 }}>
                  {timesUp ? "⏰ 시간 종료!" : "⏱"}
                </span>
                {!timesUp && (
                  <span style={{ fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: timeLeft <= 120 ? "#E65100" : "#1a1a1a", letterSpacing: 1 }}>
                    {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {timesUp && score !== null && (
        <div style={{ background: "#FFEBEE", border: "1.5px solid #EF5350", borderRadius: 12, padding: "12px 20px", marginBottom: 16, textAlign: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#C62828" }}>⏰ 시간 종료 — 자동 채점되었습니다</span>
        </div>
      )}

      {score !== null && (
        isRetrySet ? (
          <div style={{ background: redeemedCount > 0 ? "#E8F5E9" : "#FFF8E1", border: `1px solid ${redeemedCount > 0 ? "#A5D6A7" : "#FFE082"}`, borderRadius: 12, padding: "20px", marginBottom: 24, textAlign: "center" }}>
            {redeemedCount > 0 ? (
              <>
                <div style={{ fontSize: 36, marginBottom: 6 }}>🎉</div>
                <p style={{ fontSize: 22, fontWeight: 700, color: "#2E7D32", margin: "0 0 4px" }}>{redeemedCount}문제 굳굳!</p>
                <p style={{ fontSize: 13, color: "#666", margin: 0 }}>총 {score} / {set.problems.length} 정답</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 32, marginBottom: 6 }}>😅</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#8a6d00", margin: "0 0 4px" }}>아직 만회 못했어요</p>
                <p style={{ fontSize: 13, color: "#666", margin: 0 }}>포기하지 말고 다시 도전해봐요! ({score}/{set.problems.length})</p>
              </>
            )}
          </div>
        ) : (
          <div style={{ background: score >= 7 ? "#E8F5E9" : score >= 4 ? "#FFF8E1" : "#FFEBEE", border: `1px solid ${score >= 7 ? "#A5D6A7" : score >= 4 ? "#FFE082" : "#EF9A9A"}`, borderRadius: 12, padding: "16px 20px", marginBottom: 24, textAlign: "center" }}>
            <span style={{ fontSize: 28, fontWeight: 700 }}>{score}</span>
            <span style={{ fontSize: 16, color: "#666" }}> / {set.problems.length}</span>
          </div>
        )
      )}

      {set.problems.map((p, idx) => {
        const isR = revealed[p.id];
        const cor = isCorrect(p);
        const cc = set.catColors[p.category] || "#666";
        const isRedeemed = !!redeemedIds[p.id];

        return (
          <div key={p.id} style={{ background: "#fff", borderRadius: 14, marginBottom: 20, padding: "20px 20px 16px", border: isR && !teacherMode ? `1.5px solid ${cor ? "#66BB6A" : "#EF5350"}` : "1px solid #E8E8E8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: cc, background: cc + "14", padding: "3px 10px", borderRadius: 20 }}>{p.category}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: p.type === "spr" ? "#E63946" : "#457B9D", background: p.type === "spr" ? "#FFEBEE" : "#E3F2FD", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase" }}>{p.type === "spr" ? "Grid-In" : "MC"}</span>
                {!teacherMode && (
                  <button
                    onClick={() => toggleBookmark(effectiveSetId(set, p), p._originalId || p.id)}
                    title={bookmarks[p.id] ? "북마크 해제" : "북마크에 추가"}
                    style={{ background: bookmarks[p.id] ? "#FFF3CD" : "none", border: bookmarks[p.id] ? "1px solid #FFD54F" : "1px solid transparent", cursor: "pointer", fontSize: 14, padding: "2px 7px", lineHeight: 1.5, borderRadius: 6, opacity: bookmarks[p.id] ? 1 : 0.4, transition: "all .15s" }}
                  >
                    🔖
                  </button>
                )}
              </div>
            </div>

            <p style={{ fontSize: 13, color: "#999", margin: "0 0 4px", fontWeight: 600 }}>Q{idx + 1} <span style={{ color: "#ccc" }}>{p.difficulty}</span></p>
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
                  <input type="text" inputMode="decimal" value={teacherMode ? "" : sprInputs[p.id] || ""} onChange={(e) => handleSprInput(p.id, e.target.value)} disabled={isR} placeholder={teacherMode ? `정답: ${p.correctValue}` : "Your answer"} style={{ flex: 1, padding: "10px 14px", fontSize: 16, fontWeight: 600, fontFamily: "inherit", border: isR && !teacherMode ? `1.5px solid ${cor ? "#66BB6A" : "#EF5350"}` : "1.5px solid #ddd", borderRadius: 10, background: isR && !teacherMode ? (cor ? "#E8F5E9" : "#FFEBEE") : "#fff", outline: "none", color: "#1a1a1a" }} />
                  {p.unit && <span style={{ fontSize: 14, color: "#888", fontWeight: 500 }}>{p.unit}</span>}
                </div>
                {isR && !teacherMode && !cor && <p style={{ fontSize: 13, color: "#E53935", margin: "8px 0 0", fontWeight: 600 }}>Correct: {p.correctValue} {p.unit}</p>}
              </div>
            )}

            {!isR && isAnswered(p) && (
              <button onClick={() => handleReveal(p.id)} style={{ background: "none", border: "1px solid #ccc", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>Show Solution</button>
            )}

            {isR && (
              <div style={{ background: isRedeemed ? "#F1F8E9" : "#FAFAFA", borderRadius: 10, padding: 16, marginTop: 8, border: isRedeemed ? "1px solid #C5E1A5" : "none" }}>
                {!teacherMode && (
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, margin: "0 0 10px", color: cor ? "#43A047" : "#E53935" }}>
                    {isRedeemed ? "🎉 굳굳! 정답입니다" : cor ? "✓ CORRECT" : "✗ INCORRECT"}
                  </p>
                )}
                <pre style={{ fontSize: 13, color: "#555", lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{p.explanation}</pre>
              </div>
            )}
          </div>
        );
      })}

      {!teacherMode && (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", padding: "12px 0 16px" }}>
          {score === null && (
            <button onClick={scoreAll} style={{ background: isRetrySet ? "#E53935" : "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {isRetrySet ? `만회 도전! (${answeredCount}/${set.problems.length})` : `Score All (${answeredCount}/${set.problems.length})`}
            </button>
          )}
          <button onClick={() => setShowKey(!showKey)} style={{ background: "#fff", color: "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{showKey ? "Hide" : "Answer Key"}</button>
          <button onClick={reset} style={{ background: "#fff", color: "#666", border: "1px solid #ddd", borderRadius: 10, padding: "12px 28px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Reset</button>
        </div>
      )}

      {showKey && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E8E8", padding: 20, marginBottom: 40 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Answer Key — {set.label}</h3>
          <div style={{ display: "grid", gap: 6 }}>
            {set.problems.map((p, idx) => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "36px 56px 64px 1fr", alignItems: "center", gap: 8, padding: "8px 12px", background: "#FAFAFA", borderRadius: 8, fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>Q{idx + 1}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: p.type === "spr" ? "#E63946" : "#457B9D", background: p.type === "spr" ? "#FFEBEE" : "#E3F2FD", padding: "2px 6px", borderRadius: 4, textAlign: "center" }}>{p.type.toUpperCase()}</span>
                <span style={{ fontWeight: 700, color: "#1982C4", background: "#E3F2FD", padding: "2px 8px", borderRadius: 6, textAlign: "center" }}>{p.type === "mc" ? p.options[p.answer].split(")")[0] : p.correctValue}</span>
                <span style={{ color: "#888" }}>{p.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
