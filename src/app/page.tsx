'use client';

import { useState, useMemo } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { useFilters } from '@/hooks/useFilters';
import { useStore } from '@/hooks/useStore';
import { usePosts } from '@/hooks/usePosts';
import { usePostActions, type PostFormData } from '@/hooks/usePostActions';
import {
  StatCard,
  EmissionChart,
  SourceChart,
  CompanyStackChart,
  CompanyTable,
  LoadingScreen,
  ErrorScreen,
} from '@/components/dashboard';
import { Modal } from '@/components/ui';
import { PostForm, PostList } from '@/components/posts';
import { groupEmissionsBySource, calculateChange } from '@/lib/utils';

export default function Dashboard() {
  const { loading, error } = useCompanies();
  const { filteredCompanies } = useFilters();
  const { companies, selectedCompanies, dateRange } = useStore();
  const { posts } = usePosts();
  const { createPost, deletePost, loading: postActionLoading } = usePostActions();
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [deletingPostIds, setDeletingPostIds] = useState<string[]>([]);
  const [postFormError, setPostFormError] = useState<string | null>(null);
  const [postFormSuccess, setPostFormSuccess] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const inDateRange = post.dateTime >= dateRange.start && post.dateTime <= dateRange.end;
      const inSelectedCompanies = selectedCompanies.length === 0 || selectedCompanies.includes(post.resourceUid);
      return inDateRange && inSelectedCompanies;
    });
  }, [posts, dateRange, selectedCompanies]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  // 포스트 작성 핸들러
  const handleCreatePost = async (data: PostFormData) => {
    setPostFormError(null);
    setPostFormSuccess(false);
    try {
      await createPost(data);
      setPostFormError(null);
      setPostFormSuccess(true);
      // 성공 메시지 표시 후 모달 닫기
      setTimeout(() => {
        setIsPostFormOpen(false);
        setPostFormSuccess(false);
      }, 1500);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '포스트 작성에 실패했습니다';
      setPostFormError(errMsg);
      setPostFormSuccess(false);
    }
  };

  // 포스트 삭제 핸들러
  const handleDeletePost = (id: string) => {
    setDeletingPostIds(prev => [...prev, id]);
    deletePost(id);
    setDeletingPostIds(prev => prev.filter(pid => pid !== id));
  };

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
    <>
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

        {/* 5. 포스트 섹션 */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Related Posts</h2>
            <button
              onClick={() => setIsPostFormOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + New Post
            </button>
          </div>
          <PostList posts={filteredPosts} companies={companies} onDeletePost={handleDeletePost} deletingPostIds={deletingPostIds} />
        </section>
    </div>

    {/* 포스트 작성 모달 */}
    <Modal isOpen={isPostFormOpen} onClose={() => setIsPostFormOpen(false)} title="New Post">
      {postFormSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
          포스트가 성공적으로 생성되었습니다! 🎉
        </div>
      )}
      {postFormError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {postFormError}
        </div>
      )}
      {!postFormSuccess && (
        <PostForm
          companies={companies}
          onSubmit={handleCreatePost}
          onCancel={() => setIsPostFormOpen(false)}
          isLoading={postActionLoading}
        />
      )}
    </Modal>
    </>
  );
}
