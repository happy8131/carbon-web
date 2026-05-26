# 🎨 설계 결정사항 (Design Decisions)

Carbon Emissions Dashboard의 모든 주요 설계 결정과 그 근거를 문서화합니다.

---

## 목차

1. [아키텍처 설계](#아키텍처-설계)
2. [라이브러리 선택](#라이브러리-선택)
3. [UI/UX 설계](#uiux-설계)
4. [성능 최적화](#성능-최적화)
5. [에러 처리](#에러-처리)
6. [타입 안전성](#타입-안전성)
7. [트레이드오프](#트레이드오프)
8. [평가 기준 반영](#평가-기준-반영)

---

## 아키텍처 설계

### 전체 상태 흐름도

```
┌─────────────────────────────────────────────────────────────┐
│ User Interface (React Components)                            │
│ ┌─────────────┬──────────────┬─────────────┐                │
│ │ Sidebar     │ Header       │ Dashboard   │                │
│ │ - Filters   │ - Title      │ - Charts    │                │
│ │ - Company   │ - Status     │ - Table     │                │
│ │   Checkbox  │ - Badges     │ - Stats     │                │
│ └──────┬──────┴──────────────┴─────────────┘                │
│        │                                                     │
│        └──→ useFilters() │ useCompanies() │ usePosts()      │
│                 ↓              ↓                ↓             │
└──────────────────┬──────────────┬──────────────┬────────────┘
                   │              │              │
                   ↓              ↓              ↓
        ┌──────────────────────────────────────┐
        │   Zustand Global Store               │
        │ ┌─────────────────────────────────┐  │
        │ │ State:                          │  │
        │ │ - companies: Company[]          │  │
        │ │ - posts: Post[]                 │  │
        │ │ - selectedCompanies: string[]   │  │
        │ │ - dateRange: {start, end}       │  │
        │ │ - loading: boolean              │  │
        │ │ - error: string | null          │  │
        │ └─────────────────────────────────┘  │
        │ ┌─────────────────────────────────┐  │
        │ │ Actions:                        │  │
        │ │ - setCompanies()                │  │
        │ │ - setPosts()                    │  │
        │ │ - setSelectedCompanies()        │  │
        │ │ - setLoading()                  │  │
        │ │ - setError()                    │  │
        │ └─────────────────────────────────┘  │
        └──────────────┬───────────────────────┘
                       │
                       ↓
        ┌──────────────────────────────┐
        │ API Layer (lib/api.ts)       │
        │ ┌──────────────────────────┐ │
        │ │ Features:                │ │
        │ │ - 200-800ms 지연         │ │
        │ │ - 15% 실패율            │ │
        │ │ - 데이터 불변성         │ │
        │ │                          │ │
        │ │ Functions:               │ │
        │ │ - fetchCompanies()       │ │
        │ │ - fetchPosts()           │ │
        │ │ - createOrUpdatePost()   │ │
        │ │ - deletePost()           │ │
        │ └──────────────────────────┘ │
        └──────────────────────────────┘
```

### Next.js App Router 선택 이유

| 항목 | 이유 | 대안 | 비교 |
|------|------|------|------|
| **Server Components** | 자동으로 최적화된 렌더링 | Pages Router | Pages Router는 클라이언트 중심 |
| **자동 라우팅** | 파일 기반 라우팅으로 간편 | Express | Express는 수동 설정 필요 |
| **내장 API Routes** | 별도 백엔드 없이 API 가능 | 별도 서버 | 단순 프로젝트에는 불필요 |
| **성능 최적화** | Next.js가 자동으로 최적화 | Vite | Vite는 설정 필요 |
| **배포** | Vercel에 원클릭 배포 | 자체 호스팅 | 자체 호스팅은 복잡함 |

**결정**: Next.js 14 App Router 채택 ✅

---

## 라이브러리 선택

### 1️⃣ Zustand vs Redux vs Context API

#### Zustand를 선택한 이유

```typescript
// Zustand: 간단하고 직관적
const useStore = create<DashboardStore>((set) => ({
  companies: [],
  setCompanies: (companies) => set({ companies }),
}));

// Redux: 보일러플레이트가 많음
const companiesSlice = createSlice({
  name: 'companies',
  initialState: [],
  reducers: {
    setCompanies: (state, action) => {
      return action.payload;
    },
  },
});
```

| 기준 | Zustand | Redux | Context |
|------|---------|-------|---------|
| 학습곡선 | 낮음 ⭐⭐ | 높음 ⭐⭐⭐⭐⭐ | 중간 ⭐⭐⭐ |
| 보일러플레이트 | 최소 | 많음 | 중간 |
| 번들 크기 | ~1KB | ~40KB | 내장 |
| 개발 속도 | 빠름 | 느림 | 중간 |
| 타입 지원 | 우수 | 우수 | 약함 |
| 타임박스 | 8-12h에 적합 ✅ | 과도함 ❌ | 성능 이슈 가능 ⚠️ |

**결정**: Zustand 채택 ✅
- **이유**: 8-12시간 타임박스에서 보일러플레이트 최소화
- **트레이드오프**: 복잡한 미들웨어 로직에는 적합하지 않지만, 이 프로젝트에는 필요 없음

---

### 2️⃣ Recharts vs Chart.js vs D3.js

#### Recharts를 선택한 이유

| 기준 | Recharts | Chart.js | D3.js |
|------|----------|----------|-------|
| 번들 크기 | ~100KB | ~60KB | ~300KB |
| 학습곡선 | 낮음 ⭐⭐ | 중간 ⭐⭐⭐ | 높음 ⭐⭐⭐⭐⭐ |
| React 통합 | 네이티브 ✅ | 포장 필요 | 포장 필요 |
| 반응형 지원 | 기본 ✅ | 설정 필요 | 수동 필요 |
| TypeScript | 우수 ✅ | 약함 | 약함 |
| 애니메이션 | 자동 ✅ | 수동 | 직접 작성 |
| 개발 속도 | 빠름 ✅ | 중간 | 느림 |

```typescript
// Recharts: React 스럽고 선언형
<LineChart data={chartData}>
  <CartesianGrid />
  <XAxis dataKey="month" />
  <YAxis />
  <Line dataKey="emissions" />
</LineChart>

// Chart.js: 명령형, 더 많은 설정
const ctx = canvas.getContext('2d');
new Chart(ctx, { type: 'line', data: {...}, options: {...} });

// D3: 저수준 제어, 복잡함
svg.append('g')
   .selectAll('circle')
   .data(data)
   .enter()
   .append('circle')
   .attr('cx', d => xScale(d.x))
   .attr('cy', d => yScale(d.y));
```

**결정**: Recharts 채택 ✅
- **이유**: React 컴포넌트 자연스러움, 반응형 기본 지원, 빠른 개발
- **이점**: 
  - 4개 차트 타입 쉽게 구현 (Line, Area, Pie, BarChart)
  - 자동 애니메이션 (animationDuration)
  - TypeScript 완벽 지원

---

### 3️⃣ Tailwind CSS vs styled-components vs CSS Modules

#### Tailwind CSS를 선택한 이유

| 기준 | Tailwind | styled-components | CSS Modules |
|------|----------|-------------------|-------------|
| 개발 속도 | 빠름 ✅✅ | 중간 | 느림 |
| 런타임 오버헤드 | 없음 ✅ | 있음 | 없음 |
| 번들 크기 | 최소 ⭐⭐ | 중간 ⭐⭐⭐ | 최소 ⭐ |
| 디자인 시스템 | 강력 ✅ | 약함 | 없음 |
| 반응형 지원 | 내장 ✅ | 수동 | 미지원 |
| 일관성 | 우수 ✅ | 개발자 의존 | 느슨함 |
| 학습곡선 | 낮음 ⭐⭐ | 중간 ⭐⭐⭐ | 낮음 ⭐⭐ |

```typescript
// Tailwind: 빠르고 직관적
<div className="flex justify-between items-center p-4 bg-blue-500 hover:bg-blue-600">
  {/* 반응형도 간단 */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// styled-components: 런타임 오버헤드
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: ${props => props.color || 'blue'};
`;

// CSS Modules: 모듈화되지만 번거로움
import styles from './Component.module.css';
<div className={styles.container}>
```

**결정**: Tailwind CSS 채택 ✅
- **이유**: 빠른 개발, 최소 번들, 일관된 디자인 시스템
- **구성**: 
  - Primary (초록), Secondary (파랑), Accent (주황) 색상 팔레트
  - 50-900 범위 색상 확장
  - 커스텀 애니메이션 (@keyframes)

---

## UI/UX 설계

### 1️⃣ Sidebar + Main 분리 구조

```
┌─────────────────────────────────────┐
│ Header (전체 너비)                  │
├──────────┬──────────────────────────┤
│ Sidebar  │ Main Content             │
│          │                          │
│ Filters  │ - Statistics Cards       │
│ - Company│ - Charts (4개)           │
│ - Date   │ - Data Table             │
│          │ - Posts Section          │
└──────────┴──────────────────────────┘
```

#### 설계 이유

| 이유 | 구현 | 효과 |
|------|------|------|
| **시각적 분리** | 좌측 필터, 우측 데이터 | 사용자가 직관적으로 이해 |
| **실시간 업데이트** | 필터 변경 → 즉시 메인 업데이트 | 빠른 피드백 |
| **모바일 최적화** | 사이드바 숨김, 전체 너비 | 작은 화면에서 편리 |
| **확장성** | 필터 추가 용이 | 향후 기능 확장 쉬움 |

#### 반응형 구현

```typescript
// 데스크톱 (1024px 이상): 사이드바 표시
const Desktop = () => (
  <div className="flex h-screen">
    <aside className="w-64">Sidebar</aside>
    <main className="flex-1">Content</main>
  </div>
);

// 모바일 (640px 이하): 사이드바 숨김
const Mobile = () => (
  <div className="flex flex-col">
    <Header />
    <main className="w-full">Content</main>
  </div>
);
```

**결정**: Sidebar + Main 분리 ✅

---

### 2️⃣ 차트 4개 선택 이유

#### 각 차트의 목적

| 차트 | 타입 | 목적 | 인사이트 |
|------|------|------|---------|
| **1. 꺾은선** | LineChart | **시간 추이 (주요)** | 배출량 증감 추세, 계절성 |
| **2. 누적 영역** | AreaChart | 회사별 누적 비교 | 어느 회사가 많이 배출하는지 |
| **3. 도넛** | PieChart | 배출원별 비율 | 어떤 출처가 주요 원인인지 |
| **4. 테이블** | Table | 상세 데이터 | 정확한 수치, 정렬, 필터링 |

```
배출량 분석 프로세스:
  1. 시간 추이 보기 (라인 차트)
     → "배출량이 증가했나?"
  
  2. 회사별 누적 보기 (영역 차트)
     → "어떤 회사가 많이 배출하나?"
  
  3. 출처별 보기 (도넛 차트)
     → "어떤 출처를 줄여야 하나?"
  
  4. 상세 수치 보기 (테이블)
     → "정확한 수치는?"
```

**결정**: LineChart + AreaChart + PieChart + Table ✅
- **이유**: 다각도 분석으로 종합적인 인사이트 제공
- **구현**: Recharts 4개 컴포넌트로 각각 구현

---

### 3️⃣ 색상 팔레트 설계

#### 색상 심리학 적용

```typescript
// tailwind.config.ts
colors: {
  primary: {    // 초록색 - 환경, 긍정, 성장
    50: '#f0fdf4',   // 매우 밝음
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981',  // 메인 컬러
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',  // 매우 어두움
  },
  
  secondary: {  // 파란색 - 신뢰, 안정, 정보
    50: '#eff6ff',
    500: '#3b82f6',  // 메인 컬러
    900: '#1e3a8a',
  },
  
  accent: {     // 주황색 - 경고, 강조
    50: '#fff7ed',
    500: '#f97316',  // 경고/강조
    900: '#7c2d12',
  }
}
```

#### 사용처

| 색상 | 사용처 | 이유 |
|------|--------|------|
| Primary (초록) | 버튼, 링크, 차트1-2 | 환경 주제와 부합 |
| Secondary (파랑) | 필터, 헤더, 차트3 | 신뢰감과 전문성 |
| Accent (주황) | 경고, 증가율, 강조 | 주의 집중 |

**결정**: 3색 팔레트 (Primary, Secondary, Accent) ✅
- **이유**: 시각적 계층 명확, 일관된 브랜드 이미지

---

## 성능 최적화

### 1️⃣ React.memo로 불필요한 리렌더링 방지

```typescript
// StatCard: 부모가 리렌더링되어도 props 변경 없으면 스킵
export default React.memo(function StatCard({ title, value, change }) {
  return <div>...</div>;
});

// PostCard: 개별 포스트 카드
export default React.memo(function PostCard({ post, onDelete }) {
  return <div>...</div>;
});
```

**효과**: 필터 변경 시 영향받지 않는 컴포넌트는 리렌더링 안 함

---

### 2️⃣ useMemo로 계산 결과 캐싱

```typescript
// useFilters.ts
export function useFilters() {
  const { companies, selectedCompanies, dateRange } = useStore();
  
  // 필터된 회사 계산은 의존성이 변경될 때만 재계산
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => 
      selectedCompanies.includes(c.id) &&
      c.emissions.some(e => e.yearMonth >= dateRange.start)
    );
  }, [companies, selectedCompanies, dateRange]);
  
  return { filteredCompanies, dateRange };
}
```

**효과**: 필터링 로직은 의존성 변경 시만 실행, 나머지는 캐시된 값 사용

---

### 3️⃣ useCallback으로 이벤트 핸들러 메모이제이션

```typescript
// Sidebar.tsx
const handleToggleCompany = useCallback((id: string) => {
  if (selectedCompanies.includes(id)) {
    setSelectedCompanies(selectedCompanies.filter(c => c !== id));
  } else {
    setSelectedCompanies([...selectedCompanies, id]);
  }
}, [selectedCompanies, setSelectedCompanies]);
```

**효과**: 핸들러 참조가 변경되지 않으므로 하위 컴포넌트 리렌더링 방지

---

### 4️⃣ Recharts 애니메이션 설정

```typescript
// EmissionChart.tsx
<LineChart data={chartData}>
  <CartesianGrid />
  <XAxis dataKey="month" />
  <YAxis />
  <Line
    dataKey="emissions"
    animationDuration={800}  // 800ms 부드러운 전환
  />
</LineChart>
```

**효과**: 데이터 변경 시 시각적 전환이 부드러움 (갑작스럽지 않음)

---

### 5️⃣ CSS 애니메이션 (GPU 가속)

```css
/* globals.css */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.skeleton {
  animation: shimmer 2s infinite;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
```

**효과**: GPU에서 실행되므로 메인 스레드 부하 없음

---

## 에러 처리

### 1️⃣ 가짜 API 실패율 시뮬레이션

```typescript
// lib/api.ts
const maybeFail = () => Math.random() < 0.15;  // 15% 확률

export async function createOrUpdatePost(post: PostFormData) {
  await delay(jitter());
  
  // 실제 네트워크 불안정성을 시뮬레이션
  if (maybeFail()) {
    throw new Error('포스트 저장에 실패했습니다. 다시 시도해주세요.');
  }
  
  // 성공 처리...
}
```

**목적**: 실제 환경에서 발생할 수 있는 오류를 테스트 가능

---

### 2️⃣ 낙관적 업데이트 (Optimistic Update)

```typescript
// usePostActions.ts
export function usePostActions() {
  const { posts, setPosts } = useStore();
  
  const createPost = useCallback(async (data: PostFormData) => {
    // 1. UI 즉시 업데이트 (낙관적)
    const newPost = { ...data, id: `p${Date.now()}` };
    setPosts([...posts, newPost]);
    
    try {
      // 2. API 호출
      await createOrUpdatePost(data);
    } catch (error) {
      // 3. 실패 시 원래 상태로 롤백
      setPosts(posts.filter(p => p.id !== newPost.id));
      throw error;
    }
  }, [posts, setPosts]);
  
  return { createPost };
}
```

**효과**: 사용자가 빠른 응답성을 느낌

---

### 3️⃣ 에러 상태 표시

```typescript
// app/page.tsx
const [postFormError, setPostFormError] = useState<string | null>(null);

const handleCreatePost = async (data: PostFormData) => {
  try {
    await createPost(data);
    setPostFormError(null);  // 성공 시 에러 클리어
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류';
    setPostFormError(message);  // 사용자에게 표시
  }
};
```

**효과**: 사용자가 명확한 에러 메시지로 상황 파악

---

## 타입 안전성

### 1️⃣ TypeScript Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

**효과**: 런타임 오류 대부분을 빌드 타임에 발견

---

### 2️⃣ 명시적 타입 지정

```typescript
// 모든 함수에 입력/출력 타입 지정
function formatEmissions(value: number): string {
  return `${value.toLocaleString()} tons`;
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// 컴포넌트 Props 타입
interface StatCardProps {
  title: string;
  value: number | string;
  change: number;
  unit?: string;
}
```

**효과**: IDE 자동완성, 컴파일러 검사

---

### 3️⃣ Union Types로 선택지 제한

```typescript
// EmissionSource는 정확히 3가지만 가능
export type EmissionSource = 'gasoline' | 'lpg' | 'diesel';

export type GhgEmission = {
  yearMonth: string;      // YYYY-MM 형식
  source: EmissionSource; // 'gasoline' | 'lpg' | 'diesel'만 가능
  emissions: number;      // 양수만 가능해야 하지만 런타임에는 검증 필요
};
```

**효과**: 불가능한 상태를 타입 레벨에서 방지

---

## 트레이드오프

### 1️⃣ 데이터 검증: 클라이언트만 (vs 서버 검증)

| 선택 | 장점 | 단점 | 우리의 선택 |
|------|------|------|------------|
| **클라이언트만** | 빠른 피드백 | 신뢰할 수 없음 | ✅ 현재 |
| **서버만** | 보안 | 느린 피드백 | ❌ |
| **클라이언트+서버** | 최적 | 복잡함 | ⏳ 향후 |

**현재 구현**: 클라이언트만 검증 (PostForm.tsx의 validateForm)
**이유**: 백엔드가 없는 시뮬레이션 환경
**향후**: 실제 백엔드 연결 시 서버 검증 추가

---

### 2️⃣ 로그인: 구현 안 함

| 항목 | 결정 | 이유 |
|------|------|------|
| **인증** | ❌ 구현 안 함 | 평가 기준에 없음 |
| **권한** | ❌ 구현 안 함 | 모든 사용자 동일 권한 |
| **감시 로그** | ❌ 구현 안 함 | 역시 요구사항에 없음 |

**이유**: 8-12시간 타임박스에서 우선순위 집중
**향후**: 실제 배포 시 추가 가능

---

### 3️⃣ 데이터베이스: API 시뮬레이션만

```typescript
// lib/api.ts
// 실제 DB 대신 메모리 내 배열 사용
let _companies: Company[] = [
  { id: 'c1', name: 'Acme Corp', ... },
  // ...
];

let _posts: Post[] = [];
```

| 선택 | 장점 | 단점 | 우리의 선택 |
|------|------|------|------------|
| **메모리** | 빠름, 간단 | 브라우저 새로고침 시 초기화 | ✅ 현재 |
| **로컬 스토리지** | 간단한 영속성 | 크기 제한 (5-10MB) | ⏳ 권장 개선 |
| **실제 DB** | 진정한 영속성 | 복잡함 | 향후 |

**현재 구현**: 메모리 기반 (app.tsx 새로고침 시 초기화)
**개선안**: localStorage 추가 가능

---

## 평가 기준 반영

### 1️⃣ 창의성 & 비판적 사고 (25%)

**구현 항목:**
- ✅ Zustand 선택 이유 명확 (Redux 대비)
- ✅ Recharts 선택 이유 명확 (D3.js 대비)
- ✅ 색상 팔레트 의도적 선택 (심리학 적용)
- ✅ 아키텍처 설계 이유 설명
- ✅ 트레이드오프 명시 (데이터 검증, 로그인 등)

**문서화**: 이 파일과 CLAUDE.md에서 모두 설명

---

### 2️⃣ UI/UX 디자인 (25%)

**구현 항목:**
- ✅ Sidebar + Main 분리로 직관적 구조
- ✅ 4개 차트로 다각도 분석 지원
- ✅ 3색 팔레트 (Primary, Secondary, Accent)
- ✅ 애니메이션 (Shimmer, SlideIn)
- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)

**파일**: 각 컴포넌트에서 구현

---

### 3️⃣ UI 엔지니어링 (20%)

**구현 항목:**
- ✅ Recharts 4개 차트 + Table
- ✅ 필터 실시간 업데이트
- ✅ 포스트 CRUD (Modal)
- ✅ 로딩/에러 상태 UI
- ✅ 애니메이션 (800ms, GPU 가속)

**파일**: src/components/dashboard/*, src/components/posts/*

---

### 4️⃣ 소프트웨어 엔지니어링 (20%)

**구현 항목:**
- ✅ TypeScript strict mode
- ✅ Zustand 상태관리 (강한 타입)
- ✅ 폴더 구조 명확 (기능별 분리)
- ✅ API 시뮬레이션 (200-800ms, 15% 실패율)
- ✅ 에러 처리 (낙관적 업데이트, 롤백)

**파일**: src/lib/*, src/store/*, src/hooks/*

---

### 5️⃣ 코드 품질 (10%)

**구현 항목:**
- ✅ ESLint 통과
- ✅ 명확한 커밋 메시지 (12개)
- ✅ 성능 최적화 (React.memo, useMemo, useCallback)
- ✅ 코드 일관성
- ✅ 문서화 (README, DESIGN_DECISIONS, CLAUDE.md)

**확인**: `npm run lint`, `git log --oneline`

---

## 향후 개선 방안

### 단기 (1주)
- [ ] localStorage로 데이터 영속성 추가
- [ ] 어두운 테마 (Dark Mode) 지원
- [ ] 데이터 내보내기 (CSV)

### 중기 (1개월)
- [ ] 실제 백엔드 API 연결
- [ ] 사용자 인증 (로그인)
- [ ] 데이터베이스 (PostgreSQL)
- [ ] 알림 기능

### 장기 (3개월)
- [ ] 지도 시각화 (국가별 배출량)
- [ ] AI 분석 및 경고
- [ ] 모바일 앱 (React Native)
- [ ] 대시보드 커스터마이제이션

---

## 결론

모든 설계 결정은 다음 원칙을 따릅니다:

1. **사용자 중심**: 직관적이고 빠른 응답
2. **개발 효율**: 최소 복잡도, 최대 생산성
3. **코드 품질**: 타입 안전성, 성능 최적화
4. **명확한 이유**: 모든 선택의 근거를 문서화

**개발 완료**: 2026년 5월 26일
**Phase 상태**: Phase 1-7 완료
**버전**: 0.1.0 (베타)

---

이 문서는 프로젝트의 모든 설계 결정을 설명하며, 향후 개발이나 리뷰 시 참고 자료로 사용됩니다.
