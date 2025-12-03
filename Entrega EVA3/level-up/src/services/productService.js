// Servicio de productos
const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:80';

/**
 * Obtiene todos los productos activos
 * @returns {Promise<Array>}
 */
export const obtenerProductos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/productos`, {
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
 * Obtiene TODOS los productos (incluyendo desactivados) - Solo para Admin
 * @returns {Promise<Array>}
 */
export const obtenerTodosLosProductos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/productos/todos`, {
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
    console.error('Error al obtener todos los productos:', error);
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
    const response = await fetch(`${API_BASE_URL}/api/productos/codigo/${codigo}`, {
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
    console.log('📤 Enviando creación de producto:', JSON.stringify(productData, null, 2));
    const response = await fetch(`${API_BASE_URL}/api/productos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del servidor al crear:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(errorText || 'Error al crear producto');
      }
      throw new Error(errorData.error || errorData.message || 'Error al crear producto');
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
    console.log('📤 Enviando actualización:', JSON.stringify(productData, null, 2));
    const response = await fetch(`${API_BASE_URL}/api/productos/${codigo}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del servidor:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(errorText || 'Error al actualizar producto');
      }
      throw new Error(errorData.error || errorData.message || 'Error al actualizar producto');
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
 * Desactiva un producto (cambia activo a false)
 * @param {string} codigo - Código del producto
 * @param {string} token - Token de autenticación
 * @returns {Promise<object>}
 */
export const desactivarProducto = async (codigo, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/productos/${codigo}/desactivar`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al desactivar producto');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al desactivar producto:', error);
    throw error;
  }
};

/**
 * Actualiza el stock de un producto (suma o resta la cantidad)
 * @param {string} codigo - Código del producto
 * @param {number} delta - Cantidad a sumar (positivo) o restar (negativo)
 * @returns {Promise<object>}
 */
export const updateProductStock = async (codigo, delta) => {
  try {
    const token = localStorage.getItem('token');
    
    console.log(`Actualizando stock de ${codigo}: delta = ${delta}`);
    
    // Enviar delta directamente al backend
    const response = await fetch(`${API_BASE_URL}/api/productos/codigo/${codigo}/stock?delta=${delta}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar stock');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar stock del producto:', error);
    throw error;
  }
};
