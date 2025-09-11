
function $(sel){ return document.querySelector(sel); }

function renderProductos(containerId){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = "";
  PRODUCTOS.forEach(p=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
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
  const p = PRODUCTOS.find(x=>x.codigo===codigo);
  if(!p){ el.innerHTML = "<p>No se encontró el producto.</p>"; return; }
  el.innerHTML = `
    <article class="card">
      <h3>${p.nombre}</h3>
      <p class="label">${p.categoria}</p>
      <p>${p.desc||""}</p>
      <p><strong>Precio:</strong> $${p.precio.toLocaleString('es-CL')}</p>
      <p style="margin-top:.5rem">
        <label for="qty">Cantidad:</label>
        <input id="qty" type="number" min="1" value="1" style="max-width:100px"/>
        <button id="btnAdd" class="btn">Añadir al carrito</button>
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

  email.addEventListener("input", ()=> emailPermitido(email.value)?clearError(email):setError(email,"Usa @duoc.cl, @profesor.duoc.cl o @gmail.com"));
  pass.addEventListener("input", ()=> longitudEntre(pass.value,4,10)?clearError(pass):setError(pass,"Contraseña 4–10"));

  form.addEventListener("submit", e=>{
    e.preventDefault();
    if(!emailPermitido(email.value)) return setError(email,"Dominio no permitido");
    if(!longitudEntre(pass.value,4,10)) return setError(pass,"Contraseña 4–10");
    localStorage.setItem("usuarioActual", JSON.stringify({email: email.value.trim()}));
    alert("Inicio de sesión OK");
    location.href = "../index.html";
  });
}


function bindRegistroForm(){
  const form = document.getElementById("form-registro");
  if(!form) return;
  const run = document.getElementById("reg-run");
  const nombre = document.getElementById("reg-nombre");
  const apellidos = document.getElementById("reg-apellidos");
  const correo = document.getElementById("reg-correo");

  run.addEventListener("input", ()=> validarRUN(run.value)?clearError(run):setError(run,"RUN inválido (sin puntos ni guion)"));
  nombre.addEventListener("input", ()=> longitudEntre(nombre.value,1,50)?clearError(nombre):setError(nombre,"Máx 50"));
  apellidos.addEventListener("input", ()=> longitudEntre(apellidos.value,1,100)?clearError(apellidos):setError(apellidos,"Máx 100"));
  correo.addEventListener("input", ()=> emailPermitido(correo.value)?clearError(correo):setError(correo,"Dominios: duoc.cl/profesor.duoc.cl/gmail.com"));

  form.addEventListener("submit", e=>{
    e.preventDefault();
    if(!validarRUN(run.value)) return;
    if(!longitudEntre(nombre.value,1,50)) return;
    if(!longitudEntre(apellidos.value,1,100)) return;
    if(!emailPermitido(correo.value)) return;
    alert("Registro enviado");
    location.href = "login.html";
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
    alert("Mensaje enviado");
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  bindLoginForm();
  bindRegistroForm();
  bindContactoForm();
});
