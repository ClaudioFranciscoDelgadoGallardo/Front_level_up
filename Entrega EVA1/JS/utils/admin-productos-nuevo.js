// admin-productos-nuevo.js
// Lógica para manejar el formulario de nuevo producto, incluyendo imagen local y pop-up de éxito

document.addEventListener('DOMContentLoaded', () => {
  // Declarar variables solo una vez
  const params = new URLSearchParams(window.location.search);
  const codigoEditar = params.get('codigo');
  const form = document.getElementById('form-nuevo-producto');
  const inputImagen = document.getElementById('imagen');
  const inputImagenLocal = document.getElementById('imagenLocal');

  if (codigoEditar) {
    let productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const prod = productos.find(p => p.codigo === codigoEditar);
    if (prod) {
      form.codigo.value = prod.codigo;
      form.codigo.readOnly = true;
      form.nombre.value = prod.nombre;
      form.categoria.value = prod.categoria;
      form.precio.value = prod.precio;
      form.stock.value = prod.stock;
      form.descripcion.value = prod.descripcion || '';
      if (prod.imagen && prod.imagen.startsWith('http')) {
        inputImagen.value = prod.imagen;
      }
      // Si es local-img, no se puede previsualizar el file input
    }
    document.querySelector('h2.section-title').textContent = 'Editar Producto';
    form.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
  }

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

    let productos = JSON.parse(localStorage.getItem('productos') || '[]');

    if (!codigoEditar) {
      // Alta: Validar código único
      if (productos.some(p => p.codigo === codigo)) {
        mostrarPopUp('Ya existe un producto con ese código. Usa un código único.', 'error');
        return;
      }
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
    } else if (codigoEditar) {
      // Si no se cambia la imagen, mantener la anterior
      const prodAnt = productos.find(p => p.codigo === codigo);
      if (prodAnt) imagenFinal = prodAnt.imagen;
    }

    if (codigoEditar) {
      // Edición: actualizar producto existente
      productos = productos.map(p =>
        p.codigo === codigo ? { codigo, nombre, categoria, precio, stock, descripcion, imagen: imagenFinal } : p
      );
    } else {
      // Alta: agregar nuevo producto
      productos.push({ codigo, nombre, categoria, precio, stock, descripcion, imagen: imagenFinal });
    }
    localStorage.setItem('productos', JSON.stringify(productos));

    mostrarPopUp(codigoEditar ? '¡Producto actualizado correctamente!' : '¡Producto agregado correctamente!', 'success', () => {
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
        <div class="modal-content bg-dark text-white border border-success" style="box-shadow: 0 0 16px #39ff14;">
          <div class="modal-header border-bottom border-success" style="background:#111;">
            <h5 class="modal-title" id="modalPopUpTitle"></h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <p id="modalPopUpMensaje"></p>
          </div>
          <div class="modal-footer border-top border-success">
            <button type="button" class="btn btn-success" style="background:#39ff14;border:none;color:#111;" data-bs-dismiss="modal">Aceptar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  document.getElementById('modalPopUpMensaje').textContent = mensaje;
  document.getElementById('modalPopUpTitle').textContent = (tipo === 'error') ? 'Error' : 'Éxito';
  const bsModal = new bootstrap.Modal(modal);
  modal.addEventListener('hidden.bs.modal', function handler() {
    modal.removeEventListener('hidden.bs.modal', handler);
    if (callback) callback();
  });
  bsModal.show();
}
