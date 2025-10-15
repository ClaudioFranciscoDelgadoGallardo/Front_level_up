import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (error) {
        setCarrito([]);
      }
    }
  }, []);

  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    } else {
      localStorage.removeItem('carrito');
    }
  }, [carrito]);

  const agregarAlCarrito = (producto, qty = 1) => {
    if (!producto || !producto.codigo) {
      return;
    }
    
    setCarrito(prevCarrito => {
      const idx = prevCarrito.findIndex(item => item.codigo === producto.codigo);
      const maxQty = producto.stock || 999;
      
      if (idx >= 0) {
        const newCart = [...prevCarrito];
        newCart[idx] = {
          ...newCart[idx],
          qty: Math.min(newCart[idx].qty + qty, maxQty)
        };
        return newCart;
      } else {
        return [...prevCarrito, {
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          qty: Math.min(qty, maxQty)
        }];
      }
    });
  };

  const eliminarDelCarrito = (codigo) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.codigo !== codigo));
  };

  const actualizarCantidad = (codigo, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(codigo);
      return;
    }
    
    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.codigo === codigo
          ? { ...item, qty: nuevaCantidad }
          : item
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem('carrito');
  };

  const calcularTotales = () => {
    if (carrito.length === 0) {
      return { items: [], subtotal: 0, descuento: 0, total: 0 };
    }

    const items = carrito.map(it => {
      const subtotal = it.precio * it.qty;
      return { ...it, subtotal };
    });
    
    const subtotal = items.reduce((a, b) => a + b.subtotal, 0);
    
    let descuento = 0;
    try {
      const user = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
      const email = user?.correo?.toLowerCase() || user?.email?.toLowerCase() || '';
      if (email.endsWith('@duoc.cl') || email.endsWith('@profesor.duoc.cl')) {
        descuento = subtotal * 0.20;
      }
    } catch (_) {}
    
    const total = Math.max(0, subtotal - descuento);
    
    return { items, subtotal, descuento, total };
  };

  const calcularTotal = () => {
    return calcularTotales().total;
  };

  const obtenerCantidadTotal = () => {
    return carrito.reduce((total, item) => total + item.qty, 0);
  };

  const value = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    calcularTotal,
    calcularTotales,
    obtenerCantidadTotal
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};
