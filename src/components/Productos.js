import React, { useState, useEffect } from 'react';
// IMPORTANTE: Importamos Link para la redirección por ID
import { Link } from 'react-router-dom';
import './Productos.css';

const API_URL = 'http://localhost:8080/api/productos';

// El backend guarda solo el NOMBRE del archivo de imagen (ej: "1DEDO.jpg").
// Esta función arma la ruta real dentro de assets, y si no hay imagen
// o el archivo no existe, usa un placeholder para no romper el layout.
function resolverImagen(valor) {
  if (!valor) return 'https://picsum.photos/300';
  if (valor.startsWith('http')) return valor;
  try {
    return require(`../assets/productos/${valor}`);
  } catch {
    return 'https://picsum.photos/300';
  }
}

export default function Productos({ agregarAlCarrito, filtro, soloIntereses }) {
  const [likes, setLikes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los productos');
        return res.json();
      })
      .then((data) => {
        // Traducimos la forma del backend (idProducto, nombreCategoria...)
        // a la forma que ya usaba este componente (id, categoria...)
        const mapeados = data.map((p) => ({
          id: p.idProducto,
          nombre: p.nombre,
          precio: p.precio,
          imagen: resolverImagen(p.imagen),
          categoria: (p.nombreCategoria || '').toLowerCase(),
        }));
        setProductos(mapeados);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  const manejarLike = (id) => {
    if (likes.includes(id)) {
      setLikes(likes.filter(favId => favId !== id));
    } else {
      setLikes([...likes, id]);
    }
  };

  let productosMostrados = productos;

  if (soloIntereses) {
    productosMostrados = productos.filter(p => likes.includes(p.id));
  } else if (filtro && filtro !== '') {
    productosMostrados = productos.filter(p => p.categoria === filtro);
  }

  if (cargando) {
    return <p className="mensaje-intereses-vacio">Cargando productos...</p>;
  }

  if (error) {
    return <p className="mensaje-intereses-vacio">No se pudieron cargar los productos. ¿Está corriendo el backend?</p>;
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

          <Link to={`/producto/${prod.id}`} className="enlace-tarjeta-completa" aria-label={`Ver ${prod.nombre}`} />

          {soloIntereses ? (
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
            <>
              <div className="contenedor-imagen-cuadrada">
                <img src={prod.imagen} alt={prod.nombre} className="imagen-producto-catalogo" />
              </div>

              <h3 className="titulo-producto-catalogo titulo-centrado">
                {prod.nombre}
              </h3>

              <span className="precio-producto-catalogo precio-centrado">
                ${prod.precio}
              </span>

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