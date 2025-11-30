import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthActions } from '../hooks/useAuthActions';

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'La contraseña es muy corta'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const { errors } = formState;
  const { signIn } = useAuthActions();
  const [submitting, setSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setBackendError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error) {
      setBackendError(error instanceof Error ? error.message : 'Credenciales inválidas');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Equipo CLM</Text>
          <Text style={styles.subtitle}>Control avanzado del equipo en terreno</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo corporativo</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="nombre@equipo.clm"
                  placeholderTextColor="#64748b"
                />
                {errors.email?.message && <Text style={styles.error}>{errors.email.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="••••••••"
                  placeholderTextColor="#64748b"
                />
                {errors.password?.message && <Text style={styles.error}>{errors.password.message}</Text>}
              </View>
            )}
          />

          {backendError && <Text style={styles.error}>{backendError}</Text>}

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>{submitting ? 'Ingresando…' : 'Ingresar'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          ¿Problemas? Contacta al Supervisor Administrador para reestablecer tus credenciales.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#cbd5f5',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  error: {
    color: '#f97316',
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    marginTop: 48,
    fontSize: 13,
    textAlign: 'center',
    color: '#64748b',
  },
});
