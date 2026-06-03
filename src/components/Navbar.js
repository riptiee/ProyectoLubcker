import { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

import usuarioImg from '../assets/iconos/usuario.jpg';
import carritoImg from '../assets/iconos/carrito.png'; 
import logolubckerImg from '../assets/iconos/logolubcker.png';

const Navbar = ({ carrito }) => { // <-- RECIBIMOS EL CARRITO AQUÍ
  const [menuActivo, setMenuActivo] = useState(null);

  const alternarMenu = (menu) => {
    setMenuActivo(menuActivo === menu ? null : menu);
  };

  // CALCULAMOS EL NÚMERO TOTAL DE ARTÍCULOS (Suma todas las cantidades)
  const totalArticulos = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);

  return (
    <>
      <nav className="navbar">
        
        {/* PARTE IZQUIERDA: Menú hamburguesa y Logo */}
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

        {/* PARTE CENTRAL: Buscador */}
        <div className="navbar-center">
          <input type="text" placeholder="Buscar..." className="search-bar" />
        </div>

        {/* PARTE DERECHA: Iconos */}
        <div className="navbar-right">
          
          {/* BOTÓN DE USUARIO */}
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

          {/* BOTÓN DE CARRITO */}
          <div className="icon-box">
            <img src={carritoImg} alt="Carrito" className="nav-icon-carrito" onClick={() => alternarMenu('carrito')} />
            
            {/* NÚMERO DINÁMICO DEL CARRITO */}
            <span className="numero-carrito">{totalArticulos}</span>
            
            <div className={`ventanita-flotante ${menuActivo === 'carrito' ? 'abierto' : ''}`}>
              <h4>Tu Carrito</h4>
              
              {/* LISTADO DINÁMICO DE PRODUCTOS AGREGADOS */}
              {carrito.length === 0 ? (
                <p className="carrito-vacio">No hay productos todavía.</p>
              ) : (
                <div className="carrito-lista-desplegable" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
                  {carrito.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee', fontSize: '13px' }}>
                      <span style={{ textAlign: 'left', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.nombre} (x{item.cantidad})
                      </span>
                      <span style={{ fontWeight: '600' }}>${(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <button className="btn-primario">Ver Carrito</button>
            </div>
          </div>

        </div>
      </nav>

      {/* MENÚ LATERAL ANIMADO */}
      <div className={`menu-lateral ${menuActivo === 'lateral' ? 'abierto' : ''}`}>
        <button className="btn-cerrar" onClick={() => setMenuActivo(null)}>X</button>
        <ul>
          <li>
            <Link to="/" onClick={() => setMenuActivo(null)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              Inicio
            </Link>
          </li>
          <li>Productos</li>
          <li>Categorías</li>
          <li>
            <Link to="/historial" onClick={() => setMenuActivo(null)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              Historial de Compras
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;