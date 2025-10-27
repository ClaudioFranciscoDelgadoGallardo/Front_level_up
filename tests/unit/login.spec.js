describe('Login - Validaciones y flujo', function(){
  beforeEach(function(){
    // Limpiar DOM
    document.body.innerHTML = `
      <form id="form-login">
        <input id="login-email" />
        <input id="login-pass" />
      </form>
    `;
    // Limpiar localStorage simulado
    localStorage.clear();
  // Stubs de notificaciones para evitar errores
  window.mostrarNotificacion = function(){};
  window.mostrarNotificacionConCallback = function(){};
  });

  it('emailPermitido valida dominios permitidos', function(){
    expect(emailPermitido('alguien@duoc.cl')).toBeTrue();
    expect(emailPermitido('alguien@profesor.duoc.cl')).toBeTrue();
    expect(emailPermitido('alguien@gmail.com')).toBeTrue();
    expect(emailPermitido('alguien@levelup.com')).toBeTrue();
    expect(emailPermitido('alguien@otro.com')).toBeFalse();
    expect(emailPermitido('invalido')).toBeFalse();
  });

  it('bindLoginForm habilita acceso admin con credenciales fijas', function(){
    // Asegurar que la función existe y vincula eventos
    if(typeof bindLoginForm === 'function'){
      bindLoginForm();
    } else {
      // app.js registra en DOMContentLoaded; lo invocamos manualmente
      document.dispatchEvent(new Event('DOMContentLoaded'));
    }
    const form = document.getElementById('form-login');
    const email = document.getElementById('login-email');
    const pass = document.getElementById('login-pass');
    email.value = 'admin@levelup.com';
    pass.value = 'admin';

    // Espiar temporizadores para validar redirección diferida
    spyOn(window, 'setTimeout').and.callThrough();

    form.dispatchEvent(new Event('submit', { bubbles:true, cancelable:true }));

    // Verifica que se haya guardado el usuario admin en localStorage
    const u = JSON.parse(localStorage.getItem('usuarioActual')||'null');
    expect(u && u.email).toBe('admin@levelup.com');
    // Verifica que se haya intentado redirigir con un timeout ~800ms
    expect(window.setTimeout).toHaveBeenCalled();
  });

  it('rechaza usuario si no coincide correo/clave', function(){
    // Cargar un usuario distinto
    localStorage.setItem('usuarios', JSON.stringify([{ correo: 'x@gmail.com', nombre:'X', pass:'1234'}]));

    if(typeof bindLoginForm === 'function'){
      bindLoginForm();
    } else {
      document.dispatchEvent(new Event('DOMContentLoaded'));
    }
    const form = document.getElementById('form-login');
    const email = document.getElementById('login-email');
    const pass = document.getElementById('login-pass');
    email.value = 'z@gmail.com';
    pass.value = 'wrong';

    // Espiar notificación si existe
    if(typeof window.mostrarNotificacion === 'function') spyOn(window, 'mostrarNotificacion');

    const ev = new Event('submit', { bubbles:true, cancelable:true });
    form.dispatchEvent(ev);

  // No debe crearse usuarioActual en localStorage
  expect(localStorage.getItem('usuarioActual')).toBeNull();
  });
});
