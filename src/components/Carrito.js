import React from 'react';
import './Carrito.css';

// 1. Recibimos las dos nuevas propiedades aquí arriba
const Carrito = ({ carrito, eliminarDelCarrito, volverAlCatalogo, agregarAlCarrito }) => {
  
  const valorTotalGeneral = carrito ? carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0) : 0;

  return (
    <div className="carrito-pagina-container">
      <div className="carrito-tarjeta-principal">
        <h2 className="carrito-titulo-grande">Tu Carrito de Compras</h2>
        <p className="carrito-subtitulo-tienda">Gestioná los productos de higiene mecánica antes de finalizar el pedido.</p>
        
        <div className="carrito-tabla-cabecera">
          <div>Producto</div>
          <div>Detalle</div>
          <div>Cantidad</div>
          <div>Subtotal</div>
          <div>Acción</div>
        </div>

        <div className="carrito-listado-cuerpo">
          {!carrito || carrito.length === 0 ? (
            <div className="carrito-seccion-vacia">
              <p className="carrito-icono-vacio">🛒</p>
              <h3>Tu carrito está vacío</h3>
              {/* 2. Le damos vida al botón cuando está vacío */}
              <button onClick={volverAlCatalogo} className="btn-seguir-comprando" style={{ marginTop: '15px' }}>
                Ir a ver productos
              </button>
            </div>
          ) : (
            <>
              {carrito.map((item) => (
                <div key={item.id} className="carrito-fila-item">
                  
                  <div className="carrito-col-foto">
                    <img 
                      src={item.foto || "https://via.placeholder.com/80/374151/ffffff?text=Insumo"} 
                      alt={item.nombre} 
                    />
                  </div>

                  <div className="carrito-col-detalle">
                    <span className="carrito-item-nombre-txt">{item.nombre}</span>
                    <span className="carrito-item-precio-unitario">Precio unitario: ${item.precio.toFixed(2)}</span>
                  </div>

                  {/* 3. COLUMNA CANTIDAD: Agregamos el botón + al lado del número */}
                  <div className="carrito-col-cantidad" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="carrito-badge-multiplicador">x{item.cantidad}</span>
                    <button 
                      onClick={() => agregarAlCarrito(item)}
                      style={{ 
                        background: '#e2e8f0', color: '#1e293b', border: 'none', 
                        borderRadius: '50%', width: '28px', height: '28px', 
                        fontSize: '18px', cursor: 'pointer', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                      title="Agregar una unidad más"
                    >
                      +
                    </button>
                  </div>

                  <div className="carrito-col-subtotal">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </div>

                  <div className="carrito-col-eliminar">
                    <button 
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="btn-eliminar"
                      title="Eliminar producto"
                    >
                      ✕
                    </button>
                  </div>

                </div>
              ))}

              <div className="carrito-resumen-gastos">
                <div className="carrito-fila-total">
                  <span>Valor Total General:</span>
                  <span className="carrito-monto-total">${valorTotalGeneral.toFixed(2)}</span>
                </div>
                <div className="carrito-contenedor-botones">
                  {/* 4. Le damos vida al botón de volver con onClick */}
                  <button onClick={volverAlCatalogo} className="btn-seguir-comprando">
                    Volver al catálogo
                  </button>
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