import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import '../styles/Home.css';

const PRODUCTOS_DEFAULT = [
  {
    codigo: "JM001",
    categoria: "Juegos de Mesa",
    nombre: "Catan",
    precio: 29990,
    stock: 10,
    desc: "Juego clásico de estrategia.",
    img: "/assets/imgs/destacado1.png",
    imagen: "/assets/imgs/destacado1.png"
  },
  {
    codigo: "AC001",
    categoria: "Accesorios",
    nombre: "Control Xbox Series X",
    precio: 59990,
    stock: 15,
    desc: "Control inalámbrico.",
    img: "/assets/imgs/destacado2.png",
    imagen: "/assets/imgs/destacado2.png"
  },
  {
    codigo: "CO001",
    categoria: "Consolas",
    nombre: "PlayStation 5",
    precio: 549990,
    stock: 5,
    desc: "Consola de última generación.",
    img: "/assets/imgs/destacado3.png",
    imagen: "/assets/imgs/destacado3.png"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productos, setProductos] = useState(PRODUCTOS_DEFAULT);
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  useEffect(() => {
    const destacadosCodigosLS = JSON.parse(localStorage.getItem('destacados') || '[]');
    if (destacadosCodigosLS.length > 0) {
      const productosLS = JSON.parse(localStorage.getItem('productos') || '[]');
      const productosDestacados = destacadosCodigosLS.map(codigo => {
        const producto = productosLS.find(p => p.codigo === codigo);
        if (producto && producto.stock > 0) {
          return {
            codigo: producto.codigo,
            categoria: producto.categoria,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            desc: producto.descripcion || producto.desc || 'Producto destacado',
            img: producto.imagen,
            imagen: producto.imagen
          };
        }
        return null;
      }).filter(p => p !== null);
      
      if (productosDestacados.length > 0) {
        setProductos(productosDestacados);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [productos.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + productos.length) % productos.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % productos.length);
  };

  const handleAgregarAlCarrito = (codigo) => {
    const producto = productos.find(p => p.codigo === codigo);
    if (producto) {
      agregarAlCarrito(producto);
      if (window.notificar) {
        window.notificar(`¡${producto.nombre} agregado al carrito!`, 'success', 3000);
      }
    }
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>¡DESAFÍA TUS LÍMITES!</h1>
              <p>Explora consolas, accesorios, PCs y más</p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                <Link className="btn btn-secondary" to="/productos">Explorar Productos</Link>
                <Link className="btn btn-secondary" to="/nosotros">Conócenos</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="col-12">
            <h2 className="section-title">Destacados</h2>
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <div id="productos-carrusel-container" className="mt-5">
          <div id="productosCarrusel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
            <div className="carousel-inner" id="carousel-productos-inner">
              {productos.map((prod, idx) => (
                <div className={`carousel-item${idx === currentSlide ? ' active' : ''}`} key={prod.codigo}>
                  <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                      <div className="d-flex flex-column align-items-center justify-content-center p-3 p-md-4" style={{ minHeight: '500px' }}>
                        <img 
                          src={prod.img} 
                          alt={prod.nombre} 
                          className="img-fluid mb-3 rounded" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '300px', 
                            objectFit: 'contain', 
                            background: '#222',
                            cursor: 'pointer',
                            padding: '1rem'
                          }}
                          onClick={() => navigate(`/detalle/${prod.codigo}`)}
                        />
                        <h5 
                          className="text-neon mb-2 text-center" 
                          style={{ cursor: 'pointer', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}
                          onClick={() => navigate(`/detalle/${prod.codigo}`)}
                        >
                          {prod.nombre}
                        </h5>
                        <span className="badge bg-secondary mb-2" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>{prod.categoria}</span>
                        <span className="fw-bold text-success mb-2" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)' }}>${prod.precio.toLocaleString('es-CL')}</span>
                        <p className="mb-2 text-center px-2" style={{ maxWidth: '420px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>{prod.desc}</p>
                        <button 
                          className="btn btn-success btn-lg w-100 w-sm-auto" 
                          onClick={() => handleAgregarAlCarrito(prod.codigo)}
                        >
                          Agregar al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="carousel-control-prev" 
              type="button" 
              onClick={handlePrev}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button 
              className="carousel-control-next" 
              type="button" 
              onClick={handleNext}
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>
          </div>
        </div>
      </main>
    </>
  );
}
