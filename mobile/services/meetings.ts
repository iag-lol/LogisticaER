import { supabase } from '../lib/supabase';

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  location: string | null;
  owner_id: string;
  attendees: { attendee_id: string; role: string | null }[];
}

export async function fetchMeetings(): Promise<Meeting[]> {
  const { data, error } = await supabase
    .from('meetings')
    .select('id, title, description, scheduled_at, location, created_by, meeting_attendees(attendee_id, role)')
    .order('scheduled_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  return data.map((meeting) => ({
    id: meeting.id,
    title: meeting.title,
    description: meeting.description,
    scheduled_at: meeting.scheduled_at,
    location: meeting.location,
    owner_id: meeting.created_by,
    attendees: (meeting.meeting_attendees ?? []) as { attendee_id: string; role: string | null }[],
  }));
}
