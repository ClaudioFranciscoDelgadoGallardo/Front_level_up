-- =====================================================================
-- FIX: Constraint chk_estado_orden no incluye 'ENVIADO' ni 'ENTREGADO'
-- =====================================================================
-- PROBLEMA: La función actualizar_estados_ordenes_activas() usa 'ENVIADO' y 'ENTREGADO'
-- pero el constraint solo permite 'EN_TRANSITO' y 'ENTREGADA'
--
-- SOLUCIÓN 1 (RECOMENDADA): Actualizar el constraint para permitir ambos valores
-- =====================================================================

-- Eliminar el constraint existente
ALTER TABLE ordenes DROP CONSTRAINT IF EXISTS chk_estado_orden;

-- Crear nuevo constraint con todos los valores necesarios
ALTER TABLE ordenes ADD CONSTRAINT chk_estado_orden CHECK (estado IN (
    'PENDIENTE',     -- Estado inicial
    'CONFIRMADA',    -- Orden confirmada
    'PROCESANDO',    -- En procesamiento
    'EMPACADA',      -- Empacada y lista
    'ENVIADO',       -- ✅ NUEVO - En camino (usado por trigger)
    'EN_TRANSITO',   -- En tránsito (alternativa)
    'ENTREGADO',     -- ✅ NUEVO - Entregado (usado por trigger)
    'ENTREGADA',     -- Entregada (alternativa femenina)
    'CANCELADA',     -- Cancelada
    'DEVUELTA'       -- Devuelta
));

-- =====================================================================
-- VERIFICAR QUE EL CONSTRAINT SE ACTUALIZÓ CORRECTAMENTE
-- =====================================================================
SELECT conname, consrc
FROM pg_constraint
WHERE conname = 'chk_estado_orden'
  AND conrelid = 'ordenes'::regclass;

-- =====================================================================
-- PROBAR LA FUNCIÓN NUEVAMENTE
-- =====================================================================
-- Ahora la función debería funcionar sin errores
SELECT actualizar_estados_ordenes_activas();

-- Ver órdenes actualizadas:
SELECT 
    numero_orden, 
    estado, 
    fecha_creacion,
    ROUND(EXTRACT(EPOCH FROM (NOW() - fecha_creacion)) / 60, 2) as minutos_transcurridos
FROM ordenes
WHERE estado IN ('PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO')
ORDER BY fecha_creacion DESC
LIMIT 10;
