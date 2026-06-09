import { useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate

import usuarioImg from '../assets/iconos/usuario.jpg';
import carritoImg from '../assets/iconos/carrito.png'; 
import logolubckerImg from '../assets/iconos/logolubcker.png';

// Recibimos setSeccionCatalogo
const Navbar = ({ carrito, eliminarDelCarrito, setSeccionCatalogo }) => { 
  const [menuActivo, setMenuActivo] = useState(null);
  const navigate = useNavigate(); // Herramienta para navegar entre páginas

  const alternarMenu = (menu) => {
    setMenuActivo(menuActivo === menu ? null : menu);
  };

  // FUNCIÓN MÁGICA: Va al inicio, abre la pestaña y hace scroll
  const irAlCarritoDelCatalogo = () => {
    setMenuActivo(null); // 1. Cierra la ventanita
    setSeccionCatalogo('carrito'); // 2. Le avisa al catálogo que abra el carrito
    navigate('/'); // 3. Asegura que vayamos al inicio por si estábamos en otra página
    
    // 4. Hace scroll suave hacia el catálogo después de un micro-segundo
    setTimeout(() => {
      document.getElementById('catalogo-ancla')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const totalArticulos = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acumulador, item) => acumulador + (item.precio * item.cantidad), 0);

  return (
    <>
      <nav className="navbar">
        
        <div className="navbar-left">
          <div className="hamburger" onClick={() => alternarMenu('lateral')}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
          <Link to="/" className="logo-lubcker" onClick={() => setMenuActivo(null)}>
            <img src={logolubckerImg} alt="Logo" className="logo-lubcker-img" />
          </Link>
        </div>

        <div className="navbar-center">
          <input type="text" placeholder="Buscar..." className="search-bar" />
        </div>

        <div className="navbar-right">
          
          <div className="icon-box">
            <img src={usuarioImg} alt="Usuario" className="nav-icon-login" onClick={() => alternarMenu('usuario')} />
            
            <div className={`ventanita-flotante ${menuActivo === 'usuario' ? 'abierto' : ''}`}>
              <button className="btn-primario">Iniciar Sesión</button>
              <button className="btn-secundario">Registrarse</button>
              <Link to="/historial" onClick={() => setMenuActivo(null)} style={{ textDecoration: 'none' }}>
                <button className="btn-secundario" style={{ marginTop: '8px' }}>Mi Historial</button>
              </Link>
            </div>
          </div>

          <div className="icon-box">
            <img src={carritoImg} alt="Carrito" className="nav-icon-carrito" onClick={() => alternarMenu('carrito')} />
            
            <span className="numero-carrito">{totalArticulos}</span>
            
            <div className={`ventanita-flotante ${menuActivo === 'carrito' ? 'abierto' : ''}`} style={{ width: '320px', padding: '15px' }}>
              <h4 style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Tu Carrito</h4>
              
              {carrito.length === 0 ? (
                <p className="carrito-vacio" style={{ textAlign: 'center', color: '#666', padding: '20px 0' }}>No hay productos todavía.</p>
              ) : (
                <>
                  <div className="carrito-lista-desplegable" style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '15px' }}>
                    {carrito.map((item) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #eee', fontSize: '13px' }}>
                        <img src={item.foto || "https://via.placeholder.com/80/374151/ffffff?text=Insumo"} alt={item.nombre} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '5px' }} />
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{item.nombre}</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>x{item.cantidad} - ${(item.precio * item.cantidad).toFixed(2)}</div>
                        </div>
                        <button onClick={() => eliminarDelCarrito(item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '16px' }} title="Eliminar producto">✕</button>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>
                    <span>Total:</span>
                    <span style={{ color: '#27ae60' }}>${totalPrecio.toFixed(2)}</span>
                  </div>

                  {/* AQUÍ REEMPLAZAMOS EL LINK POR NUESTRA FUNCIÓN MÁGICA */}
                  <button onClick={irAlCarritoDelCatalogo} className="btn-primario" style={{ width: '100%', padding: '10px', fontWeight: 'bold' }}>
                    Ver Carrito Completo
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </nav>

      <div className={`menu-lateral ${menuActivo === 'lateral' ? 'abierto' : ''}`}>
        <button className="btn-cerrar" onClick={() => setMenuActivo(null)}>X</button>
        <ul>
          <li><Link to="/" onClick={() => setMenuActivo(null)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>Inicio</Link></li>
          <li>Productos</li>
          <li>Categorías</li>
          <li><Link to="/historial" onClick={() => setMenuActivo(null)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>Historial de Compras</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;