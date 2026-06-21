import { SETS, useStore, setProgress, allWrongProblems, weaknessByCategory } from "../store.js";
import { toggleAssigned, resetSet, resetAll } from "../store.js";
import { correctLabel } from "../data/sets.js";

function Card({ children, style }) {
  return <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E8E8", padding: 20, marginBottom: 20, ...style }}>{children}</div>;
}
const SectionTitle = ({ children }) => <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px", color: "#1a1a1a" }}>{children}</h3>;
const chip = (color, bg) => ({ fontSize: 10, fontWeight: 700, color, background: bg, padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap" });

function Bar({ value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ height: 8, background: "#EEE", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ width: pct + "%", height: "100%", background: color }} />
    </div>
  );
}

export default function TeacherDashboard({ onPreviewSet }) {
  const snapshot = useStore();
  const perSet = SETS.map((set) => ({ set, prog: setProgress(snapshot, set) }));
  const wrong = allWrongProblems(snapshot);
  const weak = weaknessByCategory(snapshot);

  const totalAnswered = perSet.reduce((s, x) => s + x.prog.answered, 0);
  const totalCorrect = perSet.reduce((s, x) => s + x.prog.correct, 0);
  const accuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "8px 16px 60px" }}>
      <Card style={{ background: "linear-gradient(135deg,#264653,#2A9D8F)", border: "none", color: "#fff" }}>
        <p style={{ fontSize: 12, letterSpacing: 1, opacity: 0.8, margin: "0 0 14px", textTransform: "uppercase" }}>선생님 대시보드 · 학생 학습 분석</p>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 30, fontWeight: 700 }}>{totalAnswered}</div><div style={{ fontSize: 12, opacity: 0.8 }}>총 풀이 수</div></div>
          <div><div style={{ fontSize: 30, fontWeight: 700 }}>{accuracy}%</div><div style={{ fontSize: 12, opacity: 0.8 }}>전체 정답률</div></div>
          <div><div style={{ fontSize: 30, fontWeight: 700, color: "#FFD180" }}>{wrong.length}</div><div style={{ fontSize: 12, opacity: 0.8 }}>틀린 문제</div></div>
        </div>
      </Card>

      {/* Set management / assignment */}
      <Card>
        <SectionTitle>🗂 문제 세트 관리 · 배정</SectionTitle>
        {perSet.map(({ set, prog }) => (
          <div key={set.id} style={{ borderTop: "1px solid #F0F0F0", padding: "14px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{set.title}</span>
                <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>{set.label}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => toggleAssigned(set.id)} style={{ ...chip(prog.assigned ? "#fff" : "#E63946", prog.assigned ? "#E63946" : "#FFEBEE"), cursor: "pointer", border: "none", padding: "5px 10px" }}>{prog.assigned ? "✓ 배정됨" : "배정하기"}</button>
                <button onClick={() => onPreviewSet(set)} style={{ ...chip("#1565C0", "#E3F2FD"), cursor: "pointer", border: "none", padding: "5px 10px" }}>미리보기</button>
                <button onClick={() => { if (confirm(`${set.title} 기록을 초기화할까요?`)) resetSet(set.id); }} style={{ ...chip("#888", "#F1F3F4"), cursor: "pointer", border: "none", padding: "5px 10px" }}>초기화</button>
              </div>
            </div>
            <Bar value={prog.answered} total={prog.total} color={set.accent} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", marginTop: 6 }}>
              <span>{prog.answered}/{prog.total} 풀이 · 정답률 {prog.answered ? Math.round((prog.correct / prog.answered) * 100) : 0}%</span>
              <span style={{ color: "#E53935" }}>틀림 {prog.wrong}</span>
            </div>
          </div>
        ))}
      </Card>

      {/* Weakness analysis */}
      <Card>
        <SectionTitle>🎯 유형별 오답 분석</SectionTitle>
        {weak.length === 0 ? (
          <p style={{ fontSize: 13, color: "#aaa" }}>아직 오답 데이터가 없습니다.</p>
        ) : (
          weak.map((w) => (
            <div key={w.category} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                <span style={{ fontWeight: 500 }}>{w.category}</span>
                <span style={{ color: "#E53935", fontWeight: 600 }}>{w.wrong}/{w.attempted} 틀림 ({Math.round((w.wrong / w.attempted) * 100)}%)</span>
              </div>
              <Bar value={w.wrong} total={w.attempted} color={w.color} />
            </div>
          ))
        )}
      </Card>

      {/* Wrong problems with answers */}
      <Card>
        <SectionTitle>❌ 학생이 틀린 문제 ({wrong.length})</SectionTitle>
        {wrong.length === 0 ? (
          <p style={{ fontSize: 13, color: "#aaa" }}>틀린 문제가 없습니다.</p>
        ) : (
          wrong.map(({ set, problem, attempt }) => (
            <div key={`${set.id}-${problem.id}`} style={{ borderTop: "1px solid #F0F0F0", padding: "12px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                <span style={chip(set.catColors[problem.category] || "#888", (set.catColors[problem.category] || "#888") + "18")}>{problem.category}</span>
                <span style={{ fontSize: 11, color: "#bbb" }}>{set.label} · Q{problem.id}</span>
              </div>
              <pre style={{ fontSize: 13, color: "#444", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "0 0 8px" }}>{problem.question}</pre>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12 }}>
                <span style={{ color: "#C62828", background: "#FFEBEE", padding: "3px 8px", borderRadius: 6 }}>학생 답: {problem.type === "mc" ? problem.options[attempt.answer] ?? "—" : attempt.answer || "—"}</span>
                <span style={{ color: "#2E7D32", background: "#E8F5E9", padding: "3px 8px", borderRadius: 6 }}>정답: {correctLabel(problem)}</span>
              </div>
            </div>
          ))
        )}
      </Card>

      <div style={{ textAlign: "center" }}>
        <button onClick={() => { if (confirm("모든 학생 풀이 기록을 초기화할까요? (배정은 유지)")) resetAll(); }} style={{ background: "#fff", color: "#C62828", border: "1px solid #EF9A9A", borderRadius: 10, padding: "10px 24px", fontSize: 13, cursor: "pointer" }}>전체 기록 초기화</button>
      </div>
    </div>
  );
}
