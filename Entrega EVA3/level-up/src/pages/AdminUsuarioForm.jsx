import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { obtenerUsuarioPorId, actualizarUsuario, crearUsuario } from '../services/userService';
import { registrarLogAdmin } from '../utils/logManager';
import '../styles/Admin.css';

export default function AdminUsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    telefono: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    fechaNacimiento: '',
    rol: 'CLIENTE'
  });

  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (esEdicion) {
      cargarUsuario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, esEdicion]);

  const cargarUsuario = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      const usuario = await obtenerUsuarioPorId(id, token);
      
      setFormData({
        run: usuario.run || '',
        nombre: usuario.nombre || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        password: '', // No cargar la contraseña
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        comuna: usuario.comuna || '',
        ciudad: usuario.ciudad || '',
        region: usuario.region || '',
        codigoPostal: usuario.codigoPostal || '',
        fechaNacimiento: usuario.fechaNacimiento || '',
        rol: usuario.rol || 'CLIENTE'
      });
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      if (window.notificar) {
        window.notificar('Error al cargar usuario', 'error', 3000);
      }
      navigate('/admin/usuarios');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarFormulario = () => {
    // Validar RUN
    const rutRegex = /^\d{7,8}-[0-9Kk]$/;
    if (!formData.run) {
      if (window.notificar) {
        window.notificar('El RUN es obligatorio', 'error', 3000);
      }
      return false;
    }
    if (!rutRegex.test(formData.run)) {
      if (window.notificar) {
        window.notificar('El RUN debe tener formato válido: 12345678-9 o 1234567-K', 'error', 3000);
      }
      return false;
    }

    // Validar nombre y apellidos
    if (!formData.nombre || formData.nombre.length > 50) {
      if (window.notificar) {
        window.notificar('El nombre es obligatorio y debe tener máximo 50 caracteres', 'error', 3000);
      }
      return false;
    }

    if (!formData.apellidos || formData.apellidos.length > 100) {
      if (window.notificar) {
        window.notificar('Los apellidos son obligatorios y deben tener máximo 100 caracteres', 'error', 3000);
      }
      return false;
    }

    // Validar correo
    if (!formData.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      if (window.notificar) {
        window.notificar('Debes ingresar un correo válido', 'error', 3000);
      }
      return false;
    }

    // Validar teléfono (obligatorio en creación)
    if (!esEdicion && !formData.telefono) {
      if (window.notificar) {
        window.notificar('El teléfono es obligatorio', 'error', 3000);
      }
      return false;
    }
    
    if (formData.telefono) {
      const telefonoLimpio = formData.telefono.trim().replace(/\s+/g, '');
      if (!/^\d{9}$/.test(telefonoLimpio)) {
        if (window.notificar) {
          window.notificar('El teléfono debe tener exactamente 9 dígitos', 'error', 3000);
        }
        return false;
      }
    }

    // Validar comuna, ciudad, región (obligatorios en creación)
    if (!esEdicion) {
      if (!formData.comuna || formData.comuna.length < 3 || formData.comuna.length > 100) {
        if (window.notificar) {
          window.notificar('La comuna es obligatoria y debe tener entre 3 y 100 caracteres', 'error', 3000);
        }
        return false;
      }

      if (!formData.ciudad || formData.ciudad.length < 3 || formData.ciudad.length > 100) {
        if (window.notificar) {
          window.notificar('La ciudad es obligatoria y debe tener entre 3 y 100 caracteres', 'error', 3000);
        }
        return false;
      }

      if (!formData.region || formData.region.length < 3 || formData.region.length > 100) {
        if (window.notificar) {
          window.notificar('La región es obligatoria y debe tener entre 3 y 100 caracteres', 'error', 3000);
        }
        return false;
      }
    } else {
      // En edición, validar solo si están presentes
      if (formData.comuna && (formData.comuna.length < 3 || formData.comuna.length > 100)) {
        if (window.notificar) {
          window.notificar('La comuna debe tener entre 3 y 100 caracteres', 'error', 3000);
        }
        return false;
      }

      if (formData.ciudad && (formData.ciudad.length < 3 || formData.ciudad.length > 100)) {
        if (window.notificar) {
          window.notificar('La ciudad debe tener entre 3 y 100 caracteres', 'error', 3000);
        }
        return false;
      }

      if (formData.region && (formData.region.length < 3 || formData.region.length > 100)) {
        if (window.notificar) {
          window.notificar('La región debe tener entre 3 y 100 caracteres', 'error', 3000);
        }
        return false;
      }
    }

    // Validar código postal
    if (formData.codigoPostal && formData.codigoPostal.length > 10) {
      if (window.notificar) {
        window.notificar('El código postal no puede tener más de 10 caracteres', 'error', 3000);
      }
      return false;
    }

    // Validar contraseña
    if (!esEdicion && !formData.password) {
      if (window.notificar) {
        window.notificar('La contraseña es obligatoria para nuevos usuarios', 'error', 3000);
      }
      return false;
    }
    
    if (formData.password && (formData.password.length < 4 || formData.password.length > 20)) {
      if (window.notificar) {
        window.notificar('La contraseña debe tener entre 4 y 20 caracteres', 'error', 3000);
      }
      return false;
    }

    // Validar fecha de nacimiento (obligatoria en creación)
    if (!esEdicion && !formData.fechaNacimiento) {
      if (window.notificar) {
        window.notificar('La fecha de nacimiento es obligatoria', 'error', 3000);
      }
      return false;
    }

    // Validar mayor de edad si hay fecha de nacimiento
    if (formData.fechaNacimiento) {
      const fechaNacimiento = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }

      if (edad < 18) {
        if (window.notificar) {
          window.notificar('El usuario debe ser mayor de 18 años', 'error', 3000);
        }
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      
      if (esEdicion) {
        // Modo edición: actualizar usuario existente
        const datosActualizacion = {
          run: formData.run || undefined,
          nombre: formData.nombre || undefined,
          apellidos: formData.apellidos || undefined,
          correo: formData.correo || undefined,
          telefono: formData.telefono ? formData.telefono.trim().replace(/\s+/g, '') : undefined,
          direccion: formData.direccion || undefined,
          comuna: formData.comuna || undefined,
          ciudad: formData.ciudad || undefined,
          region: formData.region || undefined,
          codigoPostal: formData.codigoPostal || undefined,
          fechaNacimiento: formData.fechaNacimiento || undefined,
          rol: formData.rol || undefined
        };

        // Solo incluir password si se proporcionó
        if (formData.password && formData.password.trim() !== '') {
          datosActualizacion.password = formData.password;
        }

        await actualizarUsuario(id, datosActualizacion, token);
        
        registrarLogAdmin(`Editó usuario: ${formData.nombre} ${formData.apellidos} (ID: ${id})`);
        
        if (window.notificar) {
          window.notificar('Usuario actualizado exitosamente', 'success', 3000);
        }
      } else {
        // Modo creación: crear nuevo usuario
        const datosCreacion = {
          run: formData.run,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          correo: formData.correo,
          password: formData.password,
          telefono: formData.telefono ? formData.telefono.trim().replace(/\s+/g, '') : undefined,
          direccion: formData.direccion || 'Sin especificar',
          comuna: formData.comuna,
          ciudad: formData.ciudad,
          region: formData.region,
          codigoPostal: formData.codigoPostal || null,
          fechaNacimiento: formData.fechaNacimiento,
          rol: formData.rol || 'CLIENTE'
        };

        await crearUsuario(datosCreacion, token);
        
        registrarLogAdmin(`Creó usuario: ${formData.nombre} ${formData.apellidos} (${formData.correo})`);
        
        if (window.notificar) {
          window.notificar('Usuario creado exitosamente', 'success', 3000);
        }
      }
      
      navigate('/admin/usuarios');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      if (window.notificar) {
        window.notificar(error.message || `Error al ${esEdicion ? 'actualizar' : 'crear'} usuario`, 'error', 4000);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container admin-page">
      <div className="mb-4">
        <h2 className="section-title mb-2">
          {esEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h2>
        <Link to="/admin/usuarios" className="text-secondary">
          ← Volver a Usuarios
        </Link>
      </div>

      {cargando && esEdicion ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-secondary mt-3">Cargando datos del usuario...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="run" className="form-label text-white">RUN *</label>
              <input
                type="text"
                className="form-control"
                id="run"
                name="run"
                value={formData.run}
                onChange={handleChange}
                placeholder="12345678-9"
                pattern="\d{7,8}-[0-9Kk]"
                title="Formato: 12345678-9 o 1234567-K"
                required
              />
              <small className="text-light">Formato: 12345678-9 o 1234567-K</small>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="correo" className="form-label text-white">Correo Electrónico *</label>
              <input
                type="email"
                className="form-control"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                disabled={esEdicion}
                required
              />
              {esEdicion && <small className="text-light">El correo no se puede cambiar</small>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="nombre" className="form-label text-white">Nombre *</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                maxLength="50"
                required
              />
              <small className="text-light">Máximo 50 caracteres</small>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="apellidos" className="form-label text-white">Apellidos *</label>
              <input
                type="text"
                className="form-control"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                maxLength="100"
                required
              />
              <small className="text-light">Máximo 100 caracteres</small>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="telefono" className="form-label text-white">Teléfono {!esEdicion && '*'}</label>
              <input
                type="tel"
                className="form-control"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="912345678 (9 dígitos)"
                pattern="[0-9]{9}"
                title="Debe contener exactamente 9 dígitos"
                required={!esEdicion}
              />
              <small className="text-light">Formato: 9 dígitos sin espacios ni prefijo +56</small>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="fechaNacimiento" className="form-label text-white">Fecha de Nacimiento {!esEdicion && '*'}</label>
              <input
                type="date"
                className="form-control"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required={!esEdicion}
              />
            </div>

            <div className="col-md-12 mb-3">
              <label htmlFor="direccion" className="form-label text-white">Dirección</label>
              <input
                type="text"
                className="form-control"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Calle, número, depto"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="comuna" className="form-label text-white">Comuna {!esEdicion && '*'}</label>
              <input
                type="text"
                className="form-control"
                id="comuna"
                name="comuna"
                value={formData.comuna}
                onChange={handleChange}
                minLength="3"
                maxLength="100"
                required={!esEdicion}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="ciudad" className="form-label text-white">Ciudad {!esEdicion && '*'}</label>
              <input
                type="text"
                className="form-control"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                minLength="3"
                maxLength="100"
                required={!esEdicion}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="region" className="form-label text-white">Región {!esEdicion && '*'}</label>
              <input
                type="text"
                className="form-control"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                minLength="3"
                maxLength="100"
                required={!esEdicion}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="codigoPostal" className="form-label text-white">Código Postal</label>
              <input
                type="text"
                className="form-control"
                id="codigoPostal"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                maxLength="10"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="rol" className="form-label text-white">Rol *</label>
              <select
                className="form-select"
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
              >
                <option value="CLIENTE">Cliente</option>
                <option value="VENDEDOR">Vendedor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div className="col-md-12 mb-3">
              <label htmlFor="password" className="form-label text-white">
                Contraseña {!esEdicion && '*'}
                {esEdicion && <small className="text-light"> (dejar vacío para mantener la actual)</small>}
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={esEdicion ? "Dejar vacío para no cambiar" : "Mínimo 4 caracteres"}
                minLength="4"
                maxLength="20"
                required={!esEdicion}
              />
              <small className="text-light">Entre 4 y 20 caracteres</small>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4 justify-content-center">
            <button 
              type="submit" 
              className="btn btn-success px-5"
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Guardando...
                </>
              ) : (
                esEdicion ? 'Actualizar Usuario' : 'Crear Usuario'
              )}
            </button>
            <Link 
              to="/admin/usuarios" 
              className="btn btn-secondary px-5"
            >
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}
