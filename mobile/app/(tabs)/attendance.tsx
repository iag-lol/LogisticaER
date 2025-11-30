import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchAttendanceSessions } from '../../services/attendance';

export default function AttendanceScreen() {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['attendance-sessions'],
    queryFn: fetchAttendanceSessions,
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.placeholder}>Cargando asistencias…</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.placeholder}>Sin registros recientes.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>Turno: {item.shift} · {item.terminal}</Text>
              <Text style={styles.meta}>Programado: {new Date(item.scheduled_for).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#0b1120',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 6,
  },
  title: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: '#64748b',
    fontSize: 12,
  },
  placeholder: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 40,
  },
});
