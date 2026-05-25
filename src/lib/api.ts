import { Company, Post } from './types';

// 헬퍼 함수
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

// 테스트 데이터: 회사들
const companies: Company[] = [
  {
    id: 'c1',
    name: 'Acme Corp',
    country: 'US',
    emissions: [
      { yearMonth: '2026-01', source: 'gasoline', emissions: 120 },
      { yearMonth: '2026-02', source: 'gasoline', emissions: 110 },
      { yearMonth: '2026-03', source: 'diesel', emissions: 95 },
      { yearMonth: '2026-04', source: 'gasoline', emissions: 105 },
      { yearMonth: '2026-05', source: 'lpg', emissions: 85 },
      { yearMonth: '2026-06', source: 'gasoline', emissions: 115 },
      { yearMonth: '2026-07', source: 'diesel', emissions: 100 },
      { yearMonth: '2026-08', source: 'gasoline', emissions: 125 },
      { yearMonth: '2026-09', source: 'lpg', emissions: 90 },
      { yearMonth: '2026-10', source: 'gasoline', emissions: 118 },
      { yearMonth: '2026-11', source: 'diesel', emissions: 102 },
      { yearMonth: '2026-12', source: 'gasoline', emissions: 130 },
    ],
  },
  {
    id: 'c2',
    name: 'Globex Industries',
    country: 'DE',
    emissions: [
      { yearMonth: '2026-01', source: 'diesel', emissions: 140 },
      { yearMonth: '2026-02', source: 'diesel', emissions: 135 },
      { yearMonth: '2026-03', source: 'lpg', emissions: 110 },
      { yearMonth: '2026-04', source: 'diesel', emissions: 138 },
      { yearMonth: '2026-05', source: 'gasoline', emissions: 98 },
      { yearMonth: '2026-06', source: 'diesel', emissions: 145 },
      { yearMonth: '2026-07', source: 'lpg', emissions: 115 },
      { yearMonth: '2026-08', source: 'diesel', emissions: 150 },
      { yearMonth: '2026-09', source: 'gasoline', emissions: 105 },
      { yearMonth: '2026-10', source: 'diesel', emissions: 142 },
      { yearMonth: '2026-11', source: 'lpg', emissions: 120 },
      { yearMonth: '2026-12', source: 'diesel', emissions: 155 },
    ],
  },
  {
    id: 'c3',
    name: 'TechCorp Asia',
    country: 'JP',
    emissions: [
      { yearMonth: '2026-01', source: 'gasoline', emissions: 85 },
      { yearMonth: '2026-02', source: 'lpg', emissions: 75 },
      { yearMonth: '2026-03', source: 'gasoline', emissions: 80 },
      { yearMonth: '2026-04', source: 'gasoline', emissions: 82 },
      { yearMonth: '2026-05', source: 'lpg', emissions: 70 },
      { yearMonth: '2026-06', source: 'gasoline', emissions: 88 },
      { yearMonth: '2026-07', source: 'diesel', emissions: 90 },
      { yearMonth: '2026-08', source: 'gasoline', emissions: 92 },
      { yearMonth: '2026-09', source: 'lpg', emissions: 72 },
      { yearMonth: '2026-10', source: 'gasoline', emissions: 86 },
      { yearMonth: '2026-11', source: 'diesel', emissions: 88 },
      { yearMonth: '2026-12', source: 'gasoline', emissions: 95 },
    ],
  },
  {
    id: 'c4',
    name: 'Green Energy Co',
    country: 'KR',
    emissions: [
      { yearMonth: '2026-01', source: 'lpg', emissions: 65 },
      { yearMonth: '2026-02', source: 'gasoline', emissions: 75 },
      { yearMonth: '2026-03', source: 'lpg', emissions: 60 },
      { yearMonth: '2026-04', source: 'gasoline', emissions: 72 },
      { yearMonth: '2026-05', source: 'diesel', emissions: 78 },
      { yearMonth: '2026-06', source: 'lpg', emissions: 62 },
      { yearMonth: '2026-07', source: 'gasoline', emissions: 76 },
      { yearMonth: '2026-08', source: 'lpg', emissions: 68 },
      { yearMonth: '2026-09', source: 'diesel', emissions: 82 },
      { yearMonth: '2026-10', source: 'gasoline', emissions: 74 },
      { yearMonth: '2026-11', source: 'lpg', emissions: 65 },
      { yearMonth: '2026-12', source: 'gasoline', emissions: 80 },
    ],
  },
];

