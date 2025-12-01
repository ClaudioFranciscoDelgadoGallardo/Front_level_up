import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserOrders } from '../services/orderService';
import { actualizarUsuario } from '../services/userService';
import { registrarLogUsuario } from '../utils/logManager';
import { subirImagenPerfil, eliminarImagenPerfil } from '../config/supabase';
import '../styles/Perfil.css';

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [ordenes, setOrdenes] = useState([]);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previsualizacionFoto, setPrevisualizacionFoto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
    if (usuarioActual) {
      setUsuario(usuarioActual);
      setPrevisualizacionFoto(usuarioActual.fotoPerfil || null);
      setFormData({
        nombre: usuarioActual.nombre || '',
        apellidos: usuarioActual.apellidos || '',
        telefono: usuarioActual.telefono || '',
        direccion: usuarioActual.direccion || '',
        comuna: usuarioActual.comuna || '',
        ciudad: usuarioActual.ciudad || '',
        region: usuarioActual.region || '',
        codigoPostal: usuarioActual.codigoPostal || '',
        password: '',
        newPassword: '',
        confirmPassword: ''
      });
      cargarOrdenes();
    }
  }, []);

  const cargarOrdenes = async () => {
    try {
      const data = await getUserOrders();
      setOrdenes(data.slice(0, 5)); // Solo las últimas 5
    } catch (err) {
      // Si es 404, simplemente no hay órdenes todavía (no es un error crítico)
      if (err.message && err.message.includes('404')) {
        setOrdenes([]);
      } else {
        console.error('Error al cargar órdenes:', err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        if (window.notificar) {
          window.notificar('La imagen no debe superar 5MB', 'error', 3000);
        }
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPerfil(reader.result);
        setPrevisualizacionFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔄 Iniciando actualización de perfil...');
    console.log('📝 Datos del formulario:', formData);

    // Validar campos obligatorios
    if (!formData.nombre.trim()) {
      if (window.notificar) {
        window.notificar('El nombre es obligatorio', 'error', 3000);
      }
      return;
    }

    // Validar teléfono (9 dígitos para Chile)
    if (formData.telefono?.trim()) {
      const telefonoLimpio = formData.telefono.trim().replace(/\s+/g, '');
      if (!/^\d{9}$/.test(telefonoLimpio)) {
        if (window.notificar) {
          window.notificar('El teléfono debe tener exactamente 9 dígitos', 'error', 3000);
        }
        return;
      }
    }

    // Validar código postal (máximo 10 caracteres)
    if (formData.codigoPostal?.trim() && formData.codigoPostal.trim().length > 10) {
      if (window.notificar) {
        window.notificar('El código postal no puede tener más de 10 caracteres', 'error', 3000);
      }
      return;
    }

    // Validar longitud de campos
    if (formData.nombre?.trim().length > 50) {
      if (window.notificar) {
        window.notificar('El nombre no puede tener más de 50 caracteres', 'error', 3000);
      }
      return;
    }

    if (formData.apellidos?.trim().length > 100) {
      if (window.notificar) {
        window.notificar('Los apellidos no pueden tener más de 100 caracteres', 'error', 3000);
      }
      return;
    }

    if (formData.comuna?.trim().length > 100) {
      if (window.notificar) {
        window.notificar('La comuna no puede tener más de 100 caracteres', 'error', 3000);
      }
      return;
    }

    if (formData.ciudad?.trim().length > 100) {
      if (window.notificar) {
        window.notificar('La ciudad no puede tener más de 100 caracteres', 'error', 3000);
      }
      return;
    }

    if (formData.region?.trim().length > 100) {
      if (window.notificar) {
        window.notificar('La región no puede tener más de 100 caracteres', 'error', 3000);
      }
      return;
    }

    // Si quiere cambiar contraseña
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        if (window.notificar) {
          window.notificar('La nueva contraseña debe tener al menos 6 caracteres', 'error', 3000);
        }
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        if (window.notificar) {
          window.notificar('Las contraseñas no coinciden', 'error', 3000);
        }
        return;
      }
    }

    try {
      // Obtener token primero
      const token = localStorage.getItem('token');
      if (!token) {
        if (window.notificar) {
          window.notificar('Sesión expirada. Por favor inicia sesión nuevamente.', 'error', 3000);
        }
        navigate('/login');
        return;
      }

      // Si hay una nueva foto, subirla primero
      let fotoPerfilUrl = usuario.fotoPerfil; // Mantener la URL actual por defecto
      
      if (fotoPerfil && fotoPerfil !== usuario.fotoPerfil) {
        try {
          if (window.notificar) {
            window.notificar('Subiendo imagen de perfil...', 'info', 2000);
          }
          
          // Convertir base64 a File si es necesario
          let archivoFoto;
          if (fotoPerfil.startsWith('data:')) {
            const response = await fetch(fotoPerfil);
            const blob = await response.blob();
            archivoFoto = new File([blob], `perfil_${usuario.id}.jpg`, { type: 'image/jpeg' });
          } else {
            archivoFoto = fotoPerfil;
          }
          
          // Subir nueva imagen
          fotoPerfilUrl = await subirImagenPerfil(usuario.id, archivoFoto);
          console.log('✅ Imagen subida exitosamente:', fotoPerfilUrl);
          
          // Eliminar imagen anterior si existe
          if (usuario.fotoPerfil) {
            await eliminarImagenPerfil(usuario.fotoPerfil);
          }
        } catch (uploadError) {
          console.error('Error al subir imagen:', uploadError);
          if (window.notificar) {
            window.notificar('Error al subir la imagen. Se guardará el perfil sin cambiar la foto.', 'warning', 3000);
          }
          // Continuar sin actualizar la foto
          fotoPerfilUrl = usuario.fotoPerfil;
        }
      }

      // Preparar datos para enviar al backend (solo campos no vacíos)
      const datosActualizacion = {};
      
      if (formData.nombre?.trim()) datosActualizacion.nombre = formData.nombre.trim();
      if (formData.apellidos?.trim()) datosActualizacion.apellidos = formData.apellidos.trim();
      if (formData.telefono?.trim()) datosActualizacion.telefono = formData.telefono.trim().replace(/\s+/g, '');
      if (formData.direccion?.trim()) datosActualizacion.direccion = formData.direccion.trim();
      if (formData.comuna?.trim()) datosActualizacion.comuna = formData.comuna.trim();
      if (formData.ciudad?.trim()) datosActualizacion.ciudad = formData.ciudad.trim();
      if (formData.region?.trim()) datosActualizacion.region = formData.region.trim();
      if (formData.codigoPostal?.trim()) datosActualizacion.codigoPostal = formData.codigoPostal.trim();
      
      // Incluir foto de perfil si cambió
      if (fotoPerfilUrl) {
        datosActualizacion.fotoPerfil = fotoPerfilUrl;
      }

      // Solo incluir password si se quiere cambiar
      if (formData.newPassword?.trim()) {
        datosActualizacion.password = formData.newPassword;
      }

      console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
      console.log('👤 ID de usuario:', usuario.id);
      console.log('📤 Datos a enviar:', datosActualizacion);

      // Llamar al backend
      console.log('🌐 Llamando al backend...');
      const usuarioActualizado = await actualizarUsuario(usuario.id, datosActualizacion, token);
      console.log('✅ Respuesta del backend:', usuarioActualizado);
      
      // Actualizar localStorage con los nuevos datos
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);
      
      registrarLogUsuario(`Actualizó su perfil: ${usuarioActualizado.nombre} ${usuarioActualizado.apellidos}`);

      if (window.notificar) {
        window.notificar('Perfil actualizado exitosamente', 'success', 3000);
      }

      setEditando(false);
      setFormData(prev => ({
        ...prev,
        password: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      if (window.notificar) {
        window.notificar(error.message || 'Error al actualizar perfil. Intenta nuevamente.', 'error', 4000);
      }
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuarioActual');
    window.dispatchEvent(new Event('usuarioActualizado'));
    if (window.notificar) {
      window.notificar('Sesión cerrada exitosamente', 'success', 3000);
    }
    navigate('/login');
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const obtenerEstadoBadge = (status) => {
    const badges = {
      PENDING: { class: 'badge-warning', text: 'Pendiente' },
      CONFIRMED: { class: 'badge-info', text: 'Confirmada' },
      SHIPPED: { class: 'badge-primary', text: 'Enviada' },
      DELIVERED: { class: 'badge-success', text: 'Entregada' },
      CANCELLED: { class: 'badge-danger', text: 'Cancelada' }
    };
    return badges[status] || { class: 'badge-secondary', text: status };
  };

  if (!usuario) {
    return (
      <main className="container perfil-page">
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="container perfil-page">
      <div className="perfil-header mb-4">
        <div>
          <h2 className="section-title mb-2">Mi Perfil</h2>
          <h4 className="text-white">Bienvenido, {usuario.nombre} {usuario.apellidos}</h4>
        </div>
        <button className="btn btn-danger" onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
      </div>

      <div className="row">
        {/* Columna de Foto de Perfil */}
        <div className="col-md-4 mb-4">
          <div className="usuario-perfil-card text-center">
            <div className="usuario-card-header">
              <h4>Foto de Perfil</h4>
            </div>
            <div className="perfil-foto-container">
              <div className="perfil-foto-circular">
                <img 
                  src={previsualizacionFoto || '/assets/icons/icono.png'} 
                  alt="Foto de perfil"
                  className="perfil-foto-img"
                />
              </div>
              {editando && (
                <div className="mt-3">
                  <label htmlFor="foto-upload-usuario" className="btn btn-success btn-sm">
                    Cambiar Foto
                  </label>
                  <input
                    id="foto-upload-usuario"
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    style={{ display: 'none' }}
                  />
                  <p className="text-muted small mt-2">Máx. 5MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información del perfil */}
        <div className="col-md-8">
          <div className="usuario-perfil-card">
            <div className="usuario-card-header">
              <h4>Información Personal</h4>
              {!editando && (
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    setFormData({
                      nombre: usuario.nombre || '',
                      apellidos: usuario.apellidos || '',
                      telefono: usuario.telefono || '',
                      direccion: usuario.direccion || '',
                      comuna: usuario.comuna || '',
                      ciudad: usuario.ciudad || '',
                      region: usuario.region || '',
                      codigoPostal: usuario.codigoPostal || '',
                      password: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setEditando(true);
                  }}
                >
                  Editar
                </button>
              )}
            </div>

            {editando ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="usuario-label">Nombre *</label>
                  <input
                    type="text"
                    className="usuario-input"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="usuario-label">Apellidos</label>
                  <input
                    type="text"
                    className="usuario-input"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="usuario-label">Teléfono</label>
                  <input
                    type="tel"
                    className="usuario-input"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="usuario-label">Dirección</label>
                  <input
                    type="text"
                    className="usuario-input"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="usuario-label">Comuna</label>
                  <input
                    type="text"
                    className="usuario-input"
                    name="comuna"
                    value={formData.comuna}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="usuario-label">Ciudad</label>
                  <input
                    type="text"
                    className="usuario-input"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="usuario-label">Región</label>
                  <input
                    type="text"
                    className="usuario-input"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="usuario-label">Código Postal</label>
                  <input
                    type="text"
                    className="usuario-input"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                  />
                </div>

                <hr className="usuario-divider my-4" />
                <h5 className="mb-3 usuario-subtitle">Cambiar Contraseña</h5>

                <div className="mb-3">
                  <label className="usuario-label">Contraseña Actual</label>
                  <input
                    type="password"
                    className="usuario-input"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="usuario-label">Nueva Contraseña</label>
                  <input
                    type="password"
                    className="usuario-input"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="usuario-label">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    className="usuario-input"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success">
                    Guardar Cambios
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setEditando(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="perfil-info">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="text-primary mb-3">Información Personal</h5>
                    <div className="info-item">
                      <strong>RUN:</strong>
                      <span>{usuario.run || 'No registrado'}</span>
                    </div>
                    <div className="info-item">
                      <strong>Nombre Completo:</strong>
                      <span>{usuario.nombre} {usuario.apellidos}</span>
                    </div>
                    <div className="info-item">
                      <strong>Email:</strong>
                      <span>{usuario.correo || usuario.email}</span>
                    </div>
                    <div className="info-item">
                      <strong>Teléfono:</strong>
                      <span>{usuario.telefono || 'No registrado'}</span>
                    </div>
                    <div className="info-item">
                      <strong>Fecha de Nacimiento:</strong>
                      <span>{usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toLocaleDateString('es-CL') : 'No registrada'}</span>
                    </div>
                    <div className="info-item">
                      <strong>Rol:</strong>
                      <span className={`badge ${
                        usuario.rol === 'ADMIN' ? 'bg-danger' :
                        usuario.rol === 'VENDEDOR' ? 'bg-warning text-dark' :
                        usuario.rol === 'BODEGUERO' ? 'bg-secondary' :
                        'bg-info'
                      }`}>
                        {usuario.rol || 'CLIENTE'}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5 className="text-primary mb-3">Dirección</h5>
                    <div className="info-item">
                      <strong>Dirección:</strong>
                      <span>{usuario.direccion || 'No registrada'}</span>
                    </div>
                    <div className="info-item">
                      <strong>Comuna:</strong>
                      <span>{usuario.comuna || 'No registrada'}</span>
                    </div>
                    <div className="info-item">
                      <strong>Ciudad:</strong>
                      <span>{usuario.ciudad || 'No registrada'}</span>
                    </div>
                    <div className="info-item">
                      <strong>Región:</strong>
                      <span>{usuario.region || 'No registrada'}</span>
                    </div>
                    <div className="info-item">
                      <strong>Código Postal:</strong>
                      <span>{usuario.codigoPostal || 'No registrado'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Últimas órdenes */}
        <div className="col-md-12 mt-4">
          <div className="usuario-perfil-card">
            <div className="usuario-card-header">
              <h4>Mis Últimas Órdenes</h4>
              <Link to="/mis-ordenes" className="btn btn-sm btn-primary">
                Ver Todas
              </Link>
            </div>

            {ordenes.length === 0 ? (
              <p className="text-muted text-center py-4">No tienes órdenes todavía</p>
            ) : (
              <div className="ordenes-recientes">
                {ordenes.map(orden => {
                  const badge = obtenerEstadoBadge(orden.status);
                  return (
                    <div key={orden.id} className="orden-item-small">
                      <div className="orden-item-header">
                        <span className="orden-id-small">#{orden.id}</span>
                        <span className={`badge ${badge.class}`}>{badge.text}</span>
                      </div>
                      <div className="orden-item-body">
                        <small className="text-muted">
                          {formatearFecha(orden.createdAt)}
                        </small>
                        <strong className="orden-total-small">
                          ${orden.totalAmount.toLocaleString('es-CL')}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
