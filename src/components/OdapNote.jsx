import { useState } from "react";
import { useStore, allWrongProblems, toggleBookmark } from "../store.js";
import { correctLabel, checkSpr } from "../data/sets.js";
import { generateSimilarProblems, clearSimilarCache, hasApiKey } from "../claude.js";

// ── Mini interactive quiz for a single generated problem ─────────────────────
function MiniQuiz({ problem, catColor }) {
  const [selected, setSelected] = useState(null);
  const [sprInput, setSprInput] = useState("");
  const [revealed, setRevealed] = useState(false);

  const answered = problem.type === "mc" ? selected !== null : sprInput.trim() !== "";
  const correct =
    problem.type === "mc"
      ? selected === problem.answer
      : checkSpr(problem, sprInput);

  const reset = () => { setSelected(null); setSprInput(""); setRevealed(false); };

  return (
    <div style={{ background: "#FAFAFA", borderRadius: 12, padding: 16, marginBottom: 10, border: revealed ? `1.5px solid ${correct ? "#66BB6A" : "#EF5350"}` : "1px solid #E8E8E8" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: catColor, background: catColor + "18", padding: "2px 8px", borderRadius: 20 }}>{problem.category}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: problem.type === "spr" ? "#E63946" : "#457B9D", background: problem.type === "spr" ? "#FFEBEE" : "#E3F2FD", padding: "2px 7px", borderRadius: 4 }}>{problem.type === "spr" ? "Grid-In" : "MC"}</span>
      </div>

      <pre style={{ fontSize: 13, color: "#2a2a2a", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "0 0 12px" }}>{problem.question}</pre>

      {problem.type === "mc" ? (
        <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
          {problem.options.map((opt, i) => {
            let bg = "#fff", border = "1px solid #E0E0E0", color = "#333";
            if (revealed && i === problem.answer) { bg = "#E8F5E9"; border = "1.5px solid #66BB6A"; color = "#2E7D32"; }
            else if (revealed && i === selected && i !== problem.answer) { bg = "#FFEBEE"; border = "1.5px solid #EF5350"; color = "#C62828"; }
            else if (!revealed && i === selected) { bg = "#E3F2FD"; border = "1.5px solid #64B5F6"; color = "#1565C0"; }
            return (
              <button key={i} onClick={() => !revealed && setSelected(i)} style={{ background: bg, border, borderRadius: 8, padding: "9px 13px", fontSize: 13, color, textAlign: "left", cursor: revealed ? "default" : "pointer", fontFamily: "inherit" }}>
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <input
            type="text"
            inputMode="decimal"
            value={sprInput}
            onChange={(e) => !revealed && setSprInput(e.target.value)}
            disabled={revealed}
            placeholder="Your answer"
            style={{ flex: 1, padding: "9px 12px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", border: revealed ? `1.5px solid ${correct ? "#66BB6A" : "#EF5350"}` : "1.5px solid #ddd", borderRadius: 8, background: revealed ? (correct ? "#E8F5E9" : "#FFEBEE") : "#fff", outline: "none" }}
          />
          {problem.unit && <span style={{ fontSize: 13, color: "#888" }}>{problem.unit}</span>}
        </div>
      )}

      {!revealed && answered && (
        <button onClick={() => setRevealed(true)} style={{ background: "none", border: "1px solid #ccc", borderRadius: 8, padding: "7px 14px", fontSize: 12, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>
          정답 확인
        </button>
      )}

      {revealed && (
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 700, margin: "0 0 8px", color: correct ? "#43A047" : "#E53935" }}>
            {correct ? "✓ 정답!" : `✗ 오답 — 정답: ${correctLabel(problem)}`}
          </p>
          <pre style={{ fontSize: 12, color: "#555", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "0 0 8px" }}>{problem.explanation}</pre>
          <button onClick={reset} style={{ background: "none", border: "none", color: "#888", fontSize: 12, cursor: "pointer", padding: 0 }}>↺ 다시 풀기</button>
        </div>
      )}
    </div>
  );
}

// ── Similar problems panel for one wrong problem ──────────────────────────────
function SimilarPanel({ setId, problem, catColor }) {
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [similar, setSimilar] = useState(null);
  const [error, setError] = useState("");

  const generate = async () => {
    setState("loading");
    setError("");
    try {
      const result = await generateSimilarProblems(setId, problem);
      setSimilar(result);
      setState("done");
    } catch (e) {
      setError(e.message);
      setState("error");
    }
  };

  const regenerate = () => {
    clearSimilarCache(setId, problem.id);
    setSimilar(null);
    generate();
  };

  if (state === "idle") {
    return (
      <button onClick={generate} style={{ background: "#EEF4FF", border: "1px solid #C5D8FF", color: "#1565C0", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>
        ✨ 유사 문제 3개 생성
      </button>
    );
  }

  if (state === "loading") {
    return (
      <div style={{ marginTop: 10, padding: "12px 16px", background: "#F8F9FF", border: "1px solid #C5D8FF", borderRadius: 10, fontSize: 13, color: "#666" }}>
        <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span> 유사 문제를 생성하고 있어요…
      </div>
    );
  }

  if (state === "error") {
    return (
      <div style={{ marginTop: 10, padding: "10px 14px", background: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: 10, fontSize: 12, color: "#C62828" }}>
        ⚠ {error}
        <button onClick={generate} style={{ marginLeft: 10, background: "none", border: "none", color: "#1565C0", cursor: "pointer", fontSize: 12 }}>다시 시도</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1565C0" }}>✨ AI 유사 문제</span>
        <button onClick={regenerate} style={{ background: "none", border: "none", color: "#888", fontSize: 11, cursor: "pointer" }}>↺ 새로 생성</button>
      </div>
      {similar.map((p) => (
        <MiniQuiz key={p.id} problem={p} catColor={catColor} />
      ))}
    </div>
  );
}

// ── Main OdapNote component ───────────────────────────────────────────────────
export default function OdapNote({ onBack, onOpenSet }) {
  const snapshot = useStore();
  const wrong = allWrongProblems(snapshot);
  const [filter, setFilter] = useState("all"); // all | mc | spr
  const [expanded, setExpanded] = useState({});

  const filtered = filter === "all" ? wrong : wrong.filter(({ problem }) => problem.type === filter);

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const apiReady = hasApiKey();

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "16px 16px 80px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <button onClick={onBack} style={{ background: "none", border: "none", color: "#888", fontSize: 14, cursor: "pointer", padding: "8px 0", marginBottom: 8, fontFamily: "inherit" }}>← 대시보드로</button>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>📒 오답노트</h1>
        <p style={{ fontSize: 13, color: "#777", margin: 0 }}>틀린 문제 {wrong.length}개 · 유사 문제를 생성해 집중 연습하세요</p>
      </div>

      {!apiReady && (
        <div style={{ background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 12, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: "#5D4037" }}>
          <strong>유사 문제 생성을 사용하려면</strong> <code>.env</code> 파일에 <code>VITE_ANTHROPIC_API_KEY=sk-ant-…</code> 를 추가하고 앱을 재시작하세요.
        </div>
      )}

      {wrong.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <p style={{ fontSize: 15 }}>아직 틀린 문제가 없어요!</p>
        </div>
      ) : (
        <>
          {/* Filter */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[["all", "전체"], ["mc", "MC만"], ["spr", "Grid-In만"]].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{ border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20, background: filter === val ? "#1a1a1a" : "#EEF0F3", color: filter === val ? "#fff" : "#666" }}>
                {label}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#aaa", alignSelf: "center" }}>{filtered.length}문제</span>
          </div>

          {filtered.map(({ set, problem, attempt }, idx) => {
            const key = `${set.id}-${problem.id}`;
            const isOpen = !!expanded[key];
            const catColor = set.catColors[problem.category] || "#888";
            const bookmarked = !!snapshot.bookmarks?.[set.id]?.[problem.id];

            return (
              <div key={key} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E8E8", marginBottom: 14, overflow: "hidden" }}>
                {/* Header row */}
                <div
                  onClick={() => toggle(key)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", cursor: "pointer", borderBottom: isOpen ? "1px solid #F0F0F0" : "none" }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#E53935", background: "#FFEBEE", width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{idx + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: catColor, background: catColor + "18", padding: "2px 8px", borderRadius: 20 }}>{problem.category}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: problem.type === "spr" ? "#E63946" : "#457B9D", background: problem.type === "spr" ? "#FFEBEE" : "#E3F2FD", padding: "2px 7px", borderRadius: 4 }}>{problem.type === "spr" ? "Grid-In" : "MC"}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{set.label}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(set.id, problem.id); }}
                      title={bookmarked ? "북마크 해제" : "북마크"}
                      style={{ background: bookmarked ? "#FFF3CD" : "none", border: bookmarked ? "1px solid #FFD54F" : "1px solid transparent", cursor: "pointer", fontSize: 13, padding: "2px 7px", borderRadius: 6, opacity: bookmarked ? 1 : 0.4 }}
                    >
                      🔖
                    </button>
                    <span style={{ color: "#bbb", fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ padding: "16px 16px 18px" }}>
                    {/* Problem */}
                    <pre style={{ fontSize: 13.5, color: "#2a2a2a", lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "0 0 14px" }}>{problem.question}</pre>

                    {/* My answer vs correct */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                      <span style={{ fontSize: 12, color: "#C62828", background: "#FFEBEE", padding: "4px 10px", borderRadius: 8 }}>
                        내 답: {problem.type === "mc" ? (problem.options[attempt.answer] ?? "—") : (attempt.answer || "—")}
                      </span>
                      <span style={{ fontSize: 12, color: "#2E7D32", background: "#E8F5E9", padding: "4px 10px", borderRadius: 8 }}>
                        정답: {correctLabel(problem)}
                      </span>
                    </div>

                    {/* Explanation */}
                    <pre style={{ fontSize: 12.5, color: "#555", lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "inherit", background: "#FAFAFA", borderRadius: 10, padding: "12px 14px", margin: "0 0 14px" }}>{problem.explanation}</pre>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: apiReady ? 14 : 0 }}>
                      <button onClick={() => onOpenSet(set)} style={{ background: "none", border: `1px solid ${set.accent}`, color: set.accent, borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                        이 세트 다시 풀기 →
                      </button>
                    </div>

                    {/* Similar problems */}
                    {apiReady && <SimilarPanel setId={set.id} problem={problem} catColor={catColor} />}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