// 테스트 데이터: 포스트들
const posts: Post[] = [
  {
    id: 'p1',
    title: 'Acme Corp 분기별 탄소 감축 보고서',
    resourceUid: 'c1',
    dateTime: '2026-02',
    content: 'Acme Corp는 2026년 1분기에 탄소 배출량을 전년 대비 8% 감축했습니다.',
  },
  {
    id: 'p2',
    title: 'Acme의 신재생 에너지 전환 계획',
    resourceUid: 'c1',
    dateTime: '2026-06',
    content: '가솔린 차량을 전기차로 교체하는 대규모 프로젝트 진행 중입니다.',
  },
  {
    id: 'p3',
    title: 'Globex Industries 환경 인증 획득',
    resourceUid: 'c2',
    dateTime: '2026-03',
    content: 'Globex는 ISO 14001 환경 경영 시스템 인증을 획득했습니다.',
  },
  {
    id: 'p4',
    title: 'Globex의 2026년 탄소 중립 계획',
    resourceUid: 'c2',
    dateTime: '2026-07',
    content: '2030년까지 탄소 중립을 달성하기 위한 로드맵을 발표했습니다.',
  },
  {
    id: 'p5',
    title: 'TechCorp Asia 에너지 효율화 기술',
    resourceUid: 'c3',
    dateTime: '2026-04',
    content: 'AI 기반 에너지 관리 시스템으로 20% 효율 개선을 달성했습니다.',
  },
  {
    id: 'p6',
    title: 'TechCorp의 친환경 데이터센터 확장',
    resourceUid: 'c3',
    dateTime: '2026-09',
    content: '재생에너지 기반 데이터센터 시설을 추가로 구축했습니다.',
  },
  {
    id: 'p7',
    title: 'Green Energy Co 태양광 발전 도입',
    resourceUid: 'c4',
    dateTime: '2026-05',
    content: '전 계열사에 태양광 패널을 설치하여 배출량을 30% 감축했습니다.',
  },
  {
    id: 'p8',
    title: 'Green Energy의 수소 연료 전지 실험',
    resourceUid: 'c4',
    dateTime: '2026-10',
    content: '화물차 수소 연료 전지 충전소 구축 사업을 시작했습니다.',
  },
];

// API 함수: 회사 목록 조회
export async function fetchCompanies(): Promise<Company[]> {
  await delay(jitter());
  return companies;
}

// API 함수: 포스트 목록 조회
export async function fetchPosts(): Promise<Post[]> {
  await delay(jitter());
  return posts;
}

// API 함수: 포스트 생성/수정
export async function createOrUpdatePost(
  post: Omit<Post, 'id'> & { id?: string }
): Promise<Post> {
  await delay(jitter());

  if (maybeFail()) {
    throw new Error('포스트 저장에 실패했습니다. 다시 시도해주세요.');
  }

  if (post.id) {
    // 수정: 기존 포스트 업데이트
    const index = posts.findIndex(p => p.id === post.id);
    if (index !== -1) {
      const updated: Post = {
        id: post.id,
        title: post.title,
        resourceUid: post.resourceUid,
        dateTime: post.dateTime,
        content: post.content,
      };
      posts[index] = updated;
      return updated;
    }
  }

  // 생성: 새 포스트 추가
  const newPost: Post = {
    id: `p${Date.now()}`,
    title: post.title,
    resourceUid: post.resourceUid,
    dateTime: post.dateTime,
    content: post.content,
  };
  posts.push(newPost);
  return newPost;
}
