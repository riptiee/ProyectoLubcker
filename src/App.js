import { useState, useEffect } from 'react'; // <-- IMPORTANTE: Se agregó useEffect aquí
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // <-- IMPORTANTE: Se agregó useLocation aquí
import Navbar from './components/Navbar';
import CatalogoInteractivo from './components/CatalogoInteractivo';
import Carrusel from './components/Carrusel';
import Historial from './paginas/Historial'; 
import Carrito from './paginas/Carrito';
import PaginaProducto from "./paginas/PaginaProducto"; 
import Login from './paginas/Login'; 
import Registro from './paginas/Registro'; // <-- VERIFICA ESTA IMPORTACIÓN
import Pago from './paginas/Pago'; // <-- NUEVA IMPORTACIÓN DE LA VISTA DE PAGO
import AdminProductos from './paginas/AdminProductos';

// COMPONENTE AUXILIAR PARA FORZAR EL SCROLL AL TOPE EN CADA CAMBIO DE RUTA
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [carrito, setCarrito] = useState([]);
  const [seccionCatalogo, setSeccionCatalogo] = useState('todos');

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find(item => item.id === producto.id);
      if (existe) {
        return prevCarrito.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (idProducto) => {
    setCarrito((prevCarrito) => prevCarrito.filter(item => item.id !== idProducto));
  };

  // Función para vaciar el carrito cuando el pago sea exitoso
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <Router>
      {/* SE INYECTA AQUÍ PARA QUE CONTROLE TODAS LAS RUTAS DE LA APP */}
      <ScrollToTop />
      
      <div className="app-container">
        
        <header>
          <Navbar 
            carrito={carrito} 
            eliminarDelCarrito={eliminarDelCarrito} 
            setSeccionCatalogo={setSeccionCatalogo} 
          />
        </header>

        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <section className="seccion-carrusel">
                    <h2 className="titulo-seccion">Ofertas de la Semana</h2>
                    <Carrusel />
                  </section>
                  
                  <section className="seccion-carrusel-secundario">
                    <h2 className="titulo-seccion">Productos Destacados</h2>
                    <Carrusel />
                  </section>
                  
                  <section className="seccion-catalogo" id="catalogo-ancla">
                    <CatalogoInteractivo 
                      agregarAlCarrito={agregarAlCarrito} 
                      carrito={carrito}
                      eliminarDelCarrito={eliminarDelCarrito}
                      seccionFija={seccionCatalogo}
                      setSeccionFija={setSeccionCatalogo}
                    />
                  </section>
                </>
              } 
            />
            
            <Route path="/historial" element={<Historial />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/productos" element={<AdminProductos />} />

            
            
            {/* ESTA RUTA DEBE ESTAR EXACTAMENTE AQUÍ */}
            <Route path="/registro" element={<Registro />} />

            <Route path="/carrito" element={
              <Carrito 
                carrito={carrito} 
                eliminarDelCarrito={eliminarDelCarrito} 
                agregarAlCarrito={agregarAlCarrito}
                volverAlCatalogo={() => window.location.href = "/"} 
              />
            } />

            {/* NUEVA RUTA PARA LA PÁGINA DE PAGO */}
            <Route path="/pago" element={
              <Pago carrito={carrito} vaciarCarrito={vaciarCarrito} />
            } />

            <Route 
              path="/producto/:id" 
              element={
                <PaginaProducto agregarAlCarrito={agregarAlCarrito} />
              } 
            />
          </Routes>
        </main>

        <footer>
          <div className="footer-contenido">
            <p>&copy; 2026 Lubcker - Tienda de Higiene Mecánica.</p>
            <p>Todos los derechos reservados.</p>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;
