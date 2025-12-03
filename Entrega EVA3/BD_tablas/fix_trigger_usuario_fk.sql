-- =============================================
-- FIX URGENTE: Foreign Key violation al eliminar usuarios
-- Problema: El trigger intenta insertar usuario_id=X en logs_sistema
--           mientras el usuario X está siendo eliminado
-- Solución: Establecer usuario_id=NULL al eliminar usuarios
-- =============================================

\echo '🔧 Aplicando fix para trigger de eliminación de usuarios...'

-- Recrear solo la parte problemática de la función
CREATE OR REPLACE FUNCTION registrar_log_automatico()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_tipo VARCHAR(20) := 'SISTEMA';
    v_accion VARCHAR(100);
    v_descripcion TEXT;
    v_usuario_id BIGINT := NULL;
    v_datos_anteriores JSONB := NULL;
    v_datos_nuevos JSONB := NULL;
BEGIN
    -- Determinar la acción
    IF (TG_OP = 'INSERT') THEN
        v_accion := 'CREAR';
        v_datos_nuevos := row_to_json(NEW)::jsonb;
        
        -- Descripción específica según tabla
        IF (TG_TABLE_NAME = 'productos') THEN
            v_descripcion := 'Producto creado: "' || COALESCE(NEW.nombre, 'Sin nombre') || '" | Precio: $' || 
                           COALESCE(NEW.precio_venta::TEXT, '0') || ' | Stock: ' || 
                           COALESCE(NEW.stock_actual::TEXT, '0') || ' | Categoría ID: ' || 
                           COALESCE(NEW.categoria_id::TEXT, 'N/A') || ' | Marca ID: ' || 
                           COALESCE(NEW.marca_id::TEXT, 'N/A');
        ELSIF (TG_TABLE_NAME = 'usuarios') THEN
            v_descripcion := 'Usuario registrado: ' || COALESCE(NEW.correo, 'Sin correo') || 
                           ' | Nombre: ' || COALESCE(NEW.nombre || ' ' || NEW.apellidos, 'Sin nombre') || 
                           ' | Rol: ' || COALESCE(NEW.rol, 'Sin rol') || 
                           ' | Estado: ' || CASE WHEN NEW.activo THEN 'Activo' ELSE 'Inactivo' END;
        ELSIF (TG_TABLE_NAME = 'ordenes') THEN
            v_descripcion := 'Orden #' || NEW.id || ' creada | Usuario ID: ' || 
                           COALESCE(NEW.usuario_id::TEXT, 'N/A') || ' | Estado: ' || 
                           COALESCE(NEW.estado, 'Sin estado') || ' | Total: $' || 
                           COALESCE(NEW.total::TEXT, '0') || ' | Dirección: ' || 
                           COALESCE(NEW.direccion_envio, 'Sin dirección');
        ELSIF (TG_TABLE_NAME = 'categorias') THEN
            v_descripcion := 'Categoría creada: "' || COALESCE(NEW.nombre, 'Sin nombre') || 
                           '" | Descripción: ' || COALESCE(NEW.descripcion, 'Sin descripción') || 
                           ' | Estado: ' || CASE WHEN NEW.activo THEN 'Activa' ELSE 'Inactiva' END;
        ELSIF (TG_TABLE_NAME = 'marcas') THEN
            v_descripcion := 'Marca creada: "' || COALESCE(NEW.nombre, 'Sin nombre') || 
                           '" | País: ' || COALESCE(NEW.pais, 'Sin país') || 
                           ' | Estado: ' || CASE WHEN NEW.activo THEN 'Activa' ELSE 'Inactiva' END;
        ELSIF (TG_TABLE_NAME = 'detalle_ordenes') THEN
            v_descripcion := 'Detalle agregado | Orden ID: ' || COALESCE(NEW.orden_id::TEXT, 'N/A') || 
                           ' | Producto ID: ' || COALESCE(NEW.producto_id::TEXT, 'N/A') || 
                           ' | Cantidad: ' || COALESCE(NEW.cantidad::TEXT, '0') || 
                           ' | Precio: $' || COALESCE(NEW.precio_unitario::TEXT, '0');
        ELSIF (TG_TABLE_NAME = 'carritos') THEN
            v_descripcion := 'Carrito creado | Usuario ID: ' || COALESCE(NEW.usuario_id::TEXT, 'N/A') || 
                           ' | Estado: ' || COALESCE(NEW.estado, 'Sin estado');
        ELSIF (TG_TABLE_NAME = 'items_carrito') THEN
            v_descripcion := 'Item agregado al carrito | Carrito ID: ' || COALESCE(NEW.carrito_id::TEXT, 'N/A') || 
                           ' | Producto ID: ' || COALESCE(NEW.producto_id::TEXT, 'N/A') || 
                           ' | Cantidad: ' || COALESCE(NEW.cantidad::TEXT, '0');
        ELSIF (TG_TABLE_NAME = 'movimientos_inventario') THEN
            v_descripcion := 'Movimiento inventario | Producto ID: ' || COALESCE(NEW.producto_id::TEXT, 'N/A') || 
                           ' | Tipo: ' || COALESCE(NEW.tipo_movimiento, 'Sin tipo') || 
                           ' | Cantidad: ' || COALESCE(NEW.cantidad::TEXT, '0') || 
                           ' | Motivo: ' || COALESCE(NEW.motivo, 'Sin motivo');
        ELSE
            v_descripcion := 'Registro creado en ' || TG_TABLE_NAME || ' (ID: ' || NEW.id || ')';
        END IF;
        
        -- Intentar obtener usuario_id si existe en el registro
        IF (TG_TABLE_NAME = 'usuarios') THEN
            v_usuario_id := NEW.id;
        ELSIF (to_jsonb(NEW) ? 'usuario_id') THEN
            v_usuario_id := (to_jsonb(NEW)->>'usuario_id')::BIGINT;
        ELSIF (to_jsonb(NEW) ? 'creado_por') THEN
            v_usuario_id := (to_jsonb(NEW)->>'creado_por')::BIGINT;
        END IF;
        
    ELSIF (TG_OP = 'UPDATE') THEN
        v_accion := 'EDITAR';
        v_datos_anteriores := row_to_json(OLD)::jsonb;
        v_datos_nuevos := row_to_json(NEW)::jsonb;
        
        -- Descripción específica según tabla y campos modificados
        IF (TG_TABLE_NAME = 'productos') THEN
            v_descripcion := 'Producto "' || NEW.nombre || '" editado:';
            IF (OLD.nombre != NEW.nombre) THEN
                v_descripcion := v_descripcion || ' Nombre ("' || OLD.nombre || '" → "' || NEW.nombre || '")';
            END IF;
            IF (OLD.precio_venta != NEW.precio_venta) THEN
                v_descripcion := v_descripcion || ' Precio ($' || OLD.precio_venta || ' → $' || NEW.precio_venta || ')';
            END IF;
            IF (OLD.stock_actual != NEW.stock_actual) THEN
                v_descripcion := v_descripcion || ' Stock (' || OLD.stock_actual || ' → ' || NEW.stock_actual || ' uds)';
            END IF;
            IF (OLD.activo != NEW.activo) THEN
                v_descripcion := v_descripcion || ' Estado (' || CASE WHEN NEW.activo THEN 'ACTIVADO' ELSE 'DESACTIVADO' END || ')';
            END IF;
            IF (OLD.descripcion != NEW.descripcion) THEN
                v_descripcion := v_descripcion || ' Descripción modificada';
            END IF;
            IF (OLD.categoria_id != NEW.categoria_id) THEN
                v_descripcion := v_descripcion || ' Categoría (ID:' || OLD.categoria_id || ' → ID:' || NEW.categoria_id || ')';
            END IF;
            IF (OLD.marca_id != NEW.marca_id) THEN
                v_descripcion := v_descripcion || ' Marca (ID:' || OLD.marca_id || ' → ID:' || NEW.marca_id || ')';
            END IF;
        ELSIF (TG_TABLE_NAME = 'usuarios') THEN
            v_descripcion := 'Usuario "' || NEW.correo || '" editado:';
            IF (OLD.correo != NEW.correo) THEN
                v_descripcion := v_descripcion || ' Correo ("' || OLD.correo || '" → "' || NEW.correo || '")';
            END IF;
            IF (OLD.nombre != NEW.nombre OR OLD.apellidos != NEW.apellidos) THEN
                v_descripcion := v_descripcion || ' Nombre ("' || OLD.nombre || ' ' || OLD.apellidos || '" → "' || NEW.nombre || ' ' || NEW.apellidos || '")';
            END IF;
            IF (OLD.rol != NEW.rol) THEN
                v_descripcion := v_descripcion || ' Rol ("' || OLD.rol || '" → "' || NEW.rol || '")';
            END IF;
            IF (OLD.activo != NEW.activo) THEN
                v_descripcion := v_descripcion || ' Estado (' || CASE WHEN NEW.activo THEN 'ACTIVADO' ELSE 'DESACTIVADO' END || ')';
            END IF;
        ELSIF (TG_TABLE_NAME = 'ordenes') THEN
            v_descripcion := 'Orden #' || NEW.id || ' editada:';
            IF (OLD.estado != NEW.estado) THEN
                v_descripcion := v_descripcion || ' Estado ("' || OLD.estado || '" → "' || NEW.estado || '")';
            END IF;
            IF (OLD.total != NEW.total) THEN
                v_descripcion := v_descripcion || ' Total ($' || OLD.total || ' → $' || NEW.total || ')';
            END IF;
            IF (OLD.direccion_envio != NEW.direccion_envio) THEN
                v_descripcion := v_descripcion || ' Dirección modificada';
            END IF;
        ELSIF (TG_TABLE_NAME = 'categorias') THEN
            v_descripcion := 'Categoría "' || NEW.nombre || '" editada:';
            IF (OLD.nombre != NEW.nombre) THEN
                v_descripcion := v_descripcion || ' Nombre ("' || OLD.nombre || '" → "' || NEW.nombre || '")';
            END IF;
            IF (OLD.activo != NEW.activo) THEN
                v_descripcion := v_descripcion || ' Estado (' || CASE WHEN NEW.activo THEN 'ACTIVADA' ELSE 'DESACTIVADA' END || ')';
            END IF;
        ELSIF (TG_TABLE_NAME = 'marcas') THEN
            v_descripcion := 'Marca "' || NEW.nombre || '" editada:';
            IF (OLD.nombre != NEW.nombre) THEN
                v_descripcion := v_descripcion || ' Nombre ("' || OLD.nombre || '" → "' || NEW.nombre || '")';
            END IF;
            IF (OLD.activo != NEW.activo) THEN
                v_descripcion := v_descripcion || ' Estado (' || CASE WHEN NEW.activo THEN 'ACTIVADA' ELSE 'DESACTIVADA' END || ')';
            END IF;
        ELSIF (TG_TABLE_NAME = 'detalle_ordenes') THEN
            v_descripcion := 'Detalle orden editado | Orden ID: ' || NEW.orden_id || 
                           ' | Producto ID: ' || NEW.producto_id || 
                           ' | Cantidad: ' || OLD.cantidad || ' → ' || NEW.cantidad;
        ELSIF (TG_TABLE_NAME = 'carritos') THEN
            v_descripcion := 'Carrito editado | ID: ' || NEW.id || 
                           ' | Usuario ID: ' || NEW.usuario_id || 
                           ' | Estado: ' || OLD.estado || ' → ' || NEW.estado;
        ELSIF (TG_TABLE_NAME = 'items_carrito') THEN
            v_descripcion := 'Item carrito editado | Carrito ID: ' || NEW.carrito_id || 
                           ' | Producto ID: ' || NEW.producto_id || 
                           ' | Cantidad: ' || OLD.cantidad || ' → ' || NEW.cantidad;
        ELSIF (TG_TABLE_NAME = 'movimientos_inventario') THEN
            v_descripcion := 'Movimiento inventario editado | Producto ID: ' || NEW.producto_id || 
                           ' | Tipo: ' || NEW.tipo_movimiento || 
                           ' | Cantidad anterior: ' || OLD.cantidad || 
                           ' | Cantidad nueva: ' || NEW.cantidad;
        ELSE
            v_descripcion := 'Registro editado en ' || TG_TABLE_NAME || ' (ID: ' || NEW.id || ')';
        END IF;
        
        -- Intentar obtener usuario_id
        IF (TG_TABLE_NAME = 'usuarios') THEN
            v_usuario_id := NEW.id;
        ELSIF (to_jsonb(NEW) ? 'usuario_id') THEN
            v_usuario_id := (to_jsonb(NEW)->>'usuario_id')::BIGINT;
        ELSIF (to_jsonb(NEW) ? 'modificado_por') THEN
            v_usuario_id := (to_jsonb(NEW)->>'modificado_por')::BIGINT;
        END IF;
        
    ELSIF (TG_OP = 'DELETE') THEN
        v_accion := 'ELIMINAR';
        v_datos_anteriores := row_to_json(OLD)::jsonb;
        
        -- Descripción específica según tabla
        IF (TG_TABLE_NAME = 'productos') THEN
            v_descripcion := 'Producto eliminado: "' || COALESCE(OLD.nombre, 'Sin nombre') || 
                           '" | Precio: $' || COALESCE(OLD.precio_venta::TEXT, '0') || 
                           ' | Stock: ' || COALESCE(OLD.stock_actual::TEXT, '0') || 
                           ' | Categoría ID: ' || COALESCE(OLD.categoria_id::TEXT, 'N/A') || 
                           ' | ID: ' || OLD.id;
        ELSIF (TG_TABLE_NAME = 'usuarios') THEN
            v_descripcion := 'Usuario eliminado: ' || COALESCE(OLD.correo, 'Sin correo') || 
                           ' | Nombre: ' || COALESCE(OLD.nombre || ' ' || OLD.apellidos, 'Sin nombre') || 
                           ' | Rol: ' || COALESCE(OLD.rol, 'Sin rol') || 
                           ' | ID: ' || OLD.id;
        ELSIF (TG_TABLE_NAME = 'ordenes') THEN
            v_descripcion := 'Orden #' || OLD.id || ' eliminada | Usuario ID: ' || 
                           COALESCE(OLD.usuario_id::TEXT, 'N/A') || ' | Estado: ' || 
                           COALESCE(OLD.estado, 'Sin estado') || ' | Total: $' || 
                           COALESCE(OLD.total::TEXT, '0');
        ELSIF (TG_TABLE_NAME = 'categorias') THEN
            v_descripcion := 'Categoría eliminada: "' || COALESCE(OLD.nombre, 'Sin nombre') || 
                           '" | Descripción: ' || COALESCE(OLD.descripcion, 'Sin descripción') || 
                           ' | ID: ' || OLD.id;
        ELSIF (TG_TABLE_NAME = 'marcas') THEN
            v_descripcion := 'Marca eliminada: "' || COALESCE(OLD.nombre, 'Sin nombre') || 
                           '" | País: ' || COALESCE(OLD.pais, 'Sin país') || 
                           ' | ID: ' || OLD.id;
        ELSIF (TG_TABLE_NAME = 'detalle_ordenes') THEN
            v_descripcion := 'Detalle eliminado | Orden ID: ' || COALESCE(OLD.orden_id::TEXT, 'N/A') || 
                           ' | Producto ID: ' || COALESCE(OLD.producto_id::TEXT, 'N/A') || 
                           ' | Cantidad: ' || COALESCE(OLD.cantidad::TEXT, '0') || 
                           ' | Precio: $' || COALESCE(OLD.precio_unitario::TEXT, '0');
        ELSIF (TG_TABLE_NAME = 'carritos') THEN
            v_descripcion := 'Carrito eliminado | Usuario ID: ' || COALESCE(OLD.usuario_id::TEXT, 'N/A') || 
                           ' | Estado: ' || COALESCE(OLD.estado, 'Sin estado') || 
                           ' | ID: ' || OLD.id;
        ELSIF (TG_TABLE_NAME = 'items_carrito') THEN
            v_descripcion := 'Item eliminado del carrito | Carrito ID: ' || COALESCE(OLD.carrito_id::TEXT, 'N/A') || 
                           ' | Producto ID: ' || COALESCE(OLD.producto_id::TEXT, 'N/A') || 
                           ' | Cantidad: ' || COALESCE(OLD.cantidad::TEXT, '0') || 
                           ' | ID: ' || OLD.id;
        ELSIF (TG_TABLE_NAME = 'movimientos_inventario') THEN
            v_descripcion := 'Movimiento eliminado | Producto ID: ' || COALESCE(OLD.producto_id::TEXT, 'N/A') || 
                           ' | Tipo: ' || COALESCE(OLD.tipo_movimiento, 'Sin tipo') || 
                           ' | Cantidad: ' || COALESCE(OLD.cantidad::TEXT, '0') || 
                           ' | Motivo: ' || COALESCE(OLD.motivo, 'Sin motivo') || 
                           ' | ID: ' || OLD.id;
        ELSE
            v_descripcion := 'Registro eliminado de ' || TG_TABLE_NAME || ' (ID: ' || OLD.id || ')';
        END IF;
        
        -- Intentar obtener usuario_id
        -- ⚠️ FIX CRÍTICO: NO establecer usuario_id al eliminar usuarios
        --    porque violaría la FK fk_log_usuario (usuario ya no existe)
        IF (TG_TABLE_NAME = 'usuarios') THEN
            v_usuario_id := NULL; -- CRUCIAL: evita FK violation
        ELSIF (to_jsonb(OLD) ? 'usuario_id') THEN
            v_usuario_id := (to_jsonb(OLD)->>'usuario_id')::BIGINT;
        END IF;
    END IF;

    -- Determinar tipo de log según la tabla
    IF (TG_TABLE_NAME IN ('usuarios', 'roles_permisos')) THEN
        v_tipo := 'ADMIN';
    ELSIF (TG_TABLE_NAME IN ('productos', 'categorias', 'marcas', 'ordenes')) THEN
        v_tipo := 'ADMIN';
    ELSE
        v_tipo := 'SISTEMA';
    END IF;

    -- Insertar el log
    INSERT INTO logs_sistema (
        tipo,
        nivel,
        usuario_id,
        modulo,
        accion,
        descripcion,
        entidad_tipo,
        entidad_id,
        datos_anteriores,
        datos_nuevos
    ) VALUES (
        v_tipo,
        'INFO',
        v_usuario_id,
        TG_TABLE_NAME,
        v_accion,
        v_descripcion,
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN (to_jsonb(OLD)->>'id')::BIGINT
            ELSE (to_jsonb(NEW)->>'id')::BIGINT
        END,
        v_datos_anteriores,
        v_datos_nuevos
    );

    -- Retornar el registro apropiado
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

\echo '✅ Función registrar_log_automatico() actualizada correctamente'
\echo ''
\echo '📋 Probando eliminación de usuario...'
