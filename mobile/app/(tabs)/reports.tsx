import { FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchReports } from '../../services/reports';

export default function ReportsScreen() {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.placeholder}>Cargando informes…</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.placeholder}>Aún no hay informes generados.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
              <Text style={styles.meta}>Semana {item.generated_for_week ?? '-'} · {item.generated_for_year ?? ''}</Text>
              <Text style={styles.meta}>Creado: {new Date(item.created_at).toLocaleString()}</Text>
              {item.file_url ? (
                <TouchableOpacity
                  onPress={() => {
                    const fileUrl = item.file_url;
                    if (fileUrl) {
                      void Linking.openURL(fileUrl);
                    }
                  }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Abrir archivo</Text>
                </TouchableOpacity>
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
    gap: 8,
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
  button: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  placeholder: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 40,
  },
});
