# Math Practice Hub

`.jsx`로 만든 수학 문제 세트들을 한 곳에서 관리하는 통합 플랫폼입니다.
학생용 / 선생님용 화면을 토글로 전환할 수 있고, 진도·틀린 문제·유형별 약점을
브라우저(localStorage)에 자동 저장합니다.

## 실행 방법

```bash
cd math-platform
npm install      # 최초 1회
npm run dev      # http://localhost:5173 자동 오픈
```

빌드/배포: `npm run build` → `dist/` 폴더 생성 (정적 호스팅 가능).

## 기능

**학생용 (학생용 탭)**
- 나의 학습 현황 — 지금까지 푼 문제, 정답률, 틀린 문제 수
- 📌 앞으로 풀어야 하는 문제 — 미완료 세트(선생님 배정 우선)
- 📚 전체 진행 상황 — 세트별 진도 바 + 상태(시작 전/진행 중/완료)
- 🎯 유형별 약점 — 카테고리별 오답 비율
- ❌ 틀린 문제 다시 보기 — 내 답 vs 정답 + 풀이

**선생님용 (선생님용 탭)**
- 학생 학습 분석 요약 (총 풀이·정답률·오답 수)
- 🗂 문제 세트 관리 — 세트 **배정**, **미리보기**(정답·풀이 표시), **초기화**
- 🎯 유형별 오답 분석
- ❌ 학생이 틀린 문제 (학생 답 + 정답)
- 전체 기록 초기화

> 기본은 같은 브라우저의 localStorage에 저장됩니다. **Supabase를 연결하면
> 다른 기기 간 실시간 동기화**가 됩니다 → 아래 "실시간 동기화" 참고.

## 다른 기기 실시간 동기화 + GitHub Pages 배포

GitHub Pages(무료 호스팅) + Supabase(무료 실시간 DB) 조합으로, **학생이 푼 기록을
선생님이 다른 기기에서 실시간으로** 볼 수 있습니다. 단일 학생 기준.

→ 단계별 가이드: **[SETUP.md](SETUP.md)** · DB 스키마: [supabase-schema.sql](supabase-schema.sql)

요약: ① Supabase 프로젝트 + SQL 실행 → ② 이 폴더를 GitHub 저장소로 push →
③ Supabase URL/anon key를 GitHub Secrets에 등록 → ④ Settings → Pages를 GitHub
Actions로 설정. 이후 push할 때마다 자동 배포됩니다.

헤더 배지로 동기화 상태 확인: 🟢 실시간 / 🟡 연결 중 / 🔴 오프라인 / ⚪ 로컬.
Supabase 미설정 시에도 앱은 로컬 저장으로 정상 동작합니다(배포 먼저, 연결은 나중에 가능).

## 다른 기기 간 기록 공유 (파일 내보내기/가져오기)

서버 DB 없이, 화면 하단 **🔄 다른 기기와 기록 주고받기** 카드로 기록을 옮깁니다.

1. **학생**: `⬇ 기록 내보내기` → `math-hub-student-날짜.json` 다운로드 → 카톡/이메일로 선생님께 전달
2. **선생님**: 다른 기기에서 `⬆ 가져오기 (합치기)` → 받은 파일 선택 → 학생 기록 확인
3. **선생님 → 학생** (세트 배정 전달): 선생님이 배정을 바꾼 뒤 `⬇ 내보내기` → 학생이 `⬆ 가져오기`

- **가져오기(합치기)**: 문제별로 더 최신 풀이를 남기고 배정은 합칩니다 (기본).
- **덮어쓰기**: 현재 기록을 받은 파일로 완전히 교체합니다.

> 실시간 자동 동기화는 아닙니다. 파일을 주고받는 시점에 반영됩니다.
> 실시간이 필요해지면 `src/store.js`의 저장 부분만 Supabase 등으로 교체하면 됩니다.

## 새 문제 세트 추가하기

1. `src/data/sets.js` 를 엽니다.
2. 기존 `set2` / `set3` 객체를 복사해 새 객체(`set4` 등)를 만들고,
   `.jsx` 파일의 `problems` / `catColors` 배열을 그대로 붙여넣습니다.
   - `id`(고유), `label`, `title`, `subtitle`, `accent`(색상)만 채우면 됩니다.
3. 맨 아래 `export const SETS = [set2, set3];` 에 새 세트를 추가합니다.

문제 객체 형식:
```js
// 객관식(MC)
{ id, type: "mc", category, difficulty, question,
  options: ["A) ...", ...], answer: 0~3, explanation }

// 단답형(SPR / Grid-In)
{ id, type: "spr", category, difficulty, question,
  correctValue, tolerance, unit, explanation }
```

## 구조

```
src/
  data/sets.js        문제 세트 데이터 (여기만 수정하면 세트 추가)
  store.js            localStorage 진도/오답 저장 + 집계
  components/
    Quiz.jsx              문제 풀이 화면 (학생 풀이 / 선생님 미리보기 공용)
    StudentDashboard.jsx  학생 대시보드
    TeacherDashboard.jsx  선생님 대시보드
  App.jsx             역할 전환 + 라우팅
```

원본 `.jsx` 파일들은 `../DSAT_Practice_Set/` 에 그대로 보존되어 있습니다.
