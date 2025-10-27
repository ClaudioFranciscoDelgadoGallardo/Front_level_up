import { 
  validarStock, 
  agregarProductoAlCarrito 
} from '../utils/validaciones';

describe('Carrito Tests', function() {
  beforeEach(function() {
    localStorage.clear();
  });

  it('adds product to cart', function() {
    var producto = {
      codigo: 'PROD001',
      nombre: 'Test Product',
      precio: 1000,
      stock: 5
    };
    
    expect(agregarProductoAlCarrito(producto, 1)).toBe(true);
    var carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    expect(carrito.length).toBe(1);
  });

  it('validates stock before adding to cart', function() {
    var producto = {
      codigo: 'PROD001',
      nombre: 'Test Product',
      precio: 1000,
      stock: 2
    };
    
    expect(validarStock(producto, 3)).toBe(false);
    expect(validarStock(producto, 1)).toBe(true);
  });
});