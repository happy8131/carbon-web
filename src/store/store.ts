import { create } from 'zustand';
import { Company, Post } from '@/lib';

export interface DashboardStore {
  // 상태
  companies: Company[];
  posts: Post[];
  selectedCompanies: string[];
  dateRange: { start: string; end: string };
  loading: boolean;
  error: string | null;

  // 액션
  setCompanies: (companies: Company[]) => void;
  setPosts: (posts: Post[]) => void;
  setSelectedCompanies: (ids: string[]) => void;
  setDateRange: (start: string, end: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardStore>()((set) => ({
  // 초기 상태
  companies: [],
  posts: [],
  selectedCompanies: [],
  dateRange: { start: '2024-01', end: '2024-12' },
  loading: false,
  error: null,

  // 액션
  setCompanies: (companies) => set({ companies }),
  setPosts: (posts) => set({ posts }),
  setSelectedCompanies: (ids) => set({ selectedCompanies: ids }),
  setDateRange: (start, end) => set({ dateRange: { start, end } }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
