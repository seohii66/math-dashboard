# 배포 가이드 — GitHub Pages + Supabase 실시간 동기화

이 문서대로 따라 하면 **학생이 푼 기록을 선생님이 다른 기기에서 실시간으로** 볼 수
있게 됩니다. 단일 학생 기준입니다.

소요 시간: 약 20~30분 · 비용: 무료

---

## 1단계 — Supabase 프로젝트 만들기 (실시간 DB)

1. https://supabase.com 가입 → **New project** 생성 (Region은 `Northeast Asia (Seoul)` 추천)
2. 왼쪽 메뉴 **SQL Editor → New query** 에 이 폴더의
   [`supabase-schema.sql`](supabase-schema.sql) 내용을 붙여넣고 **Run**
   (테이블 생성 + 권한 + 실시간 활성화가 한 번에 됩니다)
3. **Project Settings → API** 에서 두 값을 복사해 둡니다:
   - **Project URL** (예: `https://abcd1234.supabase.co`)
   - **anon public** key (브라우저에 노출돼도 안전한 공개 키)

> anon 키는 공개용이라 코드/링크에 들어가도 됩니다. (절대 노출하면 안 되는 건
> `service_role` 키이며, 이 앱은 그 키를 쓰지 않습니다.)

### 로컬에서 먼저 테스트하려면
`.env.example` 을 복사해 `.env` 를 만들고 두 값을 채운 뒤 `npm run dev`.
헤더의 상태 배지가 🟢 **실시간 동기화** 로 바뀌면 연결 성공입니다.

---

## 2단계 — GitHub 저장소에 올리기

이 `math-platform` 폴더를 저장소 루트로 올립니다.

```bash
cd math-platform
git init
git add .
git commit -m "Math Practice Hub"
# GitHub에서 빈 저장소 생성 후:
git remote add origin https://github.com/<아이디>/<저장소이름>.git
git branch -M main
git push -u origin main
```

---

## 3단계 — Supabase 키를 GitHub 비밀값으로 등록

저장소 → **Settings → Secrets and variables → Actions → New repository secret** 에서 2개 추가:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | 1단계의 Project URL |
| `VITE_SUPABASE_ANON_KEY` | 1단계의 anon public key |

> 빌드 시점에 앱에 주입됩니다. 비워두면 동기화 없이 로컬 저장으로만 동작합니다.

---

## 4단계 — GitHub Pages 켜기

저장소 → **Settings → Pages** → **Source** 를 **GitHub Actions** 로 선택.

이제 `main` 에 push할 때마다 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
가 자동으로 빌드·배포합니다. **Actions** 탭에서 진행 상황을 볼 수 있고, 완료되면
`https://<아이디>.github.io/<저장소이름>/` 주소가 생깁니다.

---

## 5단계 — 공유 & 사용

- **학생**: 위 링크를 받아 브라우저에서 엶 → 헤더에서 **학생용** 선택 → 문제 풀이
- **선생님**: 같은 링크를 다른 기기에서 엶 → **선생님용** 선택 →
  학생이 풀면 진도·오답·유형 분석이 **실시간으로** 갱신됨

헤더의 상태 배지로 동기화 상태를 확인하세요:
🟢 실시간 동기화 / 🟡 연결 중 / 🔴 오프라인(로컬 저장).

---

## 자주 묻는 것

- **동기화가 안 돼요 (🔴/⚪)** → GitHub Secrets 2개가 정확한지, SQL을 실행했는지 확인.
  키를 바꿨다면 Actions 탭에서 **Re-run** 으로 다시 빌드해야 반영됩니다.
- **기록 초기화** → 선생님용 하단 "전체 기록 초기화" 또는 세트별 "초기화".
- **백업** → 화면 하단 "기록 내보내기"로 언제든 JSON 파일 백업 가능 (DB와 별개).
- **나중에 학생을 여러 명 관리하려면** → 학생 이름 구분 기능이 필요합니다. 그때
  `store.js`/스키마를 학생별로 확장하면 됩니다 (지금은 단일 학생 구조).
- **무료 한도** → Supabase 무료 티어로 과외 1명 규모는 충분합니다. 7일간 요청이
  전혀 없으면 프로젝트가 일시정지될 수 있는데, 다시 접속하면 깨어납니다.
