

// Usar la función compartida de validators.js




document.addEventListener("DOMContentLoaded", ()=>{
  poblarRegiones("us-region");
  poblarComunas("us-region","us-comuna");
  document.getElementById("us-region").addEventListener("change",()=>poblarComunas("us-region","us-comuna"));

  const form = document.getElementById('form-usuario');
  const msg = document.getElementById('msg-usuario');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    msg.innerHTML = '';
    let run = document.getElementById('us-run').value.trim();
    let nombre = document.getElementById('us-nombre').value.trim();
    let apellidos = document.getElementById('us-apellidos').value.trim();
    let correo = document.getElementById('us-correo').value.trim();
    let region = document.getElementById('us-region').value;
    let comuna = document.getElementById('us-comuna').value;
    let direccion = document.getElementById('us-direccion').value.trim();
  let tipo = document.getElementById('us-tipo').value;
  let pass = document.getElementById('us-pass').value;
  let pass2 = document.getElementById('us-pass2').value;

    if(!run || !nombre || !apellidos || !correo || !region || !comuna || !direccion || !tipo || !pass || !pass2) {
      msg.innerHTML = '<span class="text-danger">Todos los campos son obligatorios.</span>';
      return;
    }
    if(pass.length < 6) {
      msg.innerHTML = '<span class="text-danger">La contraseña debe tener al menos 6 caracteres.</span>';
      return;
    }
    if(pass !== pass2) {
      msg.innerHTML = '<span class="text-danger">Las contraseñas no coinciden.</span>';
      return;
    }
    if(!validarRUN(run)) {
      msg.innerHTML = '<span class="text-danger">RUN inválido. Debe ser sin puntos ni guion y con dígito verificador correcto.</span>';
      return;
    }
    if(!emailPermitido(correo)) {
      msg.innerHTML = '<span class="text-danger">Correo electrónico inválido o dominio no permitido.</span>';
      return;
    }
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if(usuarios.some(u => u.run === run)) {
      msg.innerHTML = '<span class="text-danger">Ya existe un usuario con ese RUN.</span>';
      return;
    }
  usuarios.push({ run, nombre, apellidos, correo, region, comuna, direccion, tipo, password: pass });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    // Mostrar modal de éxito
    let modal = document.getElementById('modalExito');
    if(!modal){
      modal = document.createElement('div');
      modal.id = 'modalExito';
      modal.className = 'modal fade';
      modal.tabIndex = -1;
      modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-white">
            <div class="modal-header border-0">
              <h5 class="modal-title text-success">¡Usuario creado!</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">El usuario fue registrado exitosamente.</div>
          </div>
        </div>`;
      document.body.appendChild(modal);
    }
    let bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    form.reset();
    setTimeout(()=>{ window.location.href = 'admin-usuarios.html'; }, 1500);
  });
});
