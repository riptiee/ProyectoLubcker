import { useState } from 'react'; // <-- Agregamos useState
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Productos from './components/Productos';
import Carrusel from './components/Carrusel';
import Historial from './paginas/Historial'; 

// 1. NUEVO IMPORT: Traemos el componente Carrito para poder usarlo en las rutas
import Carrito from './components/Carrito'; 

function App() {
  // ESTADO GLOBAL DEL CARRITO
  const [carrito, setCarrito] = useState([]);

  // FUNCIÓN PARA AGREGAR UN PRODUCTO
  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      // Verificamos si el producto ya está en el carrito
      const existe = prevCarrito.find(item => item.id === producto.id);
      
      if (existe) {
        // Si ya existe, le sumamos 1 a la cantidad
        return prevCarrito.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        // Si es nuevo, lo agregamos con cantidad 1
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  return (
    <Router>
      <div className="app-container">
        
        {/* HEADER / NAVBAR (Le pasamos el estado del carrito) */}
        <header>
          <Navbar carrito={carrito} />
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  {/* SECCIÓN 1: Carrusel Principal */}
                  <section className="seccion-carrusel">
                    <Carrusel />
                  </section>

                  {/* SECCIÓN 2: Carrusel Secundario */}
                  <section className="seccion-carrusel-secundario">
                    <h2 className="titulo-seccion">Marcas Destacadas</h2>
                    <Carrusel />
                  </section>

                  {/* SECCIÓN 3: Catálogo de Productos (Le pasamos la función de agregar) */}
                  <section className="seccion-catalogo">
                    <h1 className="titulo-principal">Catálogo de Productos</h1>
                    <p className="subtitulo">Encuentra todo para la higiene mecánica</p>
                    <Productos agregarAlCarrito={agregarAlCarrito} />
                  </section>
                </>
              } 
            />
            
            <Route path="/historial" element={<Historial />} />

            {/* 2. NUEVA RUTA: Muestra la pantalla grande del carrito al entrar a /carrito */}
            <Route path="/carrito" element={<Carrito carrito={carrito} />} />

          </Routes>
        </main>

        {/* FOOTER SEPARADO */}
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