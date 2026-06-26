import { useSyncExternalStore } from "react";
import { SETS, getSet, checkSpr } from "./data/sets.js";
import { supabase, TABLE, STATE_ID } from "./supabase.js";

// ----------------------------------------------------------------------------
// Persistent progress store. Single-student.
//
// Storage layers:
//  1. localStorage — instant, offline cache, and the only store if Supabase is
//     not configured.
//  2. Supabase (optional) — one JSON row shared across devices, with realtime
//     so the teacher's screen updates as the student works.
//
// state shape: { attempts: { [setId]: { [pid]: { answer, correct, at } } },
//                assigned: { [setId]: true } }
// ----------------------------------------------------------------------------

const KEY = "math-platform-v1";
const empty = { attempts: {}, assigned: {}, bookmarks: {} };

function readLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const p = JSON.parse(raw);
    return { attempts: p.attempts || {}, assigned: p.assigned || {}, bookmarks: p.bookmarks || {} };
  } catch {
    return empty;
  }
}

let state = readLocal();
const listeners = new Set();

// connection status, exposed to the UI
let conn = supabase ? "connecting" : "local";
function setConn(c) { conn = c; listeners.forEach((l) => l()); }

function notify() { listeners.forEach((l) => l()); }
function subscribe(l) { listeners.add(l); return () => listeners.delete(l); }

// Write to localStorage immediately, optionally push to Supabase.
function persist({ push = true } = {}) {
  localStorage.setItem(KEY, JSON.stringify(state));
  notify();
  if (push && supabase) pushRemote();
}

let pushTimer = null;
function pushRemote() {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    const { error } = await supabase.from(TABLE).upsert({ id: STATE_ID, data: state, updated_at: new Date().toISOString() });
    if (error) { console.error("Supabase push failed:", error.message); setConn("error"); }
    else if (conn !== "live") setConn("live");
  }, 250);
}

// Merge two states: keep the later attempt per problem; union assignments and bookmarks.
// Used on first load to reconcile this device's local cache with the cloud.
function merge(a, b) {
  const attempts = {};
  for (const setId of new Set([...Object.keys(a.attempts), ...Object.keys(b.attempts)])) {
    const ma = a.attempts[setId] || {}, mb = b.attempts[setId] || {};
    const m = {};
    for (const pid of new Set([...Object.keys(ma), ...Object.keys(mb)])) {
      const x = ma[pid], y = mb[pid];
      m[pid] = !x ? y : !y ? x : (y.at || 0) >= (x.at || 0) ? y : x;
    }
    attempts[setId] = m;
  }
  const bookmarks = {};
  for (const setId of new Set([...Object.keys(a.bookmarks || {}), ...Object.keys(b.bookmarks || {})])) {
    bookmarks[setId] = { ...(a.bookmarks?.[setId] || {}), ...(b.bookmarks?.[setId] || {}) };
  }
  return { attempts, assigned: { ...a.assigned, ...b.assigned }, bookmarks };
}

// Cross-tab sync (same browser).
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) { state = readLocal(); notify(); }
  });
}

// ---- Supabase init + realtime ----------------------------------------------
async function initRemote() {
  try {
    const { data, error } = await supabase.from(TABLE).select("data").eq("id", STATE_ID).maybeSingle();
    if (error) throw error;
    if (data?.data) {
      state = merge(state, data.data); // reconcile local cache with cloud
      persist({ push: true });         // push the reconciled result back
    } else {
      persist({ push: true });         // first run: seed the cloud row
    }
    setConn("live");
  } catch (err) {
    console.error("Supabase init failed:", err.message);
    setConn("error");
  }

  // Realtime: when the row changes (e.g. student answers), pull it in.
  supabase
    .channel("app_state_changes")
    .on("postgres_changes", { event: "*", schema: "public", table: TABLE, filter: `id=eq.${STATE_ID}` }, (payload) => {
      const next = payload.new?.data;
      if (next) { state = next; localStorage.setItem(KEY, JSON.stringify(state)); notify(); }
    })
    .subscribe();
}
if (supabase) initRemote();

