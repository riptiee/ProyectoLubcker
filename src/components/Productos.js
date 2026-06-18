import React, { useState } from 'react';
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
    imagen: "https://via.placeholder.com/200?text=Frenos",
    categoria: 'limpieza'
  },
  { 
    id: 3, 
    nombre: "Filtro de Aceite Universal", 
    precio: 22.00, 
    imagen: "https://via.placeholder.com/200?text=Filtro",
    categoria: 'mantenimiento'
  },
  { 
    id: 4, 
    nombre: "Líquido de Frenos Premium", 
    precio: 18.00, 
    imagen: "https://via.placeholder.com/200?text=Liquido",
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
    <div style={{ 
      display: soloIntereses ? 'flex' : 'grid', 
      flexDirection: soloIntereses ? 'column' : 'unset',
      gridTemplateColumns: soloIntereses ? 'none' : 'repeat(auto-fill, minmax(250px, 1fr))', 
      gap: '20px' 
    }}>
      
      {productosMostrados.length === 0 && soloIntereses && (
        <p style={{ textAlign: 'center', padding: '20px', width: '100%' }}>
          Aún no tienes productos en tus intereses.
        </p>
      )}

      {productosMostrados.map((prod) => (
        <div key={prod.id} style={{ 
          display: 'flex',
          flexDirection: soloIntereses ? 'row' : 'column',
          alignItems: soloIntereses ? 'center' : 'stretch',
          justifyContent: 'space-between',
          height: soloIntereses ? '60px' : '100%', 
          border: '1px solid #eaeaea', 
          borderRadius: '8px', 
          padding: soloIntereses ? '0 15px' : '20px', 
          backgroundColor: '#fff',
          gap: soloIntereses ? '0' : '15px', // <-- Esto asegura el espacio equitativo
          boxSizing: 'border-box'
        }}>
          
          {soloIntereses ? (
            /* --- VISTA HORIZONTAL: TUS INTERESES --- */
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ height: '40px', width: '40px', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px' }}>
                  <img src={prod.imagen} alt={prod.nombre} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <h3 style={{ fontSize: '16px', margin: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                  {prod.nombre}
                </h3>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#28a745', fontSize: '18px', fontWeight: 'bold', margin: '0' }}>${prod.precio}</span>
                <button onClick={() => manejarLike(prod.id)} style={{ background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {likes.includes(prod.id) ? '❤️' : '🤍'}
                </button>
                <button onClick={() => agregarAlCarrito(prod)} style={{ backgroundColor: '#333', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  Agregar
                </button>
              </div>
            </>
          ) : (
            /* --- VISTA VERTICAL: TODOS LOS PRODUCTOS --- */
            <>
              {/* 1. Imagen */}
              <div style={{ height: '180px', width: '100%', backgroundColor: '#f8f9fa', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', overflow: 'hidden' }}>
                <img src={prod.imagen} alt={prod.nombre} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
              
              {/* 2. Título (flexGrow hace que absorba el espacio sobrante de forma centrada) */}
              <h3 style={{ fontSize: '16px', margin: '0', textAlign: 'center', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {prod.nombre}
              </h3>
              
              {/* 3. Precio */}
              <span style={{ color: '#28a745', fontSize: '22px', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>
                ${prod.precio}
              </span>
              
              {/* 4. Botones */}
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <button onClick={() => manejarLike(prod.id)} style={{ background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {likes.includes(prod.id) ? '❤️' : '🤍'}
                </button>
                <button onClick={() => agregarAlCarrito(prod)} style={{ backgroundColor: '#333', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap', flex: 1 }}>
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