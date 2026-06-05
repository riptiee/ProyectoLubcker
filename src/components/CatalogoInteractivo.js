import React, { useState } from 'react';
import './CatalogoInteractivo.css';
import Producto from './Producto'; 
import Carrito from './Carrito'; 

const listaProductos = [
  { id: 1, nombre: "Desengrasante Motor", precio: 15.50 },
  { id: 2, nombre: "Limpiador de Frenos Aerosol", precio: 10.00 },
  { id: 3, nombre: "Filtro de Aceite Universal", precio: 22.00 }
];

export default function CatalogoInteractivo({ agregarAlCarrito, carrito, eliminarDelCarrito, seccionFija, setSeccionFija }) {
  
  const [seccionHover, setSeccionHover] = useState(null);
  const seccionActiva = seccionHover || seccionFija;

  const menuItems = [
    { id: 'filtrado', titulo: 'Filtrado' },
    { id: 'intereses', titulo: 'Tus Intereses' },
    { id: 'carrito', titulo: 'En el Carrito' },
    { id: 'todos', titulo: 'Todos los Productos' },
  ];

  return (
    <div className="catalogo-contenedor">
      <div className="catalogo-cabecera">
        <h2>Catálogo de Productos</h2>
        <p>Encuentra todo para la higiene mecánica</p>
      </div>

      <nav className="catalogo-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-btn ${seccionFija === item.id ? 'activo-fijo' : ''}`}
            onMouseEnter={() => setSeccionHover(item.id)}
            onMouseLeave={() => setSeccionHover(null)}
            onClick={() => setSeccionFija(item.id)}
          >
            {item.titulo}
          </button>
        ))}
      </nav>

      <div className="catalogo-contenido">
        
        {seccionActiva === 'filtrado' && (
          <div className="vista-seccion">
            <h3>Opciones de Filtrado</h3>
            <p>Aquí irían tus opciones por categoría, marca, etc.</p>
          </div>
        )}

        {seccionActiva === 'intereses' && (
          <div className="vista-seccion">
            <h3>Tus Intereses</h3>
            <p>Productos recomendados basados en tu navegación.</p>
          </div>
        )}

        {seccionActiva === 'carrito' && (
          <div className="vista-seccion">
            {/* AQUÍ CONECTAMOS EL CARRITO CON SUS FUNCIONES DE ACCIÓN */}
            <Carrito 
              carrito={carrito} 
              eliminarDelCarrito={eliminarDelCarrito} 
              agregarAlCarrito={agregarAlCarrito}
              volverAlCatalogo={() => setSeccionFija('todos')} 
            />
          </div>
        )}

        {seccionActiva === 'todos' && (
          <div className="vista-seccion">
            <h3>Todos los Productos</h3>
            <div className="productos-grid">
              {listaProductos.map(prod => (
                <Producto 
                  key={prod.id} 
                  producto={prod} 
                  agregarAlCarrito={agregarAlCarrito} 
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}