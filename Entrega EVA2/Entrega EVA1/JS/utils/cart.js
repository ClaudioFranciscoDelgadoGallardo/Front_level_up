
const KEY_CART = "carrito";
const KEY_USER = "usuarioActual"; 

function readCart(){ try{ return JSON.parse(localStorage.getItem(KEY_CART)||"[]"); }catch(_){ return []; } }
function writeCart(cart){ localStorage.setItem(KEY_CART, JSON.stringify(cart||[])); }

function addToCart(codigo, qty=1){
  // Buscar en PRODUCTOS y en productos de localStorage
  let productosLS = [];
  try { productosLS = JSON.parse(localStorage.getItem('productos') || '[]'); } catch(_){}
  let p = PRODUCTOS.find(x=>x.codigo===codigo);
  if(!p) {
    p = productosLS.find(x=>x.codigo===codigo);
    // Si el producto de localStorage tiene diferente estructura, adaptarlo
    if(p && !p.precio && p.precio !== 0) p.precio = 0;
  }
  if(!p) return;
  const cart = readCart();
  const idx = cart.findIndex(x=>x.codigo===codigo);
  const maxQty = Math.max(0, p.stock || 0);
  if(idx>=0){ cart[idx].qty = Math.max(1, Math.min(cart[idx].qty + qty, maxQty||qty)); }
  else { cart.push({codigo:codigo, qty: Math.max(1, Math.min(qty, maxQty||qty)), precio: p.precio}); }
  writeCart(cart);
  renderMiniCart();
}

function calcularTotales(){
  const cart = readCart();
  const items = cart.map(it => {
    const p = PRODUCTOS.find(x=>x.codigo===it.codigo);
    const precioUnit = (p?.precio ?? it.precio);
    const subtotal = precioUnit * it.qty;
    return {...it, nombre:p?.nombre||it.codigo, precioUnit, subtotal};
  });
  const subtotal = items.reduce((a,b)=>a+b.subtotal,0);
  
  let desc = 0;
  try{
    const user = JSON.parse(localStorage.getItem(KEY_USER)||"null");
    const email = user?.email?.toLowerCase()||"";
    if(email.endsWith("@duoc.cl") || email.endsWith("@profesor.duoc.cl")) desc = subtotal * 0.20;
  }catch(_){}
  const total = Math.max(0, subtotal - desc);
  return {items, subtotal, desc, total};
}

function renderMiniCart(){
  const el = document.getElementById("cart-mini");
  if(!el) return;
  const {items, total} = calcularTotales();
  const cantidad = items.reduce((a,b)=>a+b.qty,0);
  el.textContent = `Carrito: ${cantidad} ítem(s) | Total: $${total.toLocaleString('es-CL')}`;
}

document.addEventListener("DOMContentLoaded", renderMiniCart);
