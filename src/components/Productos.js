import React from 'react';
import './Productos.css'; // Asegurate de que el CSS esté importado

const listaProductos = [
  { 
    id: 1, 
    nombre: "1DEDO", 
    precio: 40000, 
    // Usamos require() para la imagen local
    imagen: require('../assets/productos/1DEDO.jpg')
  },
  { 
    id: 2, 
    nombre: "Limpiador de Frenos Aerosol", 
    precio: 10.00, 
    // Imagen de relleno por ahora
    imagen: "https://via.placeholder.com/200?text=Frenos" 
  },
  { 
    id: 3, 
    nombre: "Filtro de Aceite Universal", 
    precio: 22.00, 
    imagen: "https://via.placeholder.com/200?text=Filtro" 
  },
  { 
    id: 4, 
    nombre: "Líquido de Frenos Premium", 
    precio: 18.00, 
    imagen: "https://via.placeholder.com/200?text=Liquido" 
  }
];

export default function Productos() {
  return (
    <div className="catalogo-contenedor">
      
      {/* Pestañas superiores */}
      <div className="catalogo-pestanas">
        <button className="pestana-btn">Filtrado</button>
        <button className="pestana-btn">Tus Intereses</button>
        <button className="pestana-btn">En el Carrito</button>
        <button className="pestana-btn activa">Todos los Productos</button>
      </div>

      {/* GRILLA DE PRODUCTOS */}
      <div className="productos-grid">
        {listaProductos.map((prod) => (
          <div key={prod.id} className="producto-card">
            
            {/* ESTA ES LA PARTE QUE FALTABA PARA MOSTRAR LA FOTO */}
            <div className="producto-imagen-contenedor">
              <img src={prod.imagen} alt={prod.nombre} className="producto-imagen" />
            </div>
            
            <div className="producto-info">
              <h3 className="producto-titulo">{prod.nombre}</h3>
              <div className="producto-footer">
                <span className="producto-precio">${prod.precio}</span>
                <button className="btn-agregar-carrito">Agregar al carrito</button>
              </div>
            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
}