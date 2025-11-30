-- =====================================================
-- SCRIPT DE DIAGNÓSTICO - EQUIPO CLM
-- =====================================================
-- Ejecuta esto en Supabase SQL Editor para ver qué falta
-- =====================================================

-- 1. Verificar extensiones
SELECT
  'EXTENSIONES' as tipo,
  extname as nombre,
  'OK' as estado
FROM pg_extension
WHERE extname = 'uuid-ossp';

-- 2. Verificar tipos ENUM
SELECT
  'ENUMS' as tipo,
  typname as nombre,
  'OK' as estado
FROM pg_type
WHERE typname IN ('user_role', 'task_status', 'task_priority', 'request_status', 'cleaning_status')
ORDER BY typname;

-- 3. Verificar tablas
SELECT
  'TABLAS' as tipo,
  table_name as nombre,
  'OK' as estado
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles',
    'tasks',
    'task_supervisors',
    'task_inspectors',
    'meetings',
    'meeting_attendees',
    'reports',
    'attendance_sessions',
    'cleaning_plans',
    'requests'
  )
ORDER BY table_name;

-- 4. Verificar triggers
SELECT
  'TRIGGERS' as tipo,
  trigger_name as nombre,
  event_object_table as tabla,
  'OK' as estado
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- 5. Verificar políticas RLS
SELECT
  'POLÍTICAS RLS' as tipo,
  tablename as tabla,
  policyname as nombre,
  'OK' as estado
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. Verificar que RLS está habilitado
SELECT
  'RLS HABILITADO' as tipo,
  tablename as nombre,
  CASE WHEN rowsecurity THEN 'SÍ' ELSE 'NO' END as estado
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'tasks',
    'task_supervisors',
    'task_inspectors',
    'meetings',
    'meeting_attendees',
    'reports',
    'attendance_sessions',
    'cleaning_plans',
    'requests'
  )
ORDER BY tablename;

-- 7. Contar usuarios existentes
SELECT
  'USUARIOS' as tipo,
  COUNT(*) as cantidad,
  'usuarios en auth.users' as detalle
FROM auth.users;

-- 8. Contar perfiles existentes
SELECT
  'PERFILES' as tipo,
  COUNT(*) as cantidad,
  'perfiles en profiles' as detalle
FROM profiles;

-- =====================================================
-- RESUMEN ESPERADO:
-- =====================================================
-- EXTENSIONES: 1 (uuid-ossp)
-- ENUMS: 5 tipos
-- TABLAS: 10 tablas
-- TRIGGERS: 7+ triggers
-- POLÍTICAS RLS: ~30 políticas
-- RLS HABILITADO: SÍ en todas las tablas
-- USUARIOS: Tus usuarios creados
-- PERFILES: Deben coincidir con usuarios
-- =====================================================
