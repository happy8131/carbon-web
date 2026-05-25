# 🌍 탄소 배출 대시보드 (Carbon Emissions Dashboard) - 프로젝트 로드맵

## 프로젝트 개요

**목표**: 경영진과 관리자가 회사별 탄소 배출량을 모니터링하고 탄소세 계획을 세울 수 있는 대시보드 웹앱

**기술 스택**:
- Frontend: Next.js 14+ (App Router) + React 18 + TypeScript
- 상태관리: Zustand (간단함) 또는 React Context
- 스타일: Tailwind CSS
- 차트: Recharts (가볍고 빠름)
- 가짜 백엔드: lib/api.ts (200-800ms 지연, 15% 실패율)

**평가 기준**:
- 창의성 & 비판적 사고 (25%)
- UI/UX 디자인 (25%)
- UI 엔지니어링 (20%)
- 소프트웨어 엔지니어링 (20%)
- 코드 품질 (10%)

---

## Phase 1️⃣: 프로젝트 기초 설정 (1-2시간)

### Task 1-1: Next.js + TypeScript 초기화 (20분)
- [ ] `npx create-next-app@latest carbon-dashboard --typescript --app`
- [ ] TypeScript strict mode 활성화 (`"strict": true` in tsconfig.json)
- [ ] git 저장소 초기화 (`git init`)
- [ ] 첫 커밋: `git commit -m "initial: create Next.js project"`

### Task 1-2: Tailwind CSS 설정 (15분)
- [ ] Tailwind CSS 설치 및 설정 (Next.js에 기본 포함)
- [ ] `src/app/globals.css`에 Tailwind 디렉티브 확인:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- [ ] `tailwind.config.ts` 색상 팔레트 커스터마이징:
  ```typescript
  colors: {
    primary: { 50: '#f0fdf4', 500: '#10b981', 900: '#065f46' },
    secondary: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a' },
    accent: { 50: '#fff7ed', 500: '#f97316', 900: '#7c2d12' },
  }
  ```

### Task 1-3: 폴더 구조 생성 (15분)
- [ ] 디렉토리 생성:
  ```bash
  mkdir -p src/{components/{layout,dashboard,posts,ui},lib,hooks,store,types}
  ```
- [ ] 각 폴더에 `index.ts` 또는 `index.tsx` 생성 (재내보내기 용)
- [ ] 폴더 구조 확인:
  ```
  src/
  ├── app/
  ├── components/
  │   ├── dashboard/
  │   ├── layout/
  │   ├── posts/
  │   └── ui/
  ├── hooks/
  ├── lib/
  ├── store/
  └── types/
  ```

### Task 1-4: 데이터 타입 정의 (20분)
- [ ] `src/lib/types.ts` 파일 생성
- [ ] TypeScript 타입 작성:
  ```typescript
  export type Country = {
    code: string;
    name: string;
  };

  export type GhgEmission = {
    yearMonth: string;      // "2025-01"
    source: string;         // "gasoline" | "lpg" | "diesel"
    emissions: number;      // CO2 equivalent tons
  };

  export type Company = {
    id: string;
    name: string;
    country: string;
    emissions: GhgEmission[];
  };

  export type Post = {
    id: string;
    title: string;
    resourceUid: string;    // Company.id
    dateTime: string;       // "2024-02"
    content: string;
  };
  ```
- [ ] 타입 파일 컴파일 확인 (에러 없는지)

### Task 1-5: 가짜 백엔드 API 구현 (30분)
- [ ] `src/lib/api.ts` 파일 생성
- [ ] 테스트 데이터 정의:
  ```typescript
  const companies: Company[] = [
    {
      id: "c1",
      name: "Acme Corp",
      country: "US",
      emissions: [
        { yearMonth: "2024-01", source: "gasoline", emissions: 120 },
        { yearMonth: "2024-02", source: "gasoline", emissions: 110 },
        { yearMonth: "2024-03", source: "diesel", emissions: 95 }
      ]
    }
    // ... 더 많은 회사
  ]
  ```
- [ ] API 헬퍼 함수:
  ```typescript
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  const jitter = () => 200 + Math.random() * 600;
  const maybeFail = () => Math.random() < 0.15;
  ```
- [ ] API 함수 구현:
  - [ ] `fetchCompanies()` - 회사 목록 조회
  - [ ] `fetchPosts()` - 포스트 목록 조회
  - [ ] `createOrUpdatePost(post)` - 포스트 생성/수정 (15% 실패율)
- [ ] 테스트: 각 함수가 지연 후 데이터 반환하는지 확인

