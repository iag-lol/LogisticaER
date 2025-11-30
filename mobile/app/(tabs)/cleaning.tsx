import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchCleaningPlans } from '../../services/cleaning';

export default function CleaningScreen() {
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['cleaning-plans'],
    queryFn: fetchCleaningPlans,
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.placeholder}>Cargando planes…</Text>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.placeholder}>No hay planes activos.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
              <Text style={styles.meta}>Estado: {item.status}</Text>
              {item.scheduled_for ? (
                <Text style={styles.meta}>Programado: {new Date(item.scheduled_for).toLocaleDateString()}</Text>
              ) : null}
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
  description: {
    color: '#94a3b8',
    fontSize: 13,
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
