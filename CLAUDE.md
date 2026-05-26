# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**탄소 배출 대시보드 (Carbon Emissions Dashboard)**
- 경영진과 관리자가 회사별 탄소 배출량을 모니터링하고 탄소세 계획을 세울 수 있는 대시보드 웹앱
- 상세한 개발 로드맵: `docs/CARBON_EMISSIONS_ROADMAP.md` 참조

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **UI 라이브러리**: React 18
- **언어**: TypeScript (strict mode 활성화)
- **스타일링**: Tailwind CSS 3.4.1
- **상태관리**: Zustand (계획된 구현)
- **차트**: Recharts (계획된 구현)

## 주요 커맨드

```bash
# 개발 서버 실행 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# ESLint 검사
npm run lint
```

## 디렉토리 구조 및 경로 별칭

### 경로 별칭 설정
`tsconfig.json`에서 `@/*` 별칭이 `./src/*`로 설정됨:
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/store` → `src/store`
- `@/types` → `src/types`

### 계획된 디렉토리 구조 (로드맵 기준)
```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout (HTML 구조, metadata)
│   ├── page.tsx      # 메인 대시보드 페이지
│   └── globals.css   # 전역 Tailwind 스타일
├── components/       # React 컴포넌트
│   ├── layout/       # 레이아웃 컴포넌트 (MainLayout, Header, Sidebar)
│   ├── dashboard/    # 대시보드 컴포넌트 (차트, 통계 카드, 테이블)
│   ├── posts/        # 포스트/뉴스 관련 컴포넌트
│   └── ui/           # 기본 UI 컴포넌트 (Modal, Button 등)
├── hooks/            # 커스텀 React hooks
│   ├── useStore.ts   # Zustand store 접근
│   ├── useFilters.ts # 필터 로직
│   ├── useCompanies.ts # 회사 데이터 페칭
│   └── usePosts.ts   # 포스트 데이터 페칭
├── lib/              # 유틸리티 및 헬퍼 함수
│   ├── api.ts        # 가짜 백엔드 API (200-800ms 지연, 15% 실패율 시뮬레이션)
│   ├── types.ts      # 데이터 타입 정의
│   └── utils.ts      # 데이터 포맷팅 함수
├── store/            # 상태관리 (Zustand)
│   └── store.ts      # Zustand store 정의
└── types/            # TypeScript 타입 정의
    └── index.ts      # 핵심 타입 export
```

## TypeScript 설정

- **Strict Mode**: 활성화됨 (`"strict": true`)
- **JSX**: preserve 모드 (Next.js에서 처리)
- **Module Resolution**: bundler
- 모든 소스 파일에서 타입 안전성 유지

## Tailwind CSS

### 기본 설정
- `tailwind.config.ts`: Tailwind 설정 파일
- `src/app/globals.css`: Tailwind 디렉티브 포함
  - `@tailwind base;` - 기본 스타일
  - `@tailwind components;` - 컴포넌트 클래스
  - `@tailwind utilities;` - 유틸리티 클래스

### 커스텀 색상 팔레트 (로드맵 기준)
로드맵에서 정의한 색상을 `tailwind.config.ts`의 `theme.extend.colors`에 추가:
```typescript
colors: {
  primary: { 50: '#f0fdf4', 500: '#10b981', 900: '#065f46' },     // 초록색 (환경)
  secondary: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a' },   // 파란색 (신뢰)
  accent: { 50: '#fff7ed', 500: '#f97316', 900: '#7c2d12' },      // 주황색 (경고)
  success: '#10b981',  // 초록
  warning: '#f97316',  // 주황
  error: '#ef4444'     // 빨강
}
```

## 개발 가이드

### 개발 단계 (Phase별)

**로드맵 확인**: `docs/CARBON_EMISSIONS_ROADMAP.md`에서 각 Phase의 세부 task 확인

1. **Phase 1**: 프로젝트 기초 설정 (1-2시간)
   - Next.js, TypeScript, Tailwind 초기화
   - 데이터 타입 정의
   - 가짜 백엔드 API 구현
   - Zustand 상태관리 설정

2. **Phase 2**: 레이아웃 & 네비게이션 (1-1.5시간)
   - MainLayout, Header, Sidebar 컴포넌트
   - 필터 기능 (회사 선택, 날짜 범위)

3. **Phase 3**: 대시보드 핵심 기능 (3-4시간) ⭐ 가장 중요
   - 데이터 페칭 로직 (useCompanies, usePosts)
   - 통계 카드 (StatCard)
   - Recharts 차트 (라인, 막대, 원형)
   - 테이블 컴포넌트 및 정렬 기능
   - 로딩/에러 상태 처리 (Skeleton)

4. **Phase 4**: 포스트/뉴스 기능 (1-1.5시간)
   - PostCard, PostList, PostForm 컴포넌트
   - 포스트 CRUD 작업
   - Modal 컴포넌트

5. **Phase 5**: 디자인 & 사용성 (1.5-2시간)
   - 색상 팔레트 및 타이포그래피
   - 반응형 디자인 (모바일/태블릿/데스크톱)
   - 로딩 애니메이션, 어두운 테마

6. **Phase 6**: 코드 품질 & 최적화 (1-1.5시간)
   - 성능 최적화 (React.memo, useMemo, useCallback)
   - 접근성 (A11y) 개선

7. **Phase 7**: 문서화 & 배포 (1시간)

### 데이터 구조

핵심 타입들 (`src/lib/types.ts` 기준):
- `Company`: 회사 정보 및 배출 데이터
- `GhgEmission`: 연월, 출처(가솔린/LPG/디젤), 배출량
- `Post`: 회사별 뉴스/공지사항
- `Country`: 국가 코드 및 이름

### API 시뮬레이션

`src/lib/api.ts`에서 다음 함수 제공:
- `fetchCompanies()`: 회사 목록 조회
- `fetchPosts()`: 포스트 목록 조회
- `createOrUpdatePost(post)`: 포스트 생성/수정 (15% 실패율 시뮬레이션)

모든 API 호출은 200-800ms의 지연을 갖음 (실제 네트워크 환경 시뮬레이션).

### 상태관리 패턴

Zustand store 사용:
```typescript
// 상태와 액션 정의
interface DashboardStore {
  companies: Company[];
  posts: Post[];
  selectedCompanies: string[];
  dateRange: { start: string; end: string };
  loading: boolean;
  error: string | null;
  
  setCompanies: (companies: Company[]) => void;
  // ... 기타 액션
}
```

커스텀 훅으로 사용:
```typescript
const { companies, loading, error } = useStore();
```

## 코딩 스타일

- **들여쓰기**: 2칸
- **주석**: 한국어로 작성 (필요한 경우만)
- **커밋 메시지**: 한국어로 작성 (예: `feat: 데시보드 차트 추가`)
- **변수/함수명**: 영어 (camelCase)
- **클래스/타입명**: PascalCase

## 주요 고려사항

1. **로드맵 참조**: 각 Phase는 명확한 체크리스트 포함 - 로드맵 문서를 항상 참조
2. **TypeScript 엄격성**: 모든 함수에 명시적 타입 지정
3. **컴포넌트 분리**: 재사용 가능한 작은 컴포넌트로 분리
4. **에러 처리**: API 실패(15% 확률) 대비 - 낙관적 업데이트 고려
5. **반응형 설계**: Tailwind breakpoints 활용 (md, lg)
6. **성능**: 불필요한 리렌더링 방지 (React.memo, useCallback)
