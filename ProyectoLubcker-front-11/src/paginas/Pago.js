import React, { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Importamos el contexto de sesión
import './Pago.css';

const Pago = ({ carrito, vaciarCarrito }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useAuth(); // Obtenemos el usuario logueado del contexto
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [formulario, setFormulario] = useState({
    nombre: '', email: '', direccion: '', ciudad: '', tarjetaNumero: '', tarjetaExpiracion: '', tarjetaCvv: ''
  });

  // REQUERIMIENTO TAREA 8: Si no hay sesión iniciada, redirige al login guardando la ruta origen
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const procesarPago = (e) => {
    e.preventDefault();
    alert('¡Pago procesado con éxito! Muchas gracias por tu compra en Lubcker.');
    if (vaciarCarrito) vaciarCarrito(); 
    navigate('/historial'); 
  };

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
            
            <h3>Datos de Envío</h3>
            <input type="text" name="nombre" placeholder="Nombre completo" required onChange={manejarCambio} />
            <input type="email" name="email" placeholder="Correo electrónico" required onChange={manejarCambio} />
            <input type="text" name="direccion" placeholder="Dirección de entrega" required onChange={manejarCambio} />
            <input type="text" name="ciudad" placeholder="Ciudad / Provincia" required onChange={manejarCambio} />

            <h3>Método de Pago</h3>
            <div className="pago-metodos-opciones">
              <label>
                <input type="radio" name="metodo" checked={metodoPago === 'tarjeta'} onChange={() => setMetodoPago('tarjeta')} />
                Tarjeta de Crédito/Débito
              </label>
              <label>
                <input type="radio" name="metodo" checked={metodoPago === 'transferencia'} onChange={() => setMetodoPago('transferencia')} />
                Transferencia Bancaria
              </label>
            </div>

            {metodoPago === 'tarjeta' && (
              <div className="pago-datos-tarjeta">
                <input type="text" name="tarjetaNumero" placeholder="Número de tarjeta" maxLength="16" required onChange={manejarCambio} />
                <div className="pago-tarjeta-exp-cvv">
                  <input type="text" name="tarjetaExpiracion" placeholder="MM/AA" maxLength="5" required onChange={manejarCambio} />
                  <input type="text" name="tarjetaCvv" placeholder="CVV" maxLength="4" required onChange={manejarCambio} />
                </div>
              </div>
            )}

            <button type="submit" className="btn-confirmar-pago">
              Confirmar y Pagar ${total.toFixed(2)}
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
                <span>${(item.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="pago-total-final">
            <span>Total a transferir:</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pago;
