# Instrucciones para Configurar la Base de Datos en Supabase

## 📋 Pasos para Implementar el Schema

### 1. Acceder al SQL Editor de Supabase

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. En el menú lateral, haz clic en **SQL Editor**
3. Crea una nueva query haciendo clic en **"New query"**

### 2. Ejecutar el Schema Completo

1. Abre el archivo `database-schema.sql` de este proyecto
2. Copia **TODO** el contenido del archivo
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **"Run"** (o presiona `Ctrl+Enter` / `Cmd+Enter`)

⏱️ **Tiempo estimado:** 10-15 segundos

### 3. Verificar que Todo se Creó Correctamente

Ejecuta esta query para verificar las tablas:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver estas **10 tablas**:
- ✅ `attendance_sessions`
- ✅ `cleaning_plans`
- ✅ `meeting_attendees`
- ✅ `meetings`
- ✅ `profiles`
- ✅ `reports`
- ✅ `requests`
- ✅ `task_inspectors`
- ✅ `task_supervisors`
- ✅ `tasks`

---

## 👥 Crear Usuarios de Prueba

### Opción A: Desde Supabase Dashboard (Recomendado)

1. Ve a **Authentication** → **Users** en el menú lateral
2. Haz clic en **"Add user"** → **"Create new user"**
3. Completa el formulario:

**Usuario 1: Jefe de Terminal (JT)**
```
Email: jefe@equipoclm.cl
Password: Admin123!
Confirm Password: Admin123!
```

En **User Metadata** (opcional, pero recomendado):
```json
{
  "rut": "12345678-9",
  "name": "Juan Pérez",
  "terminal": "Terminal Norte",
  "role": "JT"
}
```

**Usuario 2: Supervisor Administrador (SA)**
```
Email: supervisor@equipoclm.cl
Password: Super123!

User Metadata:
{
  "rut": "98765432-1",
  "name": "María González",
  "terminal": "Terminal Sur",
  "role": "SA"
}
```

**Usuario 3: Inspector de Patio (IP)**
```
Email: inspector@equipoclm.cl
Password: Insp123!

User Metadata:
{
  "rut": "11223344-5",
  "name": "Pedro Ramírez",
  "terminal": "Terminal Norte",
  "role": "IP"
}
```

4. Haz clic en **"Create user"**

> **Nota:** El trigger automático `on_auth_user_created` creará el perfil en la tabla `profiles` automáticamente.

### Opción B: Mediante SQL

```sql
-- IMPORTANTE: Esto requiere acceso directo a auth.users
-- Solo usar en desarrollo/testing

-- Insertar usuario manualmente (y el trigger creará el profile)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'jefe@equipoclm.cl',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  '{"rut": "12345678-9", "name": "Juan Pérez", "terminal": "Terminal Norte", "role": "JT"}',
  NOW(),
  NOW()
);
```

---

## 🎯 Probar las Credenciales

Una vez creados los usuarios, pruébalos en tu aplicación:

**Frontend:** http://localhost:5173 (si está corriendo localmente)
**Mobile Web:** http://localhost:8081 (si está corriendo Expo)

### Credenciales de prueba creadas:

| Email | Password | Rol | Permisos |
|-------|----------|-----|----------|
| `jefe@equipoclm.cl` | `Admin123!` | JT (Jefe Terminal) | ✅ Acceso total |
| `supervisor@equipoclm.cl` | `Super123!` | SA (Supervisor Admin) | ✅ Crear tareas, reuniones, informes |
| `inspector@equipoclm.cl` | `Insp123!` | IP (Inspector) | ✅ Ver tareas asignadas, crear solicitudes |

---

## 🗂️ Estructura de la Base de Datos

### Tablas Principales

| Tabla | Descripción | Relaciones |
|-------|-------------|------------|
| `profiles` | Perfiles de usuarios | 1:1 con `auth.users` |
| `tasks` | Tareas operativas | N:M con `profiles` (supervisores/inspectores) |
| `meetings` | Reuniones/briefings | N:M con `profiles` (asistentes) |
| `reports` | Informes ejecutivos | - |
| `attendance_sessions` | Control de asistencia | N:1 con `profiles` (supervisor) |
| `cleaning_plans` | Planes de limpieza | - |
| `requests` | Solicitudes de recursos | N:1 con `profiles` (solicitante/aprobador) |

### Enums Creados

```sql
-- Roles de usuario
user_role: 'JT' | 'SA' | 'S' | 'IPA' | 'IP'

-- Estados de tareas
task_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

-- Prioridades de tareas
task_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

-- Estados de solicitudes
request_status: 'PENDING' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'

-- Estados de limpieza
cleaning_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
```

---

## 🔒 Políticas de Seguridad (RLS)

El schema incluye **Row Level Security** configurado para todos los niveles jerárquicos:

### Jerarquía de Roles:
```
JT (Jefe Terminal)
  ↓
SA (Supervisor Administrador)
  ↓
S (Supervisor)
  ↓
IPA (Inspector Patio Admin)
  ↓
IP (Inspector de Patio)
```

### Permisos por Rol:

