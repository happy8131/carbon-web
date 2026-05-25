'use client';

import { useMemo, useState } from 'react';
import type { Company } from '@/lib/types';
import { calculateChange } from '@/lib/utils';

interface CompanyTableProps {
  filteredCompanies: Company[];
}

type SortBy = 'name' | 'country' | 'emissions' | 'change';
type SortOrder = 'asc' | 'desc';

const COUNTRY_NAMES: Record<string, string> = {
  'US': '미국',
  'KR': '한국',
  'JP': '일본',
  'CN': '중국',
  'GB': '영국',
  'DE': '독일',
  'FR': '프랑스',
  'CA': '캐나다',
  'AU': '호주',
  'IN': '인도',
};

function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] || code;
}

interface CompanyWithStats extends Company {
  latestEmissions: number;
  previousEmissions: number;
  changePercent: number;
}

function calculateCompanyStats(company: Company): CompanyWithStats {
  if (company.emissions.length === 0) {
    return {
      ...company,
      latestEmissions: 0,
      previousEmissions: 0,
      changePercent: 0,
    };
  }

  // 정렬된 배출 데이터 (yearMonth 기준)
  const sortedEmissions = [...company.emissions].sort((a, b) =>
    a.yearMonth.localeCompare(b.yearMonth)
  );

  // 최근 월 배출량 (모든 출처 합계)
  const latestMonth = sortedEmissions[sortedEmissions.length - 1].yearMonth;
  const latestEmissions = sortedEmissions
    .filter(e => e.yearMonth === latestMonth)
    .reduce((sum, e) => sum + e.emissions, 0);

  // 이전 월 배출량
  let previousEmissions = 0;
  if (sortedEmissions.length > 1) {
    const previousMonth = sortedEmissions[sortedEmissions.length - 2].yearMonth;
    previousEmissions = sortedEmissions
      .filter(e => e.yearMonth === previousMonth)
      .reduce((sum, e) => sum + e.emissions, 0);
  }

  const changePercent = calculateChange(latestEmissions, previousEmissions);

  return {
    ...company,
    latestEmissions,
    previousEmissions,
    changePercent,
  };
}

function sortData(
  data: CompanyWithStats[],
  sortBy: SortBy,
  sortOrder: SortOrder
): CompanyWithStats[] {
  const sorted = [...data].sort((a, b) => {
    let aValue: string | number = 0;
    let bValue: string | number = 0;

    switch (sortBy) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'country':
        aValue = a.country;
        bValue = b.country;
        break;
      case 'emissions':
        aValue = a.latestEmissions;
        bValue = b.latestEmissions;
        break;
      case 'change':
        aValue = a.changePercent;
        bValue = b.changePercent;
        break;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
  });

  return sorted;
}

export default function CompanyTable({ filteredCompanies }: CompanyTableProps) {
  const [sortBy, setSortBy] = useState<SortBy>('emissions');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const companyStats = useMemo(
    () => filteredCompanies.map(calculateCompanyStats),
    [filteredCompanies]
  );

  const sortedData = useMemo(
    () => sortData(companyStats, sortBy, sortOrder),
    [companyStats, sortBy, sortOrder]
  );

  const handleSort = (key: SortBy) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ column }: { column: SortBy }) => {
    if (sortBy !== column) return <span className="text-gray-300">⇅</span>;
    return <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>;
  };

  if (filteredCompanies.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">회사 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <>
      {/* 모바일 카드 레이아웃 */}
      <div className="md:hidden space-y-3">
        {sortedData.map((company) => (
          <div
            key={company.id}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{company.name}</h3>
                <p className="text-sm text-gray-500">{getCountryName(company.country)}</p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  company.changePercent >= 0
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {company.changePercent >= 0 ? '▲' : '▼'} {Math.abs(company.changePercent).toFixed(2)}%
              </span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-1">최근 월 배출량</p>
              <p className="text-lg font-semibold text-gray-900">
                {company.latestEmissions.toLocaleString('ko-KR', {
                  maximumFractionDigits: 2,
                })} 톤
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 데스크톱 테이블 레이아웃 */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 font-semibold text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 rounded px-1"
                >
                  회사명 <SortIcon column="name" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('country')}
                  className="flex items-center gap-2 font-semibold text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 rounded px-1"
                >
                  국가 <SortIcon column="country" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('emissions')}
                  className="flex items-center justify-end gap-2 font-semibold text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 rounded px-1 w-full"
                >
                  최근 월 배출량 (톤) <SortIcon column="emissions" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('change')}
                  className="flex items-center justify-end gap-2 font-semibold text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 rounded px-1 w-full"
                >
                  변화율 (%) <SortIcon column="change" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{company.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{getCountryName(company.country)}</td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 font-semibold">
                  {company.latestEmissions.toLocaleString('ko-KR', {
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <span
                    className={`font-semibold ${
                      company.changePercent >= 0
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {company.changePercent >= 0 ? '▲' : '▼'}{' '}
                    {Math.abs(company.changePercent).toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
