
function $(sel){ return document.querySelector(sel); }

function renderProductos(containerId){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = "";
  PRODUCTOS.forEach(p=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img || '../assets/imgs/placeholder.jpg'}" alt="${p.nombre}" class="producto-img mb-2" style="max-width:180px;max-height:120px;object-fit:contain;display:block;margin:auto;"/>
      <h3>${p.nombre}</h3>
      <p class="label">${p.categoria}</p>
      <p>Precio: $${p.precio.toLocaleString('es-CL')}</p>
      <a class="btn" href="detalle.html?codigo=${encodeURIComponent(p.codigo)}">Ver detalle</a>
      <button class="btn secondary" data-codigo="${p.codigo}">Añadir</button>
    `;
    el.appendChild(card);
  });
  el.querySelectorAll("button[data-codigo]").forEach(b=>{
    b.addEventListener("click", e=> addToCart(e.currentTarget.getAttribute("data-codigo"), 1));
  });
}

function renderDetalle(containerId){
  const el = document.getElementById(containerId);
  if(!el) return;
  const params = new URLSearchParams(location.search);
  const codigo = params.get("codigo");
  // Buscar en PRODUCTOS y en productos de localStorage
  let productosLS = [];
  try { productosLS = JSON.parse(localStorage.getItem('productos') || '[]'); } catch(_){}
  let p = PRODUCTOS.find(x=>x.codigo===codigo);
  if(!p) {
    p = productosLS.find(x=>x.codigo===codigo);
    // Adaptar estructura si es necesario
    if(p) {
      p = {
        ...p,
        img: p.imagen,
        desc: p.descripcion
      };
    }
  }
  if(!p){ el.innerHTML = "<p>No se encontró el producto.</p>"; return; }
  // Manejar imagen local (base64) si corresponde
  let imgSrc = p.img;
  if(imgSrc && imgSrc.startsWith('local-img:')) {
    const codigo = imgSrc.replace('local-img:', '');
    let imgs = {};
    try { imgs = JSON.parse(localStorage.getItem('imagenes_productos') || '{}'); } catch(_){}
    imgSrc = imgs[codigo] || '../assets/imgs/placeholder.jpg';
  }
  if(!imgSrc) imgSrc = '../assets/imgs/placeholder.jpg';
  el.innerHTML = `
    <article class="card">
      <img src="${imgSrc}" alt="${p.nombre}" class="producto-img mb-2" style="max-width:220px;max-height:160px;object-fit:contain;display:block;margin:auto;"/>
      <h3>${p.nombre}</h3>
      <p class="label">${p.categoria}</p>
      <p>${p.desc||""}</p>
      <p><strong>Precio:</strong> $${p.precio.toLocaleString('es-CL')}</p>
      <p style="margin-top:.5rem">
        <label for="qty">Cantidad:</label>
        <input id="qty" type="number" min="1" value="1" style="max-width:100px"/>
        <button id="btnAdd" class="btn btn-outline-success px-4">Añadir al carrito</button>
      </p>
    </article>
  `;
  $("#btnAdd").addEventListener("click", ()=>{
    const q = parseInt($("#qty").value,10)||1;
    addToCart(p.codigo, q);
  });
}


function bindLoginForm(){
  const form = document.getElementById("form-login");
  if(!form) return;
  const email = document.getElementById("login-email");
  const pass = document.getElementById("login-pass");

  email.addEventListener("input", ()=> emailPermitido(email.value)?clearError(email):setError(email,"Usa @duoc.cl, @profesor.duoc.cl, @gmail.com o @levelup.com"));
  pass.addEventListener("input", ()=> longitudEntre(pass.value,4,10)?clearError(pass):setError(pass,"Contraseña 4–10"));

  form.addEventListener("submit", e=>{
    e.preventDefault();
    if(!emailPermitido(email.value)) {
      setError(email,"Dominio no permitido");
      mostrarNotificacion("Correo no válido. Usa un correo permitido.", "error");
      return;
    }
    if(!longitudEntre(pass.value,4,20)) {
      setError(pass,"Contraseña 4–20");
      mostrarNotificacion("La contraseña debe tener entre 4 y 20 caracteres.", "error");
      return;
    }
    // Acceso admin
    if(email.value.trim() === "admin@levelup.com" && pass.value === "admin") {
      localStorage.setItem("usuarioActual", JSON.stringify({email: "admin@levelup.com", nombre: "Administrador"}));
      mostrarNotificacion("Bienvenido, administrador", "success");
      setTimeout(()=>{ location.href = "admin-home.html"; }, 800);
      return;
    }
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.correo === email.value.trim() && (u.pass === pass.value || u.password === pass.value));
    if(!usuario) {
      mostrarNotificacion("Usuario o contraseña incorrectos", "error");
      return;
    }
    localStorage.setItem("usuarioActual", JSON.stringify({email: usuario.correo, nombre: usuario.nombre, tipo: usuario.tipo||''}));
    mostrarNotificacion("Inicio de sesión OK", "success");
    setTimeout(()=>{
      if((usuario.tipo||'').toLowerCase() === 'administrador') {
        location.href = "admin-home.html";
      } else {
        location.href = "./index.html";
      }
    }, 800);
  });
}


function bindRegistroForm(){
  const form = document.getElementById("form-registro");
  if(!form) return;
  const run = document.getElementById("reg-run");
  const nombre = document.getElementById("reg-nombre");
  const apellidos = document.getElementById("reg-apellidos");
  const correo = document.getElementById("reg-correo");
  const pass = document.getElementById("reg-pass");

  run.addEventListener("input", ()=> validarRUN(run.value)?clearError(run):setError(run,"RUN inválido (sin puntos ni guion)"));
  nombre.addEventListener("input", ()=> longitudEntre(nombre.value,1,50)?clearError(nombre):setError(nombre,"Máx 50"));
  apellidos.addEventListener("input", ()=> longitudEntre(apellidos.value,1,100)?clearError(apellidos):setError(apellidos,"Máx 100"));
  correo.addEventListener("input", ()=> emailPermitido(correo.value)?clearError(correo):setError(correo,"Dominios: duoc.cl/profesor.duoc.cl/gmail.com"));
  pass.addEventListener("input", ()=> longitudEntre(pass.value,4,20)?clearError(pass):setError(pass,"Contraseña 4–20"));

  form.addEventListener("submit", e=>{
    e.preventDefault();
    if(!validarRUN(run.value)) {
      setError(run, "RUN inválido (sin puntos ni guion)");
      mostrarNotificacion("RUN inválido (sin puntos ni guion)", "error");
      return;
    }
    if(!longitudEntre(nombre.value,1,50)) {
      setError(nombre, "Máx 50");
      mostrarNotificacion("El nombre debe tener entre 1 y 50 caracteres.", "error");
      return;
    }
    if(!longitudEntre(apellidos.value,1,100)) {
      setError(apellidos, "Máx 100");
      mostrarNotificacion("Los apellidos deben tener entre 1 y 100 caracteres.", "error");
      return;
    }
    if(!emailPermitido(correo.value)) {
      setError(correo, "Dominios: duoc.cl/profesor.duoc.cl/gmail.com");
      mostrarNotificacion("Correo no válido. Usa un correo permitido.", "error");
      return;
    }
    if(!longitudEntre(pass.value,4,20)) {
      setError(pass, "Contraseña 4–20");
      mostrarNotificacion("La contraseña debe tener entre 4 y 20 caracteres.", "error");
      return;
    }
    // Guardar usuario en localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if(usuarios.some(u => u.correo === correo.value.trim())) {
      mostrarNotificacion('El correo ya está registrado', 'error');
      return;
    }
    if(usuarios.some(u => u.run === run.value.trim())) {
      setError(run, 'RUN ya registrado');
      mostrarNotificacion('El RUN ya está registrado', 'error');
      return;
    }
    usuarios.push({
      run: run.value.trim(),
      nombre: nombre.value.trim(),
      apellidos: apellidos.value.trim(),
      correo: correo.value.trim(),
      pass: pass.value
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    // Pop-up con callback para redirigir
    mostrarNotificacionConCallback('Registrado correctamente', 'success', 0, function(){
      location.href = 'login.html';
    });
  });
}


function bindContactoForm(){
  const form = document.getElementById("form-contacto");
  if(!form) return;
  const nombre = document.getElementById("ct-nombre");
  const correo = document.getElementById("ct-correo");
  const comentario = document.getElementById("ct-comentario");

  nombre.addEventListener("input", ()=> longitudEntre(nombre.value,1,100)?clearError(nombre):setError(nombre,"Máx 100"));
  correo.addEventListener("input", ()=> emailPermitido(correo.value)?clearError(correo):setError(correo,"Dominio no permitido"));
  comentario.addEventListener("input", ()=> longitudEntre(comentario.value,1,500)?clearError(comentario):setError(comentario,"Máx 500"));

  form.addEventListener("submit", e=>{
    e.preventDefault();
    if(!longitudEntre(nombre.value,1,100)) return;
    if(!emailPermitido(correo.value)) return;
    if(!longitudEntre(comentario.value,1,500)) return;
    mostrarNotificacion("Mensaje enviado", "success");
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  bindLoginForm();
  bindRegistroForm();
  bindContactoForm();
  if(document.getElementById("listado-productos")) {
    renderProductos("listado-productos");
    if(typeof renderMiniCart === 'function') renderMiniCart();
  }
});
