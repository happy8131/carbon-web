export type EmissionSource = 'gasoline' | 'lpg' | 'diesel';

export type Country = {
  code: string;
  name: string;
};

export type GhgEmission = {
  yearMonth: string;        // "2025-01" 형식
  source: EmissionSource;   // 가솔린 | LPG | 디젤
  emissions: number;        // CO2 환산 톤
};

export type Company = {
  id: string;
  name: string;
  country: string;          // Country.code 참조
  emissions: GhgEmission[];
};

export type Post = {
  id: string;
  title: string;
  resourceUid: string;      // Company.id 참조
  dateTime: string;         // "2024-02" 형식
  content: string;
};
