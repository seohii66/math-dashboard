import { useRef, useState } from "react";
import { exportState, importState, useStore } from "../store.js";

// File-based transfer of progress between devices (no backend).
// Student exports → sends file → Teacher imports (and vice versa for assignments).
export default function DataTransfer({ role }) {
  const snapshot = useStore();
  const fileRef = useRef(null);
  const [msg, setMsg] = useState(null);

  const attemptCount = Object.values(snapshot.attempts).reduce((s, m) => s + Object.keys(m).length, 0);

  const handleExport = () => {
    const blob = new Blob([exportState()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `math-hub-${role === "teacher" ? "teacher" : "student"}-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ ok: true, text: `기록을 내보냈어요 (풀이 ${attemptCount}개). 상대방에게 파일을 전달하세요.` });
  };

  const handleFile = (e, mode) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importState(JSON.parse(reader.result), mode);
        setMsg({ ok: true, text: mode === "replace" ? "기록을 덮어썼습니다." : "기록을 가져와 합쳤습니다." });
      } catch (err) {
        setMsg({ ok: false, text: err.message || "파일을 읽을 수 없습니다." });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div style={{ maxWidth: role === "teacher" ? 760 : 720, margin: "0 auto", padding: "0 16px 48px" }}>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px dashed #D6D9DE", padding: 18 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: "#1a1a1a" }}>🔄 다른 기기와 기록 주고받기 (파일)</h3>
        <p style={{ fontSize: 12, color: "#999", margin: "0 0 14px", lineHeight: 1.6 }}>
          {role === "teacher"
            ? "학생이 보낸 기록 파일을 가져와 확인하세요. 세트 배정을 바꿨다면 내보내서 학생에게 전달하세요."
            : "내 풀이 기록을 파일로 내보내 선생님께 전달하세요. 선생님이 보낸 배정 파일은 여기서 가져옵니다."}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={handleExport} style={btn("#1a1a1a", "#fff")}>⬇ 기록 내보내기</button>
          <button onClick={() => { fileRef.current.dataset.mode = "merge"; fileRef.current.click(); }} style={btn("#fff", "#1a1a1a", "1px solid #1a1a1a")}>⬆ 가져오기 (합치기)</button>
          <button onClick={() => { if (confirm("현재 기록을 모두 덮어쓸까요?")) { fileRef.current.dataset.mode = "replace"; fileRef.current.click(); } }} style={btn("#fff", "#888", "1px solid #ddd")}>덮어쓰기</button>
          <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: "none" }} onChange={(e) => handleFile(e, e.target.dataset.mode || "merge")} />
        </div>
        {msg && <p style={{ fontSize: 12.5, margin: "12px 0 0", color: msg.ok ? "#2E7D32" : "#C62828", fontWeight: 500 }}>{msg.text}</p>}
      </div>
    </div>
  );
}

const btn = (bg, color, border = "none") => ({ background: bg, color, border, borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" });