### Task 1-6: Zustand 상태관리 설정 (20분)
- [ ] `npm install zustand`
- [ ] `src/store/store.ts` 파일 생성
- [ ] 상태 및 액션 정의:
  ```typescript
  interface DashboardStore {
    // 상태
    companies: Company[];
    posts: Post[];
    selectedCompanies: string[];
    dateRange: { start: string; end: string };
    loading: boolean;
    error: string | null;
    
    // 액션
    setCompanies: (companies: Company[]) => void;
    setPosts: (posts: Post[]) => void;
    setSelectedCompanies: (ids: string[]) => void;
    setDateRange: (start: string, end: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  }
  ```
- [ ] Zustand store 생성 완료

### Task 1-7: 유틸리티 함수 작성 (15분)
- [ ] `src/lib/utils.ts` 파일 생성
- [ ] 데이터 포맷팅 함수:
  ```typescript
  // 예: formatEmissions(1234.56) → "1,234.56 tons"
  export function formatEmissions(value: number): string
  
  // 예: formatDate("2025-01") → "Jan 2025"
  export function formatDate(yearMonth: string): string
  
  // 예: calculateChange(100, 90) → 11.11
  export function calculateChange(current: number, previous: number): number
  
  // 배출 출처별 합계
  export function groupEmissionsBySource(emissions: GhgEmission[])
  ```
- [ ] 테스트: 각 함수가 올바른 형식 반환하는지 확인

### Task 1-8: 초기 커밋
- [ ] `git add .`
- [ ] `git commit -m "feat: setup Next.js, TypeScript, Tailwind, folder structure"`
- [ ] `git commit -m "feat: define data types (Company, GhgEmission, Post)"`
- [ ] `git commit -m "feat: implement fake backend API with simulated latency"`
- [ ] `git commit -m "feat: setup Zustand store for state management"`
- [ ] `git commit -m "feat: add utility functions for data formatting"`

---

## Phase 2️⃣: 레이아웃 & 네비게이션 (1-1.5시간)

### Task 2-1: 기본 레이아웃 컴포넌트 (30분)
- [ ] `src/components/layout/MainLayout.tsx` 생성
  ```typescript
  // 구조:
  // <div className="flex h-screen">
  //   <Sidebar />
  //   <main className="flex-1 flex flex-col">
  //     <Header />
  //     <div className="flex-1 overflow-auto">
  //       {children}
  //     </div>
  //   </main>
  // </div>
  ```
- [ ] `src/app/layout.tsx` 수정:
  ```typescript
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
          <MainLayout>{children}</MainLayout>
        </body>
      </html>
    )
  }
  ```
- [ ] 테스트: 레이아웃이 화면에 렌더링되는지 확인

### Task 2-2: 헤더 컴포넌트 (20분)
- [ ] `src/components/layout/Header.tsx` 생성
- [ ] 요소:
  - [ ] 제목: "Carbon Emissions Dashboard"
  - [ ] 새로고침 버튼 (아이콘)
  - [ ] 필터 활성 표시 (선택된 회사 수, 날짜 범위)
- [ ] Tailwind 스타일:
  ```typescript
  // flex justify-between items-center px-6 py-4 border-b border-gray-200
  ```

### Task 2-3: 사이드바 (네비게이션 드로어) (45분)
- [ ] `src/components/layout/Sidebar.tsx` 생성
- [ ] 구조:
  ```typescript
  <aside className="w-64 bg-gray-50 border-r border-gray-200">
    {/* 로고 */}
    {/* 네비게이션 메뉴 */}
    {/* 회사 필터 */}
    {/* 날짜 범위 필터 */}
  </aside>
  ```
  
#### Task 2-3-1: 네비게이션 메뉴 (15분)
- [ ] 메뉴 항목:
  - [ ] Dashboard (/)
  - [ ] Companies (/companies) [선택사항]
  - [ ] Reports (/reports) [선택사항]
- [ ] 활성 메뉴 하이라이트 (next/navigation 사용)
  
#### Task 2-3-2: 회사 필터 섹션 (20분)
- [ ] 제목: "Select Companies"
- [ ] "All" 체크박스
- [ ] 각 회사별 체크박스
- [ ] 체크박스 변경 시 → Zustand store 업데이트
  ```typescript
  const { selectedCompanies, setSelectedCompanies } = useStore()
  
  const handleToggle = (id: string) => {
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter(c => c !== id))
    } else {
      setSelectedCompanies([...selectedCompanies, id])
    }
  }
  ```

#### Task 2-3-3: 날짜 범위 필터 (15분)
- [ ] 라벨: "Date Range"
- [ ] 선택 옵션:
  - [ ] Last 3 months
  - [ ] Last 6 months
  - [ ] Last 12 months
  - [ ] Custom [선택사항]
