// Servicio para interactuar con Order Service (Puerto 8084)
const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8080';
const ORDER_SERVICE_URL = `${API_BASE_URL}/api/ordenes`;

/**
 * Crea una nueva orden de compra
 * @param {Object} orderData - Datos de la orden
 * @param {string} orderData.userId - ID del usuario
 * @param {Array} orderData.items - Items de la orden [{productId, quantity, price}]
 * @param {number} orderData.totalAmount - Monto total
 * @param {string} orderData.shippingAddress - Dirección de envío
 * @param {string} orderData.paymentMethod - Método de pago
 * @returns {Promise<Object>} Orden creada
 */
export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    console.log('Datos de orden enviados:', JSON.stringify(orderData, null, 2));
    
    const response = await fetch(`${ORDER_SERVICE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error del backend:', errorData);
      throw new Error(errorData.error || errorData.message || `Error al crear la orden: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createOrder:', error);
    throw error;
  }
};

/**
 * Obtiene todas las órdenes del usuario actual
 * @returns {Promise<Array>} Lista de órdenes
 */
export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    
    // Si no hay userId en localStorage, intentar obtenerlo del usuario actual
    if (!userId) {
      const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
      if (usuarioActual && usuarioActual.id) {
        userId = usuarioActual.id;
        localStorage.setItem('userId', userId);
      } else {
        throw new Error('Usuario no autenticado');
      }
    }

    const response = await fetch(`${ORDER_SERVICE_URL}/usuario/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener órdenes: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getUserOrders:', error);
    throw error;
  }
};

/**
 * Obtiene una orden por su ID
 * @param {string} orderId - ID de la orden
 * @returns {Promise<Object>} Orden encontrada
 */
export const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${ORDER_SERVICE_URL}/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener la orden: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getOrderById:', error);
    throw error;
  }
};

/**
 * Actualiza el estado de una orden
 * @param {string} orderId - ID de la orden
 * @param {string} estado - Nuevo estado (PENDIENTE, CONFIRMADA, ENVIADA, ENTREGADA, CANCELADA)
 * @returns {Promise<Object>} Orden actualizada
 */
export const updateOrderStatus = async (orderId, estado) => {
  try {
    const token = localStorage.getItem('token');
    const url = `${ORDER_SERVICE_URL}/${orderId}/estado?estado=${estado}`;
    console.log(`🔄 Actualizando orden ${orderId} a estado ${estado}`);
    console.log(`URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error ${response.status}:`, errorText);
      throw new Error(`Error al actualizar el estado: ${response.status} - ${errorText}`);
    }

    const resultado = await response.json();
    console.log(`✅ Orden actualizada correctamente:`, resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Error en updateOrderStatus:', error);
    throw error;
  }
};

/**
 * DESACTIVADO - Progresión automática ahora se maneja con trigger en Supabase
 * Simula la progresión automática de estados de una orden
 * PENDIENTE -> (1 min) -> PROCESANDO -> (1 min) -> ENVIADO -> (1 min) -> ENTREGADO
 * @param {string} orderId - ID de la orden
 * @param {Function} onUpdate - Callback que se llama cuando cambia el estado
 */
export const iniciarProgresionAutomatica = (orderId, onUpdate) => {
  console.log(`⏰ Progresión automática desactivada - se maneja en Supabase con trigger`);
  console.log(`   La orden ${orderId} se actualizará automáticamente en la base de datos`);
  return () => {}; // Función vacía para cancelar
};

/* FUNCIÓN ORIGINAL COMENTADA - Ahora usa trigger de Supabase
export const iniciarProgresionAutomatica = (orderId, onUpdate) => {
  console.log(`⏰ Iniciando progresión automática para orden ${orderId}`);
  
  const progresion = [
    { estado: 'PROCESANDO', delay: 60000 }, // 1 minuto
    { estado: 'ENVIADO', delay: 60000 },    // 1 minuto adicional
    { estado: 'ENTREGADO', delay: 60000 }   // 1 minuto adicional
  ];

  let timeoutIds = [];

  progresion.forEach((paso, index) => {
    const delayAcumulado = progresion.slice(0, index + 1).reduce((sum, p) => sum + p.delay, 0);
    const minutos = delayAcumulado / 60000;
    
    console.log(`⏰ Programado cambio a ${paso.estado} en ${minutos} minuto(s)`);
    
    const timeoutId = setTimeout(async () => {
      try {
        console.log(`🔄 Ejecutando cambio a ${paso.estado}...`);
        const ordenActualizada = await updateOrderStatus(orderId, paso.estado);
        console.log(`✅ Orden ${orderId} progresó a estado: ${ordenActualizada.estado}`);
        if (onUpdate) {
          onUpdate(ordenActualizada);
        }
      } catch (error) {
        console.error(`❌ Error al actualizar orden ${orderId} a ${paso.estado}:`, error);
      }
    }, delayAcumulado);

    timeoutIds.push(timeoutId);
  });

  return () => {
    timeoutIds.forEach(id => clearTimeout(id));
  };
};
*/

/**
 * Cancela una orden
 * @param {string} orderId - ID de la orden
 * @returns {Promise<Object>} Orden cancelada
 */
export const cancelOrder = async (orderId) => {
  return updateOrderStatus(orderId, 'CANCELADO');
};

/**
 * Obtiene todas las órdenes (Admin)
 * @param {Object} params - Parámetros de filtrado
 * @param {string} params.status - Estado de la orden
 * @param {string} params.startDate - Fecha inicio (ISO)
 * @param {string} params.endDate - Fecha fin (ISO)
 * @returns {Promise<Array>} Lista de órdenes
 */
export const getAllOrders = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const url = `${ORDER_SERVICE_URL}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener todas las órdenes: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAllOrders:', error);
    throw error;
  }
};

const orderService = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  iniciarProgresionAutomatica,
  cancelOrder,
  getAllOrders,
};

export default orderService;
