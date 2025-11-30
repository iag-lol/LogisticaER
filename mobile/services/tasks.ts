import { supabase } from '../lib/supabase';
import type { TaskPriority, TaskStatus } from '../constants/app';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  start_at: string;
  due_at: string | null;
  attachment_url: string | null;
  attachment_label: string | null;
  created_by: string;
  supervisors: string[];
  inspectors: string[];
}

export async function fetchTasksForUser(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(
      `id, title, description, priority, status, start_at, due_at, attachment_url, attachment_label, created_by,
       task_supervisors(supervisor_id),
       task_inspectors(inspector_id)`
    )
    .order('due_at', { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  return data
    .map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority as TaskPriority,
      status: task.status as TaskStatus,
      start_at: task.start_at,
      due_at: task.due_at,
      attachment_url: task.attachment_url,
      attachment_label: task.attachment_label,
      created_by: task.created_by,
      supervisors: (task.task_supervisors ?? []).map((item: { supervisor_id: string }) => item.supervisor_id),
      inspectors: (task.task_inspectors ?? []).map((item: { inspector_id: string }) => item.inspector_id),
    }))
    .filter((task) =>
      task.supervisors.includes(userId) ||
      task.inspectors.includes(userId) ||
      task.created_by === userId
    );
}
