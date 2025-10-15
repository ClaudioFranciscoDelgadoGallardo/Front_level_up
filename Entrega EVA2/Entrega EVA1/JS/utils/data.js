
const CATEGORIAS = [
  "Juegos de Mesa","Accesorios","Consolas","Computadores Gamers",
  "Sillas Gamers","Mouse","Mousepad","Poleras Personalizadas","Polerones Gamers Personalizados"
];

const PRODUCTOS = [
  {
    codigo: "JM001",
    categoria: "Juegos de Mesa",
    nombre: "Catan",
    precio: 29990,
    stock: 10,
    desc: "Juego clásico de estrategia.",
    img: "../assets/imgs/destacado1.png"
  },
  {
    codigo: "AC001",
    categoria: "Accesorios",
    nombre: "Control Xbox Series X",
    precio: 59990,
    stock: 15,
    desc: "Control inalámbrico.",
    img: "../assets/imgs/destacado2.png"
  },
  {
    codigo: "CO001",
    categoria: "Consolas",
    nombre: "PlayStation 5",
    precio: 549990,
    stock: 5,
    desc: "Consola de última generación.",
    img: "../assets/imgs/destacado3.png"
  }
];
 
window.PRODUCTOS = PRODUCTOS;
