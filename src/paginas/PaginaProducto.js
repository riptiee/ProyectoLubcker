import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './PaginaProducto.css';

const API_URL = 'http://localhost:8080/api';

// Igual que en Productos.js: el backend guarda solo el nombre del archivo.
function resolverImagen(nombreArchivo) {
  if (!nombreArchivo) return 'https://picsum.photos/300';
  try {
    return require(`../assets/productos/${nombreArchivo}`);
  } catch {
    return 'https://picsum.photos/300';
  }
}

function mapearProducto(p, descripcion) {
  return {
    id: p.idProducto,
    nombre: p.nombre,
    precio: p.precio,
    imagen: resolverImagen(p.imagen),
    categoria: (p.nombreCategoria || '').toLowerCase(),
    idCategoria: p.idCategoria,
    descripcion: descripcion || 'Sin descripción disponible para este producto.',
  };
}

function PaginaProducto({ agregarAlCarrito }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [noExiste, setNoExiste] = useState(false);

  useEffect(() => {
    setCargando(true);
    setNoExiste(false);

    fetch(`${API_URL}/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('no existe');
        return res.json();
      })
      .then((dataProducto) => {
        // La descripción vive en ficha_tecnica, no en producto -> pedido aparte.
        // No todos los productos tienen ficha cargada, por eso el .catch en vez
        // de dejar que rompa toda la página si da 404.
        fetch(`${API_URL}/fichas-tecnicas/producto/${id}`)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null)
          .then((ficha) => {
            const productoMapeado = mapearProducto(dataProducto, ficha?.descripcion);
            setProducto(productoMapeado);

            fetch(`${API_URL}/productos/categoria/${dataProducto.idCategoria}`)
              .then((res) => (res.ok ? res.json() : []))
              .then((lista) => {
                const relacionados = lista
                  .filter((p) => p.idProducto !== dataProducto.idProducto)
                  .map((p) => mapearProducto(p, null));
                setProductosRelacionados(relacionados);
                setCargando(false);
              })
              .catch(() => setCargando(false));
          });
      })
      .catch(() => {
        setNoExiste(true);
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return <p className="mensaje-intereses-vacio">Cargando producto...</p>;
  }

  if (noExiste || !producto) {
    return (
      <div className="error-producto-no-existe">
        <h2>El producto solicitado no está disponible.</h2>
        <button onClick={() => navigate('/')} className="btn-comprar-carrito btn-error-regresar">
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="pagina-producto-contenedor">
      <button onClick={() => navigate('/')} className="btn-volver-catalogo">
        &larr; Volver al Catálogo
      </button>

      <div className="producto-detalle-grid">
        <div className="producto-wrapper-imagen">
          <img src={producto.imagen} alt={producto.nombre} className="producto-imagen-principal" />
        </div>

        <div className="producto-bloque-info">
          <span className="producto-categoria-etiqueta">
            Categoría: {producto.categoria}
          </span>
          <h1 className="producto-nombre-titulo">{producto.nombre}</h1>
          <p className="producto-precio-destacado">${producto.precio}</p>

          <p className="producto-texto-descripcion">
            {producto.descripcion}
          </p>

          <button
            onClick={() => {
              agregarAlCarrito(producto);
              alert(`${producto.nombre} añadido al carrito`);
            }}
            className="btn-comprar-carrito"
          >
            Añadir al Carrito
          </button>
        </div>
      </div>

      {productosRelacionados.length > 0 && (
        <div className="seccion-relacionados">
          <h2 className="titulo-relacionados">Productos Relacionados</h2>
          <div className="productos-relacionados-grid">
            {productosRelacionados.map((prod) => (
              <div key={prod.id} className="producto-tarjeta-item tarjeta-vertical">

                <Link to={`/producto/${prod.id}`} className="enlace-tarjeta-completa" aria-label={`Ver ${prod.nombre}`} />

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
                  <button
                    onClick={() => {
                      agregarAlCarrito(prod);
                      alert(`${prod.nombre} añadido al carrito`);
                    }}
                    className="btn-agregar-catalogo-vertical"
                  >
                    Agregar al carrito
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaginaProducto;