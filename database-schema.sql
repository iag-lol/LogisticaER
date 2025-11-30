-- =====================================================
-- EQUIPO CLM - DATABASE SCHEMA COMPLETO
-- =====================================================
-- Plataforma de gestión operativa de patio
-- Incluye: Perfiles, Tareas, Reuniones, Informes,
--          Asistencia, Limpieza y Solicitudes
-- =====================================================

-- =====================================================
-- 1. EXTENSIONES
-- =====================================================

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. ENUMS (TIPOS PERSONALIZADOS)
-- =====================================================

-- Eliminar tipos existentes si hay conflictos (solo si es necesario)
DO $$
BEGIN
  -- Roles de usuario
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'JT',   -- Jefe de Terminal
      'SA',   -- Supervisor Administrador
      'S',    -- Supervisor
      'IPA',  -- Inspector de Patio Administrativo
      'IP'    -- Inspector de Patio
    );
  END IF;

  -- Estados de tareas
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE task_status AS ENUM (
      'PENDING',
      'IN_PROGRESS',
      'COMPLETED'
    );
  END IF;

  -- Prioridades de tareas
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
    CREATE TYPE task_priority AS ENUM (
      'LOW',
      'MEDIUM',
      'HIGH',
      'CRITICAL'
    );
  END IF;

  -- Estados de solicitudes
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
    CREATE TYPE request_status AS ENUM (
      'PENDING',
      'PENDING_APPROVAL',
      'APPROVED',
      'REJECTED'
    );
  END IF;

  -- Estados de limpieza
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cleaning_status') THEN
    CREATE TYPE cleaning_status AS ENUM (
      'PENDING',
      'IN_PROGRESS',
      'COMPLETED'
    );
  END IF;
END $$;

-- =====================================================
-- 3. TABLA: profiles
-- =====================================================
-- Perfiles de usuarios del sistema
-- Vinculado con auth.users (1:1)

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  rut TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  terminal TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'IP',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_profiles_rut ON profiles(rut);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_terminal ON profiles(terminal);

-- Comentarios
COMMENT ON TABLE profiles IS 'Perfiles de usuarios corporativos vinculados a auth.users';
COMMENT ON COLUMN profiles.rut IS 'RUT único del usuario chileno';
COMMENT ON COLUMN profiles.role IS 'Rol jerárquico: JT > SA > S > IPA > IP';

-- =====================================================
-- 4. TABLA: tasks
-- =====================================================
-- Tareas operativas del patio

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority NOT NULL DEFAULT 'MEDIUM',
  status task_status NOT NULL DEFAULT 'PENDING',
  start_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_at TIMESTAMPTZ,
  attachment_url TEXT,
  attachment_label TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_due_at ON tasks(due_at);
CREATE INDEX IF NOT EXISTS idx_tasks_start_at ON tasks(start_at);

-- Comentarios
COMMENT ON TABLE tasks IS 'Tareas operativas asignadas a supervisores e inspectores';
COMMENT ON COLUMN tasks.attachment_url IS 'URL de archivo adjunto en Supabase Storage';

-- =====================================================
-- 5. TABLA: task_supervisors
-- =====================================================
-- Relación muchos-a-muchos: tareas ↔ supervisores

