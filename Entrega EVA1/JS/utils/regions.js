
const REGIONES = {
  "Región Metropolitana": ["Santiago","Puente Alto","Maipú","La Florida"],
  "Valparaíso": ["Valparaíso","Viña del Mar","Quilpué"],
  "Biobío": ["Concepción","Talcahuano","Los Ángeles"]
};

function poblarRegiones(selectId){
  const sel = document.getElementById(selectId);
  if(!sel) return;
  sel.innerHTML = "";
  Object.keys(REGIONES).forEach(r=>{
    const opt = document.createElement("option");
    opt.value = r; opt.textContent = r;
    sel.appendChild(opt);
  });
}

function poblarComunas(regionSelectId, comunaSelectId){
  const regSel = document.getElementById(regionSelectId);
  const comSel = document.getElementById(comunaSelectId);
  if(!regSel || !comSel) return;
  const comunas = REGIONES[regSel.value] || [];
  comSel.innerHTML = "";
  comunas.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c;
    comSel.appendChild(opt);
  });
}
