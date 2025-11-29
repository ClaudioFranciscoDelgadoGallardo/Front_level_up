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
    // Validar formato RUT chileno: 12345678-9 o 1234567-8
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
        fechaNacimiento: formData.fechaNac,
        rol: 'CLIENTE' // El backend espera roles en mayúsculas
      };

      // Registrar en el backend
      const resultado = await registro(userData);
      
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
          value={formData.run}
          onChange={handleChange}
        />

        <label htmlFor="reg-nombre">Nombres</label>
        <input 
          id="reg-nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
        />

        <label htmlFor="reg-apellidos">Apellidos</label>
        <input 
          id="reg-apellidos"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleChange}
        />

        <label htmlFor="reg-correo">Correo</label>
        <input 
          id="reg-correo"
          name="correo"
          type="email"
          value={formData.correo}
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
