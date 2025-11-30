import { supabase } from '../lib/supabase';

export interface AttendanceSession {
  id: string;
  title: string;
  shift: string;
  terminal: string;
  scheduled_for: string;
  supervisor_id: string;
  created_at: string;
}

export async function fetchAttendanceSessions(): Promise<AttendanceSession[]> {
  const { data, error } = await supabase
    .from('attendance_sessions')
    .select('id, title, shift, terminal, scheduled_for, supervisor_id, created_at')
    .order('scheduled_for', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
