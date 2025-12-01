import React, { useState, useEffect, useRef } from 'react';
import '../styles/Notificacion.css';

export default function NotificacionContainer() {
  const [notificaciones, setNotificaciones] = useState([]);
  const timeoutsRef = useRef({});
  const counterRef = useRef(0);

  useEffect(() => {
    window.notificar = (mensaje, tipo = 'info', duracion = 3000) => {
      // Usar setTimeout para evitar setState durante render
      setTimeout(() => {
        setNotificaciones(prev => {
          // Buscar si ya existe una notificación con el mismo mensaje y tipo
          const existente = prev.find(n => n.mensaje === mensaje && n.tipo === tipo);
          
          if (existente) {
            // Cancelar el timeout anterior
            if (timeoutsRef.current[existente.id]) {
              clearTimeout(timeoutsRef.current[existente.id]);
              delete timeoutsRef.current[existente.id];
            }
            // Remover la notificación existente
            const filtrado = prev.filter(n => n.id !== existente.id);
            
            // Crear nueva notificación con ID único
            const id = `${Date.now()}-${++counterRef.current}`;
            if (duracion > 0) {
              const timeoutId = setTimeout(() => {
                setNotificaciones(current => current.filter(n => n.id !== id));
                delete timeoutsRef.current[id];
              }, duracion);
              timeoutsRef.current[id] = timeoutId;
            }
            
            return [...filtrado, { id, mensaje, tipo }];
          } else {
            // No existe, crear nueva
            const id = `${Date.now()}-${++counterRef.current}`;
            if (duracion > 0) {
              const timeoutId = setTimeout(() => {
                setNotificaciones(current => current.filter(n => n.id !== id));
                delete timeoutsRef.current[id];
              }, duracion);
              timeoutsRef.current[id] = timeoutId;
            }
            
            return [...prev, { id, mensaje, tipo }];
          }
        });
      }, 0);
    };

    return () => {
      // Limpiar todos los timeouts al desmontar
      Object.values(timeoutsRef.current).forEach(timeoutId => clearTimeout(timeoutId));
      window.notificar = null;
    };
  }, []);

  const cerrarNotificacion = (id) => {
    // Cancelar el timeout si existe
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
    // Remover la notificación inmediatamente
    setNotificaciones(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notificacion-container">
      {notificaciones.map(noti => (
        <div
          key={noti.id}
          className={`notificacion-item ${noti.tipo}`}
        >
          <span className="notificacion-mensaje">{noti.mensaje}</span>
          <button
            onClick={() => cerrarNotificacion(noti.id)}
            className="notificacion-btn-cerrar"
          >
            OK
          </button>
        </div>
      ))}
    </div>
  );
}
