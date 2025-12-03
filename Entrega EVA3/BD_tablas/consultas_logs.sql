-- =============================================
-- CONSULTAS SQL PARA AdminLogs.jsx
-- Para usar con Supabase Client directo
-- =============================================

-- CONSULTA 1: Obtener logs con filtros (paginado)
-- Uso: supabase.from('logs_sistema').select('*').order('fecha', { ascending: false })

SELECT 
    id,
    tipo,
    nivel,
    usuario_id,
    modulo,
    accion,
    descripcion,
    entidad_tipo,
    entidad_id,
    fecha,
    ip_address,
    user_agent
FROM logs_sistema
WHERE 
    ($1::VARCHAR IS NULL OR tipo = $1)  -- Filtro tipo (ADMIN, USUARIO, SISTEMA)
    AND ($2::VARCHAR IS NULL OR accion ILIKE '%' || $2 || '%')  -- Filtro acción
    AND ($3::TIMESTAMP IS NULL OR fecha >= $3)  -- Fecha inicio
    AND ($4::TIMESTAMP IS NULL OR fecha <= $4)  -- Fecha fin
ORDER BY fecha DESC
LIMIT $5 OFFSET $6;  -- Paginación

-- CONSULTA 2: Contar total de logs con filtros
SELECT COUNT(*) as total
FROM logs_sistema
WHERE 
    ($1::VARCHAR IS NULL OR tipo = $1)
    AND ($2::VARCHAR IS NULL OR accion ILIKE '%' || $2 || '%')
    AND ($3::TIMESTAMP IS NULL OR fecha >= $3)
    AND ($4::TIMESTAMP IS NULL OR fecha <= $4);

-- CONSULTA 3: Estadísticas de logs
SELECT 
    COUNT(*) as total_logs,
    COUNT(CASE WHEN tipo = 'ADMIN' THEN 1 END) as logs_admin,
    COUNT(CASE WHEN tipo = 'USUARIO' THEN 1 END) as logs_usuario,
    COUNT(CASE WHEN tipo = 'SISTEMA' THEN 1 END) as logs_sistema,
    COUNT(CASE WHEN nivel = 'ERROR' THEN 1 END) as logs_error,
    COUNT(CASE WHEN nivel = 'WARNING' THEN 1 END) as logs_warning
FROM logs_sistema
WHERE fecha >= NOW() - INTERVAL '30 days';

-- CONSULTA 4: Logs por usuario específico
SELECT 
    l.*,
    u.nombre,
    u.apellidos,
    u.correo
FROM logs_sistema l
LEFT JOIN usuarios u ON l.usuario_id = u.id
WHERE l.usuario_id = $1
ORDER BY l.fecha DESC
LIMIT 100;

-- CONSULTA 5: Logs de una entidad específica (ejemplo: producto, orden)
SELECT *
FROM logs_sistema
WHERE entidad_tipo = $1 AND entidad_id = $2
ORDER BY fecha DESC;
