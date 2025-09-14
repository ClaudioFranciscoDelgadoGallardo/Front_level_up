

document.addEventListener('DOMContentLoaded', function() {


  const tbody = document.querySelector('table tbody');
  function getAdminFijo() {
    return {
      run: '11111111K',
      nombre: 'Admin',
      apellidos: 'Principal',
      correo: 'admin@levelup.com',
      tipo: 'Administrador',
      fijo: true
    };
  }

  function getUsuariosConAdmin() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const adminFijo = getAdminFijo();
    return [adminFijo, ...usuarios.filter(u => u.run !== adminFijo.run)];
  }

  function renderUsuarios() {
    const listaFinal = getUsuariosConAdmin();
    tbody.innerHTML = '';
    if(listaFinal.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay usuarios registrados.</td></tr>';
    } else {
      listaFinal.forEach((u) => {
        tbody.innerHTML += `
          <tr>
            <td>${u.run}</td>
            <td>${u.nombre} ${u.apellidos}</td>
            <td>${u.correo}</td>
            <td>${u.tipo ? u.tipo : 'Cliente'}</td>
            <td class="d-flex gap-2">
              ${u.fijo ? '<button class="btn btn-secondary btn-sm" disabled>Admin</button>' : `<button class="btn btn-warning btn-sm btn-cambiar-pass" data-run="${u.run}">Cambiar contraseña</button><button class="btn btn-danger btn-sm btn-eliminar-usuario" data-run="${u.run}">Eliminar</button>`}
            </td>
          </tr>`;
      });
    }
    bindAccionesUsuarios();
  }

  function bindAccionesUsuarios() {
    document.querySelectorAll('.btn-cambiar-pass').forEach(btn => {
      btn.onclick = function() {
        const run = this.getAttribute('data-run');
        document.getElementById('nuevaPass').value = '';
        document.getElementById('confirmarPass').value = '';
        document.getElementById('msgPass').textContent = '';
        document.getElementById('formCambiarPass').setAttribute('data-run', run);
        const modal = new bootstrap.Modal(document.getElementById('modalCambiarPass'));
        modal.show();
      };
    });

    document.getElementById('formCambiarPass').onsubmit = function(e) {
      e.preventDefault();
      const run = this.getAttribute('data-run');
      const nueva = document.getElementById('nuevaPass').value;
      const confirmar = document.getElementById('confirmarPass').value;
      const msg = document.getElementById('msgPass');
      msg.classList.remove('text-success');
      msg.classList.add('text-danger');
      if(nueva.length < 6) {
        msg.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        return;
      }
      if(nueva !== confirmar) {
        msg.textContent = 'Las contraseñas no coinciden.';
        return;
      }
      // Solo modificar usuarios de localStorage, nunca el admin fijo
      let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const idx = usuarios.findIndex(u => u.run === run);
      if(idx !== -1) {
        usuarios[idx].password = nueva;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        msg.textContent = '';
        msg.classList.remove('text-danger');
        msg.classList.add('text-success');
        const modalPass = bootstrap.Modal.getInstance(document.getElementById('modalCambiarPass'));
        if(modalPass) modalPass.hide();
        setTimeout(() => {
          let modalExito = document.getElementById('modalExitoPass');
          if(modalExito) {
            const bsModal = new bootstrap.Modal(modalExito);
            bsModal.show();
            setTimeout(()=>{
              bsModal.hide();
              renderUsuarios();
            }, 1300);
          } else {
            renderUsuarios();
          }
        }, 400);
      }
    };

    document.querySelectorAll('.btn-eliminar-usuario').forEach(btn => {
      btn.onclick = function() {
        const run = this.getAttribute('data-run');
        // Prevenir eliminar admin fijo
        if(run === getAdminFijo().run) return;
        const modal = new bootstrap.Modal(document.getElementById('modalEliminarUsuario'));
        modal.show();
        const btnConfirmar = document.getElementById('btnConfirmarEliminar');
        btnConfirmar.onclick = function() {
          // Eliminar usuario de forma robusta
          let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
          console.log('Usuarios antes de eliminar:', usuarios);
          console.log('Eliminando RUN:', run);
          
          // Filtrar múltiples veces para asegurar eliminación completa
          let nuevosUsuarios = usuarios.filter(u => u.run !== run);
          nuevosUsuarios = nuevosUsuarios.filter(u => u.run && u.run.toString() !== run.toString());
          
          // Guardar y verificar eliminación
          localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
          
          // Verificación adicional: recargar y confirmar
          const verificacion = JSON.parse(localStorage.getItem('usuarios') || '[]');
          console.log('Usuarios después de eliminar:', verificacion);
          console.log('RUN eliminado correctamente:', !verificacion.some(u => u.run === run));
          
          // Forzar actualización del storage event para otras pestañas
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'usuarios',
            newValue: JSON.stringify(nuevosUsuarios),
            oldValue: JSON.stringify(usuarios)
          }));
          
          const modalEliminar = bootstrap.Modal.getInstance(document.getElementById('modalEliminarUsuario'));
          if(modalEliminar) modalEliminar.hide();
          setTimeout(renderUsuarios, 200);
        };
      };
    });
  }


  renderUsuarios();
});
