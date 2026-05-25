'use client';

import { useCompanies } from '@/hooks/useCompanies';
import { useFilters } from '@/hooks/useFilters';
import {
  StatCard,
  EmissionChart,
  SourceChart,
  CompanyStackChart,
  CompanyTable,
  LoadingScreen,
  ErrorScreen,
} from '@/components/dashboard';
import { MainLayout } from '@/components/layout';
import { groupEmissionsBySource, calculateChange } from '@/lib/utils';

export default function Dashboard() {
  const { loading, error } = useCompanies();
  const { filteredCompanies } = useFilters();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  // 통계 계산
  const allEmissions = filteredCompanies.flatMap(c => c.emissions);

  // 총 배출량
  const totalEmissions = allEmissions.reduce((sum, e) => sum + e.emissions, 0);

  // 이전 달 배출량 (변화율 계산용)
  const sortedEmissions = [...allEmissions].sort((a, b) =>
    a.yearMonth.localeCompare(b.yearMonth)
  );
  let previousTotalEmissions = 0;
  let previousSourceTotal = { gasoline: 0, lpg: 0, diesel: 0 };

  if (sortedEmissions.length > 0) {
    const latestMonth = sortedEmissions[sortedEmissions.length - 1].yearMonth;
    const previousMonth = new Date(latestMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    const previousMonthStr = previousMonth
      .toISOString()
      .slice(0, 7);

    previousTotalEmissions = sortedEmissions
      .filter(e => e.yearMonth === previousMonthStr)
      .reduce((sum, e) => sum + e.emissions, 0);

    const previousEmissions = sortedEmissions.filter(
      e => e.yearMonth === previousMonthStr
    );
    previousSourceTotal = groupEmissionsBySource(previousEmissions);
  }

  const currentSourceTotal = groupEmissionsBySource(allEmissions);
  const totalChange = calculateChange(totalEmissions, previousTotalEmissions);
  const gasolineChange = calculateChange(
    currentSourceTotal.gasoline,
    previousSourceTotal.gasoline
  );
  const lpgChange = calculateChange(
    currentSourceTotal.lpg,
    previousSourceTotal.lpg
  );
  const dieselChange = calculateChange(
    currentSourceTotal.diesel,
    previousSourceTotal.diesel
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 1. 통계 카드 행 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="총 탄소 배출량"
            value={totalEmissions.toLocaleString('ko-KR', {
              maximumFractionDigits: 2,
            })}
            change={totalChange}
            unit="tons"
          />
          <StatCard
            title="가솔린 배출량"
            value={currentSourceTotal.gasoline.toLocaleString('ko-KR', {
              maximumFractionDigits: 2,
            })}
            change={gasolineChange}
            unit="tons"
          />
          <StatCard
            title="LPG 배출량"
            value={currentSourceTotal.lpg.toLocaleString('ko-KR', {
              maximumFractionDigits: 2,
            })}
            change={lpgChange}
            unit="tons"
          />
          <StatCard
            title="디젤 배출량"
            value={currentSourceTotal.diesel.toLocaleString('ko-KR', {
              maximumFractionDigits: 2,
            })}
            change={dieselChange}
            unit="tons"
          />
        </div>

        {/* 2. 차트 2개 행 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmissionChart filteredCompanies={filteredCompanies} />
          <SourceChart filteredCompanies={filteredCompanies} />
        </div>

        {/* 3. 스택 차트 */}
        <CompanyStackChart filteredCompanies={filteredCompanies} />

        {/* 4. 테이블 */}
        <CompanyTable filteredCompanies={filteredCompanies} />
      </div>
    </MainLayout>
  );
}
