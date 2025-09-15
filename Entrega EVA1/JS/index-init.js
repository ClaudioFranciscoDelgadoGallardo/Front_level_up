// Inicialización de la página de inicio (index.html)
// Inicialización de la página de inicio (index.html)
document.addEventListener('DOMContentLoaded', function() {
  const productos = window.PRODUCTOS || [];
  const inner = document.getElementById('carousel-productos-inner');
  if (!inner) return;
  if (!productos.length) {
  inner.innerHTML = '<div class="text-center py-5" style="color:#fff;font-size:1.3rem;">No hay productos para mostrar en el carrusel.</div>';
    return;
  }
  inner.innerHTML = productos.map((prod, idx) => `
    <div class="carousel-item${idx === 0 ? ' active' : ''}">
      <div class="d-flex flex-column align-items-center justify-content-center p-4" style="min-height:340px;">
        <img src="${prod.img || '../assets/imgs/placeholder.jpg'}" alt="${prod.nombre}" class="mb-3 rounded" style="max-width:220px;max-height:160px;object-fit:contain;background:#222;">
        <h5 class="text-neon mb-2">${prod.nombre}</h5>
        <span class="badge bg-secondary mb-2">${prod.categoria}</span>
        <span class="fw-bold text-success mb-2">$${prod.precio.toLocaleString('es-CL')}</span>
        <p class="mb-2 text-center" style="max-width:320px">${prod.desc || ''}</p>
  <button class="btn btn-success" onclick="addToCart('${prod.codigo}')">Agregar al carrito</button>
      </div>
    </div>
  `).join('');
  // No renderizar tarjetas de destacados en la home — se deja solo el carrusel
});
