import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { obtenerProductos } from '../services/productService';
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
  const [todosLosProductos, setTodosLosProductos] = useState([]);
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        console.log('🔄 Cargando productos desde backend...');
        const productosBackend = await obtenerProductos();
        console.log('✅ Productos recibidos:', productosBackend.length);
        
        // Mapeo de IDs de categoría a nombres
        const categoriasMap = {
          1: 'Juegos de Mesa',
          2: 'Accesorios',
          3: 'Consolas',
          4: 'Videojuegos',
          5: 'Figuras',
          6: 'Otros'
        };
        
        // Mapear todos los productos activos con stock
        const productosValidos = productosBackend
          .filter(p => p.activo === true && p.stockActual > 0)
          .map(p => ({
            id: p.id || p.codigo,
            codigo: p.codigo,
            nombre: p.nombre,
            descripcion: p.descripcion || p.descripcionCorta || '',
            categoria: categoriasMap[p.categoriaId] || 'Sin categoría',
            precio: p.precioVenta || p.precioBase || 0,
            stock: p.stockActual || 0,
            desc: p.descripcion || p.descripcionCorta || 'Producto destacado',
            img: p.imagenPrincipal || '/assets/imgs/producto-default.png',
            imagen: p.imagenPrincipal || '/assets/imgs/producto-default.png',
            destacado: p.destacado || false
          }));
        
        console.log('📦 Productos válidos procesados:', productosValidos.length);
        
        // Guardar todos los productos
        setTodosLosProductos(productosValidos);
        
        // Filtrar productos destacados para el carrusel
        const productosDestacados = productosValidos.filter(p => p.destacado === true);
        
        console.log('🌟 Productos destacados encontrados:', productosDestacados.length, productosDestacados.map(p => p.nombre));
        
        const productosMostrar = productosDestacados.length > 0
          ? productosDestacados 
          : productosValidos.slice(0, 3);
        
        if (productosMostrar.length > 0) {
          console.log('✅ Productos destacados para carrusel:', productosMostrar.length);
          setProductos(productosMostrar);
        } else {
          console.log('⚠️ No hay productos destacados, usando defaults');
        }
      } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        // Mantener productos por defecto si falla
      }
    };

    cargarProductos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [productos.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + productos.length) % productos.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % productos.length);
  };

  const getVisibleProducts = (centerIndex) => {
    const prevIndex = (centerIndex - 1 + productos.length) % productos.length;
    const nextIndex = (centerIndex + 1) % productos.length;
    return [
      { producto: productos[prevIndex], position: 'left' },
      { producto: productos[centerIndex], position: 'center' },
      { producto: productos[nextIndex], position: 'right' }
    ];
  };

  const handleAgregarAlCarrito = (codigo) => {
    // Buscar primero en todos los productos, luego en destacados
    const producto = todosLosProductos.find(p => p.codigo === codigo) || productos.find(p => p.codigo === codigo);
    if (producto) {
      agregarAlCarrito(producto);
      if (window.notificar) {
        window.notificar(`¡${producto.nombre} agregado al carrito!`, 'success', 3000);
      }
    } else {
      console.error('❌ Producto no encontrado:', codigo);
      if (window.notificar) {
        window.notificar('Error: Producto no encontrado', 'error', 3000);
      }
    }
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="display-4 fw-bold">¡DESAFÍA TUS LÍMITES!</h1>
          <p className="lead">Explora consolas, accesorios, PCs y más</p>
          <div className="d-flex flex-wrap gap-2 justify-content-center mt-4">
            <Link className="btn btn-success btn-lg" to="/productos">Explorar Productos</Link>
            <Link className="btn btn-outline-success btn-lg" to="/nosotros">Conócenos</Link>
          </div>
        </div>
      </section>

      <main className="container py-5">
        <h2 className="section-title text-center mb-5">Destacados</h2>
        
        <div id="productos-carrusel-container" className="mt-4">
          <div id="productosCarrusel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner" id="carousel-productos-inner">
              {productos.map((_, idx) => {
                const visibleProducts = getVisibleProducts(idx);
                
                return (
                  <div 
                    className={`carousel-item${idx === currentSlide ? ' active' : ''}`} 
                    key={idx}
                  >
                    <div className="row g-3 g-md-4 justify-content-center p-2 p-md-4">
                      {visibleProducts.map(({ producto: prod, position }) => (
                        <div 
                          className="col-12 col-sm-6 col-md-4"
                          key={`${prod.codigo}-${position}`}
                        >
                          <div className={`card h-100 bg-dark text-white carousel-card carousel-card-${position}`}>
                            <img 
                              src={prod.img} 
                              alt={prod.nombre} 
                              className="card-img-top p-3 carousel-card-img" 
                              onClick={() => navigate(`/detalle/${prod.codigo}`)}
                            />
                            <div className="card-body d-flex flex-column">
                              <h5 
                                className="card-title text-neon mb-2 carousel-card-title" 
                                onClick={() => navigate(`/detalle/${prod.codigo}`)}
                              >
                                {prod.nombre}
                              </h5>
                              <span className="badge bg-secondary mb-2 align-self-start">{prod.categoria}</span>
                              <p className="card-text text-success fw-bold mb-2 carousel-card-price">
                                ${prod.precio.toLocaleString('es-CL')}
                              </p>
                              <p className="card-text mb-3 flex-grow-1">{prod.desc}</p>
                              <button 
                                className="btn btn-success w-100 mt-auto" 
                                onClick={() => handleAgregarAlCarrito(prod.codigo)}
                              >
                                Agregar al carrito
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
      </main>
    </>
  );
}
