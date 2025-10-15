import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import '../styles/Productos.css';

const PRODUCTOS_BASE = [
  {
    id: "JM001",
    codigo: "JM001",
    categoria: "Juegos de Mesa",
    nombre: "Catan",
    precio: 29990,
    stock: 10,
    descripcion: "Juego clásico de estrategia.",
    imagen: "/assets/imgs/destacado1.png"
  },
  {
    id: "AC001",
    codigo: "AC001",
    categoria: "Accesorios",
    nombre: "Control Xbox Series X",
    precio: 59990,
    stock: 15,
    descripcion: "Control inalámbrico.",
    imagen: "/assets/imgs/destacado2.png"
  },
  {
    id: "CO001",
    codigo: "CO001",
    categoria: "Consolas",
    nombre: "PlayStation 5",
    precio: 549990,
    stock: 5,
    descripcion: "Consola de última generación.",
    imagen: "/assets/imgs/destacado3.png"
  }
];

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    // Cargar productos del localStorage si existen
    const productosLS = JSON.parse(localStorage.getItem('productos') || '[]');
    
    // Combinar productos base con los del localStorage
    const productosCombinados = [
      ...PRODUCTOS_BASE,
      ...productosLS.filter(p => !PRODUCTOS_BASE.some(b => b.codigo === p.codigo))
    ].map(p => ({ ...p, id: p.codigo })); // Asegurar que todos tengan ID

    setProductos(productosCombinados);
  }, []);

  const handleAgregarAlCarrito = (codigo) => {
    const prod = productos.find(p => p.codigo === codigo);
    if (prod) {
      agregarAlCarrito(prod);
      if (window.notificar) {
        window.notificar(`¡${prod.nombre} agregado al carrito!`, 'success', 3000);
      }
    }
  };

  return (
    <main className="container">
      <h2 className="section-title">Productos</h2>
      <div id="listado-productos" className="grid products productos-table">
        {productos.length === 0 ? (
          <div className="text-center text-secondary">No hay productos disponibles.</div>
        ) : (
          productos.map((prod) => (
            <div 
              key={prod.codigo} 
              className="card bg-dark text-white border-success m-2 d-inline-block" 
              style={{ width: '18rem', boxShadow: '0 0 8px #39ff14' }}
            >
              <div className="card-body d-flex flex-column align-items-center">
                {prod.imagen && (
                  <img 
                    src={prod.imagen} 
                    alt={prod.nombre} 
                    className="img-fluid rounded mb-2" 
                    style={{ maxWidth: '120px', maxHeight: '120px' }} 
                  />
                )}
                <h5 className="card-title mt-2">{prod.nombre}</h5>
                <p className="card-text mb-1">
                  <span className="text-success">{prod.categoria}</span>
                </p>
                <p className="card-text mb-1">{prod.descripcion || ''}</p>
                <p className="card-text fw-bold mb-1">${prod.precio.toLocaleString('es-CL')}</p>
                <div className="d-flex flex-column align-items-center w-100 mt-auto">
                  <button 
                    className="btn btn-success mb-2 w-75" 
                    onClick={() => handleAgregarAlCarrito(prod.codigo)}
                  >
                    Agregar al carrito
                  </button>
                  <Link 
                    className="btn btn-outline-success px-4 text-center" 
                    to={`/detalle/${prod.codigo}`}
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
