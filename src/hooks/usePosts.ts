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
        setPosts(data);
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
