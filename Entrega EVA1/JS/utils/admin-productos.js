// admin-productos.js
// Renderiza la lista de productos y permite eliminarlos con confirmación
document.addEventListener('DOMContentLoaded', () => {
  // Llamamos a la función específica de este módulo para evitar colisiones con app.js
  try { renderAdminProductos(); } catch (e) { console.error('admin-productos init error', e); }
});

function renderAdminProductos() {
  const tbody = document.getElementById('tabla-productos');
  if (!tbody) return;
  tbody.innerHTML = '';
  let productosLS = JSON.parse(localStorage.getItem('productos') || '[]');
  let imgs = JSON.parse(localStorage.getItem('imagenes_productos') || '{}');
  let productosBase = (window.PRODUCTOS || []).map(p => ({
    codigo: p.codigo,
    nombre: p.nombre,
    categoria: p.categoria,
    precio: p.precio,
    stock: p.stock,
    descripcion: p.desc || p.descripcion,
    imagen: p.img || p.imagen
  }));
  let productos = [...productosBase, ...productosLS.filter(p => !productosBase.some(b => b.codigo === p.codigo))];
  if (productos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">No hay productos registrados.</td></tr>';
    return;
  }

  productos.forEach((prod, idx) => {
    const tr = document.createElement('tr');

    const tdCodigo = document.createElement('td'); tdCodigo.textContent = prod.codigo; tr.appendChild(tdCodigo);

    const tdNombre = document.createElement('td');
    if (prod.imagen && prod.imagen.startsWith('local-img:')) {
      const codigo = prod.imagen.replace('local-img:', '');
      if (imgs[codigo]) {
        const img = document.createElement('img'); img.src = imgs[codigo]; img.alt = prod.nombre; img.style.maxWidth = '48px'; img.style.maxHeight = '48px'; tdNombre.appendChild(img);
      }
    } else if (prod.imagen) {
      const img = document.createElement('img'); img.src = prod.imagen; img.alt = prod.nombre; img.style.maxWidth = '48px'; img.style.maxHeight = '48px'; tdNombre.appendChild(img);
    }
    const nombreText = document.createTextNode(' ' + prod.nombre);
    tdNombre.appendChild(nombreText);
    tr.appendChild(tdNombre);

    const tdCategoria = document.createElement('td'); tdCategoria.textContent = prod.categoria; tr.appendChild(tdCategoria);
    const tdPrecio = document.createElement('td'); tdPrecio.textContent = '$' + prod.precio.toLocaleString('es-CL'); tr.appendChild(tdPrecio);
    const tdStock = document.createElement('td'); tdStock.textContent = prod.stock; tr.appendChild(tdStock);

    const tdAcciones = document.createElement('td');
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn btn-danger btn-sm btn-eliminar-producto';
    btnEliminar.setAttribute('data-codigo', prod.codigo);
    btnEliminar.textContent = 'Eliminar';
    tdAcciones.appendChild(btnEliminar);
    const aEditar = document.createElement('a');
    aEditar.className = 'btn btn-primary btn-sm ms-2';
    aEditar.href = 'admin-productos-nuevo.html?codigo=' + encodeURIComponent(prod.codigo);
    aEditar.textContent = 'Editar';
    tdAcciones.appendChild(aEditar);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });
  // Asignar eventos a los botones eliminar
  document.querySelectorAll('.btn-eliminar-producto').forEach(btn => {
    btn.onclick = function() {
      const codigo = this.getAttribute('data-codigo');
      mostrarPopUpConfirm('¿Seguro que deseas eliminar este producto?', () => {
        let productos = JSON.parse(localStorage.getItem('productos') || '[]');
        productos = productos.filter(p => p.codigo !== codigo);
        localStorage.setItem('productos', JSON.stringify(productos));
        renderAdminProductos();
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
    renderAdminProductos();
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