| Acción | JT | SA | S | IPA | IP |
|--------|----|----|---|-----|----|
| Ver todo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Crear tareas | ✅ | ✅ | ✅ | ❌ | ❌ |
| Crear reuniones | ✅ | ✅ | ✅ | ❌ | ❌ |
| Crear informes | ✅ | ✅ | ❌ | ❌ | ❌ |
| Aprobar solicitudes | ✅ | ✅ | ❌ | ❌ | ❌ |
| Gestionar perfiles | ✅ | ✅ | ❌ | ❌ | ❌ |
| Crear planes limpieza | ✅ | ✅ | ❌ | ✅ | ❌ |
| Crear solicitudes | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔧 Funciones y Triggers Automáticos

### ✅ Ya Configurados en el Schema:

1. **Auto-crear perfil al registrar usuario**
   - Trigger: `on_auth_user_created`
   - Función: `handle_new_user()`
   - Cuando se crea un usuario en `auth.users`, automáticamente se crea su perfil en `profiles`

2. **Auto-actualizar timestamps**
   - Trigger: `update_*_updated_at` en todas las tablas
   - Función: `update_updated_at_column()`
   - Actualiza automáticamente `updated_at` en cada UPDATE

3. **Validación de roles en asignaciones**
   - Constraint: `check_supervisor_role` en `task_supervisors`
   - Constraint: `check_inspector_role` en `task_inspectors`
   - Solo permite asignar roles apropiados a cada tabla

---

## 📊 Vistas Pre-configuradas

El schema incluye 3 vistas útiles para consultas complejas:

### 1. `v_tasks_with_assignees`
Tareas con información completa de supervisores e inspectores asignados

```sql
SELECT * FROM v_tasks_with_assignees;
```

### 2. `v_meetings_with_attendees`
Reuniones con lista de asistentes

```sql
SELECT * FROM v_meetings_with_attendees;
```

### 3. `v_requests_with_users`
Solicitudes con información de solicitante y aprobador

```sql
SELECT * FROM v_requests_with_users;
```

---

## 🧪 Datos de Prueba (Opcional)

Si deseas poblar la base de datos con datos de ejemplo, ejecuta este SQL **DESPUÉS** de crear usuarios:

```sql
-- Obtén los UUIDs de los usuarios creados
SELECT id, email FROM auth.users;

-- Reemplaza los UUIDs en las siguientes inserciones con los IDs reales

-- Ejemplo: Crear una tarea
INSERT INTO tasks (title, description, priority, status, created_by, start_at, due_at)
VALUES (
  'Inspección de grúas zona A',
  'Revisar estado operativo de grúas principales en zona A del patio',
  'HIGH',
  'PENDING',
  'UUID-DEL-JEFE-AQUI', -- Reemplazar con UUID real
  NOW(),
  NOW() + INTERVAL '2 days'
);

-- Ejemplo: Crear una reunión
INSERT INTO meetings (title, description, scheduled_at, location, created_by)
VALUES (
  'Briefing Turno Mañana',
  'Reunión diaria de coordinación turno mañana - Revisión de KPIs y asignaciones',
  NOW() + INTERVAL '1 day',
  'Sala de Juntas - Terminal Norte',
  'UUID-DEL-SUPERVISOR-AQUI' -- Reemplazar con UUID real
);

-- Ejemplo: Crear una solicitud
INSERT INTO requests (title, detail, status, requester_id)
VALUES (
  'Solicitud de uniformes nuevos',
  'Necesito 3 uniformes talla L para el equipo de inspectores',
  'PENDING',
  'UUID-DEL-INSPECTOR-AQUI' -- Reemplazar con UUID real
);
```

---

## ✅ Checklist de Implementación

- [ ] Ejecutar `database-schema.sql` en Supabase SQL Editor
- [ ] Verificar que las 10 tablas se crearon correctamente
- [ ] Crear al menos 3 usuarios de prueba (JT, SA, IP)
- [ ] Verificar que los perfiles se crearon automáticamente en `profiles`
- [ ] Probar login en frontend con las credenciales de prueba
- [ ] (Opcional) Insertar datos de ejemplo para testing
- [ ] Verificar que RLS funciona correctamente por rol

---

## 🚨 Troubleshooting

### Error: "relation already exists"
- **Causa:** Ya ejecutaste el schema anteriormente
- **Solución:** Ejecuta `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` y vuelve a ejecutar el schema completo

### Error: "permission denied for schema auth"
- **Causa:** Intentando modificar `auth.users` directamente sin permisos
- **Solución:** Usa la opción A (Dashboard) para crear usuarios

### Los perfiles no se crean automáticamente
- **Causa:** El trigger no se ejecutó correctamente
- **Solución:** Verifica que existe el trigger con:
```sql
SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
```

### Error al hacer login: "Invalid login credentials"
- **Causa:** Usuario no confirmado o contraseña incorrecta
- **Solución:** En Supabase Dashboard → Authentication → Users, confirma el email del usuario

---

## 📞 Soporte

Si encuentras algún problema:
1. Verifica los logs en Supabase Dashboard → Logs
2. Revisa las políticas RLS en Database → Policies
3. Consulta la documentación de Supabase: https://supabase.com/docs

---

**¡Tu base de datos está lista para producción!** 🎉
