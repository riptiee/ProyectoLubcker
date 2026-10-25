import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CatalogoInteractivo from './components/CatalogoInteractivo';
import Carrusel from './components/Carrusel';
import Historial from './paginas/Historial';
import Carrito from './paginas/Carrito';
import PaginaProducto from "./paginas/PaginaProducto";
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import Pago from './paginas/Pago';
import AdminProductos from './paginas/AdminProductos';
import { AuthProvider } from './AuthContext';
import { SoloConSesion, SoloSinSesion } from './RutaProtegida';

// COMPONENTE AUXILIAR PARA FORZAR EL SCROLL AL TOPE EN CADA CAMBIO DE RUTA
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Lee el carrito guardado en el navegador (si no hay o está dañado, arranca vacío)
function leerCarritoGuardado() {
  try {
    const guardado = localStorage.getItem('carrito');
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

function App() {
  const [carrito, setCarrito] = useState(leerCarritoGuardado);

  // Cada vez que cambia el carrito, se guarda para que sobreviva a recargas de la página
  useEffect(() => {
    try {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    } catch {
      // Si el navegador no deja guardar, la app sigue funcionando sin persistencia
    }
  }, [carrito]);
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

  // Resta una unidad; si queda en 0, saca el producto del carrito
  const restarDelCarrito = (idProducto) => {
    setCarrito((prevCarrito) =>
      prevCarrito
        .map(item => item.id === idProducto ? { ...item, cantidad: item.cantidad - 1 } : item)
        .filter(item => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (idProducto) => {
    setCarrito((prevCarrito) => prevCarrito.filter(item => item.id !== idProducto));
  };

  // Función para vaciar el carrito cuando el pago sea exitoso
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <AuthProvider>
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

              <Route path="/historial" element={<SoloConSesion><Historial /></SoloConSesion>} />
              <Route path="/login" element={<SoloSinSesion><Login /></SoloSinSesion>} />
              <Route path="/admin/productos" element={<SoloConSesion><AdminProductos /></SoloConSesion>} />
              <Route path="/registro" element={<SoloSinSesion><Registro /></SoloSinSesion>} />

              <Route path="/carrito" element={
                <Carrito
                  carrito={carrito}
                  eliminarDelCarrito={eliminarDelCarrito}
                  agregarAlCarrito={agregarAlCarrito}
                  restarDelCarrito={restarDelCarrito}
                />
              } />

              <Route path="/pago" element={
                <SoloConSesion><Pago carrito={carrito} vaciarCarrito={vaciarCarrito} /></SoloConSesion>
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
    </AuthProvider>
  );
}

export default App;