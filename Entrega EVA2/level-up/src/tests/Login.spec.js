import { 
  validarEmailVacio, 
  validarFormatoEmail, 
  validarPasswordVacio, 
  validarCredenciales 
} from '../utils/validaciones';

describe('Login Component Tests', function() {
  beforeEach(function() {
    localStorage.clear();
  });

  it('validates empty email', function() {
    var formData = {
      email: '',
      password: 'test123'
    };
    expect(validarEmailVacio(formData.email)).toBe(false);
  });

  it('validates email format', function() {
    var email = 'invalid-email';
    expect(validarFormatoEmail(email)).toBe(false);
    
    email = 'valid@email.com';
    expect(validarFormatoEmail(email)).toBe(true);
  });

  it('validates empty password', function() {
    var formData = {
      email: 'test@email.com',
      password: ''
    };
    expect(validarPasswordVacio(formData.password)).toBe(false);
  });

  it('validates user credentials', function() {
    var usuarios = [
      {
        correo: 'test@email.com',
        password: 'test123'
      }
    ];
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    var credentials = {
      email: 'test@email.com',
      password: 'test123'
    };
    expect(validarCredenciales(credentials)).toBe(true);

    credentials.password = 'wrong';
    expect(validarCredenciales(credentials)).toBe(false);
  });
});