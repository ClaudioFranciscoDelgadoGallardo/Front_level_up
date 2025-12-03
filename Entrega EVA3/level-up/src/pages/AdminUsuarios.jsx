import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerUsuarios, eliminarUsuario, eliminarUsuarioPermanente } from '../services/userService';
import { registrarLogAdmin } from '../utils/logManager';
import ModalConfirmacion from '../components/ModalConfirmacion';
import '../styles/Admin.css';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [usuarioAEliminarPermanente, setUsuarioAEliminarPermanente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  
  // Obtener usuario actual desde localStorage
  const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      console.log('🔄 Cargando usuarios desde backend...');
      const token = localStorage.getItem('token');
      
      // Intentar obtener todos los usuarios
      const usuariosBackend = await obtenerUsuarios(token);
      console.log('✅ Usuarios cargados:', usuariosBackend.length);
      setUsuarios(usuariosBackend);
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error);
      if (window.notificar) {
        window.notificar('Error al cargar usuarios desde el backend.', 'error', 3000);
      }
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  };

  const confirmarDesactivar = (usuarioId) => {
    setUsuarioAEliminar(usuarioId);
    setMostrarModal(true);
  };

  const desactivarUsuarioConfirmado = async () => {
    if (usuarioAEliminar) {
      try {
        const usuarioEncontrado = usuarios.find(u => u.id === usuarioAEliminar);
        const token = localStorage.getItem('token');
        
        console.log('⚠️ Desactivando usuario ID:', usuarioAEliminar);
        await eliminarUsuario(usuarioAEliminar, token);
        
        // Recargar usuarios desde el backend
        await cargarUsuarios();
        
        registrarLogAdmin(`Desactivó usuario: ${usuarioEncontrado?.nombre || 'Desconocido'} (ID: ${usuarioAEliminar})`);
        
        if (window.notificar) {
          window.notificar('Usuario desactivado exitosamente', 'success', 3000);
        }
      } catch (error) {
        console.error('❌ Error al desactivar usuario:', error);
        if (window.notificar) {
          window.notificar('Error al desactivar usuario', 'error', 3000);
        }
      } finally {
        setMostrarModal(false);
        setUsuarioAEliminar(null);
      }
    }
  };

  const activarUsuario = async (usuario) => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('✅ Activando usuario ID:', usuario.id);
      
      // Llamar al endpoint PUT /usuarios/{id}/activar
      const response = await fetch(`http://localhost:8080/api/usuarios/${usuario.id}/activar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error al activar usuario');
      }

      // Recargar usuarios desde el backend
      await cargarUsuarios();
      
      registrarLogAdmin(`Activó usuario: ${usuario.nombre} (ID: ${usuario.id})`);
      
      if (window.notificar) {
        window.notificar('Usuario activado exitosamente', 'success', 3000);
      }
    } catch (error) {
      console.error('❌ Error al activar usuario:', error);
      if (window.notificar) {
        window.notificar('Error al activar usuario', 'error', 3000);
      }
    }
  };

  const confirmarEliminarPermanente = (usuarioId) => {
    setUsuarioAEliminarPermanente(usuarioId);
    setMostrarModalEliminar(true);
  };

  const eliminarUsuarioPermanenteConfirmado = async () => {
    if (usuarioAEliminarPermanente) {
      try {
        const usuarioEncontrado = usuarios.find(u => u.id === usuarioAEliminarPermanente);
        const token = localStorage.getItem('token');
        
        console.log('🗑️ Eliminando permanentemente usuario ID:', usuarioAEliminarPermanente);
        await eliminarUsuarioPermanente(usuarioAEliminarPermanente, token);
        
        // Recargar usuarios desde el backend
        await cargarUsuarios();
        
        registrarLogAdmin(`Eliminó permanentemente usuario: ${usuarioEncontrado?.nombre || 'Desconocido'} (ID: ${usuarioAEliminarPermanente})`);
        
        if (window.notificar) {
          window.notificar('Usuario eliminado permanentemente', 'success', 3000);
        }
      } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        const errorMessage = error.message || 'Error al eliminar usuario';
        if (window.notificar) {
          window.notificar(errorMessage, 'error', 5000);
        }
      } finally {
        setMostrarModalEliminar(false);
        setUsuarioAEliminarPermanente(null);
      }
    }
  };

  const cancelarEliminar = () => {
    setMostrarModal(false);
    setUsuarioAEliminar(null);
  };

  const cancelarEliminarPermanente = () => {
    setMostrarModalEliminar(false);
    setUsuarioAEliminarPermanente(null);
  };

  const editarUsuario = (usuarioId) => {
    navigate(`/admin/usuarios/editar/${usuarioId}`);
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <th>Estado</th>
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
                        usuario.rol === 'ADMIN' ? 'bg-danger' : 
                        usuario.rol === 'VENDEDOR' ? 'bg-warning text-dark' : 
                        'bg-primary'
                      }`}
                    >
                      {usuario.rol || 'CLIENTE'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${usuario.activo ? 'bg-success' : 'bg-danger'}`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary btn-action"
                      onClick={() => editarUsuario(usuario.id)}
                      title="Editar usuario"
                    >
                      Editar
                    </button>
                    {usuario.activo ? (
                      <button 
                        className="btn btn-sm btn-warning btn-action"
                        onClick={() => confirmarDesactivar(usuario.id)}
                        disabled={usuario.id === usuarioActual?.id}
                        title={usuario.id === usuarioActual?.id ? 'No puedes desactivarte a ti mismo' : 'Desactivar usuario'}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button 
                        className="btn btn-sm btn-success btn-action"
                        onClick={() => activarUsuario(usuario)}
                        title="Activar usuario"
                      >
                        Activar
                      </button>
                    )}
                    <button 
                      className="btn btn-sm btn-danger btn-action"
                      onClick={() => confirmarEliminarPermanente(usuario.id)}
                      disabled={usuario.id === usuarioActual?.id}
                      title={usuario.id === usuarioActual?.id ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario permanentemente'}
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
        titulo="Desactivar Usuario"
        mensaje="¿Estás seguro de que deseas desactivar este usuario? El usuario no podrá iniciar sesión pero su historial de órdenes se mantendrá."
        onConfirmar={desactivarUsuarioConfirmado}
        onCancelar={cancelarEliminar}
      />

      <ModalConfirmacion
        mostrar={mostrarModalEliminar}
        titulo="Eliminar Usuario Permanentemente"
        mensaje="⚠️ ADVERTENCIA: Esta acción es IRREVERSIBLE. El usuario será eliminado permanentemente de la base de datos. Solo se puede eliminar si el usuario NO tiene órdenes asociadas. ¿Estás seguro?"
        onConfirmar={eliminarUsuarioPermanenteConfirmado}
        onCancelar={cancelarEliminarPermanente}
      />
    </main>
  );
}
