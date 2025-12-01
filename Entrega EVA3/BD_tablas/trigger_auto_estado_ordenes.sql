-- =====================================================================
-- TRIGGER AUTOMÁTICO PARA ACTUALIZACIÓN DE ESTADOS DE ÓRDENES
-- =====================================================================
-- Este trigger actualiza automáticamente el estado de las órdenes
-- basándose en el tiempo transcurrido desde su creación.
--
-- Flujo de estados:
-- PENDIENTE (0 min) → PROCESANDO (1 min) → ENVIADO (3 min) → ENTREGADO (5 min)
-- =====================================================================

-- 1. Crear función que actualiza el estado de una orden según el tiempo transcurrido
CREATE OR REPLACE FUNCTION actualizar_estado_orden()
RETURNS TRIGGER AS $$
DECLARE
    minutos_transcurridos INTEGER;
BEGIN
    -- Calcular minutos desde la creación
    minutos_transcurridos := EXTRACT(EPOCH FROM (NOW() - NEW.fecha_creacion)) / 60;
    
    -- Actualizar estado según el tiempo transcurrido
    IF NEW.estado = 'PENDIENTE' AND minutos_transcurridos >= 1 THEN
        NEW.estado := 'PROCESANDO';
        RAISE NOTICE 'Orden % actualizada: PENDIENTE → PROCESANDO (% minutos)', NEW.numero_orden, minutos_transcurridos;
    ELSIF NEW.estado = 'PROCESANDO' AND minutos_transcurridos >= 3 THEN
        NEW.estado := 'ENVIADO';
        RAISE NOTICE 'Orden % actualizada: PROCESANDO → ENVIADO (% minutos)', NEW.numero_orden, minutos_transcurridos;
    ELSIF NEW.estado = 'ENVIADO' AND minutos_transcurridos >= 5 THEN
        NEW.estado := 'ENTREGADO';
        RAISE NOTICE 'Orden % actualizada: ENVIADO → ENTREGADO (% minutos)', NEW.numero_orden, minutos_transcurridos;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Crear trigger que se ejecuta ANTES de cada SELECT para actualizar estados
-- Nota: En PostgreSQL no existe BEFORE SELECT, así que usamos una función programada
-- que se ejecutará periódicamente mediante pg_cron

-- Primero, habilitar la extensión pg_cron si no está habilitada
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 3. Crear función que actualiza todos los estados de órdenes activas
CREATE OR REPLACE FUNCTION actualizar_estados_ordenes_activas()
RETURNS void AS $$
DECLARE
    orden_record RECORD;
    minutos_transcurridos INTEGER;
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
                orden_record.numero_orden, ROUND(minutos_transcurridos::numeric, 2);
        
        -- PROCESANDO → ENVIADO (3 minutos)
        ELSIF orden_record.estado = 'PROCESANDO' AND minutos_transcurridos >= 3 THEN
            UPDATE ordenes 
            SET estado = 'ENVIADO', fecha_actualizacion = NOW()
            WHERE id = orden_record.id;
            ordenes_actualizadas := ordenes_actualizadas + 1;
            RAISE NOTICE '✅ Orden #% actualizada: PROCESANDO → ENVIADO (% minutos)', 
                orden_record.numero_orden, ROUND(minutos_transcurridos::numeric, 2);
        
        -- ENVIADO → ENTREGADO (5 minutos)
        ELSIF orden_record.estado = 'ENVIADO' AND minutos_transcurridos >= 5 THEN
            UPDATE ordenes 
            SET estado = 'ENTREGADO', fecha_actualizacion = NOW()
            WHERE id = orden_record.id;
            ordenes_actualizadas := ordenes_actualizadas + 1;
            RAISE NOTICE '✅ Orden #% actualizada: ENVIADO → ENTREGADO (% minutos)', 
                orden_record.numero_orden, ROUND(minutos_transcurridos::numeric, 2);
        END IF;
    END LOOP;
    
    IF ordenes_actualizadas > 0 THEN
        RAISE NOTICE '🎯 Total de órdenes actualizadas: %', ordenes_actualizadas;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. Programar la ejecución automática cada 30 segundos
-- Nota: pg_cron solo soporta minutos como mínimo, así que ejecutaremos cada minuto
SELECT cron.schedule(
    'actualizar-estados-ordenes',  -- nombre del job
    '* * * * *',                    -- cada minuto
    'SELECT actualizar_estados_ordenes_activas();'
);

-- 5. Verificar que el job se creó correctamente
SELECT * FROM cron.job WHERE jobname = 'actualizar-estados-ordenes';

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