- [ ] 변경 시 → Zustand store 업데이트

### Task 2-4: 반응형 디자인 (20분)
- [ ] 모바일 (< 640px):
  - [ ] 사이드바 숨김
  - [ ] 햄버거 메뉴 아이콘 추가
  - [ ] 전체 너비 메인 콘텐츠
- [ ] 태블릿 (640-1024px):
  - [ ] 사이드바 좁게 (아이콘만)
- [ ] 데스크톱 (> 1024px):
  - [ ] 사이드바 전체 크기
- [ ] Tailwind breakpoints 사용: `hidden md:block lg:block`

### Task 2-5: 커스텀 훅 생성 (15분)
- [ ] `src/hooks/useStore.ts` 생성
  ```typescript
  import { create } from 'zustand'
  import { DashboardStore } from '@/store/store'
  
  export const useStore = create<DashboardStore>(...)
  ```
- [ ] `src/hooks/useFilters.ts` 생성
  ```typescript
  export function useFilters() {
    const { selectedCompanies, dateRange, companies } = useStore()
    
    // 필터링된 데이터 반환
    const filteredCompanies = companies.filter(c => 
      selectedCompanies.includes(c.id)
    )
    
    return { filteredCompanies, dateRange }
  }
  ```

### Task 2-6: 테스트 및 커밋
- [ ] 레이아웃 시각 확인:
  - [ ] 데스크톱: 사이드바 + 메인
  - [ ] 모바일: 전체 너비
- [ ] 필터 기능:
  - [ ] 회사 체크박스 체크 시 store 업데이트
  - [ ] 날짜 범위 변경 시 store 업데이트
- [ ] `git commit -m "feat: implement MainLayout, Header, and Sidebar with filters"`
- [ ] `git commit -m "feat: add responsive design for mobile/tablet/desktop"`
- [ ] `git commit -m "feat: create useFilters custom hook"`

---

## Phase 3️⃣: 대시보드 핵심 기능 (3-4시간) ⭐ 가장 중요!

### Task 3-1: 데이터 페칭 로직 구현 (45분)
- [ ] `src/hooks/useCompanies.ts` 생성
  ```typescript
  export function useCompanies() {
    const { companies, loading, error, setCompanies, setLoading, setError } = useStore()
    
    useEffect(() => {
      const loadData = async () => {
        setLoading(true)
        try {
          const data = await fetchCompanies()
          setCompanies(data)
        } catch (err) {
          setError((err as Error).message)
        } finally {
          setLoading(false)
        }
      }
      
      loadData()
    }, [])
    
    return { companies, loading, error }
  }
  ```
- [ ] `src/hooks/usePosts.ts` 생성 (동일 패턴)
- [ ] 에러 경계 (Error Boundary) 설정:
  - [ ] `src/components/ErrorBoundary.tsx` 생성
  - [ ] 에러 메시지 + 재시도 버튼 표시

### Task 3-2: 대시보드 상단 통계 카드 (50분)
- [ ] `src/components/dashboard/StatCard.tsx` 생성
  ```typescript
  interface StatCardProps {
    title: string
    value: string | number
    change: number
    unit?: string
  }
  ```
  
#### Task 3-2-1: 전체 배출량 카드 (15분)
- [ ] 값: 선택된 회사들의 총 배출량 (tons)
- [ ] 변화율: 이전 기간 대비 %
- [ ] 화살표 아이콘 (🔴 상승/🟢 하강)
  
#### Task 3-2-2: 출처별 배출량 카드 (20분)
- [ ] 가솔린: X tons
- [ ] LPG: Y tons
- [ ] 디젤: Z tons
- 각각 카드로 표시
  
#### Task 3-2-3: 배출 추이 카드 (15분)
- [ ] 현재 월 vs 이전 월 비교
- [ ] % 변화 표시
- [ ] 색상 코딩: 빨강(증가) vs 초록(감소)

### Task 3-3: Recharts 꺾은선 차트 (1시간)
- [ ] `npm install recharts`
- [ ] `src/components/dashboard/EmissionChart.tsx` 생성
- [ ] 데이터 포맷:
  ```typescript
  const chartData = [
    {
      month: 'Jan',
      'Acme Corp': 120,
      'Globex': 80,
      'TechCorp': 95
    },
    // ...
  ]
  ```
- [ ] 차트 구현:
  - [ ] X축: 월 (Jan, Feb, Mar ...)
  - [ ] Y축: CO2 배출량 (톤)
  - [ ] 각 회사별 라인 (색상 구분)
  - [ ] 범례 (Legend) 표시
  - [ ] 호버 시 Tooltip 표시
  - [ ] 반응형 (ResponsiveContainer)
