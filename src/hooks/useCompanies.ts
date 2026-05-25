import { useEffect } from 'react';
import { fetchCompanies } from '@/lib/api';
import { useStore } from './useStore';

export function useCompanies() {
  const { companies, loading, error, setCompanies, setLoading, setError } = useStore();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchCompanies();
        // API의 배열과 다른 참조로 저장 (API와 store 분리)
        setCompanies([...data]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { companies, loading, error };
}
