import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTasksForUser, Task } from '../../services/tasks';
import { useAuth } from '../../hooks/useAuth';
import { TASK_PRIORITY_LABELS, TASK_PRIORITY, TASK_STATUS_LABELS } from '../../constants/app';

const FILTERS = [
  { label: 'Todas', value: 'ALL' },
  { label: 'Pendientes', value: 'PENDING' },
  { label: 'En proceso', value: 'IN_PROGRESS' },
  { label: 'Críticas', value: 'CRITICAL' },
] as const;

type FilterValue = (typeof FILTERS)[number]['value'];

export default function TasksScreen() {
  const { profile } = useAuth();
  const userId = profile?.id ?? null;
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterValue>('ALL');

  const {
    data: tasks = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => fetchTasksForUser(userId!),
    enabled: !!userId,
  });

  const filteredTasks = useMemo(() => {
    if (filter === 'ALL') return tasks;
    if (filter === 'CRITICAL') return tasks.filter((task) => task.priority === TASK_PRIORITY.CRITICAL);
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const onRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    await refetch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {FILTERS.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.filterChip, filter === item.value && styles.filterChipActive]}
            onPress={() => setFilter(item.value)}
          >
            <Text style={[styles.filterText, filter === item.value && styles.filterTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="#2563eb" />}
        ListEmptyComponent={
          !isLoading ? <Text style={styles.empty}>No hay tareas para mostrar.</Text> : null
        }
        renderItem={({ item }) => <TaskCard task={item} />}
      />
    </View>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.cardTitle}>{task.title}</Text>
        {task.description ? <Text style={styles.cardDescription}>{task.description}</Text> : null}
        <Text style={styles.cardMeta}>Estado: {TASK_STATUS_LABELS[task.status]}</Text>
        {task.due_at && (
          <Text style={styles.cardMeta}>Termina: {new Date(task.due_at).toLocaleString()}</Text>
        )}
      </View>
      <View style={[styles.priorityPill, task.priority === 'CRITICAL' && styles.priorityCritical]}>
        <Text style={styles.priorityText}>{TASK_PRIORITY_LABELS[task.priority]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#f8fafc',
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  empty: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 80,
  },
  card: {
    backgroundColor: '#0b1120',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    color: '#94a3b8',
    fontSize: 13,
  },
  cardMeta: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  priorityPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#1d4ed8',
  },
  priorityCritical: {
    backgroundColor: '#dc2626',
  },
  priorityText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
});
