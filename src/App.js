import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CatalogoInteractivo from './components/CatalogoInteractivo';
import Carrusel from './components/Carrusel';
import Historial from './paginas/Historial'; 
import Carrito from './components/Carrito';
import PaginaProducto from "./paginas/PaginaProducto"; 
import Login from './paginas/Login'; 

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

  return (
    <Router>
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

            <Route path="/carrito" element={
              <Carrito 
                carrito={carrito} 
                eliminarDelCarrito={eliminarDelCarrito} 
                agregarAlCarrito={agregarAlCarrito}
                volverAlCatalogo={() => window.location.href = "/"} 
              />
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