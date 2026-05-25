'use client';

import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Company } from '@/lib/types';

interface CompanyStackChartProps {
  filteredCompanies: Company[];
}

const COLORS = ['#10b981', '#3b82f6', '#f97316', '#ef4444', '#8b5cf6', '#ec4899'];

function getMonthLabel(yearMonth: string): string {
  const [, month] = yearMonth.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNames[Number(month) - 1];
}

function transformChartData(companies: Company[]) {
  if (companies.length === 0) return [];

  // 모든 yearMonth 수집
  const yearMonthSet = new Set<string>();
  companies.forEach(company => {
    company.emissions.forEach(emission => {
      yearMonthSet.add(emission.yearMonth);
    });
  });

  // yearMonth 배열로 변환 후 정렬
  const yearMonths = Array.from(yearMonthSet).sort();

  // 차트 데이터 생성
  return yearMonths.map(yearMonth => {
    const dataPoint: Record<string, number | string> = {
      month: getMonthLabel(yearMonth),
      yearMonth, // 정렬용
    };

    companies.forEach(company => {
      // 해당 회사의 해당 월 배출량 합계 (모든 출처 포함)
      const totalEmissions = company.emissions
        .filter(e => e.yearMonth === yearMonth)
        .reduce((sum, e) => sum + e.emissions, 0);

      dataPoint[company.name] = totalEmissions;
    });

    return dataPoint;
  });
}

export default function CompanyStackChart({ filteredCompanies }: CompanyStackChartProps) {
  const chartData = transformChartData(filteredCompanies);

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-center h-96">
        <p className="text-gray-500">배출 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">회사별 배출량 추이</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            label={{ value: '배출량 (톤)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => {
              const numValue = typeof value === 'number' ? value : 0;
              return [numValue.toFixed(2), ''];
            }}
          />
          <Legend />
          {filteredCompanies.map((company, idx) => (
            <Area
              key={company.id}
              type="monotone"
              dataKey={company.name}
              stackId="1"
              stroke={COLORS[idx % COLORS.length]}
              fill={COLORS[idx % COLORS.length]}
              fillOpacity={0.7}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