CREATE TABLE IF NOT EXISTS task_supervisors (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  supervisor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (task_id, supervisor_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_task_supervisors_task ON task_supervisors(task_id);
CREATE INDEX IF NOT EXISTS idx_task_supervisors_supervisor ON task_supervisors(supervisor_id);

-- Constraint: Solo usuarios con rol S, SA o JT pueden ser supervisores
ALTER TABLE task_supervisors
  ADD CONSTRAINT check_supervisor_role
  CHECK (
    (SELECT role FROM profiles WHERE id = supervisor_id) IN ('S', 'SA', 'JT')
  );

-- =====================================================
-- 6. TABLA: task_inspectors
-- =====================================================
-- Relación muchos-a-muchos: tareas ↔ inspectores

CREATE TABLE IF NOT EXISTS task_inspectors (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  inspector_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (task_id, inspector_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_task_inspectors_task ON task_inspectors(task_id);
CREATE INDEX IF NOT EXISTS idx_task_inspectors_inspector ON task_inspectors(inspector_id);

-- Constraint: Solo usuarios con rol IP o IPA pueden ser inspectores
ALTER TABLE task_inspectors
  ADD CONSTRAINT check_inspector_role
  CHECK (
    (SELECT role FROM profiles WHERE id = inspector_id) IN ('IP', 'IPA')
  );

-- =====================================================
-- 7. TABLA: meetings
-- =====================================================
-- Reuniones y briefings del equipo

CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  location TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at ON meetings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_meetings_created_by ON meetings(created_by);

-- Comentarios
COMMENT ON TABLE meetings IS 'Reuniones y briefings programados';
COMMENT ON COLUMN meetings.location IS 'Ubicación física o enlace virtual (Zoom, Meet, etc.)';

-- =====================================================
-- 8. TABLA: meeting_attendees
-- =====================================================
-- Relación muchos-a-muchos: reuniones ↔ asistentes

CREATE TABLE IF NOT EXISTS meeting_attendees (
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (meeting_id, attendee_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_meeting ON meeting_attendees(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_attendee ON meeting_attendees(attendee_id);

-- Comentarios
COMMENT ON COLUMN meeting_attendees.role IS 'Rol del asistente en la reunión (ej: Moderador, Presentador)';

-- =====================================================
-- 9. TABLA: reports
-- =====================================================
-- Informes ejecutivos generados

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  generated_for_week INTEGER,
  generated_for_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_reports_week_year ON reports(generated_for_year, generated_for_week);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Comentarios
COMMENT ON TABLE reports IS 'Informes ejecutivos semanales/mensuales';
COMMENT ON COLUMN reports.file_url IS 'URL del PDF/Excel en Supabase Storage';

-- =====================================================
-- 10. TABLA: attendance_sessions
-- =====================================================
-- Sesiones de control de asistencia

CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  shift TEXT NOT NULL,
  terminal TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  supervisor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_scheduled ON attendance_sessions(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_supervisor ON attendance_sessions(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_terminal ON attendance_sessions(terminal);

-- Comentarios
COMMENT ON TABLE attendance_sessions IS 'Sesiones de control de asistencia por turno';
COMMENT ON COLUMN attendance_sessions.shift IS 'Turno: Mañana, Tarde, Noche';

-- =====================================================
-- 11. TABLA: cleaning_plans
-- =====================================================
-- Planes de limpieza y mantenimiento de aseo

CREATE TABLE IF NOT EXISTS cleaning_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status cleaning_status NOT NULL DEFAULT 'PENDING',
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cleaning_plans_status ON cleaning_plans(status);
CREATE INDEX IF NOT EXISTS idx_cleaning_plans_scheduled ON cleaning_plans(scheduled_for);

-- Comentarios
COMMENT ON TABLE cleaning_plans IS 'Planes de limpieza y aseo del patio';

-- =====================================================
-- 12. TABLA: requests
-- =====================================================
-- Solicitudes de recursos y requerimientos

CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  detail TEXT,
  status request_status NOT NULL DEFAULT 'PENDING',
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_requests_approver ON requests(approver_id);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);

-- Comentarios
COMMENT ON TABLE requests IS 'Solicitudes de recursos, materiales o permisos';
COMMENT ON COLUMN requests.approver_id IS 'Usuario que aprueba/rechaza (SA o JT)';

-- =====================================================
-- 13. TRIGGERS PARA AUTO-UPDATE DE TIMESTAMPS
-- =====================================================

-- Función genérica para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles CASCADE;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON profiles CASCADE;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_meetings_updated_at ON profiles CASCADE;
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_sessions_updated_at ON profiles CASCADE;
CREATE TRIGGER update_attendance_sessions_updated_at
  BEFORE UPDATE ON attendance_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cleaning_plans_updated_at ON profiles CASCADE;
CREATE TRIGGER update_cleaning_plans_updated_at
  BEFORE UPDATE ON cleaning_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_requests_updated_at ON profiles CASCADE;
CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 14. FUNCIÓN: Auto-crear profile al registrar usuario
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, rut, name, terminal, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'rut', 'SIN_RUT'),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'terminal', 'PRINCIPAL'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'IP')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear profile automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 15. ROW LEVEL SECURITY (RLS) - POLÍTICAS DE ACCESO
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_supervisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_inspectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS: profiles
-- =====================================================

-- Todos pueden ver todos los perfiles (para asignaciones)
DROP POLICY IF EXISTS "Perfiles visibles para todos autenticados" ON profiles;
CREATE POLICY "Perfiles visibles para todos autenticados"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Solo el usuario puede actualizar su propio perfil
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON profiles;
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Solo JT y SA pueden crear/eliminar perfiles
DROP POLICY IF EXISTS "Solo JT y SA pueden gestionar perfiles" ON profiles;
CREATE POLICY "Solo JT y SA pueden gestionar perfiles"
  ON profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('JT', 'SA')
    )
  );

-- =====================================================
-- POLÍTICAS: tasks
-- =====================================================

-- Todos pueden ver tareas
CREATE POLICY "Tareas visibles para todos"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

-- Solo JT, SA y S pueden crear tareas
CREATE POLICY "Supervisores pueden crear tareas"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('JT', 'SA', 'S')
    )
  );

-- Creador o asignados pueden actualizar tareas
CREATE POLICY "Creador y asignados pueden actualizar tareas"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM task_supervisors WHERE task_id = id AND supervisor_id = auth.uid())
    OR EXISTS (SELECT 1 FROM task_inspectors WHERE task_id = id AND inspector_id = auth.uid())
  );

