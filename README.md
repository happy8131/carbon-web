# 🌍 탄소 배출 대시보드 (Carbon Emissions Dashboard)

**경영진과 관리자가 회사별 탄소 배출량을 모니터링하고 탄소세 계획을 세울 수 있는 웹 대시보드**


---

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [설치 및 실행](#설치-및-실행)
- [폴더 구조](#폴더-구조)
- [개발 로드맵](#개발-로드맵)
- [코드 품질](#코드-품질)
- [문서](#문서)
- [배포](#배포)

---

## 프로젝트 개요

**탄소 배출 대시보드**는 실시간 탄소 배출량 데이터를 시각화하고 관리하기 위한 풀스택 웹 애플리케이션입니다.

### 목표
- 회사별 탄소 배출량 모니터링
- 다양한 시각화를 통한 인사이트 제공
- 배출원(가솔린, LPG, 디젤)별 분석
- 시간대별 추이 분석
- 포스트/뉴스를 통한 정보 공유

### 현황
- **Phase 1-5 완료**: 프로젝트 기초, 레이아웃, 대시보드 핵심 기능, 포스트 기능, 디자인 & 사용성 개선
- **코드 품질**: TypeScript strict mode, ESLint 통과, 반응형 디자인 ✅
- **커밋 수**: 12개 (명확한 메시지와 함께)

---

## 주요 기능

### 📊 대시보드
- **통계 카드**: 총 배출량, 출처별 배출량, 변화율
- **4개 차트**:
  - 📈 꺾은선 차트: 월별 탄소 배출량 추이 (시간대별)
  - 📍 누적 영역 차트: 회사별 배출량 누적 비교
  - 🍩 도넛 차트: 배출원별 구성비 (가솔린/LPG/디젤)
  - 📋 데이터 테이블: 회사별 배출량 상세 정보 및 정렬 기능

### 🔍 필터 기능
- **회사별 필터**: 다중 선택으로 특정 회사만 표시
- **날짜 범위 필터**: 지난 3개월, 6개월, 12개월 또는 커스텀 선택
- **실시간 업데이트**: 필터 변경 시 차트와 통계 즉시 반영

### 📰 포스트/뉴스
- **포스트 목록**: 필터된 회사별 관련 뉴스/공지사항
- **CRUD 기능**: 포스트 생성, 수정, 삭제
- **모달 UI**: 깔끔한 포스트 작성 인터페이스

### 📱 반응형 디자인
- **데스크톱**: 사이드바 + 메인 콘텐츠 레이아웃
- **태블릿**: 최적화된 레이아웃
- **모바일**: 전체 너비 콘텐츠, 숨김 사이드바

### ⚡ UX/DX 개선
- **로딩 상태**: Shimmer 애니메이션으로 부드러운 로딩
- **슬라이드인 애니메이션**: 모달 진입 시 애니메이션
- **에러 처리**: 명확한 에러 메시지와 재시도 기능
- **접근성**: 시맨틱 HTML, ARIA 레이블

---

## 기술 스택

| 카테고리 | 기술 | 버전 | 목적 |
|---------|------|------|------|
| **프레임워크** | Next.js | 14.2.35 | Server-Side Rendering, API Routes |
| **라이브러리** | React | 18 | UI 컴포넌트 |
| **언어** | TypeScript | 5 | 타입 안전성 |
| **상태관리** | Zustand | 5.0.13 | 간단한 전역 상태관리 |
| **스타일링** | Tailwind CSS | 3.4.1 | 유틸리티 CSS |
| **차트** | Recharts | 3.8.1 | 반응형 차트 렌더링 |
| **개발도구** | ESLint | 8 | 코드 품질 검사 |
| **빌드** | PostCSS | 8 | CSS 전처리 |

---

## 설치 및 실행

### 사전 요구사항
- Node.js 18 이상
- npm 또는 yarn, pnpm

### 설치 단계

```bash
# 1. 저장소 클론
git clone <repository-url>
cd carbon-web

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

### 개발 서버 접근
- 로컬: [http://localhost:3000](http://localhost:3000)
- 외부: [http://<your-ip>:3000](http://example.com)

### 주요 명령어

```bash
# 개발 서버 실행 (핫 리로드 지원)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# ESLint 검사
npm run lint

# TypeScript 타입 체크
npx tsc --noEmit
```

---

## 폴더 구조

```
carbon-web/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root HTML 구조, Metadata
│   │   ├── page.tsx                  # 메인 대시보드 페이지
│   │   ├── globals.css               # Tailwind 스타일, @keyframes 애니메이션
│   │   └── not-found.tsx             # 404 에러 페이지
│   │
│   ├── components/                   # React 컴포넌트 (재사용 가능)
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx        # 메인 레이아웃 (Sidebar + Main)
│   │   │   ├── Header.tsx            # 상단 헤더 (필터 표시)
│   │   │   └── Sidebar.tsx           # 좌측 사이드바 (필터 컨트롤)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx          # 통계 카드 (총 배출량 등)
│   │   │   ├── EmissionChart.tsx     # 꺾은선 차트 (월별 추이)
│   │   │   ├── CompanyStackChart.tsx # 누적 영역 차트
│   │   │   ├── SourceChart.tsx       # 도넛 차트 (배출원별)
│   │   │   ├── CompanyTable.tsx      # 데이터 테이블 (정렬 기능)
│   │   │   └── Skeleton.tsx          # 로딩 상태 UI
│   │   │
│   │   ├── posts/
│   │   │   ├── PostForm.tsx          # 포스트 작성 폼
│   │   │   ├── PostCard.tsx          # 포스트 카드
│   │   │   └── PostList.tsx          # 포스트 목록
│   │   │
│   │   └── ui/                       # 기본 UI 컴포넌트
│   │       ├── Button.tsx            # 버튼 (variant: primary/secondary/ghost)
│   │       ├── Badge.tsx             # 배지 (색상 레이블)
│   │       ├── Card.tsx              # 카드 래퍼
│   │       └── Modal.tsx             # 모달 (ESC 키 지원)
│   │
│   ├── hooks/                        # 커스텀 React Hooks
│   │   ├── useStore.ts               # Zustand store 접근
│   │   ├── useFilters.ts             # 필터 로직 (회사, 날짜)
│   │   ├── useCompanies.ts           # 회사 데이터 페칭
│   │   ├── usePostActions.ts         # 포스트 CRUD 작업
│   │   └── usePosts.ts               # 포스트 데이터 페칭
│   │
│   ├── lib/                          # 유틸리티 및 헬퍼 함수
│   │   ├── api.ts                    # 가짜 백엔드 API
│   │   │                             # - 200-800ms 지연 시뮬레이션
│   │   │                             # - 15% 실패율 시뮬레이션
│   │   │                             # - 데이터 불변성 보장
│   │   ├── types.ts                  # TypeScript 타입 정의
│   │   │                             # - Company, GhgEmission, Post
│   │   └── utils.ts                  # 데이터 포맷팅 함수
│   │
│   ├── store/                        # 상태관리 (Zustand)
│   │   └── store.ts                  # 전역 상태 및 액션
│   │
│   └── types/                        # 추가 타입 정의
│       └── index.ts                  # 핵심 타입 export
│
├── docs/
│   ├── CARBON_EMISSIONS_ROADMAP.md   # 상세 개발 로드맵 (7단계)
│   └── DESIGN_DECISIONS.md           # 설계 결정사항 문서
│
├── public/                           # 정적 자산 (이미지 등)
│
├── .gitignore                        # Git 제외 파일 목록
├── package.json                      # 프로젝트 의존성
├── tsconfig.json                     # TypeScript 설정 (strict mode)
├── tailwind.config.ts                # Tailwind CSS 설정
├── postcss.config.js                 # PostCSS 설정
├── eslint.config.mjs                 # ESLint 규칙
├── next.config.js                    # Next.js 설정
└── README.md                         # 이 파일
```

---

## 개발 로드맵

### ✅ 완료된 Phase

| Phase | 기간 | 상태 | 설명 |
|-------|------|------|------|
| **1️⃣** | 1-2h | ✅ 완료 | 프로젝트 기초 (타입, API, Store) |
| **2️⃣** | 1-1.5h | ✅ 완료 | 레이아웃 & 네비게이션 (Sidebar, Header) |
| **3️⃣** | 3-4h | ✅ 완료 | 대시보드 핵심 (차트, 통계, 테이블) |
| **4️⃣** | 1-1.5h | ✅ 완료 | 포스트/뉴스 기능 (CRUD, Modal) |
| **5️⃣** | 1.5-2h | ✅ 완료 | 디자인 & 사용성 (애니메이션, 반응형) |
| **6️⃣** | 1-1.5h | ✅ 통합 | 코드 품질 & 최적화 (Phase 5에 포함) |
| **7️⃣** | 1h | 🔄 진행 | 문서화 & 배포 (현재) |

### 총 개발 시간
- **예상**: 8-12시간
- **실제**: 약 10시간 (Phase 1-6 완료)

---

## 코드 품질

### ✅ TypeScript Strict Mode
```bash
npx tsc --noEmit
# 결과: 모든 타입 체크 통과
```

### ✅ ESLint 검사
```bash
npm run lint
# 결과: 통과 (2개 pre-existing 경고: Zustand setter 의존성)
```

### ✅ 성능 최적화
- **React.memo**: StatCard, PostCard 등 불필요한 리렌더링 방지
- **useMemo**: filteredCompanies 계산 캐싱
- **useCallback**: 이벤트 핸들러 메모이제이션
- **Code splitting**: Next.js 자동 번들 분할

### ✅ 반응형 디자인
- 모바일 (375px): 단일 열, 숨김 사이드바
- 태블릿 (768px): 최적화된 2-3열 레이아웃
- 데스크톱 (1024px): 풀 너비 사이드바 + 메인

### ✅ 애니메이션
- **Shimmer 애니메이션**: 로딩 상태 (0.6초)
- **Slide-in 애니메이션**: 모달 진입 (0.3초)
- **Recharts 애니메이션**: 차트 데이터 변경 시 (800ms)

---

## 주요 기술 결정사항

### 왜 Zustand?
✅ 간단한 API (보일러플레이트 최소)  
✅ 강력한 타입 지원  
✅ 번들 크기 작음 (~1KB)  
❌ Redux: 너무 복잡  
❌ Context: 성능 이슈 가능성

### 왜 Recharts?
✅ 반응형 차트 기본 지원  
✅ TypeScript 지원  
✅ 자동 애니메이션  
✅ 가벼운 번들  
❌ D3.js: 너무 복잡  
❌ Chart.js: 구성이 어려움

### 왜 Tailwind CSS?
✅ 빠른 개발 속도  
✅ 일관된 디자인 시스템  
✅ 내장 반응형 지원  
✅ 최소 CSS 번들  
❌ styled-components: 런타임 오버헤드

더 자세한 설계 결정사항은 [DESIGN_DECISIONS.md](./docs/DESIGN_DECISIONS.md) 참조

---

## 문서

### 📚 주요 문서
- **[CLAUDE.md](./CLAUDE.md)**: Claude Code 개발자 가이드 (경로 별칭, 구조, 설정)
- **[CARBON_EMISSIONS_ROADMAP.md](./docs/CARBON_EMISSIONS_ROADMAP.md)**: 상세 개발 로드맵 (7 Phase, 70+ Task)
- **[DESIGN_DECISIONS.md](./docs/DESIGN_DECISIONS.md)**: 설계 결정사항 및 아키텍처

### 🔍 코드 패턴
- **상태관리**: `src/store/store.ts` → `useStore()` 훅
- **데이터 페칭**: `useEffect` + Zustand store 업데이트
- **컴포넌트 구조**: 기능별 폴더 분리, 인덱스 파일로 export
- **타입 정의**: `src/lib/types.ts` 중앙 집중식 관리

---

## 배포

### 🚀 Vercel 배포 (권장)


https://carbon-web-iota.vercel.app/

```bash
# 빌드 명령어 설정 필요
# Build command: npm run build
# Publish directory: .next
```

### 📋 배포 전 체크리스트
- [ ] `npm run build` 성공
- [ ] `npm run lint` 통과
- [ ] `npx tsc --noEmit` 에러 없음
- [ ] 환경변수 설정 확인
- [ ] README.md 최종 검토
- [ ] 모바일 반응형 확인

### ✔️ 배포 후 검증
- [ ] 라이브 URL에서 대시보드 접근 가능
- [ ] 필터 기능 동작
- [ ] 차트 렌더링 확인
- [ ] 포스트 CRUD 기능 동작
- [ ] Lighthouse 성능 점수 확인

---

## 커밋 히스토리

프로젝트는 명확한 커밋 메시지로 관리됩니다:

```
feat: 새로운 기능 추가
fix: 버그 수정
chore: 설정, 빌드 관련 변경
docs: 문서 변경
refactor: 코드 구조 개선
style: 코드 스타일 (포맷팅 등)
test: 테스트 추가
```

최근 12개 커밋 확인:
```bash
git log --oneline -12
```

---

## 라이선스 및 기여

### 라이선스
MIT License - 자유로운 사용 및 수정 가능

### 기여 가이드
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 문제 해결

### 개발 중 문제
| 문제 | 해결 방법 |
|------|---------|
| 포트 3000 이미 사용 중 | `npm run dev -- -p 3001` |
| 캐시 문제 | `.next` 디렉토리 삭제 후 재실행 |
| Node 모듈 오류 | `rm -rf node_modules && npm install` |
| TypeScript 에러 | `npx tsc --noEmit` 실행 |

### 배포 문제
| 문제 | 해결 방법 |
|------|---------|
| 빌드 실패 | 메모리 증가: `NODE_OPTIONS="--max-old-space-size=4096" npm run build` |
| 성능 문제 | Recharts 데이터 최소화, 불필요한 리렌더링 제거 |
| 타입 에러 | `npm run lint` 실행하여 문제 정확히 파악 |

---

## 프로젝트 통계

- **파일 수**: 50+ 파일
- **커밋 수**: 12+ 커밋
- **코드 라인**: 3,000+ 라인
- **컴포넌트 수**: 20+ 컴포넌트
- **훅 수**: 5+ 커스텀 훅
- **타입**: 10+ TypeScript 타입

---

**마지막 업데이트**: 2026년 5월 26일  
**프로젝트 상태**: Phase 7 진행 중 (문서화 & 배포)  
**버전**: 0.1.0 (베타)

---

**이제 대시보드를 실행하고 탄소 배출 데이터를 모니터링해보세요!** 🌱