- [ ] 스타일:
  ```typescript
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="Acme Corp" stroke="#10b981" />
    <Line type="monotone" dataKey="Globex" stroke="#3b82f6" />
  </LineChart>
  ```

### Task 3-4: 막대 차트 - 회사별 배출량 비교 (45분)
- [ ] `src/components/dashboard/CompanyChart.tsx` 생성
- [ ] 데이터:
  ```typescript
  const data = [
    { name: 'Acme Corp', emissions: 325 },
    { name: 'Globex', emissions: 305 },
    { name: 'TechCorp', emissions: 280 }
  ]
  ```
- [ ] 막대 차트:
  - [ ] 회사명 (X축)
  - [ ] 배출량 (Y축)
  - [ ] 최대값 기준 색상 그라데이션
- [ ] 정렬: 배출량 내림차순

### Task 3-5: 원형 차트 - 출처별 배출 비율 (40분)
- [ ] `src/components/dashboard/SourceChart.tsx` 생성
- [ ] 데이터:
  ```typescript
  const data = [
    { name: 'Gasoline', value: 450 },
    { name: 'LPG', value: 280 },
    { name: 'Diesel', value: 190 }
  ]
  ```
- [ ] 원형 차트:
  - [ ] 각 출처별 슬라이스
  - [ ] 색상 구분
  - [ ] 백분율 표시
  - [ ] 범례

### Task 3-6: 회사별 데이터 테이블 (50분)
- [ ] `src/components/dashboard/CompanyTable.tsx` 생성
- [ ] 테이블 컬럼:
  - [ ] 회사명
  - [ ] 국가
  - [ ] 최근 월 배출량
  - [ ] 변화율 (%)
  - [ ] 상세보기 버튼
  
#### Task 3-6-1: 테이블 정렬 기능 (20분)
- [ ] 헤더 클릭 시 정렬
- [ ] 배출량 오름차순/내림차순
- [ ] 상태: sortBy, sortOrder
  
#### Task 3-6-2: 페이지네이션 (선택사항) (15분)
- [ ] 10개씩 나눔
- [ ] 이전/다음 버튼

### Task 3-7: 로딩 & 에러 상태 UI (30분)
- [ ] `src/components/Skeleton.tsx` 생성
  - [ ] SkeletonCard
  - [ ] SkeletonChart
  - [ ] SkeletonTable
- [ ] 로딩 상태:
  ```typescript
  {loading ? <SkeletonChart /> : <EmissionChart />}
  ```
- [ ] 에러 상태:
  ```typescript
  {error && (
    <div className="p-4 bg-red-50 text-red-800 rounded">
      {error}
      <button onClick={retry}>재시도</button>
    </div>
  )}
  ```

### Task 3-8: 메인 대시보드 페이지 통합 (30분)
- [ ] `src/app/page.tsx` 작성
- [ ] 레이아웃:
  ```typescript
  <MainLayout>
    <div className="p-6">
      {/* 통계 카드 행 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard ... />
      </div>
      
      {/* 차트 행 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <EmissionChart ... />
        <SourceChart ... />
      </div>
      
      {/* 회사 테이블 */}
      <div className="mt-6">
        <CompanyChart ... />
      </div>
      
      {/* 회사 목록 테이블 */}
      <div className="mt-6">
        <CompanyTable ... />
      </div>
    </div>
  </MainLayout>
  ```

### Task 3-9: 데이터 필터링 로직 (20분)
- [ ] `useFilters` 훅 개선
- [ ] 선택된 회사로 필터링
- [ ] 날짜 범위로 필터링
- [ ] 필터 변경 시 → 차트/테이블 자동 업데이트

### Task 3-10: 테스트 및 커밋
- [ ] 각 차트 렌더링 확인
- [ ] 필터 변경 시 데이터 업데이트 확인
- [ ] 로딩 상태 표시 확인
- [ ] 에러 상태 표시 확인 (fetch 실패 시뮬레이션)
- [ ] `git commit -m "feat: implement EmissionChart with Recharts"`
- [ ] `git commit -m "feat: add CompanyChart and SourceChart"`
- [ ] `git commit -m "feat: implement CompanyTable with sorting"`
- [ ] `git commit -m "feat: add StatCards for KPIs"`
- [ ] `git commit -m "feat: implement loading and error states with Skeleton"`
- [ ] `git commit -m "feat: integrate all components into main dashboard"`

---

## Phase 4️⃣: 포스트/뉴스 기능 (1-1.5시간)

