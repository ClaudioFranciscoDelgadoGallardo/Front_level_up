// Servicio de autenticación
const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:80';

/**
 * Realiza login de usuario
 * @param {string} correo - Correo del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<{token: string, usuario: object}>}
 */
export const login = async (correo, password) => {
  try {
    console.log('Enviando login:', { correo, password: '***' });
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, password }),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = 'Error al iniciar sesión';
      
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        errorMessage = error.message || error.error || JSON.stringify(error);
      } else {
        const errorText = await response.text();
        errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
      }
      
      console.error('Error del servidor:', errorMessage);
      throw new Error(errorMessage);
    }

    const resultado = await response.json();
    console.log('Login exitoso:', { ...resultado, token: resultado.token ? '***' : undefined });
    return resultado;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

/**
 * Registra un nuevo usuario
 * @param {object} userData - Datos del usuario
 * @returns {Promise<object>}
 */
export const registro = async (userData) => {
  try {
    console.log('Enviando datos de registro:', userData);
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = 'Error al registrar usuario';
      
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        errorMessage = error.message || error.error || JSON.stringify(error);
      } else {
        const errorText = await response.text();
        errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
      }
      
      console.error('Error del servidor:', errorMessage);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

/**
 * Cierra sesión del usuario
 * @param {string} token - Token de autenticación
 */
export const logout = async (token) => {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error en logout:', error);
  }
};

/**
 * Verifica si el token es válido
 * @param {string} token - Token de autenticación
 * @returns {Promise<boolean>}
 */
export const verificarToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verificar`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return false;
  }
};
