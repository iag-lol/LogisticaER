-- =====================================================
-- EQUIPO CLM - INSTALACIÓN SIMPLE (SIN RESET)
-- =====================================================
-- Este archivo te permite ejecutarlo múltiples veces
-- sin errores. Ideal si ya ejecutaste parcialmente.
-- =====================================================

-- 1. Primero LIMPIAR TODO (ejecutar esto primero)
-- Copiar y ejecutar estas líneas PRIMERO en Supabase:

DO $$
BEGIN
    -- Eliminar políticas existentes
    EXECUTE 'DROP POLICY IF EXISTS "Perfiles visibles para todos autenticados" ON profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Solo JT y SA pueden gestionar perfiles" ON profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Tareas visibles para todos" ON tasks';
    EXECUTE 'DROP POLICY IF EXISTS "Supervisores pueden crear tareas" ON tasks';
    EXECUTE 'DROP POLICY IF EXISTS "Creador y asignados pueden actualizar tareas" ON tasks';
    EXECUTE 'DROP POLICY IF EXISTS "Solo creador o JT pueden eliminar tareas" ON tasks';
    EXECUTE 'DROP POLICY IF EXISTS "Asignaciones visibles para todos" ON task_supervisors';
    EXECUTE 'DROP POLICY IF EXISTS "Asignaciones de inspectores visibles para todos" ON task_inspectors';
    EXECUTE 'DROP POLICY IF EXISTS "Creador puede gestionar supervisores de tarea" ON task_supervisors';
    EXECUTE 'DROP POLICY IF EXISTS "Creador puede gestionar inspectores de tarea" ON task_inspectors';
    EXECUTE 'DROP POLICY IF EXISTS "Reuniones visibles para todos" ON meetings';
    EXECUTE 'DROP POLICY IF EXISTS "Supervisores pueden crear reuniones" ON meetings';
    EXECUTE 'DROP POLICY IF EXISTS "Creador puede gestionar sus reuniones" ON meetings';
    EXECUTE 'DROP POLICY IF EXISTS "Creador puede eliminar sus reuniones" ON meetings';
    EXECUTE 'DROP POLICY IF EXISTS "Asistentes visibles para todos" ON meeting_attendees';
    EXECUTE 'DROP POLICY IF EXISTS "Creador de reunión puede gestionar asistentes" ON meeting_attendees';
    EXECUTE 'DROP POLICY IF EXISTS "Informes visibles para todos" ON reports';
    EXECUTE 'DROP POLICY IF EXISTS "Solo JT y SA pueden crear informes" ON reports';
    EXECUTE 'DROP POLICY IF EXISTS "Sesiones de asistencia visibles para todos" ON attendance_sessions';
    EXECUTE 'DROP POLICY IF EXISTS "Supervisores pueden crear sesiones de asistencia" ON attendance_sessions';
    EXECUTE 'DROP POLICY IF EXISTS "Supervisor puede actualizar su sesión" ON attendance_sessions';
    EXECUTE 'DROP POLICY IF EXISTS "Planes de limpieza visibles para todos" ON cleaning_plans';
    EXECUTE 'DROP POLICY IF EXISTS "IPA y superiores pueden crear planes de limpieza" ON cleaning_plans';
    EXECUTE 'DROP POLICY IF EXISTS "IPA y superiores pueden actualizar planes" ON cleaning_plans';
    EXECUTE 'DROP POLICY IF EXISTS "Solicitudes visibles para todos" ON requests';
    EXECUTE 'DROP POLICY IF EXISTS "Cualquiera puede crear solicitudes" ON requests';
    EXECUTE 'DROP POLICY IF EXISTS "Solicitante puede actualizar su solicitud" ON requests';
    EXECUTE 'DROP POLICY IF EXISTS "SA y JT pueden aprobar solicitudes" ON requests';
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 2. Después ejecuta el schema completo que ya tienes
-- Abre database-schema.sql y ejecútalo completo

-- =====================================================
-- FIN
-- =====================================================