### Task 4-1: 포스트 카드 컴포넌트 (20분)
- [ ] `src/components/posts/PostCard.tsx` 생성
- [ ] 표시 정보:
  - [ ] 제목
  - [ ] 관련 회사명
  - [ ] 날짜 (포맷: "Feb 2024")
  - [ ] 콘텐츠 미리보기 (최대 100자)
  - [ ] 삭제 버튼 (선택사항)
- [ ] 스타일:
  ```typescript
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 className="font-semibold text-lg">{post.title}</h3>
    <p className="text-sm text-gray-600">{company.name} · {formatDate(post.dateTime)}</p>
    <p className="text-gray-700 mt-2 line-clamp-2">{post.content}</p>
  </div>
  ```

### Task 4-2: 포스트 리스트 컴포넌트 (30분)
- [ ] `src/components/posts/PostList.tsx` 생성
- [ ] 레이아웃:
  ```typescript
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {filteredPosts.map(post => (
      <PostCard key={post.id} post={post} company={...} />
    ))}
  </div>
  ```
- [ ] 필터링 로직:
  - [ ] 선택된 회사의 포스트만 표시
  - [ ] 날짜 범위 내 포스트만 표시
- [ ] 빈 상태:
  ```typescript
  {filteredPosts.length === 0 && (
    <div className="text-center py-8 text-gray-500">
      No posts found
    </div>
  )}
  ```

### Task 4-3: 포스트 작성 폼 (35분)
- [ ] `src/components/posts/PostForm.tsx` 생성
- [ ] 폼 필드:
  - [ ] 제목 (text input, required)
  - [ ] 회사 선택 (select dropdown)
  - [ ] 날짜 (date input, "YYYY-MM" format)
  - [ ] 콘텐츠 (textarea)
- [ ] 유효성 검사:
  ```typescript
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validate = () => {
    const newErrors = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!company) newErrors.company = "Company is required"
    if (!dateTime) newErrors.dateTime = "Date is required"
    if (!content.trim()) newErrors.content = "Content is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  ```
- [ ] 에러 메시지 표시
- [ ] 제출 버튼 (로딩 상태 표시)

### Task 4-4: 포스트 CRUD 액션 (30분)
- [ ] `src/hooks/usePostActions.ts` 생성
  
#### Task 4-4-1: 포스트 생성 (10분)
- [ ] `createPost()` 함수
  ```typescript
  const createPost = async (postData: Omit<Post, 'id'>) => {
    setLoading(true)
    try {
      const newPost = await createOrUpdatePost(postData)
      setPosts([...posts, newPost])
    } catch (err) {
      setError('Failed to create post')
    } finally {
      setLoading(false)
    }
  }
  ```

#### Task 4-4-2: 포스트 수정 (10분)
- [ ] `updatePost()` 함수
  ```typescript
  const updatePost = async (id: string, postData: Omit<Post, 'id'>) => {
    // 낙관적 업데이트 (선택사항)
    setPosts(posts.map(p => p.id === id ? {...p, ...postData} : p))
    
    try {
      await createOrUpdatePost({...postData, id})
    } catch (err) {
      // 롤백
      reloadPosts()
    }
  }
  ```

#### Task 4-4-3: 포스트 삭제 (10분)
- [ ] `deletePost()` 함수
  ```typescript
  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return
    
    setPosts(posts.filter(p => p.id !== id))
    
    // 실제 삭제는 API에서 구현 (현재: 클라이언트만)
  }
  ```

### Task 4-5: 포스트 모달/페이지 (25분)
- [ ] 포스트 작성 화면:
  - [ ] Option 1: 모달 팝업
  - [ ] Option 2: 별도 페이지 (/posts/new)
  
- [ ] 선택: **모달 방식** (사용성 좋음)
  ```typescript
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        + New Post
      </button>
      
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <PostForm />
        </Modal>
      )}
    </>
  )
  ```

### Task 4-6: 모달 컴포넌트 (15분)
- [ ] `src/components/ui/Modal.tsx` 생성
- [ ] 기본 구조:
  ```typescript
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      {children}
    </div>
  </div>
  ```
- [ ] ESC 키로 닫기 처리
- [ ] 백드롭 클릭으로 닫기 (선택사항)

### Task 4-7: 대시보드에 포스트 섹션 추가 (15분)
- [ ] `src/app/page.tsx` 수정
- [ ] 포스트 섹션 추가:
  ```typescript
  <section className="mt-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Related Posts</h2>
      <button onClick={() => setIsPostFormOpen(true)}>
        + New Post
      </button>
    </div>
    <PostList />
  </section>
  ```

