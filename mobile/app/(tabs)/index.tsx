import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { fetchTasksForUser } from '../../services/tasks';
import { fetchMeetings } from '../../services/meetings';
import { fetchRequestsForUser } from '../../services/requests';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../../constants/app';
import { useAuthActions } from '../../hooks/useAuthActions';

export default function DashboardScreen() {
  const { profile } = useAuth();
  const userId = profile?.id ?? null;
  const { signOut } = useAuthActions();

  const {
    data: tasks = [],
    isLoading: loadingTasks,
  } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => fetchTasksForUser(userId!),
    enabled: !!userId,
  });

  const { data: meetings = [], isLoading: loadingMeetings } = useQuery({
    queryKey: ['meetings'],
    queryFn: fetchMeetings,
  });

  const { data: requests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ['requests', userId],
    queryFn: () => fetchRequestsForUser(userId!),
    enabled: !!userId,
  });

  const stats = useMemo(() => {
    if (!tasks.length) {
      return { total: 0, completed: 0, critical: 0, inProgress: 0 };
    }
    return tasks.reduce(
      (acc, task) => {
        acc.total += 1;
        if (task.status === 'COMPLETED') acc.completed += 1;
        if (task.status === 'IN_PROGRESS') acc.inProgress += 1;
        if (task.priority === 'CRITICAL') acc.critical += 1;
        return acc;
      },
      { total: 0, completed: 0, critical: 0, inProgress: 0 },
    );
  }, [tasks]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hola, {profile?.name ?? 'equipo'}</Text>
          <Text style={styles.subtitle}>Resumen operativo de tu cuadrilla</Text>
        </View>
        <TouchableOpacity onPress={() => { void signOut(); }} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statPrimary]}>
          <Text style={styles.statTitle}>Tareas activas</Text>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statHint}>Críticas: {stats.critical}</Text>
        </View>
        <View style={[styles.statCard, styles.statSecondary]}>
          <Text style={styles.statTitle}>En progreso</Text>
          <Text style={styles.statValue}>{stats.inProgress}</Text>
          <Text style={styles.statHint}>Completadas hoy: {stats.completed}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tus siguientes tareas</Text>
        {loadingTasks && <Text style={styles.placeholder}>Cargando tareas…</Text>}
        {!loadingTasks && tasks.length === 0 && <Text style={styles.placeholder}>No tienes tareas asignadas.</Text>}
        {!loadingTasks &&
          tasks.slice(0, 3).map((task) => (
            <View key={task.id} style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemTitle}>{task.title}</Text>
                <Text style={styles.listItemSubtitle}>{TASK_STATUS_LABELS[task.status]}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{TASK_PRIORITY_LABELS[task.priority]}</Text>
              </View>
            </View>
          ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reuniones</Text>
        {loadingMeetings && <Text style={styles.placeholder}>Cargando reuniones…</Text>}
        {!loadingMeetings && meetings.length === 0 && <Text style={styles.placeholder}>No hay reuniones programadas.</Text>}
        {!loadingMeetings &&
          meetings.slice(0, 2).map((meeting) => (
            <View key={meeting.id} style={styles.listItem}>
              <View>
                <Text style={styles.listItemTitle}>{meeting.title}</Text>
                <Text style={styles.listItemSubtitle}>{new Date(meeting.scheduled_at).toLocaleString()}</Text>
              </View>
            </View>
          ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Solicitudes recientes</Text>
        {loadingRequests && <Text style={styles.placeholder}>Cargando solicitudes…</Text>}
        {!loadingRequests && requests.length === 0 && <Text style={styles.placeholder}>Sin solicitudes pendientes.</Text>}
        {!loadingRequests &&
          requests.slice(0, 3).map((req) => (
            <View key={req.id} style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemTitle}>{req.title}</Text>
                <Text style={styles.listItemSubtitle}>{new Date(req.created_at).toLocaleDateString()}</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{req.status}</Text>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    gap: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  logoutButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  logoutText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    gap: 8,
    backgroundColor: '#0f172a',
  },
  statPrimary: {
    backgroundColor: '#1d4ed8',
  },
  statSecondary: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1d4ed8',
  },
  statTitle: {
    color: '#cbd5f5',
    fontSize: 13,
    fontWeight: '600',
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 30,
    fontWeight: '800',
  },
  statHint: {
    color: '#cbd5f5',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#0b1120',
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  cardTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    color: '#64748b',
    fontSize: 13,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111c30',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f2a44',
    marginBottom: 10,
  },
  listItemTitle: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: '600',
  },
  listItemSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#1d4ed8',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '600',
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#1e293b',
  },
  statusText: {
    color: '#cbd5f5',
    fontSize: 12,
    fontWeight: '600',
  },
});
