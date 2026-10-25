import React, { useState, useEffect } from 'react';
import './CatalogoInteractivo.css';
import Productos from './Productos'; 
import { Link } from 'react-router-dom';
// 🔑 Importamos la configuración centralizada de la API
import API_URL from './config'; 

export default function CatalogoInteractivo({ agregarAlCarrito, carrito, eliminarDelCarrito, seccionFija, setSeccionFija }) {
  
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('');
  // 🔑 Estado para almacenar las categorías dinámicas de la API
  const [categoriasLista, setCategoriasLista] = useState([]);

  // 🔑 Cargamos las categorías desde el backend al montar el componente
  useEffect(() => {
    fetch(`${API_URL}/api/categorias`)
      .then(res => {
        if (!res.ok) throw new Error("Error al buscar categorías");
        return res.json();
      })
      .then(data => setCategoriasLista(data))
      .catch(err => console.error("Error cargando categorías de la API:", err));
  }, []);

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
        
        {/* 1. FILTRADO (Dinámico y completo) */}
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
              {/* 🔑 Recorremos las categorías reales traídas desde la API */}
              {categoriasLista.map(cat => (
                <option key={cat.idCategoria || cat.id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {/* Flecha minimalista personalizada */}
            <span style={{
              position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
              pointerEvents: 'none', fontSize: '10px', color: '#666'
            }}>▼</span>
          </div>
        </div>

        {/* 2. TODOS LOS PRODUCTOS */}
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
