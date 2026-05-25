interface StatCardProps {
  title: string;
  value: number | string;
  change: number;
  unit?: string;
}

export default function StatCard({ title, value, change, unit = '' }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-600 mb-2 font-medium">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
        </p>
        {unit && <p className="text-sm text-gray-500">{unit}</p>}
      </div>
      <div className={`text-sm mt-4 flex items-center gap-1 ${isPositive ? 'text-red-600' : 'text-green-600'}`}>
        <span>{isPositive ? '▲' : '▼'}</span>
        <span>{Math.abs(change).toFixed(2)}%</span>
        <span>{isPositive ? '증가' : '감소'}</span>
      </div>
    </div>
  );
}
