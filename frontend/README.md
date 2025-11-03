# Equipo CLM · Plataforma Operativa

Aplicación web progresiva (PWA) orientada a móviles para administrar cuadrillas, tareas y operaciones de patio en tiempo real.

## Stack

- React 19 + Vite + TypeScript
- Estado: Zustand (persistencia) + TanStack Query (datos en línea/offline)
- UI: Tailwind CSS + componentes shadcn adaptados + Lucide
- Backend: Supabase (Auth, Postgres, Realtime, Storage)
- PWA: vite-plugin-pwa (instalable, offline, base para push notifications)

## Primeros pasos

```bash
cd frontend
cp .env.example .env.local # edita si cambias credenciales
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173` y se puede instalar en móviles desde el menú del navegador.

## Scripts

- `npm run dev` – servidor Vite con HMR
- `npm run build` – compila a producción (PWA incluida) **⚠️** hoy falla por un bug de minificación de `vite-plugin-pwa`; ver _Pendientes_
- `npm run preview` – sirve la build si ésta existe
- `npm run lint` – reglas básicas de ESLint

## Estructura principal

- `src/app` – proveedores globales y rutas protegidas/públicas
- `src/features/auth` – autenticación Supabase (store, hooks, formularios)
- `src/layouts/main-layout.tsx` – shell móvil (header, navegación inferior)
- `src/pages/**` – secciones Dashboard, Tareas, Reuniones, Informes, Aseo y Carrocería, Asistencia, Solicitudes
- `src/lib/supabase-client.ts` – cliente inicializado con URL/anon-key (usa ENV o fallback)

## Supabase

Las credenciales provienen de `.env.local`:

```ini
VITE_SUPABASE_URL=https://wvcplgwemvqhvtstlqmt.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

Se espera una tabla `profiles` con campos: `id`, `rut`, `name`, `terminal`, `role` (enum JT/SA/S/IPA/IP). Los flujos de login consumen `auth.signInWithPassword` y sincronizan el perfil asociado.

## Pendientes inmediatos

1. Definir tablas Supabase (tareas, reuniones, etc.) + políticas RLS por jerarquía.
2. Implementar CRUD real de tareas y sincronización offline con Dexie.
3. Conectar Realtime + notificaciones push con web-push/VAPID en un Edge Function.
4. Resolver el fallo de build (`vite-plugin-pwa` + Workbox/Terser) o fijar una versión estable del plugin.

## Próximos pasos sugeridos

- Añadir pruebas (Vitest + Testing Library) y Playwright para flujos críticos.
- Configurar Sentry y variables de entorno para Vercel.
- Diseñar service worker personalizado para background sync y descargas de adjuntos.
