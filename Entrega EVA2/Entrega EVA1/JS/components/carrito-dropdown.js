// Script para el dropdown del carrito en productos.html
(function(){
  function quitarDelCarrito(codigo) {
    let cart = readCart();
    cart = cart.filter(x => x.codigo !== codigo);
    writeCart(cart);
    renderCarritoDropdown();
    renderMiniCart();
  }

  window.renderCarritoDropdown = function() {
    const carritoBody = document.getElementById('carrito-body');
    const {items, subtotal, desc, total} = calcularTotales();
    if(items.length === 0) {
      carritoBody.innerHTML = '<p class="text-center text-muted mb-0">No hay productos en el carrito.</p>';
      return;
    }
    carritoBody.innerHTML = `
      <ul class="list-group mb-2">
        ${items.map(it => `<li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
          <span>${it.nombre} <span class="badge bg-secondary ms-2">x${it.qty}</span></span>
          <span>$${it.subtotal.toLocaleString('es-CL')}</span>
          <button class="btn btn-sm btn-danger ms-2 quitar-item" data-codigo="${it.codigo}">&times;</button>
        </li>`).join('')}
      </ul>
      <div class="d-flex justify-content-between align-items-center mb-1">
        <span>Subtotal:</span>
        <span>$${subtotal.toLocaleString('es-CL')}</span>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-1">
        <span>Descuento:</span>
        <span>-$${desc.toLocaleString('es-CL')}</span>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold">Total:</span>
        <span class="fw-bold">$${total.toLocaleString('es-CL')}</span>
      </div>
      <button class="btn btn-success w-100 mt-2" id="btn-pagar">Pagar</button>
    `;
    carritoBody.querySelectorAll('.quitar-item').forEach(btn => {
      btn.addEventListener('click', function() {
        quitarDelCarrito(this.getAttribute('data-codigo'));
      });
    });
    const btnPagar = carritoBody.querySelector('#btn-pagar');
    if(btnPagar){
      btnPagar.addEventListener('click', function(){
        mostrarNotificacion('¡Gracias por tu compra! (Simulación de pago)', 'success');
        writeCart([]);
        renderCarritoDropdown();
        renderMiniCart();
      });
    }
  };

  function toggleCarritoDropdown(show) {
    const carritoDropdown = document.getElementById('carrito-dropdown');
    if(show) {
      renderCarritoDropdown();
      carritoDropdown.style.display = 'block';
    } else {
      carritoDropdown.style.display = 'none';
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    const carritoIcon = document.getElementById('carrito-icon');
    const carritoDropdown = document.getElementById('carrito-dropdown');
    const cerrarCarrito = document.getElementById('cerrar-carrito');
    if(carritoIcon && carritoDropdown && cerrarCarrito) {
      carritoIcon.addEventListener('click', function(e) {
        e.preventDefault();
        toggleCarritoDropdown(carritoDropdown.style.display !== 'block');
      });
      cerrarCarrito.addEventListener('click', function() {
        toggleCarritoDropdown(false);
      });
      document.addEventListener('click', function(e) {
        if (!carritoDropdown.contains(e.target) && e.target !== carritoIcon) {
          toggleCarritoDropdown(false);
        }
      });
    }
    // Actualizar dropdown al agregar productos
    const origAddToCart = window.addToCart;
    window.addToCart = function(codigo, qty=1) {
      origAddToCart(codigo, qty);
      renderCarritoDropdown();
      renderMiniCart();
    }
  });
})();