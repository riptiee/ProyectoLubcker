import React from 'react';
import './Carrito.css';

const Carrito = ({ carrito }) => {
  
  // Calculamos el valor total de todo lo que se gastó
  const valorTotalGeneral = carrito ? carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0) : 0;

  return (
    <div className="carrito-pagina-container">
      <div className="carrito-tarjeta-principal">
        <h2 className="carrito-titulo-grande">Tu Carrito de Compras</h2>
        <p className="carrito-subtitulo-tienda">Gestioná los productos de higiene mecánica antes de finalizar el pedido.</p>
        
        {/* ENCABEZADOS DE LA TABLA DEL CARRITO */}
        <div className="carrito-tabla-cabecera">
          <div>Producto</div>
          <div>Detalle</div>
          <div>Cantidad</div>
          <div>Subtotal</div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="carrito-listado-cuerpo">
          {!carrito || carrito.length === 0 ? (
            <div className="carrito-seccion-vacia">
              <p className="carrito-icono-vacio">🛒</p>
              <h3>Tu carrito está vacío</h3>
              <p>Volvé al catálogo para agregar insumos y herramientas al pedido.</p>
            </div>
          ) : (
            <>
              {/* MAPEADO DE PRODUCTOS EN MEMORIA */}
              {carrito.map((item) => (
                <div key={item.id} className="carrito-fila-item">
                  
                  {/* Columna 1: Foto del producto */}
                  <div className="carrito-col-foto">
                    <img 
                      src={item.foto || "https://via.placeholder.com/80/374151/ffffff?text=Insumo"} 
                      alt={item.nombre} 
                    />
                  </div>

                  {/* Columna 2: Nombre y Precio Unitario */}
                  <div className="carrito-col-detalle">
                    <span className="carrito-item-nombre-txt">{item.nombre}</span>
                    <span className="carrito-item-precio-unitario">Precio unitario: ${item.precio.toFixed(2)}</span>
                  </div>

                  {/* Columna 3: Formato Multiplicador (x1, x2, x3) */}
                  <div className="carrito-col-cantidad">
                    <span className="carrito-badge-multiplicador">x{item.cantidad}</span>
                  </div>

                  {/* Columna 4: Subtotal del producto */}
                  <div className="carrito-col-subtotal">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </div>

                </div>
              ))}

              {/* SECCIÓN FINAL: RESUMEN DE GASTOS */}
              <div className="carrito-resumen-gastos">
                <div className="carrito-fila-total">
                  <span>Valor Total General:</span>
                  <span className="carrito-monto-total">${valorTotalGeneral.toFixed(2)}</span>
                </div>
                <div className="carrito-contenedor-botones">
                  <button className="btn-seguir-comprando">Volver al catálogo</button>
                  <button className="btn-proceder-pago">Proceder al Pago Seguro</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrito;