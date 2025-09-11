// Script para mostrar/ocultar el carrito desplegable (corregido)
document.addEventListener('DOMContentLoaded', function() {
    const carritoIcon = document.getElementById('carrito-icon');
    const carritoDropdown = document.getElementById('carrito-dropdown');
    const cerrarCarrito = document.getElementById('cerrar-carrito');

    function isVisible(el) {
        return el && (el.style.display === 'block' || (el.style.display !== 'none' && window.getComputedStyle(el).display === 'block'));
    }

    if (carritoIcon && carritoDropdown && cerrarCarrito) {
        carritoIcon.addEventListener('click', function(e) {
            e.preventDefault();
            if (!isVisible(carritoDropdown)) {
                carritoDropdown.style.display = 'block';
            } else {
                carritoDropdown.style.display = 'none';
            }
        });
        cerrarCarrito.addEventListener('click', function() {
            carritoDropdown.style.display = 'none';
        });
        document.addEventListener('click', function(e) {
            if (!carritoDropdown.contains(e.target) && e.target !== carritoIcon) {
                carritoDropdown.style.display = 'none';
            }
        });
    }
});