// ---- mutations -------------------------------------------------------------
export function recordAttempt(setId, problem, answer) {
  const correct = problem.type === "mc" ? answer === problem.answer : checkSpr(problem, answer);
  const setAttempts = { ...(state.attempts[setId] || {}) };
  setAttempts[problem.id] = { answer, correct, at: Date.now() };
  state = { ...state, attempts: { ...state.attempts, [setId]: setAttempts } };
  persist();
  return correct;
}

export function resetSet(setId) {
  const attempts = { ...state.attempts };
  delete attempts[setId];
  state = { ...state, attempts };
  persist();
}

export function resetAll() {
  state = { attempts: {}, assigned: { ...state.assigned } };
  persist();
}

export function toggleAssigned(setId) {
  const assigned = { ...state.assigned };
  if (assigned[setId]) delete assigned[setId];
  else assigned[setId] = true;
  state = { ...state, assigned };
  persist();
}

export function toggleBookmark(setId, problemId) {
  const setBookmarks = { ...(state.bookmarks[setId] || {}) };
  if (setBookmarks[problemId]) delete setBookmarks[problemId];
  else setBookmarks[problemId] = { at: Date.now() };
  state = { ...state, bookmarks: { ...state.bookmarks, [setId]: setBookmarks } };
  persist();
}

// ---- export / import (file-based transfer; still useful as a backup) -------
export function exportState() {
  return JSON.stringify({ kind: "math-practice-hub", version: 1, exportedAt: Date.now(), ...state }, null, 2);
}

export function importState(data, mode = "merge") {
  if (!data || typeof data !== "object" || (data.kind && data.kind !== "math-practice-hub")) {
    throw new Error("이 파일은 Math Practice Hub 기록 파일이 아닙니다.");
  }
  const incoming = { attempts: data.attempts || {}, assigned: data.assigned || {} };
  state = mode === "replace" ? incoming : merge(state, incoming);
  persist();
}

// ---- reads -----------------------------------------------------------------
export function useStore() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function useConnection() {
  return useSyncExternalStore(subscribe, () => conn, () => conn);
}

export function setProgress(snapshot, set) {
  const attempts = snapshot.attempts[set.id] || {};
  const total = set.problems.length;
  const answered = set.problems.filter((p) => attempts[p.id]).length;
  const correct = set.problems.filter((p) => attempts[p.id]?.correct).length;
  const wrong = answered - correct;
  const assigned = !!snapshot.assigned[set.id];
  let status = "not-started";
  if (answered === total && total > 0) status = "completed";
  else if (answered > 0) status = "in-progress";
  return { total, answered, correct, wrong, assigned, status };
}

export function allBookmarkedProblems(snapshot) {
  const out = [];
  SETS.forEach((set) => {
    const bm = snapshot.bookmarks?.[set.id] || {};
    set.problems.forEach((p) => {
      if (bm[p.id]) out.push({ set, problem: p, at: bm[p.id].at });
    });
  });
  return out.sort((a, b) => b.at - a.at);
}

export function allWrongProblems(snapshot) {
  const out = [];
  SETS.forEach((set) => {
    const attempts = snapshot.attempts[set.id] || {};
    set.problems.forEach((p) => {
      const a = attempts[p.id];
      if (a && !a.correct) out.push({ set, problem: p, attempt: a });
    });
  });
  return out.sort((a, b) => b.attempt.at - a.attempt.at);
}

export function weaknessByCategory(snapshot) {
  const map = {};
  SETS.forEach((set) => {
    const attempts = snapshot.attempts[set.id] || {};
    set.problems.forEach((p) => {
      const a = attempts[p.id];
      if (!a) return;
      const m = (map[p.category] ||= { category: p.category, color: set.catColors[p.category] || "#888", attempted: 0, wrong: 0 });
      m.attempted += 1;
      if (!a.correct) m.wrong += 1;
    });
  });
  return Object.values(map).filter((m) => m.wrong > 0).sort((a, b) => b.wrong - a.wrong || b.attempted - a.attempted);
}

export function todoSets(snapshot) {
  return SETS.map((set) => ({ set, prog: setProgress(snapshot, set) }))
    .filter(({ prog }) => prog.status !== "completed")
    .sort((a, b) => Number(b.prog.assigned) - Number(a.prog.assigned));
}

export { SETS, getSet };
