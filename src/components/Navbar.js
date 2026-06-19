import { useState, useEffect, useRef } from 'react'; // Importamos useEffect y useRef
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

import usuarioImg from '../assets/iconos/usuario.jpg';
import carritoImg from '../assets/iconos/carrito.png'; 
import logolubckerImg from '../assets/iconos/logolubcker.png';

const Navbar = ({ carrito, eliminarDelCarrito, setSeccionCatalogo }) => { 
  const [menuActivo, setMenuActivo] = useState(null);
  const navigate = useNavigate();
  
  // Referencia para detectar clics fuera de la sección de usuario
  const contenedorUsuarioRef = useRef(null);

  const alternarMenu = (menu) => {
    setMenuActivo(menuActivo === menu ? null : menu);
  };

  const irAlLogin = () => {
    setMenuActivo(null); 
    navigate('/login');  
  };

  const irAlCarritoDelCatalogo = () => {
    setMenuActivo(null); 
    setSeccionCatalogo('carrito'); 
    navigate('/'); 
    
    setTimeout(() => {
      document.getElementById('catalogo-ancla')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // EFECTO MÁGICO: Escucha clics en toda la pantalla para cerrar el menú de usuario
  useEffect(() => {
    const manejarClicFuera = (evento) => {
      // Si el menú de usuario está abierto y el clic NO fue dentro del contenedor del usuario, lo cierra
      if (
        menuActivo === 'usuario' && 
        contenedorUsuarioRef.current && 
        !contenedorUsuarioRef.current.contains(evento.target)
      ) {
        setMenuActivo(null);
      }
    };

    // Agrega el evento global al documento
    document.addEventListener('mousedown', manejarClicFuera);
    
    // Limpia el evento cuando el componente se desmonta para no saturar la memoria
    return () => {
      document.removeEventListener('mousedown', manejarClicFuera);
    };
  }, [menuActivo]);

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
          
          {/* ASIGNAMOS LA REFERENCIA AQUÍ AL CONTENEDOR DEL ICONO Y VENTANITA */}
          <div className="icon-box" ref={contenedorUsuarioRef}>
            <img 
              src={usuarioImg} 
              alt="Usuario" 
              className="nav-icon-login" 
              onClick={() => alternarMenu('usuario')} 
            />
            
            <div className={`ventanita-flotante ${menuActivo === 'usuario' ? 'abierto' : ''}`}>
              <button className="btn-primario" onClick={irAlLogin} style={{ width: '100%', cursor: 'pointer' }}>
                Iniciar Sesión
              </button>
              
              <button className="btn-secundario" style={{ width: '100%', marginTop: '8px' }}>
                Registrarse
              </button>
              
              <Link to="/historial" onClick={() => setMenuActivo(null)} style={{ textDecoration: 'none', width: '100%' }}>
                <button className="btn-secundario" style={{ marginTop: '8px', width: '100%' }}>Mi Historial</button>
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
                        <img src={item.foto || "https://placeholder.com"} alt={item.nombre} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '5px' }} />
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{item.nombre}</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>x{item.cantidad} - ${(item.precio * item.cantidad).toFixed(2)}</div>
                        </div>
                        <button onClick={() => eliminarDelCarrito(item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>
                    <span>Total:</span>
                    <span style={{ color: '#27ae60' }}>${totalPrecio.toFixed(2)}</span>
                  </div>
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
