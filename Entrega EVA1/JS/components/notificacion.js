// Notificación con botón OK y callback
function mostrarNotificacionConCallback(mensaje, tipo = 'info', duracion = 0, callback) {
    let contenedor = document.getElementById('contenedor-notificaciones');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'contenedor-notificaciones';
        contenedor.style.position = 'fixed';
        contenedor.style.top = '20px';
        contenedor.style.right = '20px';
        contenedor.style.zIndex = '9999';
        contenedor.style.display = 'flex';
        contenedor.style.flexDirection = 'column';
        contenedor.style.gap = '10px';
        document.body.appendChild(contenedor);
    }

    const noti = document.createElement('div');
    noti.className = `notificacion-pop notificacion-${tipo}`;
    noti.style.padding = '16px 24px';
    noti.style.borderRadius = '8px';
    noti.style.background = tipo === 'success' ? '#4caf50' : tipo === 'error' ? '#f44336' : '#2196f3';
    noti.style.color = 'white';
    noti.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    noti.style.fontSize = '1rem';
    noti.style.opacity = '0.95';
    noti.style.transition = 'opacity 0.3s';
    noti.style.display = 'flex';
    noti.style.alignItems = 'center';
    noti.style.gap = '1rem';

    const span = document.createElement('span');
    span.textContent = mensaje;
    noti.appendChild(span);

    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.style.marginLeft = '1rem';
    btn.style.background = '#fff';
    btn.style.color = noti.style.background;
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.padding = '4px 16px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = 'bold';
    btn.addEventListener('click', () => {
        noti.style.opacity = '0';
        setTimeout(() => {
            noti.remove();
            if (contenedor.childElementCount === 0) contenedor.remove();
            if (typeof callback === 'function') callback();
        }, 300);
    });
    noti.appendChild(btn);

    contenedor.appendChild(noti);
    if (duracion > 0) {
        setTimeout(() => {
            if (document.body.contains(noti)) btn.click();
        }, duracion);
    }
}
typeof window !== 'undefined' && (window.mostrarNotificacionConCallback = mostrarNotificacionConCallback);
// Componente de notificación tipo pop-up para la página
// Uso: mostrarNotificacion('Mensaje', 'success'|'error'|'info', duraciónEnMs)

function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
    let contenedor = document.getElementById('contenedor-notificaciones');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'contenedor-notificaciones';
        contenedor.style.position = 'fixed';
        contenedor.style.top = '20px';
        contenedor.style.right = '20px';
        contenedor.style.zIndex = '9999';
        contenedor.style.display = 'flex';
        contenedor.style.flexDirection = 'column';
        contenedor.style.gap = '10px';
        document.body.appendChild(contenedor);
    }

    const noti = document.createElement('div');
    noti.className = `notificacion-pop notificacion-${tipo}`;
    noti.textContent = mensaje;
    noti.style.padding = '16px 24px';
    noti.style.borderRadius = '8px';
    noti.style.background = tipo === 'success' ? '#4caf50' : tipo === 'error' ? '#f44336' : '#2196f3';
    noti.style.color = 'white';
    noti.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    noti.style.fontSize = '1rem';
    noti.style.opacity = '0.95';
    noti.style.transition = 'opacity 0.3s';

    contenedor.appendChild(noti);

    setTimeout(() => {
        noti.style.opacity = '0';
        setTimeout(() => {
            noti.remove();
            if (contenedor.childElementCount === 0) contenedor.remove();
        }, 300);
    }, duracion);
}

// Exportar para uso global
typeof window !== 'undefined' && (window.mostrarNotificacion = mostrarNotificacion);
