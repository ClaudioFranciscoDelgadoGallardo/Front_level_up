-- =====================================================================
-- TRIGGER AUTOMÁTICO PARA ACTUALIZACIÓN DE ESTADOS DE ÓRDENES
-- =====================================================================
-- Este script crea una función que se ejecuta automáticamente
-- para actualizar los estados de las órdenes según el tiempo transcurrido.
--
-- Flujo de estados:
-- PENDIENTE (0 min) → PROCESANDO (1 min) → ENVIADO (3 min) → ENTREGADO (5 min)
-- =====================================================================

-- 1. Crear función que actualiza todos los estados de órdenes activas
CREATE OR REPLACE FUNCTION actualizar_estados_ordenes_activas()
RETURNS void AS $$
DECLARE
    orden_record RECORD;
    minutos_transcurridos NUMERIC;
    ordenes_actualizadas INTEGER := 0;
BEGIN
    -- Recorrer todas las órdenes que no están ENTREGADAS ni CANCELADAS
    FOR orden_record IN 
        SELECT id, numero_orden, estado, fecha_creacion
        FROM ordenes
        WHERE estado IN ('PENDIENTE', 'PROCESANDO', 'ENVIADO')
        ORDER BY fecha_creacion
    LOOP
        -- Calcular minutos transcurridos
        minutos_transcurridos := EXTRACT(EPOCH FROM (NOW() - orden_record.fecha_creacion)) / 60;
        
        -- PENDIENTE → PROCESANDO (1 minuto)
        IF orden_record.estado = 'PENDIENTE' AND minutos_transcurridos >= 1 THEN
            UPDATE ordenes 
            SET estado = 'PROCESANDO', fecha_actualizacion = NOW()
            WHERE id = orden_record.id;
            ordenes_actualizadas := ordenes_actualizadas + 1;
            RAISE NOTICE '✅ Orden #% actualizada: PENDIENTE → PROCESANDO (% minutos)', 
                orden_record.numero_orden, ROUND(minutos_transcurridos, 2);
        
        -- PROCESANDO → ENVIADO (3 minutos)
        ELSIF orden_record.estado = 'PROCESANDO' AND minutos_transcurridos >= 3 THEN
            UPDATE ordenes 
            SET estado = 'ENVIADO', fecha_actualizacion = NOW()
            WHERE id = orden_record.id;
            ordenes_actualizadas := ordenes_actualizadas + 1;
            RAISE NOTICE '✅ Orden #% actualizada: PROCESANDO → ENVIADO (% minutos)', 
                orden_record.numero_orden, ROUND(minutos_transcurridos, 2);
        
        -- ENVIADO → ENTREGADO (5 minutos)
        ELSIF orden_record.estado = 'ENVIADO' AND minutos_transcurridos >= 5 THEN
            UPDATE ordenes 
            SET estado = 'ENTREGADO', fecha_actualizacion = NOW()
            WHERE id = orden_record.id;
            ordenes_actualizadas := ordenes_actualizadas + 1;
            RAISE NOTICE '✅ Orden #% actualizada: ENVIADO → ENTREGADO (% minutos)', 
                orden_record.numero_orden, ROUND(minutos_transcurridos, 2);
        END IF;
    END LOOP;
    
    IF ordenes_actualizadas > 0 THEN
        RAISE NOTICE '🎯 Total de órdenes actualizadas: %', ordenes_actualizadas;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Programar ejecución automática con pg_cron (cada minuto)
-- NOTA: pg_cron debe estar habilitado en Supabase (requiere plan Pro o superior)
-- Si pg_cron no está disponible, usa la opción B más abajo

-- OPCIÓN A: Con pg_cron (plan Pro+)
-- SELECT cron.schedule(
--     'actualizar-estados-ordenes',
--     '* * * * *',
--     'SELECT actualizar_estados_ordenes_activas();'
-- );

-- OPCIÓN B: Ejecutar manualmente o desde el backend
-- Puedes llamar esta función desde tu aplicación:
-- SELECT actualizar_estados_ordenes_activas();

-- =====================================================================
-- PRUEBA INMEDIATA
-- =====================================================================
-- Ejecuta esto para probar que funciona:
SELECT actualizar_estados_ordenes_activas();

-- Ver órdenes y su tiempo transcurrido:
SELECT 
    numero_orden, 
    estado, 
    fecha_creacion,
    ROUND(EXTRACT(EPOCH FROM (NOW() - fecha_creacion)) / 60, 2) as minutos_transcurridos
FROM ordenes
WHERE estado IN ('PENDIENTE', 'PROCESANDO', 'ENVIADO')
ORDER BY fecha_creacion DESC
LIMIT 10;

-- =====================================================================
-- COMANDOS ÚTILES PARA ADMINISTRACIÓN
-- =====================================================================

-- Ver todos los jobs programados:
-- SELECT * FROM cron.job;

-- Ver el historial de ejecuciones:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- Desactivar el job (si es necesario):
-- SELECT cron.unschedule('actualizar-estados-ordenes');

-- Reactivar el job:
-- SELECT cron.schedule('actualizar-estados-ordenes', '* * * * *', 'SELECT actualizar_estados_ordenes_activas();');

-- Ejecutar manualmente la función:
-- SELECT actualizar_estados_ordenes_activas();

-- Ver órdenes pendientes de actualización:
-- SELECT numero_orden, estado, fecha_creacion, 
--        EXTRACT(EPOCH FROM (NOW() - fecha_creacion)) / 60 as minutos_transcurridos
-- FROM ordenes
-- WHERE estado IN ('PENDIENTE', 'PROCESANDO', 'ENVIADO')
-- ORDER BY fecha_creacion;

-- =====================================================================
-- LIMPIEZA (Solo ejecutar si necesitas eliminar el sistema)
-- =====================================================================
-- SELECT cron.unschedule('actualizar-estados-ordenes');
-- DROP FUNCTION IF EXISTS actualizar_estados_ordenes_activas();
-- DROP FUNCTION IF EXISTS actualizar_estado_orden();
