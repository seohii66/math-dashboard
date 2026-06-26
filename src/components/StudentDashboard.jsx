import { useState } from "react";
import { SETS, useStore, setProgress, allWrongProblems, weaknessByCategory, todoSets, allBookmarkedProblems, toggleBookmark } from "../store.js";
import { correctLabel } from "../data/sets.js";

const STATUS = {
  "not-started": { label: "시작 전", color: "#9AA0A6", bg: "#F1F3F4" },
  "in-progress": { label: "진행 중", color: "#E8870A", bg: "#FFF4E5" },
  completed: { label: "완료", color: "#2E7D32", bg: "#E8F5E9" },
};

function Bar({ value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ height: 8, background: "#EEE", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ width: pct + "%", height: "100%", background: color, transition: "width .3s" }} />
    </div>
  );
}

function Card({ children, style }) {
  return <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E8E8", padding: 20, marginBottom: 20, ...style }}>{children}</div>;
}

export default function StudentDashboard({ onOpenSet, onOpenOdapNote }) {
  const snapshot = useStore();
  const [showWrong, setShowWrong] = useState(true);
  const [showBookmarks, setShowBookmarks] = useState(true);

  const perSet = SETS.map((set) => ({ set, prog: setProgress(snapshot, set) }));
  const totalProblems = perSet.reduce((s, x) => s + x.prog.total, 0);
  const totalAnswered = perSet.reduce((s, x) => s + x.prog.answered, 0);
  const totalCorrect = perSet.reduce((s, x) => s + x.prog.correct, 0);
  const accuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const todo = todoSets(snapshot);
  const wrong = allWrongProblems(snapshot);
  const weak = weaknessByCategory(snapshot);
  const bookmarked = allBookmarkedProblems(snapshot);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "8px 16px 60px" }}>
      {/* Overview */}
      <Card style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)", border: "none", color: "#fff" }}>
        <p style={{ fontSize: 12, letterSpacing: 1, opacity: 0.7, margin: "0 0 14px", textTransform: "uppercase" }}>나의 학습 현황</p>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <Stat big value={`${totalAnswered}`} sub={`/ ${totalProblems} 문제`} label="지금까지 푼 문제" />
          <Stat big value={`${accuracy}%`} label="정답률" />
          <Stat big value={`${wrong.length}`} label="틀린 문제" color="#FF8A80" />
        </div>
        <div style={{ marginTop: 16 }}>
          <Bar value={totalAnswered} total={totalProblems} color="#64B5F6" />
        </div>
      </Card>

      {/* Quick action bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <button
          onClick={onOpenOdapNote}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #EF9A9A", borderRadius: 12, padding: "12px 18px", cursor: "pointer", fontFamily: "inherit", flex: 1, minWidth: 160 }}
        >
          <span style={{ fontSize: 20 }}>📒</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C62828" }}>오답노트</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>틀린 {wrong.length}문제 · 유사 문제 생성</div>
          </div>
        </button>
        {bookmarked.length > 0 && (
          <button
            onClick={() => {
              const catColors = Object.assign({}, ...bookmarked.map(({ set }) => set.catColors));
              onOpenSet({
                id: "__bookmark-review__",
                label: "북마크 복습",
                title: "북마크한 문제 풀기",
                subtitle: `총 ${bookmarked.length}문제`,
                accent: "#E8870A",
                catColors,
                problems: bookmarked.map(({ set, problem }) => ({ ...problem, id: `${set.id}-${problem.id}` })),
              });
            }}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #FFD54F", borderRadius: 12, padding: "12px 18px", cursor: "pointer", fontFamily: "inherit", flex: 1, minWidth: 160 }}
          >
            <span style={{ fontSize: 20 }}>🔖</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8a6d00" }}>북마크</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>{bookmarked.length}문제 모아 풀기</div>
            </div>
          </button>
        )}
      </div>

      {/* To-do */}
      <Card>
        <SectionTitle>📌 앞으로 풀어야 하는 문제</SectionTitle>
        {todo.length === 0 ? (
          <Empty>모든 세트를 완료했어요! 🎉</Empty>
        ) : (
          todo.map(({ set, prog }) => (
            <button key={set.id} onClick={() => onOpenSet(set)} style={rowBtn}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{set.title}</span>
                  {prog.assigned && <span style={chip("#E63946", "#FFEBEE")}>선생님 배정</span>}
                </div>
                <span style={{ fontSize: 12, color: "#999" }}>{set.label} · {prog.answered}/{prog.total} 완료</span>
              </div>
              <span style={{ color: set.accent, fontWeight: 600, fontSize: 13 }}>풀기 →</span>
            </button>
          ))
        )}
      </Card>

      {/* All sets progress */}
      <Card>
        <SectionTitle>📚 전체 진행 상황</SectionTitle>
        {perSet.map(({ set, prog }) => {
          const st = STATUS[prog.status];
          return (
            <button key={set.id} onClick={() => onOpenSet(set)} style={{ ...rowBtn, display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{set.title}</span>
                <span style={chip(st.color, st.bg)}>{st.label}</span>
              </div>
              <Bar value={prog.answered} total={prog.total} color={set.accent} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", marginTop: 6 }}>
                <span>{prog.answered}/{prog.total} 풀이</span>
                <span>맞음 {prog.correct} · 틀림 {prog.wrong}</span>
              </div>
            </button>
          );
        })}
      </Card>

      {/* Weakness by category */}
      {weak.length > 0 && (
        <Card>
          <SectionTitle>🎯 유형별 약점</SectionTitle>
          {weak.map((w) => (
            <div key={w.category} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                <span style={{ fontWeight: 500 }}>{w.category}</span>
                <span style={{ color: "#E53935", fontWeight: 600 }}>{w.wrong}/{w.attempted} 틀림</span>
              </div>
              <Bar value={w.wrong} total={w.attempted} color={w.color} />
            </div>
          ))}
        </Card>
      )}

      {/* Bookmarked problems */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SectionTitle style={{ margin: 0 }}>🔖 북마크한 문제 ({bookmarked.length})</SectionTitle>
          {bookmarked.length > 0 && (
            <button onClick={() => setShowBookmarks((s) => !s)} style={{ background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer" }}>{showBookmarks ? "접기" : "펼치기"}</button>
          )}
        </div>
        {bookmarked.length === 0 ? (
          <Empty>아직 북마크한 문제가 없어요. 문제 풀기 화면에서 🔖 버튼을 눌러 저장해보세요.</Empty>
        ) : showBookmarks ? (
          <div style={{ marginTop: 14 }}>
            {bookmarked.map(({ set, problem, at }) => (
              <details key={`${set.id}-${problem.id}`} style={{ borderTop: "1px solid #F0F0F0", padding: "12px 0" }}>
                <summary style={{ cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "#333", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={chip(set.catColors[problem.category] || "#888", (set.catColors[problem.category] || "#888") + "18")}>{problem.category}</span>
                    <span style={{ color: "#aaa", fontSize: 11 }}>{new Date(at).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}</span>
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#bbb" }}>{set.label}</span>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(set.id, problem.id); }}
                      title="북마크 해제"
                      style={{ background: "#FFF3CD", border: "1px solid #FFD54F", cursor: "pointer", fontSize: 12, padding: "2px 7px", borderRadius: 6, color: "#8a6d00" }}
                    >
                      해제
                    </button>
                  </div>
                </summary>
                <pre style={{ fontSize: 13, color: "#444", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "10px 0" }}>{problem.question}</pre>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: problem.type === "spr" ? "#E63946" : "#457B9D", background: problem.type === "spr" ? "#FFEBEE" : "#E3F2FD", padding: "3px 8px", borderRadius: 4 }}>{problem.type === "spr" ? "Grid-In" : "MC"}</span>
                  <span style={{ color: "#2E7D32", background: "#E8F5E9", padding: "3px 8px", borderRadius: 6 }}>정답: {correctLabel(problem)}</span>
                </div>
                {problem.explanation && (
                  <pre style={{ fontSize: 12.5, color: "#666", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", background: "#FAFAFA", borderRadius: 8, padding: 12, margin: 0 }}>{problem.explanation}</pre>
                )}
                <button onClick={() => onOpenSet(set)} style={{ marginTop: 10, background: "none", border: `1px solid ${set.accent}`, color: set.accent, borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>이 세트 풀기 →</button>
              </details>
            ))}
          </div>
        ) : null}
      </Card>

      {/* Wrong problems review */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SectionTitle style={{ margin: 0 }}>❌ 틀린 문제 다시 보기 ({wrong.length})</SectionTitle>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {wrong.length > 0 && (
              <button
                onClick={() => {
                  const catColors = Object.assign({}, ...wrong.map(({ set }) => set.catColors));
                  onOpenSet({
                    id: "__wrong-review__",
                    label: "오답 복습",
                    title: "틀린 문제 다시 풀기",
                    subtitle: `총 ${wrong.length}문제`,
                    accent: "#E53935",
                    catColors,
                    problems: wrong.map(({ set, problem }) => ({ ...problem, id: `${set.id}-${problem.id}` })),
                  });
                }}
                style={{ background: "#FFEBEE", border: "1px solid #EF9A9A", color: "#C62828", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                오답만 다시 풀기 →
              </button>
            )}
            {wrong.length > 0 && (
              <button onClick={() => setShowWrong((s) => !s)} style={{ background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer" }}>{showWrong ? "접기" : "펼치기"}</button>
            )}
          </div>
        </div>
        {wrong.length === 0 ? (
          <Empty>아직 틀린 문제가 없어요.</Empty>
        ) : showWrong ? (
          <div style={{ marginTop: 14 }}>
            {wrong.map(({ set, problem, attempt }) => (
              <details key={`${set.id}-${problem.id}`} style={{ borderTop: "1px solid #F0F0F0", padding: "12px 0" }}>
                <summary style={{ cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "#333" }}>
                    <span style={chip(set.catColors[problem.category] || "#888", (set.catColors[problem.category] || "#888") + "18")}>{problem.category}</span>
                  </span>
                  <span style={{ fontSize: 11, color: "#bbb" }}>{set.label}</span>
                </summary>
                <pre style={{ fontSize: 13, color: "#444", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "10px 0" }}>{problem.question}</pre>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12, marginBottom: 8 }}>
                  <span style={{ color: "#C62828", background: "#FFEBEE", padding: "3px 8px", borderRadius: 6 }}>내 답: {problem.type === "mc" ? problem.options[attempt.answer] ?? "—" : attempt.answer || "—"}</span>
                  <span style={{ color: "#2E7D32", background: "#E8F5E9", padding: "3px 8px", borderRadius: 6 }}>정답: {correctLabel(problem)}</span>
                </div>
                <pre style={{ fontSize: 12.5, color: "#666", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", background: "#FAFAFA", borderRadius: 8, padding: 12, margin: 0 }}>{problem.explanation}</pre>
                <button onClick={() => onOpenSet(set)} style={{ marginTop: 10, background: "none", border: `1px solid ${set.accent}`, color: set.accent, borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>이 세트 다시 풀기 →</button>
              </details>
            ))}
          </div>
        ) : null}
      </Card>
    </div>
  );
}

function Stat({ value, sub, label, big, color }) {
  return (
    <div>
      <div style={{ fontSize: big ? 30 : 22, fontWeight: 700, color: color || "#fff" }}>{value}{sub && <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.6 }}> {sub}</span>}</div>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{label}</div>
    </div>
  );
}

const SectionTitle = ({ children, style }) => <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px", color: "#1a1a1a", ...style }}>{children}</h3>;
const Empty = ({ children }) => <p style={{ fontSize: 13, color: "#aaa", margin: "8px 0 0" }}>{children}</p>;
const chip = (color, bg) => ({ fontSize: 10, fontWeight: 700, color, background: bg, padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap" });
const rowBtn = { display: "flex", alignItems: "center", gap: 10, width: "100%", background: "#FAFAFA", border: "1px solid #EFEFEF", borderRadius: 10, padding: "12px 14px", marginBottom: 10, cursor: "pointer", fontFamily: "inherit" };
