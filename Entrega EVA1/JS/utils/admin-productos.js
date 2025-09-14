// admin-productos.js
// Renderiza la lista de productos y permite eliminarlos con confirmación

document.addEventListener('DOMContentLoaded', () => {
  renderProductos();
});

function renderProductos() {
  const tbody = document.getElementById('tabla-productos');
  tbody.innerHTML = '';
  let productos = JSON.parse(localStorage.getItem('productos') || '[]');
  let imgs = JSON.parse(localStorage.getItem('imagenes_productos') || '{}');

  if (productos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-secondary">No hay productos registrados.</td></tr>';
    return;
  }

  productos.forEach((prod, idx) => {
    let imgHtml = '';
    if (prod.imagen && prod.imagen.startsWith('local-img:')) {
      const codigo = prod.imagen.replace('local-img:', '');
      if (imgs[codigo]) {
        imgHtml = `<img src="${imgs[codigo]}" alt="${prod.nombre}" style="max-width:48px;max-height:48px;">`;
      }
    } else if (prod.imagen) {
      imgHtml = `<img src="${prod.imagen}" alt="${prod.nombre}" style="max-width:48px;max-height:48px;">`;
    }
    tbody.innerHTML += `
      <tr>
        <td>${prod.codigo}</td>
        <td>${imgHtml} ${prod.nombre}</td>
        <td>${prod.categoria}</td>
        <td>$${prod.precio.toLocaleString('es-CL')}</td>
        <td>${prod.stock}</td>
        <td>
          <button class="btn btn-danger btn-sm btn-eliminar-producto" data-codigo="${prod.codigo}">Eliminar</button>
        </td>
      </tr>
    `;
  });
  // Asignar eventos a los botones eliminar
  document.querySelectorAll('.btn-eliminar-producto').forEach(btn => {
    btn.onclick = function() {
      const codigo = this.getAttribute('data-codigo');
      mostrarPopUpConfirm('¿Seguro que deseas eliminar este producto?', () => {
        let productos = JSON.parse(localStorage.getItem('productos') || '[]');
        productos = productos.filter(p => p.codigo !== codigo);
        localStorage.setItem('productos', JSON.stringify(productos));
        renderProductos();
        mostrarPopUp('Producto eliminado correctamente.', 'success');
      });
    };
  });
}

window.eliminarProducto = function(codigo) {
  mostrarPopUpConfirm('¿Seguro que deseas eliminar este producto?', () => {
    let productos = JSON.parse(localStorage.getItem('productos') || '[]');
    productos = productos.filter(p => p.codigo !== codigo);
    localStorage.setItem('productos', JSON.stringify(productos));
    renderProductos();
    mostrarPopUp('Producto eliminado correctamente.', 'success');
  });
};

function mostrarPopUpConfirm(mensaje, onConfirm) {
  let modal = document.getElementById('modalPopUpConfirm');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'modalPopUpConfirm';
    modal.tabIndex = -1;
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white border border-success" style="box-shadow: 0 0 16px #39ff14;">
          <div class="modal-header border-bottom border-success">
            <h5 class="modal-title">Confirmar</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <p id="modalPopUpConfirmMensaje"></p>
          </div>
          <div class="modal-footer border-top border-success">
            <button type="button" class="btn btn-outline-success" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-success" id="btnConfirmarEliminar" style="background:#39ff14;border:none;color:#111;">Eliminar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  document.getElementById('modalPopUpConfirmMensaje').textContent = mensaje;
  const bsModal = new bootstrap.Modal(modal);
  modal.querySelector('#btnConfirmarEliminar').onclick = function() {
    bsModal.hide();
    if (onConfirm) onConfirm();
  };
  bsModal.show();
}

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
