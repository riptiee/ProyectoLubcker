import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Historial.css';

const API_URL = 'http://localhost:8080/api';

export default function Historial() {
  const { usuario } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const idCliente = usuario?.idCliente;

  useEffect(() => {
    if (!idCliente) {
      setCargando(false);
      return;
    }
    setCargando(true);
    setError(null);
    fetch(`${API_URL}/ordenes/cliente/${idCliente}`)
      .then((res) => {
        if (!res.ok) throw new Error('error');
        return res.json();
      })
      .then((data) => {
        setOrdenes([...data].sort((a, b) => b.idOrden - a.idOrden));
        setCargando(false);
      })
      .catch(() => {
        setError('No se pudo cargar tu historial. ¿Está corriendo el backend?');
        setCargando(false);
      });
  }, [idCliente]);

  if (!usuario) {
    return (
      <div className="historial-contenedor">
        <div className="historial-tarjeta-principal">
          <h1 className="historial-titulo">Historial de Compras</h1>
          <p className="historial-subtitulo">
            Necesitás iniciar sesión para ver tus compras. <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    );
  }

  const totalOrden = (orden) =>
    (orden.detalles || []).reduce((suma, d) => suma + d.subtotal, 0);

  const ordenesFiltradas = ordenes.filter((orden) => {
    const texto = busqueda.toLowerCase();
    return (
      String(orden.idOrden).includes(texto) ||
      (orden.detalles || []).some((d) => d.nombreProducto.toLowerCase().includes(texto))
    );
  });

  return (
    <div className="historial-contenedor">
      <div className="historial-tarjeta-principal">

        <div>
          <h1 className="historial-titulo">Historial de Compras</h1>
          <p className="historial-subtitulo">Los pedidos realizados con tu cuenta, {usuario.nombreUsuario}.</p>
        </div>

        <div className="historial-barra-herramientas">
          <input
            type="text"
            placeholder="Buscar por producto o número de pedido..."
            className="historial-input-filtro"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {cargando && <p style={{ marginTop: '20px' }}>Cargando historial...</p>}
        {error && <p style={{ marginTop: '20px', color: '#dc2626' }}>{error}</p>}

        {!cargando && !error && (
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'sans-serif' }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px' }}>Pedido</th>
                  <th style={{ padding: '12px' }}>Fecha</th>
                  <th style={{ padding: '12px' }}>Productos</th>
                  <th style={{ padding: '12px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                      {ordenes.length === 0
                        ? 'Todavía no realizaste ninguna compra.'
                        : 'No se encontraron pedidos que coincidan con la búsqueda.'}
                    </td>
                  </tr>
                ) : (
                  ordenesFiltradas.map((orden) => (
                    <tr key={orden.idOrden} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#555' }}>#{orden.idOrden}</td>
                      <td style={{ padding: '12px' }}>
                        {orden.fecha ? new Date(orden.fecha).toLocaleDateString('es-AR') : '-'}
                      </td>
                      <td style={{ padding: '12px', color: '#666' }}>
                        {(orden.detalles || []).map((d) => (
                          <div key={d.idDetalle}>{d.cantidad} × {d.nombreProducto}</div>
                        ))}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>${totalOrden(orden)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}