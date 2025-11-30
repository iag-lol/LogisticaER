-- =====================================================
-- CREAR USUARIO ISAAC AVILA - VERSION SIMPLE
-- =====================================================
-- Solo ejecuta este script completo y listo
-- No necesitas reemplazar nada
-- =====================================================

-- Habilitar extensión para encriptar passwords
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- PASO 1: Crear o actualizar perfil
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'isaac.avila@equipoclm.cl';
  v_rut TEXT := '18866264-1';
  v_name TEXT := 'Isaac Avila';
  v_terminal TEXT := 'El Roble';
  v_role user_role := 'JT';
BEGIN
  -- Verificar si el usuario ya existe en auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NOT NULL THEN
    -- El usuario YA existe, crear/actualizar solo el perfil
    RAISE NOTICE 'Usuario encontrado con ID: %', v_user_id;

    INSERT INTO profiles (id, rut, name, terminal, role)
    VALUES (v_user_id, v_rut, v_name, v_terminal, v_role)
    ON CONFLICT (id) DO UPDATE SET
      rut = EXCLUDED.rut,
      name = EXCLUDED.name,
      terminal = EXCLUDED.terminal,
      role = EXCLUDED.role,
      updated_at = NOW();

    RAISE NOTICE '✅ Perfil creado/actualizado para: %', v_email;
    RAISE NOTICE 'RUT: %', v_rut;
    RAISE NOTICE 'Terminal: %', v_terminal;
    RAISE NOTICE 'Rol: %', v_role;
  ELSE
    -- El usuario NO existe, intentar crearlo
    RAISE NOTICE 'Usuario no existe. Creando desde cero...';

    -- Generar UUID para nuevo usuario
    v_user_id := gen_random_uuid();

    BEGIN
      -- Intentar crear en auth.users
      INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        raw_app_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        aud,
        role
      ) VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        v_email,
        crypt('RBU2025.', gen_salt('bf')),
        NOW(),
        jsonb_build_object(
          'rut', v_rut,
          'name', v_name,
          'terminal', v_terminal,
          'role', v_role::text
        ),
        '{}',
        NOW(),
        NOW(),
        '',
        'authenticated',
        'authenticated'
      );

      RAISE NOTICE '✅ Usuario creado en auth.users';
      RAISE NOTICE 'Email: %', v_email;
      RAISE NOTICE 'Password: RBU2025.';
      RAISE NOTICE 'ID: %', v_user_id;

      -- El trigger debería crear el perfil automáticamente
      -- Pero lo creamos manualmente por si acaso
      INSERT INTO profiles (id, rut, name, terminal, role)
      VALUES (v_user_id, v_rut, v_name, v_terminal, v_role)
      ON CONFLICT (id) DO NOTHING;

      RAISE NOTICE '✅ Perfil creado';

    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE '❌ Error al crear usuario en auth.users: %', SQLERRM;
        RAISE NOTICE 'Solución: Crea el usuario desde Supabase Dashboard';
        RAISE NOTICE 'Luego ejecuta este script nuevamente';
    END;
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Error general: %', SQLERRM;
END $$;

-- =====================================================
-- PASO 2: Verificar resultado
-- =====================================================

-- Ver usuario en auth.users
SELECT
  '1️⃣ USUARIO EN AUTH' as paso,
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmado,
  raw_user_meta_data->>'name' as nombre,
  raw_user_meta_data->>'rut' as rut
FROM auth.users
WHERE email = 'isaac.avila@equipoclm.cl';

-- Ver perfil en profiles
SELECT
  '2️⃣ PERFIL' as paso,
  id,
  rut,
  name,
  terminal,
  role::text as rol,
  created_at
FROM profiles
WHERE rut = '18866264-1';

-- Verificar que puede hacer login
SELECT
  '3️⃣ PUEDE HACER LOGIN' as paso,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM auth.users au
      JOIN profiles p ON au.id = p.id
      WHERE au.email = 'isaac.avila@equipoclm.cl'
      AND au.email_confirmed_at IS NOT NULL
    ) THEN '✅ SÍ - Todo listo para login'
    ELSE '❌ NO - Falta confirmar email o crear perfil'
  END as resultado;

-- =====================================================
-- RESUMEN
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '📋 CREDENCIALES DE LOGIN';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Email: isaac.avila@equipoclm.cl';
  RAISE NOTICE 'Password: RBU2025.';
  RAISE NOTICE 'Rol: JT (Jefe de Terminal)';
  RAISE NOTICE 'Terminal: El Roble';
  RAISE NOTICE '========================================';
END $$;
