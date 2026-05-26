'use client';

export function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="h-4 skeleton rounded w-1/2 mb-4"></div>
      <div className="h-8 skeleton rounded w-3/4 mb-4"></div>
      <div className="h-4 skeleton rounded w-1/3"></div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="h-6 skeleton rounded w-1/3 mb-4"></div>
      <div className="h-64 skeleton rounded"></div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 p-6 border-b border-gray-200">
        <div className="flex gap-4">
          <div className="h-4 skeleton rounded w-1/4"></div>
          <div className="h-4 skeleton rounded w-1/4"></div>
          <div className="h-4 skeleton rounded w-1/4"></div>
          <div className="h-4 skeleton rounded w-1/4"></div>
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="p-6 border-b border-gray-200 flex gap-4">
          <div className="h-4 skeleton rounded w-1/4"></div>
          <div className="h-4 skeleton rounded w-1/4"></div>
          <div className="h-4 skeleton rounded w-1/4"></div>
          <div className="h-4 skeleton rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}

interface ErrorScreenProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-red-200 p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-xl">⚠️</span>
          </div>
          <h2 className="text-lg font-bold text-red-900">오류 발생</h2>
        </div>
        <p className="text-sm text-red-800 mb-6">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            새로고침
          </button>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 통계 카드 스켈레톤 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>

        {/* 차트 스켈레톤 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>

        {/* 스택 차트 스켈레톤 */}
        <SkeletonChart />

        {/* 테이블 스켈레톤 */}
        <SkeletonTable />
      </div>
    </div>
  );
}
