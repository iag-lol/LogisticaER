import { supabase } from '../lib/supabase';

export interface CleaningPlan {
  id: string;
  title: string;
  description: string | null;
  status: string;
  scheduled_for: string | null;
  created_at: string;
}

export async function fetchCleaningPlans(): Promise<CleaningPlan[]> {
  const { data, error } = await supabase
    .from('cleaning_plans')
    .select('id, title, description, status, scheduled_for, created_at')
    .order('scheduled_for', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