-- Solo creador o JT pueden eliminar tareas
CREATE POLICY "Solo creador o JT pueden eliminar tareas"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'JT'
    )
  );

-- =====================================================
-- POLÍTICAS: task_supervisors y task_inspectors
-- =====================================================

-- Todos pueden ver asignaciones
CREATE POLICY "Asignaciones visibles para todos"
  ON task_supervisors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Asignaciones de inspectores visibles para todos"
  ON task_inspectors FOR SELECT
  TO authenticated
  USING (true);

-- Solo creador de tarea o supervisores pueden modificar asignaciones
CREATE POLICY "Creador puede gestionar supervisores de tarea"
  ON task_supervisors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE id = task_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Creador puede gestionar inspectores de tarea"
  ON task_inspectors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE id = task_id
      AND created_by = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS: meetings
-- =====================================================

-- Todos pueden ver reuniones
CREATE POLICY "Reuniones visibles para todos"
  ON meetings FOR SELECT
  TO authenticated
  USING (true);

-- Supervisores y superiores pueden crear reuniones
CREATE POLICY "Supervisores pueden crear reuniones"
  ON meetings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('JT', 'SA', 'S')
    )
  );

-- Creador puede actualizar/eliminar reuniones
CREATE POLICY "Creador puede gestionar sus reuniones"
  ON meetings FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Creador puede eliminar sus reuniones"
  ON meetings FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- =====================================================
-- POLÍTICAS: meeting_attendees
-- =====================================================

CREATE POLICY "Asistentes visibles para todos"
  ON meeting_attendees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creador de reunión puede gestionar asistentes"
  ON meeting_attendees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meetings
      WHERE id = meeting_id
      AND created_by = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS: reports
-- =====================================================

-- Todos pueden ver informes
CREATE POLICY "Informes visibles para todos"
  ON reports FOR SELECT
  TO authenticated
  USING (true);

