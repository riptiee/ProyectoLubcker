import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './PaginaProducto.css'; 

const listaProductos = [
  { 
    id: 1, 
    nombre: "1DEDO", 
    precio: 40000, 
    imagen: require('../assets/productos/1DEDO.jpg'),
    categoria: 'limpieza',
    descripcion: 'Limpiador industrial profundo de alto rendimiento para talleres mecánicos.'
  },
  { 
    id: 2, 
    nombre: "Limpiador de Frenos Aerosol", 
    precio: 10.00, 
    imagen: "https://picsum.photos",
    categoria: 'limpieza',
    descripcion: 'Remueve eficazmente el líquido de frenos, grasa, aceite y depósitos de suciedad.'
  },
  { 
    id: 3, 
    nombre: "Filtro de Aceite Universal", 
    precio: 22.00, 
    imagen: "https://picsum.photos",
    categoria: 'mantenimiento',
    descripcion: 'Filtro de alta capacidad compatible con múltiples modelos de vehículos.'
  },
  { 
    id: 4, 
    nombre: "Líquido de Frenos Premium", 
    precio: 18.00, 
    imagen: "https://picsum.photos",
    categoria: 'seguridad',
    descripcion: 'Fluido sintético de alta resistencia térmica para sistemas de frenado exigentes.'
  }
];

function PaginaProducto({ agregarAlCarrito }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const producto = listaProductos.find(p => p.id === parseInt(id));

  if (!producto) {
    return (
      <div className="error-producto-no-existe">
        <h2>El producto solicitado no está disponible.</h2>
        <button onClick={() => navigate('/')} className="btn-comprar-carrito btn-error-regresar">
          Volver al catálogo
        </button>
      </div>
    );
  }

  // NUEVO: Filtrar productos relacionados (misma categoría, excluyendo el actual)
  const productosRelacionados = listaProductos.filter(
    p => p.categoria === producto.categoria && p.id !== producto.id
  );

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

      {/* NUEVA SECCIÓN: Productos Relacionados */}
      {productosRelacionados.length > 0 && (
        <div className="seccion-relacionados">
          <h2 className="titulo-relacionados">Productos Relacionados</h2>
          <div className="productos-relacionados-grid">
            {productosRelacionados.map((prod) => (
              <div key={prod.id} className="producto-tarjeta-item tarjeta-vertical">
                
                {/* Enlace transparente para poder cliquear e ir al detalle de este producto relacionado */}
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
