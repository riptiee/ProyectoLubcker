import React from 'react';
import Producto from './Producto';
import './Productos.css';

// Lista de ejemplo. Asegurate de que tus productos tengan una propiedad "id" unica.
const listaProductos = [
  { id: 1, nombre: "Desengrasante Motor Premium", precio: 15.50 },
  { id: 2, nombre: "Limpiador de Frenos Aerosol", precio: 8.90 },
  { id: 3, nombre: "Filtro de Aceite Universal", precio: 22.00 }
];

const Productos = ({ agregarAlCarrito }) => {
  return (
    <div className="productos-grid">
      {listaProductos.map(prod => (
        <Producto 
          key={prod.id} 
          producto={prod} 
          agregarAlCarrito={agregarAlCarrito} 
        />
      ))}
    </div>
  );
};

export default Productos;