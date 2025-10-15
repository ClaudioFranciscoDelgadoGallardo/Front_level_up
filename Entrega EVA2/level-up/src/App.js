import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import NotificacionContainer from './components/Notificacion';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Detalle from './pages/Detalle';
import Carrito from './pages/Carrito';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import AdminHome from './pages/AdminHome';
import AdminProductos from './pages/AdminProductos';
import AdminProductoForm from './pages/AdminProductoForm';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminUsuarioForm from './pages/AdminUsuarioForm';

function App() {
  return (
    <CarritoProvider>
      <Router>
        <div className="App">
          <NotificacionContainer />
          <Header />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/detalle/:codigo" element={<Detalle />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            
            {/* Rutas de administración protegidas */}
            <Route path="/admin" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
            <Route path="/admin/productos" element={<ProtectedRoute><AdminProductos /></ProtectedRoute>} />
            <Route path="/admin/productos/nuevo" element={<ProtectedRoute><AdminProductoForm /></ProtectedRoute>} />
            <Route path="/admin/productos/editar/:codigo" element={<ProtectedRoute><AdminProductoForm /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute><AdminUsuarios /></ProtectedRoute>} />
            <Route path="/admin/usuarios/nuevo" element={<ProtectedRoute><AdminUsuarioForm /></ProtectedRoute>} />
            <Route path="/admin/usuarios/editar/:correo" element={<ProtectedRoute><AdminUsuarioForm /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CarritoProvider>
  );
}

export default App;
