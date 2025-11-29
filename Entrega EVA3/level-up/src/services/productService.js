// Servicio de productos
const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:80';

/**
 * Obtiene todos los productos
 * @returns {Promise<Array>}
 */
export const obtenerProductos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/productos/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

/**
 * Obtiene un producto por código
 * @param {string} codigo - Código del producto
 * @returns {Promise<object>}
 */
export const obtenerProductoPorCodigo = async (codigo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/productos/${codigo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener producto');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
};

/**
 * Crea un nuevo producto
 * @param {object} productData - Datos del producto
 * @param {string} token - Token de autenticación
 * @returns {Promise<object>}
 */
export const crearProducto = async (productData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/productos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear producto');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

/**
 * Actualiza un producto
 * @param {string} codigo - Código del producto
 * @param {object} productData - Datos actualizados
 * @param {string} token - Token de autenticación
 * @returns {Promise<object>}
 */
export const actualizarProducto = async (codigo, productData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/productos/${codigo}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar producto');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

/**
 * Elimina un producto
 * @param {string} codigo - Código del producto
 * @param {string} token - Token de autenticación
 * @returns {Promise<void>}
 */
export const eliminarProducto = async (codigo, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/productos/${codigo}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar producto');
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

/**
 * Actualiza el stock de un producto
 * @param {string} codigo - Código del producto
 * @param {number} cantidad - Nueva cantidad de stock
 * @param {string} token - Token de autenticación
 * @returns {Promise<object>}
 */
export const actualizarStock = async (codigo, cantidad, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/productos/${codigo}/stock`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock: cantidad }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar stock');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    throw error;
  }
};
