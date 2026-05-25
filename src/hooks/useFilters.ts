import { useStore } from './useStore';

export function useFilters() {
  const { selectedCompanies, dateRange, companies } = useStore();

  // selectedCompanies가 비어있으면 전체 회사 표시
  const filteredCompanies = selectedCompanies.length === 0
    ? companies
    : companies.filter(c => selectedCompanies.includes(c.id));

  // 날짜 범위로 배출 데이터 필터링된 회사 반환
  const filteredWithDateRange = filteredCompanies.map(company => ({
    ...company,
    emissions: company.emissions.filter(
      e => e.yearMonth >= dateRange.start && e.yearMonth <= dateRange.end
    ),
  }));

  return { filteredCompanies: filteredWithDateRange, dateRange };
}
