import React from 'react';
import Producto from './Producto';
import './Productos.css';

// Lista de ejemplo con los productos para la grilla
const listaProductos = [
  { id: 1, nombre: "Desengrasante Motor", precio: 15.50 },
  { id: 2, nombre: "Limpiador de Frenos Aerosol", precio: 10.00 },
  { id: 3, nombre: "Filtro de Aceite Universal", precio: 22.00 },
  { id: 4, nombre: "Líquido de Frenos Premium", precio: 18.00 }
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