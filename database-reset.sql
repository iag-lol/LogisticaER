-- =====================================================
-- EQUIPO CLM - SCRIPT DE LIMPIEZA COMPLETA
-- =====================================================
-- ADVERTENCIA: Este script ELIMINARÁ TODOS los datos
-- Solo ejecutar si quieres empezar desde cero
-- =====================================================

-- Deshabilitar temporalmente RLS para poder eliminar
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS task_supervisors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS task_inspectors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS meetings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS meeting_attendees DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendance_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cleaning_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS requests DISABLE ROW LEVEL SECURITY;

-- Eliminar vistas
DROP VIEW IF EXISTS v_tasks_with_assignees;
DROP VIEW IF EXISTS v_meetings_with_attendees;
DROP VIEW IF EXISTS v_requests_with_users;

-- Eliminar triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
DROP TRIGGER IF EXISTS update_attendance_sessions_updated_at ON attendance_sessions;
DROP TRIGGER IF EXISTS update_cleaning_plans_updated_at ON cleaning_plans;
DROP TRIGGER IF EXISTS update_requests_updated_at ON requests;

-- Eliminar funciones
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Eliminar tablas (en orden inverso por dependencias)
DROP TABLE IF EXISTS meeting_attendees CASCADE;
DROP TABLE IF EXISTS task_inspectors CASCADE;
DROP TABLE IF EXISTS task_supervisors CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS cleaning_plans CASCADE;
DROP TABLE IF EXISTS attendance_sessions CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Eliminar tipos ENUM
DROP TYPE IF EXISTS cleaning_status CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Base de datos limpiada completamente. Puedes ejecutar database-schema.sql ahora.';
END $$;
