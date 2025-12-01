import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarLogUsuario } from '../utils/logManager';
import { registro } from '../services/authService';
import '../styles/Registro.css';

export default function Registro() {
  const navigate = useNavigate();
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
    fechaNac: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarFormulario = () => {
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

    if (!formData.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      if (window.notificar) {
        window.notificar('Debes ingresar un correo válido', 'error', 3000);
      }
      return false;
    }

    // Validar teléfono (9 dígitos para Chile)
    if (!formData.telefono) {
      if (window.notificar) {
        window.notificar('El teléfono es obligatorio', 'error', 3000);
      }
      return false;
    }
    const telefonoLimpio = formData.telefono.trim().replace(/\s+/g, '');
    if (!/^\d{9}$/.test(telefonoLimpio)) {
      if (window.notificar) {
        window.notificar('El teléfono debe tener exactamente 9 dígitos', 'error', 3000);
      }
      return false;
    }

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

    // Validar código postal (máximo 10 caracteres)
    if (formData.codigoPostal && formData.codigoPostal.length > 10) {
      if (window.notificar) {
        window.notificar('El código postal no puede tener más de 10 caracteres', 'error', 3000);
      }
      return false;
    }

    if (!formData.password || formData.password.length < 4 || formData.password.length > 20) {
      if (window.notificar) {
        window.notificar('La contraseña debe tener entre 4 y 20 caracteres', 'error', 3000);
      }
      return false;
    }

    // Validar mayor de edad (18 años)
    if (!formData.fechaNac) {
      if (window.notificar) {
        window.notificar('Debes ingresar tu fecha de nacimiento', 'error', 3000);
      }
      return false;
    }

    const fechaNacimiento = new Date(formData.fechaNac);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      if (window.notificar) {
        window.notificar('Debes ser mayor de 18 años para registrarte', 'error', 3000);
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      // Preparar datos para el backend
      const userData = {
        run: formData.run,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        password: formData.password,
        telefono: formData.telefono.trim().replace(/\s+/g, ''), // Limpiar espacios
        direccion: formData.direccion || 'Sin especificar',
        comuna: formData.comuna,
        ciudad: formData.ciudad,
        region: formData.region,
        codigoPostal: formData.codigoPostal || null,
        fechaNacimiento: formData.fechaNac,
        rol: 'CLIENTE'
      };

      // Registrar en el backend
      await registro(userData);
      
      registrarLogUsuario(`Se registró como nuevo usuario: ${formData.nombre} ${formData.apellidos} (${formData.correo})`);
      
      if (window.notificar) {
        window.notificar(`¡Usuario ${formData.nombre} registrado exitosamente!`, 'success', 3000);
      }
      
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      if (window.notificar) {
        window.notificar(error.message || 'Error al registrar usuario. Intenta nuevamente.', 'error', 4000);
      }
    }
  };

  return (
    <main className="container">
      <h2 className="section-title">Registro de Usuario</h2>
      <form id="form-registro" onSubmit={handleSubmit} noValidate>
        <label htmlFor="reg-run">RUN</label>
        <input 
          id="reg-run"
          name="run"
          placeholder="12345678-9"
          value={formData.run}
          onChange={handleChange}
        />

        <label htmlFor="reg-nombre">Nombres</label>
        <input 
          id="reg-nombre"
          name="nombre"
          placeholder="Juan Carlos"
          value={formData.nombre}
          onChange={handleChange}
        />

        <label htmlFor="reg-apellidos">Apellidos</label>
        <input 
          id="reg-apellidos"
          name="apellidos"
          placeholder="Pérez Gómez"
          value={formData.apellidos}
          onChange={handleChange}
        />

        <label htmlFor="reg-correo">Correo</label>
        <input 
          id="reg-correo"
          name="correo"
          type="email"
          placeholder="juan.carlos@example.com"
          value={formData.correo}
          onChange={handleChange}
        />

        <label htmlFor="reg-telefono">Teléfono</label>
        <input 
          id="reg-telefono"
          name="telefono"
          type="tel"
          placeholder="912345678"
          value={formData.telefono}
          onChange={handleChange}
        />

        <label htmlFor="reg-direccion">Dirección</label>
        <input 
          id="reg-direccion"
          name="direccion"
          type="text"
          placeholder="Calle 123, dept.(opcional)"
          value={formData.direccion}
          onChange={handleChange}
        />

        <label htmlFor="reg-comuna">Comuna</label>
        <input 
          id="reg-comuna"
          name="comuna"
          type="text"
          placeholder="Santiago, Providencia, etc."
          value={formData.comuna}
          onChange={handleChange}
        />

        <label htmlFor="reg-ciudad">Ciudad</label>
        <input 
          id="reg-ciudad"
          name="ciudad"
          type="text"
          placeholder="Santiago, Valparaíso, etc."
          value={formData.ciudad}
          onChange={handleChange}
        />

        <label htmlFor="reg-region">Región</label>
        <input 
          id="reg-region"
          name="region"
          type="text"
          placeholder="Región Metropolitana, Región de Valparaíso, etc."
          value={formData.region}
          onChange={handleChange}
        />

        <label htmlFor="reg-codigo-postal">Código Postal (Opcional)</label>
        <input 
          id="reg-codigo-postal"
          name="codigoPostal"
          type="text"
          placeholder="8320000"
          value={formData.codigoPostal}
          onChange={handleChange}
        />

        <label htmlFor="reg-pass">Contraseña</label>
        <input 
          id="reg-pass"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <label htmlFor="reg-fnac">Fecha Nacimiento</label>
        <input 
          id="reg-fnac"
          name="fechaNac"
          type="date"
          value={formData.fechaNac}
          onChange={handleChange}
        />

        <button className="btn btn-success" type="submit">Registrarme</button>
      </form>
    </main>
  );
}