-- Solo JT y SA pueden crear informes
CREATE POLICY "Solo JT y SA pueden crear informes"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('JT', 'SA')
    )
  );

-- =====================================================
-- POLÍTICAS: attendance_sessions
-- =====================================================

-- Todos pueden ver sesiones de asistencia
CREATE POLICY "Sesiones de asistencia visibles para todos"
  ON attendance_sessions FOR SELECT
  TO authenticated
  USING (true);

-- Supervisores pueden crear sesiones
CREATE POLICY "Supervisores pueden crear sesiones de asistencia"
  ON attendance_sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('JT', 'SA', 'S')
    )
  );

-- Supervisor responsable puede actualizar su sesión
CREATE POLICY "Supervisor puede actualizar su sesión"
  ON attendance_sessions FOR UPDATE
  TO authenticated
  USING (supervisor_id = auth.uid());

-- =====================================================
-- POLÍTICAS: cleaning_plans
-- =====================================================

-- Todos pueden ver planes de limpieza
CREATE POLICY "Planes de limpieza visibles para todos"
  ON cleaning_plans FOR SELECT
  TO authenticated
  USING (true);

-- IPA y superiores pueden crear planes
CREATE POLICY "IPA y superiores pueden crear planes de limpieza"
  ON cleaning_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('JT', 'SA', 'IPA')
    )
  );

-- IPA y superiores pueden actualizar planes
CREATE POLICY "IPA y superiores pueden actualizar planes"
  ON cleaning_plans FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('JT', 'SA', 'IPA')
    )
  );

-- =====================================================
-- POLÍTICAS: requests
-- =====================================================

-- Todos pueden ver solicitudes
CREATE POLICY "Solicitudes visibles para todos"
  ON requests FOR SELECT
  TO authenticated
  USING (true);

-- Cualquiera puede crear solicitudes
CREATE POLICY "Cualquiera puede crear solicitudes"
  ON requests FOR INSERT
  TO authenticated
  WITH CHECK (requester_id = auth.uid());

-- Solo el solicitante puede actualizar solicitudes pendientes
CREATE POLICY "Solicitante puede actualizar su solicitud"
  ON requests FOR UPDATE
  TO authenticated
  USING (
    requester_id = auth.uid()
    AND status = 'PENDING'
  );

-- SA y JT pueden aprobar/rechazar solicitudes
CREATE POLICY "SA y JT pueden aprobar solicitudes"
  ON requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('JT', 'SA')
    )
  );

-- =====================================================
-- 16. DATOS DE EJEMPLO (SEED DATA)
-- =====================================================

-- NOTA: Estos son datos de ejemplo.
-- En producción, los usuarios se crearán vía Supabase Auth
-- y los perfiles se auto-generarán con el trigger.

-- Comentario: Descomentar si necesitas datos de prueba
/*
-- Ejemplo de perfiles (requiere usuarios existentes en auth.users)
INSERT INTO profiles (id, rut, name, terminal, role) VALUES
  ('11111111-1111-1111-1111-111111111111', '12345678-9', 'Juan Pérez', 'Terminal Norte', 'JT'),
  ('22222222-2222-2222-2222-222222222222', '98765432-1', 'María González', 'Terminal Sur', 'SA'),
  ('33333333-3333-3333-3333-333333333333', '11223344-5', 'Pedro Ramírez', 'Terminal Norte', 'S'),
  ('44444444-4444-4444-4444-444444444444', '55667788-9', 'Ana Torres', 'Terminal Sur', 'IPA'),
  ('55555555-5555-5555-5555-555555555555', '99887766-5', 'Luis Soto', 'Terminal Norte', 'IP');

-- Ejemplo de tareas
INSERT INTO tasks (title, description, priority, status, created_by, start_at, due_at) VALUES
  ('Inspección de grúas', 'Revisar estado operativo de grúas principales', 'HIGH', 'PENDING', '11111111-1111-1111-1111-111111111111', NOW(), NOW() + INTERVAL '2 days'),
  ('Limpieza de patio zona A', 'Realizar limpieza profunda en zona A', 'MEDIUM', 'IN_PROGRESS', '22222222-2222-2222-2222-222222222222', NOW(), NOW() + INTERVAL '1 day');

-- Ejemplo de reuniones
INSERT INTO meetings (title, description, scheduled_at, location, created_by) VALUES
  ('Briefing Turno Mañana', 'Reunión diaria de coordinación turno mañana', NOW() + INTERVAL '1 day', 'Sala de Juntas - Terminal Norte', '11111111-1111-1111-1111-111111111111'),
  ('Revisión Semanal KPIs', 'Revisión de indicadores operativos semanales', NOW() + INTERVAL '3 days', 'Zoom - Link en descripción', '22222222-2222-2222-2222-222222222222');
*/

