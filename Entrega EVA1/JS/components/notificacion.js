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
    noti.style.padding = '14px 20px';
    noti.style.borderRadius = '10px';
    noti.style.background = '#111';
    noti.style.color = '#39FF14';
    noti.style.border = '2px solid #39FF14';
    noti.style.boxShadow = '0 0 18px 2px #39FF14, 0 0 32px 4px #111 inset';
    noti.style.textShadow = '0 0 8px #39FF14, 0 0 2px #39FF14';
    noti.style.fontSize = '1rem';
    noti.style.opacity = '0.98';
    noti.style.transition = 'opacity 0.25s, transform 0.18s';
    noti.style.display = 'flex';
    noti.style.alignItems = 'center';
    noti.style.gap = '0.75rem';

    const span = document.createElement('span');
    span.textContent = mensaje;
    noti.appendChild(span);

    const btn = document.createElement('button');
    btn.textContent = 'Genial!';
    btn.setAttribute('aria-label','Aceptar notificación');
    btn.style.marginLeft = '1rem';
    // neon button look
    btn.style.background = '#111';
    btn.style.color = '#39FF14';
    btn.style.border = '2px solid #39FF14';
    btn.style.borderRadius = '8px';
    btn.style.padding = '8px 18px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = '800';
    btn.style.boxShadow = '0 0 12px 2px #39FF14, 0 0 18px 2px #111 inset';
    btn.style.textShadow = '0 0 8px #39FF14';
    btn.addEventListener('click', () => {
        // Si estamos en contacto.html, navega directo a index.html en la raíz del proyecto
        try {
            const isContacto = window.location.pathname.includes('contacto.html');
            if (typeof callback === 'function') {
                callback();
                        } else if (isContacto) {
                                // Calcula la ruta base y navega a index.html en la raíz del proyecto
                                try {
                                    var url = window.location.href;
                                    var parts = url.split('/');
                                    parts[parts.length-1] = 'index.html';
                                    var target = parts.join('/');
                                    window.location.assign(target);
                                } catch(e) {
                                    window.location.assign('../index.html');
                                }
            } else if (window && window.__contactRedirectTarget) {
                try { window.location.assign(window.__contactRedirectTarget); } catch(e){ window.location.href = window.__contactRedirectTarget; }
            }
        } catch(e) { /* ignore */ }
        noti.style.opacity = '0';
        setTimeout(() => {
            try { noti.remove(); } catch(e){}
            try { if (contenedor && contenedor.childElementCount === 0) contenedor.remove(); } catch(e){}
        }, 300);
    });
    noti.appendChild(btn);

    // Focus the button so users can press Enter to accept and trigger callback
    setTimeout(() => { try { btn.focus(); } catch(e){} }, 50);

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
        noti.style.padding = '14px 20px';
        noti.style.borderRadius = '10px';
        noti.style.background = tipo === 'success'
            ? 'linear-gradient(90deg, rgba(57,255,20,0.18), rgba(30,144,255,0.08))'
            : tipo === 'error'
            ? 'linear-gradient(90deg, rgba(255,50,80,0.14), rgba(255,20,60,0.06))'
            : 'linear-gradient(90deg, rgba(30,144,255,0.12), rgba(57,255,20,0.06))';
        noti.style.color = '#eaffea';
        noti.style.boxShadow = '0 8px 28px rgba(30,144,255,0.08)';
        noti.style.fontSize = '1rem';
        noti.style.opacity = '0.98';
        noti.style.transition = 'opacity 0.25s, transform 0.18s';

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