### Task 4-8: 테스트 및 커밋
- [ ] 포스트 목록 표시 확인
- [ ] 새 포스트 작성 버튼 클릭 → 모달 열림
- [ ] 포스트 작성 폼 유효성 검사 확인
- [ ] 포스트 저장 → 목록에 즉시 추가 확인
- [ ] 포스트 삭제 → 목록에서 제거 확인
- [ ] 필터 변경 → 포스트 목록 업데이트 확인
- [ ] API 실패 → 에러 메시지 표시 확인 (15% 실패율 테스트)
- [ ] `git commit -m "feat: implement PostCard and PostList components"`
- [ ] `git commit -m "feat: create PostForm with validation"`
- [ ] `git commit -m "feat: add Modal component"`
- [ ] `git commit -m "feat: implement post CRUD operations"`
- [ ] `git commit -m "feat: integrate posts section into dashboard"`

---

## Phase 5️⃣: 디자인 & 사용성 (1.5-2시간)

### Task 5-1: 색상 팔레트 구성 (20분)
- [ ] `tailwind.config.ts` 커스터마이징
- [ ] 색상 정의:
  ```typescript
  colors: {
    primary: {
      50: '#f0fdf4',   // 매우 밝음
      100: '#dcfce7',
      500: '#10b981',  // 메인 (초록색 - 환경)
      600: '#059669',
      700: '#047857',
      900: '#065f46'   // 매우 어두움
    },
    secondary: {
      50: '#eff6ff',
      500: '#3b82f6',  // 파란색 (신뢰)
      900: '#1e3a8a'
    },
    accent: {
      50: '#fff7ed',
      500: '#f97316',  // 주황색 (주의/경고)
      900: '#7c2d12'
    },
    success: '#10b981',  // 초록
    warning: '#f97316',  // 주황
    error: '#ef4444'     // 빨강
  }
  ```

### Task 5-2: 타이포그래피 설정 (15분)
- [ ] 폰트 설정:
  ```typescript
  // src/app/layout.tsx
  import { Inter } from 'next/font/google'
  
  const inter = Inter({ subsets: ['latin'] })
  ```
- [ ] 타이포그래피 스케일:
  - [ ] Heading 1: 32px, 800, line-height: 1.2
  - [ ] Heading 2: 24px, 700, line-height: 1.3
  - [ ] Heading 3: 20px, 600, line-height: 1.4
  - [ ] Body: 16px, 400, line-height: 1.6
  - [ ] Small: 14px, 400, line-height: 1.5
  - [ ] Caption: 12px, 400, line-height: 1.4

### Task 5-3: 스페이싱 & 컴포넌트 가이드 (20분)
- [ ] 8px 그리드 시스템:
  - [ ] xs: 4px
  - [ ] sm: 8px
  - [ ] md: 16px
  - [ ] lg: 24px
  - [ ] xl: 32px
- [ ] 경계선 반경:
  - [ ] sm: 4px (버튼)
  - [ ] md: 8px (카드)
  - [ ] lg: 12px (모달)
- [ ] 그림자:
  - [ ] sm: 0 1px 2px rgba(0,0,0,0.05)
  - [ ] md: 0 4px 6px rgba(0,0,0,0.1)
  - [ ] lg: 0 10px 15px rgba(0,0,0,0.1)

### Task 5-4: 통일된 컴포넌트 스타일 적용 (40분)
- [ ] 카드 컴포넌트 래퍼:
  ```typescript
  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
  ```
- [ ] 버튼 스타일:
  ```typescript
  // Primary (초록)
  className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
  
  // Secondary (회색)
  className="bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200"
  ```
- [ ] 입력 필드:
  ```typescript
  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary-500"
  ```
- [ ] 통지/알림:
  ```typescript
  // Success
  className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md p-4"
  
  // Error
  className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4"
  ```

### Task 5-5: 반응형 디자인 개선 (40분)

#### Task 5-5-1: 모바일 우선 (20분)
- [ ] 사이드바: 숨김 → 모바일 메뉴 토글
  ```typescript
  {/* 모바일 */}
  <button className="md:hidden p-2">☰</button>
  <Sidebar className="hidden md:block" />
  ```
- [ ] 그리드: 단일 컬럼 → 2컬럼
  ```typescript
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  ```
- [ ] 텍스트 크기: sm ↔ lg
  ```typescript
  className="text-lg md:text-xl lg:text-2xl"
  ```
- [ ] 패딩/마진: sm ↔ lg
  ```typescript
  className="p-4 md:p-6 lg:p-8"
  ```

