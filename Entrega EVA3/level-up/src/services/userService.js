// Servicio de usuarios
const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:80';

/**
 * Obtiene todos los usuarios (admin)
 * @param {string} token - Token de autenticación
 * @returns {Promise<Array>}
 */
export const obtenerUsuarios = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por ID
 * @param {number} id - ID del usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<object>}
 */
export const obtenerUsuarioPorId = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};

/**
 * Actualiza un usuario
 * @param {number} id - ID del usuario
 * @param {object} userData - Datos actualizados
 * @param {string} token - Token de autenticación
 * @returns {Promise<object>}
 */
export const actualizarUsuario = async (id, userData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

/**
 * Elimina un usuario
 * @param {number} id - ID del usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<void>}
 */
export const eliminarUsuario = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar usuario');
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};
