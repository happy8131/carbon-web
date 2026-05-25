'use client';

import { useStore } from '@/hooks';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { selectedCompanies, dateRange, companies } = useStore();

  const selectedCount = selectedCompanies.length === 0 ? companies.length : selectedCompanies.length;
  const isAllSelected = selectedCompanies.length === 0 || selectedCompanies.length === companies.length;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-6 flex-1">
        {/* 햄버거 메뉴 버튼 (모바일) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="메뉴 토글"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* 제목 */}
        <h1 className="text-xl font-semibold text-gray-800">Carbon Emissions Dashboard</h1>
      </div>

      {/* 필터 활성 배지 + 새로고침 버튼 */}
      <div className="flex items-center gap-4">
        {/* 필터 배지 */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-medium text-blue-700">
            {isAllSelected ? 'All Companies' : `${selectedCount} Company(ies)`}
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700">
            {dateRange.start} ~ {dateRange.end}
          </div>
        </div>

        {/* 새로고침 버튼 */}
        <button
          onClick={handleRefresh}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="새로고침"
          title="새로고침"
        >
          <svg
            className="w-5 h-5 text-gray-500 hover:text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
