-- =====================================================
-- CREAR USUARIO: Isaac Avila
-- =====================================================
-- RUT: 18866264-1
-- Terminal: El Roble
-- Email: isaac.avila@equipoclm.cl
-- Password: RBU2025.
-- Rol: JT (Jefe de Terminal)
-- =====================================================

-- =====================================================
-- OPCIÓN 1: Crear usuario completo con SQL
-- =====================================================
-- Requiere permisos de superusuario en auth.users
-- Si esto falla, usa la OPCIÓN 2 más abajo

DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Generar un UUID para el usuario
  new_user_id := gen_random_uuid();

  -- Insertar en auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    aud,
    role
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'isaac.avila@equipoclm.cl',
    crypt('RBU2025.', gen_salt('bf')),  -- Encripta la contraseña
    NOW(),  -- Email ya confirmado
    jsonb_build_object(
      'rut', '18866264-1',
      'name', 'Isaac Avila',
      'terminal', 'El Roble',
      'role', 'JT'
    ),
    NOW(),
    NOW(),
    '',
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (email) DO NOTHING;  -- Si ya existe, no hacer nada

  RAISE NOTICE 'Usuario creado exitosamente con ID: %', new_user_id;
  RAISE NOTICE 'Email: isaac.avila@equipoclm.cl';
  RAISE NOTICE 'Password: RBU2025.';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'ERROR al crear usuario en auth.users: %', SQLERRM;
    RAISE NOTICE 'Usa la OPCIÓN 2 para crear desde el Dashboard.';
END $$;

-- El trigger "on_auth_user_created" debería crear automáticamente
-- el perfil en la tabla "profiles" con los datos del metadata

-- Verificar que se creó el perfil
SELECT
  'VERIFICACIÓN' as tipo,
  id,
  email,
  raw_user_meta_data->>'name' as nombre,
  raw_user_meta_data->>'rut' as rut,
  raw_user_meta_data->>'terminal' as terminal,
  raw_user_meta_data->>'role' as rol
FROM auth.users
WHERE email = 'isaac.avila@equipoclm.cl';

-- Ver el perfil creado
SELECT
  'PERFIL' as tipo,
  id,
  rut,
  name,
  terminal,
  role,
  created_at
FROM profiles
WHERE rut = '18866264-1';

-- =====================================================
-- OPCIÓN 2: Crear solo perfil (usuario ya existe)
-- =====================================================
-- Usa esto si YA creaste el usuario desde el Dashboard
-- de Supabase en Authentication > Users

/*
-- Primero, obtén el UUID del usuario creado en el Dashboard
SELECT id, email FROM auth.users WHERE email = 'isaac.avila@equipoclm.cl';

-- Luego, reemplaza 'UUID-DEL-USUARIO' con el UUID real y ejecuta:
INSERT INTO profiles (id, rut, name, terminal, role)
VALUES (
  'UUID-DEL-USUARIO',  -- Reemplazar con UUID real
  '18866264-1',
  'Isaac Avila',
  'El Roble',
  'JT'::user_role
)
ON CONFLICT (id) DO UPDATE SET
  rut = EXCLUDED.rut,
  name = EXCLUDED.name,
  terminal = EXCLUDED.terminal,
  role = EXCLUDED.role,
  updated_at = NOW();
*/

-- =====================================================
-- OPCIÓN 3: Desde Supabase Dashboard (RECOMENDADO)
-- =====================================================
-- Esta es la forma más fácil y segura:
--
-- 1. Ve a Supabase Dashboard
-- 2. Authentication > Users > "Add user"
-- 3. Completa:
--    Email: isaac.avila@equipoclm.cl
--    Password: RBU2025.
--    Auto Confirm User: ✅ (activar)
--
-- 4. En "User Metadata" pega esto:
/*
{
  "rut": "18866264-1",
  "name": "Isaac Avila",
  "terminal": "El Roble",
  "role": "JT"
}
*/
--
-- 5. Click "Create user"
-- 6. El trigger creará automáticamente el perfil
-- =====================================================

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================
-- Ejecuta esto para verificar que todo está correcto:

-- 1. Ver el usuario en auth.users
SELECT
  '1. USUARIO AUTH' as paso,
  id,
  email,
  email_confirmed_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'isaac.avila@equipoclm.cl';

-- 2. Ver el perfil en profiles
SELECT
  '2. PERFIL' as paso,
  id,
  rut,
  name,
  terminal,
  role::text as role,
  created_at
FROM profiles
WHERE rut = '18866264-1';

-- 3. Verificar que puede hacer login (simular auth)
SELECT
  '3. PRUEBA LOGIN' as paso,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM auth.users
      WHERE email = 'isaac.avila@equipoclm.cl'
      AND email_confirmed_at IS NOT NULL
    ) THEN 'OK - Email confirmado, puede hacer login'
    ELSE 'ERROR - Email no confirmado'
  END as resultado;

-- 4. Verificar políticas RLS
SELECT
  '4. POLÍTICAS RLS' as paso,
  COUNT(*) as total_politicas,
  CASE
    WHEN COUNT(*) > 0 THEN 'OK - Políticas RLS activas en profiles'
    ELSE 'ERROR - No hay políticas RLS'
  END as resultado
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- =====================================================
-- CREDENCIALES PARA LOGIN
-- =====================================================
-- Email: isaac.avila@equipoclm.cl
-- Password: RBU2025.
-- Rol: JT (Jefe de Terminal - Acceso total)
-- =====================================================
