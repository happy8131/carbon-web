import { useEffect } from 'react';
import { fetchPosts } from '@/lib/api';
import { useStore } from './useStore';

export function usePosts() {
  const { posts, loading, error, setPosts, setLoading, setError } = useStore();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchPosts();
        // API의 배열과 다른 참조로 저장 (API와 store 분리)
        setPosts([...data]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { posts, loading, error };
}
