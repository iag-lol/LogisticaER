# Solución al Error: "type user_role already exists"

## 🔴 Problema

Cuando ejecutaste `database-schema.sql` recibiste este error:

```
ERROR: 42710: type "user_role" already exists
```

Esto significa que ya ejecutaste parte del schema anteriormente.

---

## ✅ Solución Rápida (Opción 1: Limpiar Todo y Empezar de Nuevo)

### Paso 1: Ejecuta el script de limpieza

En Supabase → SQL Editor, ejecuta este archivo:

**Archivo:** `database-reset.sql`

Este script eliminará TODAS las tablas, tipos y datos. ⚠️ **CUIDADO**: Perderás todos los datos existentes.

### Paso 2: Ejecuta el schema completo

Después de limpiar, ejecuta:

**Archivo:** `database-schema.sql`

Ahora debería funcionar sin errores.

---

## ✅ Solución Alternativa (Opción 2: Continuar desde donde quedó)

Si prefieres no borrar nada y solo agregar lo que falta:

### Paso 1: Verifica qué tablas ya existen

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Paso 2: Ejecuta solo las secciones faltantes

El archivo `database-schema.sql` ya está preparado para ejecutarse múltiples veces porque usa:

- `CREATE TYPE IF NOT EXISTS` para los enums
- `CREATE TABLE IF NOT EXISTS` para las tablas
- `CREATE INDEX IF NOT EXISTS` para los índices
- `DROP TRIGGER IF EXISTS` antes de crear triggers
- `DROP POLICY IF EXISTS` antes de crear políticas

Entonces puedes ejecutar el archivo completo nuevamente y solo creará lo que falta.

### Paso 3 (Solo si da error en políticas): Limpiar políticas existentes

Si el paso anterior falla en las políticas RLS, ejecuta primero `database-schema-simple.sql` (Bloque 1) para limpiar las políticas, y luego ejecuta el schema completo.

---

## 📋 Pasos Recomendados

### Para Desarrollo/Testing (Sin Datos Importantes)

```bash
1. Ejecuta: database-reset.sql
2. Ejecuta: database-schema.sql
3. Crea usuarios de prueba (ver INSTRUCCIONES-DATABASE.md)
✅ Listo!
```

### Para Producción (Con Datos Existentes)

```bash
1. Ejecuta: database-schema.sql directamente
   (Saltará lo que ya existe y creará lo faltante)
2. Si hay error, ejecuta solo la sección que falla
✅ Listo!
```

---

## 🎯 Verificación Final

Después de ejecutar el schema, verifica que todo esté correcto:

```sql
-- Ver tablas creadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;

-- Ver tipos enum creados
SELECT typname FROM pg_type
WHERE typname IN ('user_role', 'task_status', 'task_priority', 'request_status', 'cleaning_status');

-- Ver triggers creados
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- Ver políticas RLS creadas
SELECT schemaname, tablename, policyname
FROM pg_policies
ORDER BY tablename, policyname;
```

Deberías ver:
- ✅ 10 tablas
- ✅ 5 tipos enum
- ✅ 7 triggers
- ✅ ~30 políticas RLS

---

## 🆘 Si Sigues Teniendo Problemas

1. **Error en tipos ENUM:**
   - Ejecuta `database-reset.sql` completamente
   - Luego `database-schema.sql`

2. **Error en tablas:**
   - Verifica que `profiles` se haya creado primero
   - Las demás tablas dependen de `profiles`

3. **Error en políticas:**
   - Ejecuta solo la sección de limpieza de `database-schema-simple.sql`
   - Luego ejecuta las políticas del `database-schema.sql`

4. **Error en triggers:**
   - Los triggers se recrean automáticamente con `DROP IF EXISTS`
   - Si falla, ejecuta manualmente cada `DROP TRIGGER IF EXISTS`

---

## 📞 Archivos de Ayuda

- `database-schema.sql` → Schema completo (modificado para ser idempotente)
- `database-reset.sql` → Limpia todo y empieza de cero
- `database-schema-simple.sql` → Limpia solo políticas (para casos específicos)
- `INSTRUCCIONES-DATABASE.md` → Guía completa paso a paso

---

¡Ahora deberías poder ejecutar el schema sin errores! 🎉
