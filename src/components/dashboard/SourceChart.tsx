'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { Company, EmissionSource } from '@/lib/types';

interface SourceChartProps {
  filteredCompanies: Company[];
}

const SOURCE_COLORS: Record<EmissionSource, string> = {
  gasoline: '#3b82f6',  // 파란색
  lpg: '#10b981',        // 초록색
  diesel: '#f97316',     // 주황색
};

const SOURCE_LABELS: Record<EmissionSource, string> = {
  gasoline: 'Gasoline (가솔린)',
  lpg: 'LPG',
  diesel: 'Diesel (디젤)',
};

function aggregateEmissionsBySource(companies: Company[]) {
  const sourceData: Record<EmissionSource, number> = {
    gasoline: 0,
    lpg: 0,
    diesel: 0,
  };

  companies.forEach(company => {
    company.emissions.forEach(emission => {
      sourceData[emission.source] += emission.emissions;
    });
  });

  return Object.entries(sourceData)
    .map(([source, value]) => ({
      name: SOURCE_LABELS[source as EmissionSource],
      value: Number(value.toFixed(2)),
      source: source as EmissionSource,
    }))
    .filter(item => item.value > 0);
}

export default function SourceChart({ filteredCompanies }: SourceChartProps) {
  const chartData = aggregateEmissionsBySource(filteredCompanies);

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-center h-80">
        <p className="text-gray-500">배출 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">배출원별 구성비</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart animationDuration={800}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationDuration={800}
            label={({ name, percent }) =>
              `${name} ${((percent ?? 0) * 100).toFixed(1)}%`
            }
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.source}`} fill={SOURCE_COLORS[entry.source]} />
            ))}
          </Pie>
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => {
              const numValue = typeof value === 'number' ? value : 0;
              return [numValue.toFixed(2) + ' 톤', ''];
            }}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
