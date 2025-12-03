import React from 'react';
<<<<<<< HEAD
=======
import '../styles/ModalConfirmacion.css';
>>>>>>> main

export default function ModalConfirmacion({ mostrar, onConfirmar, onCancelar, mensaje, titulo = "Confirmación" }) {
  if (!mostrar) return null;

  return (
    <div 
      className="modal-overlay" 
<<<<<<< HEAD
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
=======
>>>>>>> main
      onClick={onCancelar}
    >
      <div 
        className="modal-content"
<<<<<<< HEAD
        style={{
          background: '#111',
          border: '2px solid var(--accent-green)',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 0 30px rgba(57, 255, 20, 0.4)',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: '1.5rem' }}>
=======
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icono-container">
>>>>>>> main
          <img 
            src="/assets/icons/icono.png" 
            alt="Level Up" 
            width="80" 
            height="80"
<<<<<<< HEAD
            style={{ filter: 'drop-shadow(0 0 10px rgba(57, 255, 20, 0.6))' }}
          />
        </div>
        
        <h3 style={{ color: 'var(--accent-green)', marginBottom: '1rem', fontFamily: 'Orbitron' }}>
          {titulo}
        </h3>
        
        <p style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
          {mensaje}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn btn-danger px-4"
            onClick={onConfirmar}
            style={{ fontWeight: 'bold' }}
=======
            className="modal-icono"
          />
        </div>
        
        <h3 className="modal-titulo">
          {titulo}
        </h3>
        
        <p className="modal-mensaje">
          {mensaje}
        </p>
        
        <div className="modal-botones">
          <button 
            className="btn btn-danger px-4 modal-btn-confirmar"
            onClick={onConfirmar}
>>>>>>> main
          >
            Confirmar
          </button>
          <button 
            className="btn btn-secondary px-4"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
