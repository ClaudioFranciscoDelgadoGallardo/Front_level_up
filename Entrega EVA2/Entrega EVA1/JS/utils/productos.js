// productos.js
// Renderiza los productos disponibles para comprar, incluyendo los creados por el admin

document.addEventListener('DOMContentLoaded', () => {
  renderProductosTienda();
});

function renderProductosTienda() {
  const contenedor = document.getElementById('listado-productos');
  contenedor.innerHTML = '';
  let productosLS = JSON.parse(localStorage.getItem('productos') || '[]');
  let imgs = JSON.parse(localStorage.getItem('imagenes_productos') || '{}');
  let productosBase = (window.PRODUCTOS || []).map(p => ({
    codigo: p.codigo,
    nombre: p.nombre,
    categoria: p.categoria,
    precio: p.precio,
    stock: p.stock,
    descripcion: p.desc,
    imagen: p.img
  }));
  // Unir sin duplicados (por código)
  let productos = [...productosBase, ...productosLS.filter(p => !productosBase.some(b => b.codigo === p.codigo))];

  if (productos.length === 0) {
    contenedor.innerHTML = '<div class="text-center text-secondary">No hay productos disponibles.</div>';
    return;
  }

  productos.forEach(prod => {
    let imgHtml = '';
    if (prod.imagen && prod.imagen.startsWith('local-img:')) {
      const codigo = prod.imagen.replace('local-img:', '');
      if (imgs[codigo]) {
        imgHtml = `<img src="${imgs[codigo]}" alt="${prod.nombre}" class="img-fluid rounded mb-2" style="max-width:120px;max-height:120px;">`;
      }
    } else if (prod.imagen) {
      imgHtml = `<img src="${prod.imagen}" alt="${prod.nombre}" class="img-fluid rounded mb-2" style="max-width:120px;max-height:120px;">`;
    }
    contenedor.innerHTML += `
      <div class="card bg-dark text-white border-success m-2 d-inline-block" style="width: 18rem; box-shadow: 0 0 8px #39ff14;">
        <div class="card-body d-flex flex-column align-items-center">
          ${imgHtml}
          <h5 class="card-title mt-2">${prod.nombre}</h5>
          <p class="card-text mb-1"><span class="text-success">${prod.categoria}</span></p>
          <p class="card-text mb-1">${prod.descripcion || ''}</p>
          <p class="card-text fw-bold mb-1">$${prod.precio.toLocaleString('es-CL')}</p>
          <div class="d-flex flex-column align-items-center w-100 mt-auto">
            <button class="btn btn-success mb-2 w-75" onclick="agregarAlCarrito('${prod.codigo}')">Agregar al carrito</button>
            <a class="btn btn-outline-success px-4 text-center" href="detalle.html?codigo=${encodeURIComponent(prod.codigo)}">Detalles</a>
          </div>
        </div>
      </div>
    `;
  });
}

window.agregarAlCarrito = function(codigo) {
  if (typeof addToCart === 'function') {
    addToCart(codigo, 1);
    // Buscar nombre real para el pop-up
    let productosLS = JSON.parse(localStorage.getItem('productos') || '[]');
    let productosBase = (window.PRODUCTOS || []).map(p => ({
      codigo: p.codigo,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      stock: p.stock,
      descripcion: p.desc,
      imagen: p.img
    }));
    let productos = [...productosBase, ...productosLS.filter(p => !productosBase.some(b => b.codigo === p.codigo))];
    const prod = productos.find(p => p.codigo === codigo);
    if (typeof mostrarPopUp === 'function' && prod) {
      mostrarPopUp(`¡${prod.nombre} agregado al carrito!`, 'success');
    }
    if (typeof renderMiniCart === 'function') renderMiniCart();
  } else {
    alert('Producto agregado al carrito');
  }
};
