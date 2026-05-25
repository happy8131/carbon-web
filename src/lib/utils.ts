import { GhgEmission, EmissionSource, Post } from './types';

// 배출량을 "X,XXX.XX tons" 형식으로 포맷
export function formatEmissions(value: number): string {
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} tons`;
}

// "2025-01" → "Jan 2025" 형식으로 포맷
export function formatDate(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// 변화율 계산: (현재값 - 이전값) / 이전값 * 100
// previous가 0이면 0 반환
export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Number(((current - previous) / previous * 100).toFixed(2));
}

// 배출 출처(gasoline/lpg/diesel)별 배출량 합계
export function groupEmissionsBySource(
  emissions: GhgEmission[]
): Record<EmissionSource, number> {
  const result = emissions.reduce(
    (acc, e) => {
      acc[e.source] = (acc[e.source] ?? 0) + e.emissions;
      return acc;
    },
    { gasoline: 0, lpg: 0, diesel: 0 } as Record<EmissionSource, number>
  );
  return result;
}

// 콘텐츠 미리보기 (지정된 길이로 자르기)
export function truncateContent(content: string, maxLength: number = 100): string {
  return content.length > maxLength ? content.slice(0, maxLength) + '...' : content;
}

// 날짜 범위로 포스트 필터링
export function filterPostsByDateRange(
  posts: Post[],
  dateRange: { start: string; end: string }
): Post[] {
  return posts.filter(post => post.dateTime >= dateRange.start && post.dateTime <= dateRange.end);
}

// 회사 ID 목록으로 포스트 필터링
export function filterPostsByCompanies(posts: Post[], companyIds: string[]): Post[] {
  if (companyIds.length === 0) return posts;
  return posts.filter(post => companyIds.includes(post.resourceUid));
}
