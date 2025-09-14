// admin-productos-nuevo.js
// Lógica para manejar el formulario de nuevo producto, incluyendo imagen local y pop-up de éxito

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-nuevo-producto');
  const inputImagen = document.getElementById('imagen');
  const inputImagenLocal = document.getElementById('imagenLocal');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Obtener datos del formulario
    const codigo = form.codigo.value.trim();
    const nombre = form.nombre.value.trim();
    const categoria = form.categoria.value;
    const precio = parseInt(form.precio.value, 10);
    const stock = parseInt(form.stock.value, 10);
    const descripcion = form.descripcion.value.trim();
    let imagenUrl = inputImagen.value.trim();
    let imagenLocalFile = inputImagenLocal.files[0];
    let imagenFinal = '';

    // Validación mínima
    if (!codigo || !nombre || !categoria || isNaN(precio) || isNaN(stock)) {
      mostrarPopUp('Por favor, completa todos los campos obligatorios.', 'error');
      return;
    }

    // Validar código único
    let productos = JSON.parse(localStorage.getItem('productos') || '[]');
    if (productos.some(p => p.codigo === codigo)) {
      mostrarPopUp('Ya existe un producto con ese código. Usa un código único.', 'error');
      return;
    }

    // Si se seleccionó imagen local, la guardamos en localStorage simulando assets/imgs
    if (imagenLocalFile) {
      imagenFinal = await fileToBase64(imagenLocalFile);
      let imgs = JSON.parse(localStorage.getItem('imagenes_productos') || '{}');
      imgs[codigo] = imagenFinal;
      localStorage.setItem('imagenes_productos', JSON.stringify(imgs));
      imagenFinal = `local-img:${codigo}`;
    } else if (imagenUrl) {
      imagenFinal = imagenUrl;
    }

    // Guardar producto en localStorage
    productos.push({ codigo, nombre, categoria, precio, stock, descripcion, imagen: imagenFinal });
    localStorage.setItem('productos', JSON.stringify(productos));

    mostrarPopUp('¡Producto agregado correctamente!', 'success', () => {
      window.location.href = 'admin-productos.html';
    });
  });
});

// Convierte un archivo a base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Muestra un pop-up de éxito/error usando Bootstrap Modal
function mostrarPopUp(mensaje, tipo = 'success', callback) {
  let modal = document.getElementById('modalPopUp');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'modalPopUp';
    modal.tabIndex = -1;
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header ${tipo === 'success' ? 'bg-success' : 'bg-danger'} text-white">
            <h5 class="modal-title">${tipo === 'success' ? 'Éxito' : 'Error'}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <p id="modalPopUpMensaje"></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-${tipo === 'success' ? 'success' : 'danger'}" data-bs-dismiss="modal">Aceptar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  document.getElementById('modalPopUpMensaje').textContent = mensaje;
  const bsModal = new bootstrap.Modal(modal);
  modal.addEventListener('hidden.bs.modal', function handler() {
    modal.removeEventListener('hidden.bs.modal', handler);
    if (callback) callback();
  });
  bsModal.show();
}
