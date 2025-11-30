# Equipo CLM Mobile

Aplicación móvil nativa (Expo React Native) para gestión integral de patio: tareas, reuniones, informes, asistencia y solicitudes en tiempo real conectada a Supabase.

## Tecnologías claves

- Expo React Native (React 19) + Expo Router (navegación tipo tabs)
- Supabase Auth + Postgres (cliente oficial `@supabase/supabase-js`)
- Manejo de datos: TanStack Query 5
- Estado global persistente: Zustand
- Formularios con React Hook Form + Zod
- Estilos personalizados con StyleSheet (tema oscuro responsive)

## Configuración

```bash
# 1. Instala dependencias
yarn install # o npm install

# 2. Crea archivo .env
echo "EXPO_PUBLIC_SUPABASE_URL=..." > .env
# usa mobile/.env.example como referencia

# 3. Inicia el proyecto
yarn start   # abre Expo CLI
# luego: presiona a para Android, i para iOS, w para web
```

### Variables de entorno

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Expo expone automáticamente las variables que comienzan con `EXPO_PUBLIC_` al bundle.

## Estructura principal

```
mobile/
  app/            # Rutas Expo Router (login + tabs)
  components/     # Utilidades reutilizables (links, color helpers)
  constants/      # Roles, labels, colores
  hooks/          # Hooks de autenticación y acciones
  lib/            # Cliente Supabase inicializado con AsyncStorage
  providers/      # React Query + listener de sesión
  services/       # Fetchers Supabase (tareas, reuniones, etc.)
  store/          # Zustand persistente para sesión/perfil
```

## Funcionalidades implementadas

- Login con Supabase Auth y consumo del perfil corporativo (`profiles`).
- Dashboard con métricas en vivo, tareas asignadas, reuniones y solicitudes recientes.
- Secciones dedicadas: Tareas, Reuniones, Informes, Aseo & Carrocería, Asistencia y Solicitudes.
- Filtros por estado/prioridad, pull-to-refresh y estilos enfocados en uso móvil.
- Store global persistente con sesión auto-refrescada.

## Próximos pasos sugeridos

1. Conectar mutaciones (crear/actualizar tareas, comentarios, solicitudes) y sincronización offline.
2. Integrar `expo-notifications` + Supabase Edge Functions para push sonoras.
3. Ajustar Splash/Icon personalizados definitivos y preparar `eas.json` para builds APK/IPA.
4. Añadir soporte offline avanzado usando SQLite/Dexie y background sync.

---

Para generar builds nativos: configura Expo EAS (`eas build --platform android|ios`).
