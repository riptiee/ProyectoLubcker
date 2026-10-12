import React, { useState } from 'react';
import './Producto.css';

const Producto = ({ producto, agregarAlCarrito }) => {
  // Estado para saber si el mouse está arriba de esta tarjeta
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`producto-tarjeta ${isHovered ? 'hover' : ''}`} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{producto.nombre}</h3>
      <p className="producto-precio">Precio: ${producto.precio}</p>
      <button 
        className="producto-boton"
        onClick={() => agregarAlCarrito(producto)}
      >
        Agregar al carrito
      </button>
    </div>
  );
} 

export default Producto;