#### Task 5-5-2: 테이블 반응형 (15분)
- [ ] 모바일: 테이블 → 카드 레이아웃
  ```typescript
  {/* 모바일: 카드 */}
  <div className="md:hidden">
    {companies.map(c => (
      <div className="p-4 border-b">{/* 카드 스타일 */}</div>
    ))}
  </div>
  
  {/* 데스크톱: 테이블 */}
  <table className="hidden md:table w-full">
  ```
- [ ] 또는 가로 스크롤 가능한 테이블

### Task 5-6: 로딩 & 에러 상태 애니메이션 (30분)
- [ ] 스켈레톤 로더 애니메이션:
  ```css
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  .skeleton {
    animation: shimmer 2s infinite;
  }
  ```
- [ ] 로딩 스피너:
  ```typescript
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
  ```
- [ ] 에러 메시지 슬라이드인:
  ```css
  @keyframes slideIn {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  ```
- [ ] 토스트 알림 (선택사항)

### Task 5-7: 차트 애니메이션 (20분)
- [ ] Recharts 애니메이션:
  ```typescript
  <LineChart data={data} isAnimationActive={true}>
    <Line animationDuration={800} />
  </LineChart>
  ```
- [ ] 호버 효과:
  ```typescript
  <Line 
    onMouseEnter={() => setActiveIndex(...)}
    onMouseLeave={() => setActiveIndex(null)}
  />
  ```

### Task 5-8: 어두운 테마 (선택사항) (30분)
- [ ] `src/hooks/useTheme.ts` 생성
- [ ] 토글 버튼: 헤더에 추가
- [ ] Dark mode 클래스:
  ```typescript
  document.documentElement.classList.toggle('dark')
  ```
- [ ] Tailwind dark: prefix 사용
  ```typescript
  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
  ```

### Task 5-9: 호버 & 포커스 상태 (20분)
- [ ] 버튼: hover, active, disabled 상태
- [ ] 링크: underline on hover
- [ ] 테이블 행: hover 강조
- [ ] 폼 입력: focus ring
  ```typescript
  className="focus:outline-none focus:ring-2 focus:ring-primary-500"
  ```

### Task 5-10: 테스트 및 커밋
- [ ] 색상 대비 확인 (WCAG)
- [ ] 모바일/태블릿/데스크톱 레이아웃 확인
- [ ] 애니메이션 부드러운지 확인
- [ ] 로딩 상태 시각적으로 좋은지 확인
- [ ] 에러 상태 명확한지 확인
- [ ] `git commit -m "feat: implement design system with colors and typography"`
- [ ] `git commit -m "feat: add responsive design for all breakpoints"`
- [ ] `git commit -m "feat: implement loading animations and skeletons"`
- [ ] `git commit -m "feat: add dark mode support (optional)"`
- [ ] `git commit -m "style: improve hover and focus states"`

---

## Phase 6️⃣: 코드 품질 & 최적화 (1-1.5시간)

### 6-1. 성능 최적화
- [ ] 컴포넌트 메모이제이션 (React.memo)
- [ ] 무거운 계산 최적화 (useMemo)
- [ ] 리렌더링 최소화 (useCallback)
- [ ] 번들 크기 확인

### 6-2. 접근성 (A11y)
- [ ] 시맨틱 HTML
- [ ] ARIA 라벨 추가
- [ ] 키보드 네비게이션
- [ ] 색상 대비 (WCAG 준수)

### 6-3. 테스트 (선택사항)
- [ ] 단위 테스트 (주요 함수)
  - 데이터 포맷팅
  - 필터링 로직
- [ ] E2E 테스트 (중요 사용자 흐름)
  - 대시보드 로드
  - 필터 적용

### 6-4. 코드 구조
- [ ] 함수 분리 및 재사용성
- [ ] 명확한 네이밍
- [ ] 주석 및 문서화
- [ ] 타입 안전성 (TypeScript strict mode)

---

## Phase 7️⃣: 문서화 & 배포 (1시간)

### 7-1. README 작성
- [ ] 프로젝트 설명
- [ ] 기술 스택
- [ ] 설치 및 실행 방법
- [ ] 폴더 구조 설명

### 7-2. 추가 문서
- [ ] 가정 및 설계 결정 사항
  ```
  - "왜 Recharts를 선택했나?"
  - "상태관리는 왜 Zustand인가?"
  - "API 시뮬레이션을 왜 만들었나?"
  - "필터 UI는 어떻게 설계했나?"
  ```
- [ ] 아키텍처 다이어그램
  ```
  User Input → Store (Zustand) → Components
                      ↓
                   API (lib/api.ts)
  ```
