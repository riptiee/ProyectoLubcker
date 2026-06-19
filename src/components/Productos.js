import React, { useState } from 'react';
// IMPORTANTE: Importamos Link para la redirección por ID
import { Link } from 'react-router-dom';
import './Productos.css'; 

const listaProductos = [
  { 
    id: 1, 
    nombre: "1DEDO", 
    precio: 40000, 
    imagen: require('../assets/productos/1DEDO.jpg'),
    categoria: 'limpieza'
  },
  { 
    id: 2, 
    nombre: "Limpiador de Frenos Aerosol", 
    precio: 10.00, 
    imagen: "https://picsum.photos",
    categoria: 'limpieza'
  },
  { 
    id: 3, 
    nombre: "Filtro de Aceite Universal", 
    precio: 22.00, 
    imagen: "https://picsum.photos",
    categoria: 'mantenimiento'
  },
  { 
    id: 4, 
    nombre: "Líquido de Frenos Premium", 
    precio: 18.00, 
    imagen: "https://picsum.photos",
    categoria: 'seguridad'
  }
];

export default function Productos({ agregarAlCarrito, filtro, soloIntereses }) {
  const [likes, setLikes] = useState([]);

  const manejarLike = (id) => {
    if (likes.includes(id)) {
      setLikes(likes.filter(favId => favId !== id)); 
    } else {
      setLikes([...likes, id]); 
    }
  };

  let productosMostrados = listaProductos;
  
  if (soloIntereses) {
    productosMostrados = listaProductos.filter(p => likes.includes(p.id));
  } else if (filtro && filtro !== '') {
    productosMostrados = listaProductos.filter(p => p.categoria === filtro);
  }

  return (
    <div className={`productos-grid-contenedor ${soloIntereses ? 'vista-intereses' : 'vista-catalogo'}`}>
      
      {productosMostrados.length === 0 && soloIntereses && (
        <p className="mensaje-intereses-vacio">
          Aún no tienes productos en tus intereses.
        </p>
      )}

      {productosMostrados.map((prod) => (
        <div key={prod.id} className={`producto-tarjeta-item ${soloIntereses ? 'tarjeta-horizontal' : 'tarjeta-vertical'}`}>
          
          {/* ENLACE INVISIBLE: Cubre la tarjeta completa sin romper los botones */}
          <Link to={`/producto/${prod.id}`} className="enlace-tarjeta-completa" aria-label={`Ver ${prod.nombre}`} />

          {soloIntereses ? (
            /* --- VISTA HORIZONTAL: TUS INTERESES --- */
            <>
              <div className="bloque-izquierdo-horizontal">
                <div className="contenedor-imagen-mini">
                  <img src={prod.imagen} alt={prod.nombre} className="imagen-producto-catalogo" />
                </div>
                <h3 className="titulo-producto-catalogo texto-recortado">
                  {prod.nombre}
                </h3>
              </div>
              
              <div className="bloque-derecho-horizontal">
                <span className="precio-producto-catalogo">${prod.precio}</span>
                <button onClick={() => manejarLike(prod.id)} className="btn-like-catalogo">
                  {likes.includes(prod.id) ? '❤️' : '🤍'}
                </button>
                <button onClick={() => agregarAlCarrito(prod)} className="btn-agregar-catalogo-horizontal">
                  Agregar
                </button>
              </div>
            </>
          ) : (
            /* --- VISTA VERTICAL: TODOS LOS PRODUCTOS --- */
            <>
              {/* 1. Imagen */}
              <div className="contenedor-imagen-cuadrada">
                <img src={prod.imagen} alt={prod.nombre} className="imagen-producto-catalogo" />
              </div>
              
              {/* 2. Título */}
              <h3 className="titulo-producto-catalogo titulo-centrado">
                {prod.nombre}
              </h3>
              
              {/* 3. Precio */}
              <span className="precio-producto-catalogo precio-centrado">
                ${prod.precio}
              </span>
              
              {/* 4. Botones independientes */}
              <div className="contenedor-botones-tarjeta">
                <button onClick={() => manejarLike(prod.id)} className="btn-like-catalogo">
                  {likes.includes(prod.id) ? '❤️' : '🤍'}
                </button>
                <button onClick={() => agregarAlCarrito(prod)} className="btn-agregar-catalogo-vertical">
                  Agregar al carrito
                </button>
              </div>
            </>
          )}
          
        </div>
      ))}
    </div>
  );
}
