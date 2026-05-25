'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/hooks';

export default function Sidebar() {
  const pathname = usePathname();
  const { companies, selectedCompanies, setSelectedCompanies, dateRange, setDateRange } = useStore();

  const handleSelectAllCompanies = (checked: boolean) => {
    if (checked) {
      setSelectedCompanies(companies.map(c => c.id));
    } else {
      setSelectedCompanies([]);
    }
  };

  const handleSelectCompany = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCompanies([...selectedCompanies, id]);
    } else {
      setSelectedCompanies(selectedCompanies.filter(cid => cid !== id));
    }
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const months = parseInt(e.target.value);
    const endMonth = 12;
    const startMonth = Math.max(1, endMonth - months + 1);

    setDateRange(`2024-${String(startMonth).padStart(2, '0')}`, `2024-${String(endMonth).padStart(2, '0')}`);
  };

  const isAllCompaniesSelected = selectedCompanies.length === 0 || selectedCompanies.length === companies.length;

  return (
    <aside className="w-full h-full bg-gray-50 border-r border-gray-100 flex flex-col overflow-y-auto">
      {/* 로고 */}
      <div className="px-6 py-6 border-b border-gray-100 flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-800">🌍 CarbonTrack</h1>
        <p className="text-xs text-gray-500 mt-1.5 font-medium">Carbon Management</p>
      </div>

      {/* 네비게이션 */}
      <nav className="px-4 py-5 border-b border-gray-100 flex-shrink-0">
        <Link
          href="/"
          className={`block px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
            pathname === '/'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Dashboard
        </Link>
      </nav>

      {/* 회사 필터 */}
      <section className="px-6 py-5 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-xs font-semibold text-gray-700 mb-3.5 uppercase tracking-widest">Select Companies</h2>

        {companies.length === 0 ? (
          <div className="text-xs text-gray-500">로딩 중...</div>
        ) : (
          <div className="space-y-2">
            {/* All 체크박스 */}
            <label className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-100 px-2 py-1.5 rounded-md transition-colors">
              <input
                type="checkbox"
                checked={isAllCompaniesSelected}
                onChange={(e) => handleSelectAllCompanies(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">All</span>
            </label>

            {/* 개별 회사 체크박스 */}
            {companies.map((company) => (
              <label
                key={company.id}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-100 px-2 py-1.5 rounded-md transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCompanies.length === 0 || selectedCompanies.includes(company.id)}
                  onChange={(e) => handleSelectCompany(company.id, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{company.name}</span>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* 날짜 범위 필터 */}
      <section className="px-6 py-5 flex-shrink-0">
        <h2 className="text-xs font-semibold text-gray-700 mb-3.5 uppercase tracking-widest">Date Range</h2>

        <select
          value={
            dateRange.start === '2024-01' && dateRange.end === '2024-12'
              ? '12'
              : dateRange.start === '2024-07' && dateRange.end === '2024-12'
                ? '6'
                : dateRange.start === '2024-10' && dateRange.end === '2024-12'
                  ? '3'
                  : '12'
          }
          onChange={handleDateRangeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="3">Last 3 months</option>
          <option value="6">Last 6 months</option>
          <option value="12">Last 12 months</option>
        </select>
      </section>
    </aside>
  );
}
