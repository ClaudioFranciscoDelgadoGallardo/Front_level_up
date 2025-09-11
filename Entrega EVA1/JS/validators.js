
const EMAIL_DOMINIOS = ["duoc.cl","profesor.duoc.cl","gmail.com"];

function emailPermitido(email){
  const e = (email||"").toLowerCase().trim();
  const m = e.match(/^[^\s@]+@([^\s@]+\.[^\s@]+)$/);
  if(!m) return false;
  return EMAIL_DOMINIOS.some(dom => e.endsWith("@"+dom));
}

function validarRUN(run){
  const clean = (run||"").toUpperCase().trim();
  if(!/^[0-9K]{7,9}$/.test(clean)) return false;
  const body = clean.slice(0,-1), dv = clean.slice(-1);
  let sum = 0, mul = 2;
  for(let i=body.length-1;i>=0;i--){
    sum += parseInt(body[i],10) * mul;
    mul = mul===7 ? 2 : mul+1;
  }
  const res = 11 - (sum % 11);
  const dvCalc = res===11 ? '0' : res===10 ? 'K' : String(res);
  return dv === dvCalc;
}

function longitudEntre(v,min,max){
  const s = (v||"").trim();
  if(min!=null && s.length < min) return false;
  if(max!=null && s.length > max) return false;
  return true;
}
function esEnteroNoNeg(v){ return Number.isInteger(+v) && +v>=0; }
function esPrecio(v){ return !isNaN(+v) && +v>=0; }


function setError(el, msg){
  let span = document.getElementById((el.id||"") + "__err");
  if(!span){
    span = document.createElement("div");
    span.id = (el.id||"") + "__err";
    span.className = "msg-error";
    el.insertAdjacentElement("afterend", span);
  }
  span.textContent = msg||"";
}
function clearError(el){ setError(el,""); }