-- =====================================================
-- 17. VISTAS ÚTILES
-- =====================================================

-- Vista: Tareas con información de asignados
CREATE OR REPLACE VIEW v_tasks_with_assignees AS
SELECT
  t.id,
  t.title,
  t.description,
  t.priority,
  t.status,
  t.start_at,
  t.due_at,
  t.attachment_url,
  t.attachment_label,
  t.created_at,
  creator.name AS created_by_name,
  creator.role AS created_by_role,
  COALESCE(
    json_agg(DISTINCT jsonb_build_object('id', ps.id, 'name', ps.name, 'role', ps.role)) FILTER (WHERE ps.id IS NOT NULL),
    '[]'::json
  ) AS supervisors,
  COALESCE(
    json_agg(DISTINCT jsonb_build_object('id', pi.id, 'name', pi.name, 'role', pi.role)) FILTER (WHERE pi.id IS NOT NULL),
    '[]'::json
  ) AS inspectors
FROM tasks t
LEFT JOIN profiles creator ON t.created_by = creator.id
LEFT JOIN task_supervisors ts ON t.id = ts.task_id
LEFT JOIN profiles ps ON ts.supervisor_id = ps.id
LEFT JOIN task_inspectors ti ON t.id = ti.task_id
LEFT JOIN profiles pi ON ti.inspector_id = pi.id
GROUP BY t.id, creator.name, creator.role;

-- Vista: Reuniones con asistentes
CREATE OR REPLACE VIEW v_meetings_with_attendees AS
SELECT
  m.id,
  m.title,
  m.description,
  m.scheduled_at,
  m.location,
  m.created_at,
  creator.name AS created_by_name,
  COALESCE(
    json_agg(jsonb_build_object('id', p.id, 'name', p.name, 'role', ma.role)) FILTER (WHERE p.id IS NOT NULL),
    '[]'::json
  ) AS attendees
FROM meetings m
LEFT JOIN profiles creator ON m.created_by = creator.id
LEFT JOIN meeting_attendees ma ON m.id = ma.meeting_id
LEFT JOIN profiles p ON ma.attendee_id = p.id
GROUP BY m.id, creator.name;

-- Vista: Solicitudes con información de usuarios
CREATE OR REPLACE VIEW v_requests_with_users AS
SELECT
  r.id,
  r.title,
  r.detail,
  r.status,
  r.created_at,
  r.updated_at,
  requester.name AS requester_name,
  requester.role AS requester_role,
  approver.name AS approver_name,
  approver.role AS approver_role
FROM requests r
LEFT JOIN profiles requester ON r.requester_id = requester.id
LEFT JOIN profiles approver ON r.approver_id = approver.id;

-- =====================================================
-- 18. ÍNDICES ADICIONALES DE RENDIMIENTO
-- =====================================================

-- Índice compuesto para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_tasks_status_priority ON tasks(status, priority);
CREATE INDEX IF NOT EXISTS idx_requests_status_created ON requests(status, created_at DESC);

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================

-- Para verificar que todo se creó correctamente:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
