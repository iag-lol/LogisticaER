import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchRequestsForUser } from '../../services/requests';
import { useAuth } from '../../hooks/useAuth';

export default function RequestsScreen() {
  const { profile } = useAuth();
  const userId = profile?.id ?? null;
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['requests', userId],
    queryFn: () => fetchRequestsForUser(userId!),
    enabled: !!userId,
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.placeholder}>Cargando solicitudes…</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.placeholder}>No tienes solicitudes registradas.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.title}>{item.title}</Text>
                {item.detail ? <Text style={styles.description}>{item.detail}</Text> : null}
                <Text style={styles.meta}>Creada: {new Date(item.created_at).toLocaleString()}</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
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
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  title: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    color: '#94a3b8',
    fontSize: 13,
  },
  meta: {
    color: '#64748b',
    fontSize: 12,
  },
  statusPill: {
    backgroundColor: '#1d4ed8',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  placeholder: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 40,
  },
});
