import React, { useState } from 'react';
import './CatalogoInteractivo.css';
import Productos from './Productos'; 
// IMPORTANTE: Importamos Link para poder enviárselo al componente hijo
import { Link } from 'react-router-dom';

export default function CatalogoInteractivo({ agregarAlCarrito, carrito, eliminarDelCarrito, seccionFija, setSeccionFija }) {
  
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('');

  const manejarCambioFiltro = (e) => {
    setFiltroSeleccionado(e.target.value);
    setSeccionFija('todos'); 
  };

  return (
    <div className="catalogo-contenedor">
      <div className="catalogo-cabecera" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>Catálogo de Productos</h2>
        <p>Encuentra todo para la higiene mecánica</p>
      </div>

      {/* Barra de navegación dividida en 3 partes equitativas */}
      <nav style={{ 
        display: 'flex', 
        width: '100%', 
        border: '1px solid #eaeaea',
        borderRadius: '6px',
        marginBottom: '30px',
        backgroundColor: '#fff'
      }}>
        
        {/* 1. FILTRADO (Minimalista y completo) */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '15px', borderRight: '1px solid #eaeaea' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <select 
              value={filtroSeleccionado} 
              onChange={manejarCambioFiltro}
              style={{ 
                appearance: 'none', 
                WebkitAppearance: 'none',
                width: '100%',
                border: 'none',
                background: 'transparent',
                fontSize: '16px', 
                padding: '12px 25px 12px 0', 
                cursor: 'pointer',
                outline: 'none',
                color: '#333'
              }}
            >
              <option value="">Filtrar por...</option>
              <option value="seguridad">Seguridad</option>
              <option value="limpieza">Limpieza</option>
            </select>
            {/* Flecha minimalista personalizada */}
            <span style={{
              position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
              pointerEvents: 'none', fontSize: '10px', color: '#666'
            }}>▼</span>
          </div>
        </div>

        {/* 2. TODOS LOS PRODUCTOS (Sin diferencia de color) */}
        <button
          onClick={() => { setSeccionFija('todos'); setFiltroSeleccionado(''); }}
          style={{
            flex: 1,
            border: 'none',
            borderRight: '1px solid #eaeaea',
            backgroundColor: 'transparent', 
            fontSize: '16px',
            fontWeight: seccionFija === 'todos' && filtroSeleccionado === '' ? 'bold' : 'normal',
            cursor: 'pointer',
            padding: '15px 0',
            color: '#333'
          }}
        >
          Todos los Productos
        </button>

        {/* 3. TUS INTERESES */}
        <button
          onClick={() => { setSeccionFija('intereses'); setFiltroSeleccionado(''); }}
          style={{
            flex: 1,
            border: 'none',
            backgroundColor: 'transparent', 
            fontSize: '16px',
            fontWeight: seccionFija === 'intereses' ? 'bold' : 'normal',
            cursor: 'pointer',
            padding: '15px 0',
            color: '#333',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ color: '#ff4d4d' }}>❤️</span> Tus Intereses
        </button>

      </nav>

      <div className="catalogo-contenido">
        {/* NUEVO: Le pasamos Link a Productos para usarlo en los botones o títulos */}
        <Productos 
          agregarAlCarrito={agregarAlCarrito} 
          filtro={filtroSeleccionado}
          soloIntereses={seccionFija === 'intereses'}
          Link={Link}
        />
      </div>
    </div>
  );
}
