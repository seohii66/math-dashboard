import { useState } from "react";
import StudentDashboard from "./components/StudentDashboard.jsx";
import TeacherDashboard from "./components/TeacherDashboard.jsx";
import DataTransfer from "./components/DataTransfer.jsx";
import Quiz from "./components/Quiz.jsx";
import OdapNote from "./components/OdapNote.jsx";
import { useConnection } from "./store.js";

const CONN = {
  connecting: { dot: "#FBC02D", label: "연결 중…" },
  live: { dot: "#43A047", label: "실시간 동기화" },
  error: { dot: "#E53935", label: "오프라인(로컬 저장)" },
  local: { dot: "#9AA0A6", label: "로컬 저장" },
};

function ConnBadge() {
  const conn = useConnection();
  const c = CONN[conn] || CONN.local;
  return (
    <span title="데이터 동기화 상태" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "#888", background: "#F1F3F4", padding: "4px 9px", borderRadius: 20 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot }} />{c.label}
    </span>
  );
}

export default function App() {
  const [role, setRole] = useState(() => localStorage.getItem("math-platform-role") || "student");
  const [activeSet, setActiveSet] = useState(null);
  const [odapOpen, setOdapOpen] = useState(false);

  const switchRole = (r) => {
    setRole(r);
    setActiveSet(null);
    setOdapOpen(false);
    localStorage.setItem("math-platform-role", r);
  };

  const openSet = (set) => { setActiveSet(set); setOdapOpen(false); };
  const goBack = () => { setActiveSet(null); setOdapOpen(false); };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F6F8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Top bar */}
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(255,255,255,.85)", backdropFilter: "blur(8px)", borderBottom: "1px solid #ECECEC" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🧮</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>Math Practice Hub</span>
            <ConnBadge />
          </div>
          <div style={{ display: "flex", background: "#EEF0F3", borderRadius: 10, padding: 3 }}>
            {[["student", "이서"], ["teacher", "선생님용"]].map(([r, label]) => (
              <button key={r} onClick={() => switchRole(r)} style={{ border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 8, background: role === r ? "#fff" : "transparent", color: role === r ? "#1a1a1a" : "#888", boxShadow: role === r ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}>{label}</button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 16 }}>
        {activeSet ? (
          <Quiz set={activeSet} teacherMode={role === "teacher"} onBack={goBack} />
        ) : odapOpen ? (
          <OdapNote onBack={() => setOdapOpen(false)} onOpenSet={openSet} />
        ) : (
          <>
            {role === "student" ? (
              <StudentDashboard onOpenSet={openSet} onOpenOdapNote={() => setOdapOpen(true)} />
            ) : (
              <TeacherDashboard onPreviewSet={openSet} />
            )}
            <DataTransfer role={role} />
          </>
        )}
      </main>
    </div>
  );
}