- [ ] 렌더링 효율성 노트
  ```
  - "메인 차트는 왜 리렌더링이 최소화되는가?"
  - "필터 변경 시 전체 리렌더링을 피하는 방법?"
  ```
- [ ] 트레이드오프 및 미완성 부분

### 7-3. Git 히스토리
- [ ] 작은 커밋으로 나누기
  - "feat: setup Next.js + Tailwind"
  - "feat: implement sidebar layout"
  - "feat: add emission chart"
  - "feat: implement post CRUD"
  - "chore: improve responsive design"
- [ ] 명확한 커밋 메시지

### 7-4. 배포 (선택사항)
- [ ] Vercel 또는 Netlify에 배포
- [ ] 라이브 URL 제공

---

## 🎯 디자인 결정 사항 (Documentation)

### 1. UI 구조
```
왜 Sidebar + Main으로 분리?
→ 필터와 데이터를 시각적으로 분리
→ 필터 변경 시 즉시 메인 영역 업데이트
→ 모바일에서는 드로어로 변환
```

### 2. 차트 선택
```
왜 Recharts?
→ 가볍고 빠른 렌더링
→ 반응형 기본 지원
→ TypeScript 지원
→ 자동 애니메이션

왜 여러 차트 타입?
→ 꺾은선: 시간 추이 (주요)
→ 막대: 회사별 비교
→ 원형: 출처별 비율
→ 각각 다른 인사이트 제공
```

### 3. 상태관리
```
왜 Zustand?
→ 간단한 API
→ 보일러플레이트 최소
→ 8-12시간 타임박스에 적합

vs Redux: 너무 복잡
vs Context: 성능 이슈 가능성
```

### 4. 에러 처리
```
가짜 API가 15% 실패율 → 실제 같은 경험
- 낙관적 업데이트 고려
- 롤백 메커니즘
- 재시도 로직
```

---

## 📊 주요 마일스톤

| Phase | 기간 | 완성 목표 |
|-------|------|---------|
| **1** | 1-2h | 프로젝트 기초, 타입, 가짜 API |
| **2** | 1-1.5h | 레이아웃, 네비게이션, 필터 |
| **3** | 3-4h | 차트, 테이블, 핵심 대시보드 |
| **4** | 1-1.5h | 포스트 기능 |
| **5** | 1.5-2h | 디자인, 반응형, 애니메이션 |
| **6** | 1-1.5h | 성능, A11y, 테스트 |
| **7** | 1h | 문서화, 배포 |
| **합계** | **8-12h** | ✅ 완성 |

---

## 🚀 추가 아이디어 (창의성을 위해)

### 1. 고급 기능
- [ ] 데이터 내보내기 (CSV, PDF)
- [ ] 대시보드 커스터마이제이션 (위젯 배치)
- [ ] 비교 기능 (A사 vs B사)
- [ ] 목표 설정 & 진행도 (예: 2025년 20% 감축 목표)

### 2. UX 개선
- [ ] 쿠키/로컬스토리지에 필터 저장
- [ ] 즉시 검색 (회사명, 기간)
- [ ] 드래그로 차트 범위 선택
- [ ] 어두운 테마 (Dark mode)

### 3. 시각화
- [ ] 지도 시각화 (국가별 배출량)
- [ ] 타임라인 애니메이션 (월별 변화)
- [ ] 히트맵 (회사 × 월 × 배출량)

### 4. AI/추천
- [ ] "배출량이 급증했습니다" 경고
- [ ] 효율적인 회사 추천
- [ ] 배출 추세 분석

---

## 📝 체크리스트

```markdown
# 최종 제출 체크리스트
- [ ] Next.js 앱 실행 가능
- [ ] README 작성
- [ ] 가정 & 설계 결정 문서화
- [ ] 깔끔한 git 히스토리
- [ ] TypeScript 타입 안전
- [ ] 반응형 디자인 확인
- [ ] 에러 상태 처리
- [ ] 로딩 상태 처리
- [ ] 차트 3개 이상
- [ ] 포스트 CRUD 기능
- [ ] 필터 기능
- [ ] 코드 품질 (가독성, 모듈화)
- [ ] GitHub/GitLab 레포 생성
- [ ] 라이브 URL (선택)
```

---

## 💡 팁

1. **시간 관리**: Phase 3이 가장 길고 중요
2. **설계 먼저**: 코드 짜기 전에 UI 스케치
3. **가정 문서화**: 평가에서 중요!
4. **Git 커밋**: 작은 단위로 자주 커밋
5. **테스트**: 주요 사용자 흐름만 테스트
6. **리드미**: 심사자가 쉽게 실행할 수 있도록

---

**행운을 빕니다!** 🌟
