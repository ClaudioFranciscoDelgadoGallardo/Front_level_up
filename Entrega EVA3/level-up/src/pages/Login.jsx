import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarLogUsuario, registrarLogAdmin } from '../utils/logManager';
import { login } from '../services/authService';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarFormulario = () => {
    if (!formData.email || formData.email.trim().length === 0) {
      if (window.notificar) {
        window.notificar('El correo es obligatorio', 'error', 3000);
      }
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      if (window.notificar) {
        window.notificar('Debes ingresar un correo válido', 'error', 3000);
      }
      return false;
    }

    if (!formData.password || formData.password.trim().length === 0) {
      if (window.notificar) {
        window.notificar('La contraseña es obligatoria', 'error', 3000);
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
      // Llamar al backend para login
      const resultado = await login(formData.email, formData.password);
      
      console.log('Resultado del login:', resultado);
      
      if (!resultado || !resultado.token) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      // Extraer datos del usuario de la respuesta (el backend los envía en el nivel raíz)
      const usuario = {
        id: resultado.id,
        run: resultado.run,
        nombre: resultado.nombre,
        apellidos: resultado.apellidos,
        correo: resultado.correo,
        rol: resultado.rol,
        telefono: resultado.telefono,
        direccion: resultado.direccion,
        comuna: resultado.comuna,
        ciudad: resultado.ciudad,
        region: resultado.region,
        codigoPostal: resultado.codigoPostal,
        fechaNacimiento: resultado.fechaNacimiento,
        fotoPerfil: resultado.fotoPerfil
      };
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', resultado.token);
      localStorage.setItem('userId', usuario.id);
      localStorage.setItem('usuarioActual', JSON.stringify(usuario));
      window.dispatchEvent(new Event('usuarioActualizado'));
      
      
      if (usuario.rol === 'ADMIN' || usuario.rol === 'admin') {
        registrarLogAdmin(`Inició sesión: ${usuario.nombre} ${usuario.apellidos || ''} (${usuario.correo})`);
      } else {
        registrarLogUsuario(`Inició sesión: ${usuario.nombre} ${usuario.apellidos || ''} (${usuario.correo})`);
      }
      
      if (window.notificar) {
        window.notificar(`¡Bienvenido ${usuario.nombre}!`, 'success', 3000);
      }
      
      // Redirigir según el rol del usuario
      const rol = usuario.rol ? usuario.rol.toLowerCase() : '';
      console.log('Redirigiendo usuario con rol:', rol);
      
      if (rol === 'admin') {
        console.log('Navegando a /admin');
        navigate('/admin');
      } else if (rol === 'vendedor') {
        console.log('Navegando a /vendedor');
        navigate('/vendedor');
      } else {
        console.log('Navegando a /perfil');
        navigate('/perfil');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      if (window.notificar) {
        window.notificar(error.message || 'Error al iniciar sesión. Verifica tus credenciales.', 'error', 4000);
      }
    }
  };

  return (
    <main className="container">
      <h2 className="section-title">Inicio de sesión</h2>
      <form id="form-login" onSubmit={handleSubmit} noValidate>
        <label htmlFor="login-email">Correo</label>
        <input 
          id="login-email"
          name="email"
          type="email"
          placeholder="juan.carlos@example.com"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="login-pass">Contraseña</label>
        <input 
          id="login-pass"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button className="btn btn-success" type="submit">Ingresar</button>
      </form>
    </main>
  );
}
