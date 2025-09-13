// Registro de usuario desde formulario de registro.html
// Guarda usuarios como tipo 'Cliente' en localStorage y previene duplicados

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-registro');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const run = document.getElementById('reg-run').value.trim();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const apellidos = document.getElementById('reg-apellidos').value.trim();
    const correo = document.getElementById('reg-correo').value.trim();
    const password = document.getElementById('reg-pass').value;
    const fnac = document.getElementById('reg-fnac').value;
    // Validaciones mínimas (puedes agregar más)
    if (!run || !nombre || !apellidos || !correo || !password) {
      if(typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('Todos los campos son obligatorios.', 'error');
      }
      return;
    }
    // Validaciones de duplicados - refrescar datos antes de validar
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    console.log('Usuarios actuales para validación:', usuarios);
    console.log('Validando RUN:', run);
    
    // Verificar RUN con múltiples comparaciones para mayor robustez
    const runExiste = usuarios.some(u => u.run === run || u.run?.toString() === run.toString());
    if (runExiste) {
      console.log('RUN ya existe:', usuarios.filter(u => u.run === run));
      if(typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('Ya existe un usuario con ese RUN.', 'error');
      }
      return;
    }
    
    // Verificar correo
    if (usuarios.some(u => u.correo === correo)) {
      if(typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('Ya existe un usuario con ese correo.', 'error');
      }
      return;
    }
    if (typeof emailPermitido === 'function' && !emailPermitido(correo)) {
      if(typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('El correo no tiene un dominio permitido.', 'error');
      }
      return;
    }
    usuarios.push({
      run,
      nombre,
      apellidos,
      correo,
      password,
      fnac,
      tipo: 'Cliente'
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    // Mensaje de éxito y redirección
    if(typeof mostrarNotificacionConCallback === 'function') {
      mostrarNotificacionConCallback('¡Usuario registrado exitosamente!', 'success', 0, function(){
        window.location.href = 'login.html';
      });
    } else {
      window.location.href = 'login.html';
    }
  });
});
