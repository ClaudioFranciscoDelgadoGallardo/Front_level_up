import React, { useState, useEffect } from 'react';

export default function NotificacionContainer() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    window.notificar = (mensaje, tipo = 'info', duracion = 3000) => {
      const id = Date.now();
      setNotificaciones(prev => [...prev, { id, mensaje, tipo }]);
      
      if (duracion > 0) {
        setTimeout(() => {
          setNotificaciones(prev => prev.filter(n => n.id !== id));
        }, duracion);
      }
    };

    return () => {
      window.notificar = null;
    };
  }, []);

  const cerrarNotificacion = (id) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id));
  };

  const getBackgroundColor = (tipo) => {
    switch (tipo) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'info': return '#2196f3';
      default: return '#2196f3';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {notificaciones.map(noti => (
        <div
          key={noti.id}
          style={{
            padding: '16px 24px',
            borderRadius: '8px',
            background: getBackgroundColor(noti.tipo),
            color: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: '1rem',
            opacity: 0.95,
            transition: 'opacity 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            minWidth: '250px'
          }}
        >
          <span style={{ flexGrow: 1 }}>{noti.mensaje}</span>
          <button
            onClick={() => cerrarNotificacion(noti.id)}
            style={{
              background: '#fff',
              color: getBackgroundColor(noti.tipo),
              border: 'none',
              borderRadius: '4px',
              padding: '4px 16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            OK
          </button>
        </div>
      ))}
    </div>
  );
}
