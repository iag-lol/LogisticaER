import { supabase } from '../lib/supabase';

export interface RequestItem {
  id: string;
  title: string;
  detail: string | null;
  status: string;
  requester_id: string;
  approver_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchRequestsForUser(userId: string): Promise<RequestItem[]> {
  const { data, error } = await supabase
    .from('requests')
    .select('id, title, detail, status, requester_id, approver_id, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).filter((item) => item.requester_id === userId || item.approver_id === userId);
}
