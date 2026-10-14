import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Pago.css';

const API_URL = 'http://localhost:8080/api';

// Datos para pagos por transferencia. COMPLETAR con los datos reales del comercio.
const DATOS_BANCARIOS = {
  titular: 'COMPLETAR titular',
  banco: 'COMPLETAR banco',
  cbu: 'COMPLETAR CBU',
  alias: 'COMPLETAR alias',
};

const formatearPrecio = (numero) => Number(numero).toLocaleString('es-AR');

const Pago = ({ carrito, vaciarCarrito }) => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [metodos, setMetodos] = useState([]);
  const [idMetodoPago, setIdMetodoPago] = useState('');
  const [formulario, setFormulario] = useState({ provincia: '', ciudad: '', calle: '', altura: '' });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [pedido, setPedido] = useState(null);

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // Los métodos de pago salen de la base de datos (no están fijos en el código)
  useEffect(() => {
    fetch(`${API_URL}/metodos-pago`)
      .then((res) => res.json())
      .then((data) => {
        setMetodos(data);
        if (data.length > 0) setIdMetodoPago(data[0].idMetodo);
      })
      .catch(() => setError('No se pudieron cargar los métodos de pago. ¿Está corriendo el backend?'));
  }, []);

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const procesarPago = (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    // Se mandan solo ids y cantidades: los precios los calcula el backend
    const cuerpo = {
      idCliente: usuario.idCliente,
      idMetodoPago: Number(idMetodoPago),
      provincia: formulario.provincia.trim(),
      ciudad: formulario.ciudad.trim(),
      calle: formulario.calle.trim(),
      altura: parseInt(formulario.altura, 10) || 0,
      items: carrito.map((item) => ({ idProducto: item.id, cantidad: item.cantidad })),
    };

    fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.mensaje || 'No se pudo registrar la compra. Intentá de nuevo.');
        }
        return data;
      })
      .then((data) => {
        setPedido(data);
        if (vaciarCarrito) vaciarCarrito();
      })
      .catch((err) => {
        setError(err instanceof TypeError ? 'No se pudo conectar con el servidor.' : err.message);
      })
      .finally(() => setEnviando(false));
  };

  // Pantalla de confirmación (va antes del chequeo de carrito vacío porque el carrito ya se vació)
  if (pedido) {
    const nombreMetodo = (pedido.nombreMetodoPago || '').toLowerCase();
    const esTransferencia = nombreMetodo.includes('transferencia');
    const esMercadoPago = nombreMetodo.includes('mercado');

    return (
      <div className="pago-pagina-container">
        <div className="pago-confirmacion">
          <h2 className="pago-titulo">¡Pedido #{pedido.idOrden} registrado!</h2>

          <div className="pago-confirmacion-datos">
            <p>Total: <strong>${formatearPrecio(pedido.total)}</strong></p>
            <p>Método de pago: <strong>{pedido.nombreMetodoPago}</strong></p>
            <p>Estado del pago: <strong>{pedido.pagoConfirmado ? 'Confirmado' : 'Pendiente'}</strong></p>
            <p>Envío a: <strong>{pedido.direccionEnvio}</strong></p>
            <p>Empresa: <strong>{pedido.nombreEmpresa}</strong> · Estado: <strong>{pedido.estadoEnvio}</strong></p>
          </div>

          <h3>Detalle</h3>
          <div className="pago-productos-lista">
            {pedido.detalles.map((d) => (
              <div key={d.idDetalle} className="pago-item-resumen">
                <span>{d.nombreProducto} (x{d.cantidad})</span>
                <span>${formatearPrecio(d.subtotal)}</span>
              </div>
            ))}
          </div>

          {esTransferencia && (
            <div className="pago-datos-bancarios">
              <h3>Datos para transferir</h3>
              <p>Titular: <strong>{DATOS_BANCARIOS.titular}</strong></p>
              <p>Banco: <strong>{DATOS_BANCARIOS.banco}</strong></p>
              <p>CBU: <strong>{DATOS_BANCARIOS.cbu}</strong></p>
              <p>Alias: <strong>{DATOS_BANCARIOS.alias}</strong></p>
              <p>Importe a transferir: <strong>${formatearPrecio(pedido.total)}</strong></p>
            </div>
          )}

          {esMercadoPago && (
            <div className="pago-datos-bancarios">
              <h3>Pago con Mercado Pago</h3>
              {/* Acá se redirigirá al checkout de Mercado Pago cuando se integre el cobro real */}
              <p>Tu pago figura como pendiente hasta que se acredite.</p>
            </div>
          )}

          <div className="pago-botones-confirmacion">
            <button onClick={() => navigate('/historial')} className="btn-confirmar-pago">Ver mis compras</button>
            <button onClick={() => navigate('/')} className="btn-volver">Seguir comprando</button>
          </div>
        </div>
      </div>
    );
  }

  if (carrito.length === 0) {
    return (
      <div className="pago-contenedor-vacio">
        <h2>No hay productos para pagar</h2>
        <button onClick={() => navigate('/')} className="btn-volver">Ir al catálogo</button>
      </div>
    );
  }

  return (
    <div className="pago-pagina-container">
      <div className="pago-layout">

        {/* Formulario de Checkout */}
        <div className="pago-formulario-tarjeta">
          <h2 className="pago-titulo">Finalizar Compra</h2>
          <form onSubmit={procesarPago}>

            <h3>Dirección de envío</h3>
            <input type="text" name="provincia" placeholder="Provincia" required value={formulario.provincia} onChange={manejarCambio} />
            <input type="text" name="ciudad" placeholder="Ciudad" required value={formulario.ciudad} onChange={manejarCambio} />
            <input type="text" name="calle" placeholder="Calle" required value={formulario.calle} onChange={manejarCambio} />
            <input type="text" name="altura" placeholder="Altura (número)" inputMode="numeric" pattern="[0-9]*" required value={formulario.altura} onChange={manejarCambio} />

            <h3>Método de Pago</h3>
            <div className="pago-metodos-opciones">
              {metodos.map((metodo) => (
                <label key={metodo.idMetodo}>
                  <input
                    type="radio"
                    name="metodo"
                    checked={Number(idMetodoPago) === metodo.idMetodo}
                    onChange={() => setIdMetodoPago(metodo.idMetodo)}
                  />
                  {metodo.nombre}
                </label>
              ))}
            </div>

            {error && <p className="pago-error">{error}</p>}

            <button type="submit" className="btn-confirmar-pago" disabled={enviando || metodos.length === 0}>
              {enviando ? 'Procesando...' : `Confirmar pedido · $${formatearPrecio(total)}`}
            </button>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div className="pago-resumen-tarjeta">
          <h3>Resumen del Pedido</h3>
          <div className="pago-productos-lista">
            {carrito.map((item) => (
              <div key={item.id} className="pago-item-resumen">
                <span>{item.nombre} (x{item.cantidad})</span>
                <span>${formatearPrecio(item.precio * item.cantidad)}</span>
              </div>
            ))}
          </div>
          <div className="pago-total-final">
            <span>Total:</span>
            <strong>${formatearPrecio(total)}</strong>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pago;