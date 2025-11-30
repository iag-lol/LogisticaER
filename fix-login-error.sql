-- =====================================================
-- FIX PARA ERROR DE LOGIN
-- =====================================================
-- Este script soluciona el error:
-- "Database error querying schema"
-- =====================================================

-- PASO 1: Verificar que la tabla profiles existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    RAISE EXCEPTION 'ERROR: La tabla profiles NO EXISTE. Debes ejecutar database-schema.sql primero.';
  ELSE
    RAISE NOTICE 'OK: La tabla profiles existe.';
  END IF;
END $$;

-- PASO 2: Verificar que hay políticas RLS en profiles
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'profiles';

  IF policy_count = 0 THEN
    RAISE EXCEPTION 'ERROR: No hay políticas RLS en profiles. El login no funcionará.';
  ELSE
    RAISE NOTICE 'OK: Hay % políticas RLS en profiles.', policy_count;
  END IF;
END $$;

-- PASO 3: TEMPORAL - Deshabilitar RLS para diagnóstico
-- ADVERTENCIA: Esto es solo para diagnosticar el problema
-- NO uses esto en producción

-- Descomentar la siguiente línea SOLO para diagnóstico:
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- PASO 4: Crear una política permisiva temporal para debugging
-- Esta política permite a TODOS los usuarios autenticados ver todos los perfiles

DROP POLICY IF EXISTS "temp_debug_select_all" ON profiles;
CREATE POLICY "temp_debug_select_all"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- PASO 5: Verificar que puedes consultar profiles
-- Ejecuta esto después de aplicar los cambios:
SELECT
  'PRUEBA DE CONSULTA' as tipo,
  COUNT(*) as total_perfiles,
  CASE
    WHEN COUNT(*) > 0 THEN 'OK - Puedes consultar profiles'
    ELSE 'ERROR - No hay perfiles o no puedes acceder'
  END as resultado
FROM profiles;

-- =====================================================
-- INSTRUCCIONES:
-- =====================================================
-- 1. Ejecuta este script completo
-- 2. Si dice "tabla profiles NO EXISTE":
--    → Ejecuta primero: database-schema.sql
--
-- 3. Si dice "No hay políticas RLS":
--    → Ejecuta la sección 15 de database-schema.sql
--
-- 4. Si todo dice OK pero sigue fallando:
--    → Descomentar línea del PASO 3 (deshabilitar RLS)
--    → Probar login nuevamente
--    → Si funciona, el problema son las políticas RLS
-- =====================================================
