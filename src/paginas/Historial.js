import React, { useState } from 'react';
import './Historial.css'; 

// Registros iniciales de prueba para que la tabla no se vea vacía al iniciar
const INITIAL_REGISTROS = [
  { id: "REG-001", maquina: "Elevador Hidráulico Norte", tarea: "Limpieza de pistones y cambio de sellos", status: "Completado" },
  { id: "REG-002", maquina: "Compresor de Aire 50L", tarea: "Purga de agua y revisión de mangueras de seguridad", status: "Revisado" },
  { id: "REG-003", maquina: "Fosa de Alineación #2", tarea: "Remoción de residuos grasos pesados en rampa", status: "Pendiente" }
];

export default function Historial() {
  const [registros, setRegistros] = useState(INITIAL_REGISTROS);
  const [pestanaActiva, setPestanaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const pestañas = ['Todos', 'Revisado', 'Completado', 'Pendiente'];

  const registrosFiltrados = registros.filter(reg => {
    const coincidePestana = pestanaActiva === 'Todos' || reg.status === pestanaActiva;
    const coincideBusqueda = 
      (reg.id && reg.id.toLowerCase().includes(busqueda.toLowerCase())) || 
      (reg.maquina && reg.maquina.toLowerCase().includes(busqueda.toLowerCase())) ||
      (reg.tarea && reg.tarea.toLowerCase().includes(busqueda.toLowerCase()));
    return coincidePestana && coincideBusqueda;
  });

  return (
    <div className="historial-contenedor">
      <div className="historial-tarjeta-principal">
        
        {/* TÍTULOS */}
        <div>
          <h1 className="historial-titulo">Historial de Higiene y Mantenimiento Mecánico</h1>
          <p className="historial-subtitulo">Registro y control preventivo de la maquinaria del taller.</p>
        </div>

        {/* BUSCADOR Y PESTAÑAS */}
        <div className="historial-barra-herramientas">
          <div className="historial-grupo-pestanas">
            {pestañas.map(tab => (
              <button 
                key={tab} 
                className={`historial-boton-tab ${pestanaActiva === tab ? 'activa' : ''}`}
                onClick={() => setPestanaActiva(tab)}
              >
                {tab === 'Todos' ? 'Todos los registros' : tab}
              </button>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Buscar por equipo, tarea o ID..." 
            className="historial-input-filtro"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* TABLA DE REGISTROS COMPLETADA */}
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px' }}>ID Registro</th>
                <th style={{ padding: '12px' }}>Maquinaria / Equipo</th>
                <th style={{ padding: '12px' }}>Tarea Realizada</th>
                <th style={{ padding: '12px' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    No se encontraron registros que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                registrosFiltrados.map((reg) => (
                  <tr key={reg.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#555' }}>{reg.id}</td>
                    <td style={{ padding: '12px' }}>{reg.maquina}</td>
                    <td style={{ padding: '12px', color: '#666' }}>{reg.tarea}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: reg.status === 'Completado' ? '#e2fbe8' : reg.status === 'Revisado' ? '#e2f1fb' : '#fbeee2',
                        color: reg.status === 'Completado' ? '#28a745' : reg.status === 'Revisado' ? '#007bff' : '#fd7e14'
                      }}>
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
