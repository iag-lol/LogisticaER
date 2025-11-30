import { supabase } from '../lib/supabase';

export interface Report {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  generated_for_week: number | null;
  generated_for_year: number | null;
  created_at: string;
}

export async function fetchReports(): Promise<Report[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('id, title, description, file_url, generated_for_week, generated_for_year, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
