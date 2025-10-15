// Inicialización de la página de detalle
// Llama a renderDetalle solo si existe la función y el contenedor

document.addEventListener('DOMContentLoaded', function() {
  if (typeof renderDetalle === 'function') {
    renderDetalle('detalle');
  }
});
