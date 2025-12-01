import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerUsuarios, eliminarUsuario } from '../services/userService';
import { registrarLogAdmin } from '../utils/logManager';
import ModalConfirmacion from '../components/ModalConfirmacion';
import '../styles/Admin.css';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  
  // Obtener usuario actual desde localStorage
  const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      console.log('🔄 Cargando usuarios desde backend...');
      const token = localStorage.getItem('token');
      const usuariosBackend = await obtenerUsuarios(token);
      console.log('✅ Usuarios cargados:', usuariosBackend.length);
      setUsuarios(usuariosBackend);
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error);
      if (window.notificar) {
        window.notificar('Error al cargar usuarios del servidor', 'error', 3000);
      }
      // Fallback a localStorage si falla backend
      const usuariosLS = JSON.parse(localStorage.getItem('usuarios') || '[]');
      setUsuarios(usuariosLS);
    } finally {
      setCargando(false);
    }
  };

  const confirmarEliminar = (usuarioId) => {
    setUsuarioAEliminar(usuarioId);
    setMostrarModal(true);
  };

  const eliminarUsuarioConfirmado = async () => {
    if (usuarioAEliminar) {
      try {
        const usuarioEncontrado = usuarios.find(u => u.id === usuarioAEliminar);
        const token = localStorage.getItem('token');
        
        console.log('🗑️ Eliminando usuario ID:', usuarioAEliminar);
        await eliminarUsuario(usuarioAEliminar, token);
        
        // Actualizar lista local
        const usuariosActualizados = usuarios.filter(u => u.id !== usuarioAEliminar);
        setUsuarios(usuariosActualizados);
        
        registrarLogAdmin(`Eliminó usuario: ${usuarioEncontrado?.nombre || 'Desconocido'} (ID: ${usuarioAEliminar})`);
        
        if (window.notificar) {
          window.notificar('Usuario eliminado exitosamente', 'success', 3000);
        }
      } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        if (window.notificar) {
          window.notificar('Error al eliminar usuario', 'error', 3000);
        }
      } finally {
        setMostrarModal(false);
        setUsuarioAEliminar(null);
      }
    }
  };

  const cancelarEliminar = () => {
    setMostrarModal(false);
    setUsuarioAEliminar(null);
  };

  const editarUsuario = (usuarioId) => {
    navigate(`/admin/usuarios/editar/${usuarioId}`);
  };

  const usuariosFiltrados = usuarios.filter(u => 
    (u.nombre && u.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
    (u.correo && u.correo.toLowerCase().includes(busqueda.toLowerCase())) ||
    (u.apellidos && u.apellidos.toLowerCase().includes(busqueda.toLowerCase())) ||
    (u.run && u.run.includes(busqueda))
  );

  return (
    <main className="container admin-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="section-title mb-2">Gestión de Usuarios</h2>
          <Link to="/admin" className="text-secondary">
            ← Volver al Panel
          </Link>
        </div>
        <Link to="/admin/usuarios/nuevo" className="btn btn-success">
          + Nuevo Usuario
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control admin-search-input"
          placeholder="Buscar por nombre, apellido o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-secondary mt-3">Cargando usuarios...</p>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-secondary mb-4">No hay usuarios registrados</p>
          <Link to="/admin/usuarios/nuevo" className="btn btn-success">
            Agregar Primer Usuario
          </Link>
        </div>
      ) : (
        <div className="admin-table">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Fecha Nacimiento</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id || usuario.correo}>
                  <td>{usuario.run || 'N/A'}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellidos || 'N/A'}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toLocaleDateString('es-CL') : 'N/A'}</td>
                  <td>
                    <span 
                      className={`badge ${
                        usuario.rol === 'ADMIN' ? 'admin-badge-admin' : 
                        usuario.rol === 'VENDEDOR' ? 'bg-info' : 
                        'admin-badge-usuario'
                      }`}
                    >
                      {usuario.rol || 'CLIENTE'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-success btn-action"
                      onClick={() => editarUsuario(usuario.id)}
                      title="Editar usuario"
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger btn-action"
                      onClick={() => confirmarEliminar(usuario.id)}
                      disabled={usuario.id === usuarioActual?.id}
                      title={usuario.id === usuarioActual?.id ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario'}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {usuariosFiltrados.length === 0 && usuarios.length > 0 && (
        <div className="text-center py-4">
          <p className="text-secondary">No se encontraron usuarios con "{busqueda}"</p>
        </div>
      )}

      <ModalConfirmacion
        mostrar={mostrarModal}
        titulo="Eliminar Usuario"
        mensaje={`¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.`}
        onConfirmar={eliminarUsuarioConfirmado}
        onCancelar={cancelarEliminar}
      />
    </main>
  );
}
