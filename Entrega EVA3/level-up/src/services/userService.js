// Servicio de usuarios
const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8080';

/**
 * Obtiene todos los usuarios (admin)
 * @param {string} token - Token de autenticación
 * @returns {Promise<Array>}
 */
export const obtenerUsuarios = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('403 Forbidden - Sesión expirada o sin permisos');
      }
      throw new Error(`Error al obtener usuarios: ${response.status}`);
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
 * Desactiva un usuario (soft delete)
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

/**
 * Crea un nuevo usuario (admin)
 * @param {object} userData - Datos del nuevo usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<object>}
 */
export const crearUsuario = async (userData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/registro`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

/**
 * Elimina permanentemente un usuario (solo si no tiene órdenes)
 * @param {number} id - ID del usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<object>}
 */
export const eliminarUsuarioPermanente = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}/permanente`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al eliminar usuario permanentemente');
    }

    return data;
  } catch (error) {
    console.error('Error al eliminar usuario permanentemente:', error);
    throw error;
  }
};
