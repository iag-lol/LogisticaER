# Solución al Error: "Database error querying schema"

## 🔴 Error Completo

```
Error: Database error querying schema
at AO (index-92T7RYZ2.js:165:36684)
at async signIn
```

Este error ocurre cuando intentas hacer login pero **la aplicación no puede consultar la tabla `profiles`** en Supabase.

---

## ✅ Solución en 3 Pasos

### **Paso 1: Verificar que ejecutaste el SQL en Supabase**

¿Ya ejecutaste el archivo `database-schema.sql` en Supabase?

**Si NO lo has ejecutado:**

1. Ve a Supabase → **SQL Editor**
2. Abre el archivo: [database-schema.sql](database-schema.sql)
3. **Copia TODO** el contenido
4. Pégalo en el SQL Editor
5. Haz clic en **"Run"**

⏱️ Debería completarse en 10-15 segundos.

---

### **Paso 2: Ejecutar Script de Diagnóstico**

Para saber exactamente qué falta, ejecuta esto en Supabase SQL Editor:

**Archivo:** [diagnostico-database.sql](diagnostico-database.sql)

Este script te dirá:
- ✅ Qué tablas existen
- ✅ Qué políticas RLS están activas
- ✅ Cuántos usuarios tienes
- ❌ Qué falta crear

**Resultados esperados:**
```
EXTENSIONES: 1 (uuid-ossp)
ENUMS: 5 tipos
TABLAS: 10 tablas  ← IMPORTANTE
TRIGGERS: 7+ triggers
POLÍTICAS RLS: ~30 políticas  ← IMPORTANTE
USUARIOS: Tu cantidad de usuarios
PERFILES: Debe coincidir con usuarios
```

---

### **Paso 3: Aplicar el Fix**

Ejecuta el script de reparación:

**Archivo:** [fix-login-error.sql](fix-login-error.sql)

Este script:
1. Verifica que `profiles` existe
2. Verifica que hay políticas RLS
3. Crea una política permisiva temporal
4. Prueba que puedes consultar la tabla

---

## 🔍 Diagnóstico Rápido

### Causa Más Común: **Tabla `profiles` no existe**

Si no ejecutaste `database-schema.sql`, la tabla `profiles` no existe y el login fallará.

**Verificar:**
```sql
SELECT * FROM profiles LIMIT 1;
```

**Si dice:** `relation "profiles" does not exist`
→ **Solución:** Ejecuta `database-schema.sql` completo

---

### Segunda Causa: **Políticas RLS muy restrictivas**

Las políticas RLS pueden estar bloqueando el acceso.

**Verificar:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

**Si retorna 0 filas:**
→ **Solución:** Ejecuta solo la sección 15 de `database-schema.sql` (políticas RLS)

**Si retorna políticas pero aún falla:**
→ **Solución temporal:** Deshabilita RLS temporalmente para probar:

```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

Luego prueba login. Si funciona, el problema son las políticas.

---

### Tercera Causa: **Usuario no tiene perfil**

El usuario existe en `auth.users` pero no en `profiles`.

**Verificar:**
```sql
-- Ver usuarios en auth
SELECT id, email FROM auth.users;

-- Ver perfiles
SELECT id, name, role FROM profiles;
```

**Si hay usuarios sin perfil:**
→ **Solución:** El trigger debería crearlos automáticamente. Crea manualmente:

```sql
-- Reemplaza UUID-DEL-USUARIO con el UUID real del paso anterior
INSERT INTO profiles (id, rut, name, terminal, role)
VALUES (
  'UUID-DEL-USUARIO',
  '12345678-9',
  'Isaac Avila',
  'Terminal Principal',
  'JT'
);
```

---

## 🎯 Checklist de Verificación

Marca cada punto:

- [ ] ✅ Ejecuté `database-schema.sql` completo en Supabase
- [ ] ✅ La tabla `profiles` existe (verificado con `SELECT * FROM profiles`)
- [ ] ✅ Hay políticas RLS en `profiles` (verificado con diagnóstico)
- [ ] ✅ Creé al menos 1 usuario en Supabase Dashboard → Authentication
- [ ] ✅ Ese usuario tiene metadata con `rut`, `name`, `terminal`, `role`
- [ ] ✅ El usuario tiene un perfil en `profiles` (auto-creado por trigger)

---

## 🔧 Solución Rápida (Si tienes prisa)

Ejecuta estos 3 archivos SQL **en orden**:

```bash
1. database-reset.sql       ← Limpia todo
2. database-schema.sql      ← Crea todo desde cero
3. fix-login-error.sql      ← Verifica que funciona
```

Luego crea un usuario:

1. Supabase → Authentication → Users → **Add user**
2. Email: `isaac.avila@equipoclm.cl`
3. Password: `RBU2025.`
4. User Metadata:
```json
{
  "rut": "12345678-9",
  "name": "Isaac Avila",
  "terminal": "Terminal Principal",
  "role": "JT"
}
```

5. Prueba login con ese usuario

---

## 🚨 Si Nada Funciona

Ejecuta este comando de emergencia en Supabase SQL Editor:

```sql
-- EMERGENCIA: Deshabilitar RLS temporalmente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Crear usuario manualmente si no existe
INSERT INTO profiles (id, rut, name, terminal, role)
SELECT
  id,
  '12345678-9',
  'Isaac Avila',
  'Terminal Principal',
  'JT'::user_role
FROM auth.users
WHERE email = 'isaac.avila@equipoclm.cl'
ON CONFLICT (id) DO NOTHING;

-- Verificar
SELECT * FROM profiles;
```

Si después de esto el login funciona, el problema eran las políticas RLS.

Para re-habilitar RLS después:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

## 📞 Información para Debug

Cuando pruebes el login, abre la **Consola del navegador** (F12) y busca:

- ❌ Errores en **Console**
- ❌ Requests fallidos en **Network**
- ❌ Respuestas con código 401, 403 o 500

Esos errores te dirán exactamente qué política RLS está bloqueando el acceso.

---

## ✅ Login Exitoso

Cuando todo funcione correctamente, deberías ver:

1. ✅ Usuario autenticado en Supabase
2. ✅ Perfil cargado desde `profiles`
3. ✅ Redirección al dashboard
4. ✅ No más errores en consola

---

**¿Ejecutaste ya el `database-schema.sql` en Supabase?** Si no, ese es el primer paso obligatorio.
