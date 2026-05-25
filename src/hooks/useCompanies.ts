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
        setCompanies(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setCompanies, setLoading, setError]);

  return { companies, loading, error };
}
