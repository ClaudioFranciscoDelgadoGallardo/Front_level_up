import React from 'react';
import { useCarrito } from '../context/CarritoContext';

export default function CarritoDebug() {
  const { carrito, obtenerCantidadTotal, calcularTotal } = useCarrito();

  const handleLimpiarTodo = () => {
    if (window.confirm('¿Limpiar todo el localStorage?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleVerLocalStorage = () => {
    console.log('=== ESTADO DEL LOCALSTORAGE ===');
    console.log('Carrito:', localStorage.getItem('carrito'));
    console.log('Productos:', localStorage.getItem('productos'));
    console.log('Usuarios:', localStorage.getItem('usuarios'));
    console.log('Usuario Actual:', localStorage.getItem('usuarioActual'));
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#222',
      border: '2px solid #39FF14',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '300px',
      zIndex: 9999,
      fontSize: '0.85rem'
    }}>
      <h6 style={{ color: '#39FF14', marginBottom: '10px' }}>🐛 Debug Carrito</h6>
      <div style={{ color: '#fff', marginBottom: '10px' }}>
        <p style={{ margin: '5px 0' }}>Items: {obtenerCantidadTotal()}</p>
        <p style={{ margin: '5px 0' }}>Total: ${calcularTotal().toLocaleString('es-CL')}</p>
        <p style={{ margin: '5px 0' }}>Productos en carrito: {carrito.length}</p>
      </div>
      <details style={{ marginBottom: '10px', color: '#ddd' }}>
        <summary style={{ cursor: 'pointer', color: '#1E90FF' }}>Ver carrito</summary>
        <pre style={{ 
          fontSize: '0.7rem', 
          background: '#111', 
          padding: '5px', 
          borderRadius: '4px',
          maxHeight: '150px',
          overflow: 'auto',
          marginTop: '5px'
        }}>
          {JSON.stringify(carrito, null, 2)}
        </pre>
      </details>
      <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
        <button 
          onClick={handleVerLocalStorage}
          style={{
            background: '#1E90FF',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#000',
            fontWeight: 'bold'
          }}
        >
          Ver Console
        </button>
        <button 
          onClick={handleLimpiarTodo}
          style={{
            background: '#dc3545',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          Limpiar Todo
        </button>
      </div>
    </div>
  );
}
