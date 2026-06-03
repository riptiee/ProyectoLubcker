import React, { useState } from 'react';
import './Historial.css'; // Asegurate de importar el archivo CSS acá

// Lista completamente vacía para arrancar desde cero
const INITIAL_REGISTROS = [];

// CORRECCIÓN: Cambiamos el nombre a "Historial" para que coincida con el App.js
export default function Historial() {
  const [registros, setRegistros] = useState(INITIAL_REGISTROS);
  const [pestanaActiva, setPestanaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const pestañas = ['Todos', 'Revisado', 'Completado', 'Pendiente'];

  // Lógica de filtrado en JS
  const registrosFiltrados = registros.filter(reg => {
    const coincidePestana = pestanaActiva === 'Todos' || reg.status === pestanaActiva;
    const coincideBusqueda = reg.id?.toLowerCase().includes(busqueda.toLowerCase()) || 
                             reg.maquina?.toLowerCase().includes(busqueda.toLowerCase()) ||
                             reg.tarea?.toLowerCase().includes(busqueda.toLowerCase());
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

        {/* HEADERS DE LA TABLA */}
        <div className="historial-encabezado-tabla">
          <div>Evidencia</div>
          <div>Detalle de Tarea</div>
          <div>Encargado</div>
          <div>Estatus</div>
          <div>Acción</div>
        </div>

        {/* CONMUTADOR DE FILAS O VISTA VACÍA */}
        <div className="historial-listado">
          {registrosFiltrados.length > 0 ? (
            registrosFiltrados.map((reg) => (
              <div key={reg.id} className="historial-tarjeta-fila">
                <div className="historial-info-fila-superior">
                  <div><strong>ID Control:</strong> {reg.id}</div>
                  <div>Fecha Registro: {reg.fecha}</div>
                </div>
                <div className="historial-cuerpo-fila-contenido">
                  <div className="historial-col-evidencia">
                    <img src={reg.foto} alt="evidencia" />
                  </div>
                  <div className="historial-col-detalle">
                    <span className="historial-maquina">{reg.maquina}</span>
                    <span className="historial-tarea">{reg.tarea}</span>
                  </div>
                  <div className="historial-col-encargado">{reg.operario}</div>
                  <div className="historial-col-estatus">
                    <span className={`historial-badge-estado ${reg.status.toLowerCase()}`}>
                      {reg.status}
                    </span>
                  </div>
                  <div className="historial-col-accion">
                    <span className="historial-link-ficha">Ver Ficha</span>
                    <button className="historial-boton-accion-naranja">Reportar</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Vista por defecto al estar vacío */
            <div className="historial-vista-vacia">
              <p className="historial-icono-vacio">🔧</p>
              <p className="historial-texto-vacio-principal">No hay registros de higiene técnica cargados.</p>
              <p className="historial-texto-vacio-secundario">Los nuevos controles de mantenimiento aparecerán en este listado.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}