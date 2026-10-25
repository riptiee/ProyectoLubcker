import React, { useState, useEffect } from 'react';
import './AdminProductos.css';
import API_URL from './config'; // 🔑 Ahora se usa únicamente la API de tu variable de entorno externa

function resolverImagen(valor) {
  if (!valor) return 'https://picsum.photos';
  if (valor.startsWith('http')) return valor;
  try {
    return require(`../assets/productos/${valor}`);
  } catch {
    return 'https://picsum.photos';
  }
}

function mapearProducto(p) {
  return {
    id: p.idProducto,
    nombre: p.nombre,
    precio: p.precio,
    imagenValor: p.imagen || '',
    imagen: resolverImagen(p.imagen),
    categoria: (p.nombreCategoria || '').toLowerCase(),
    idCategoria: p.idCategoria,
    // 🔑 Punto 7: Las filas viejas o nulas cuentan como activas por defecto (true)
    activo: p.activo !== false, 
  };
}

// 🔑 Punto 6: Estructura vacía incluyendo las propiedades de la Ficha Técnica
const FORMULARIO_VACIO = { 
  nombre: '', 
  precio: '', 
  idCategoria: '', 
  imagen: '',
  modelo: '',
  presentacion: '',
  descripcion: ''
};

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditandoId, setProductoEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);

  const cargarDatos = () => {
    setCargando(true);
    Promise.all([
      fetch(`${API_URL}/api/productos`).then((res) => res.json()), // 🔑 Ajustadas las rutas de la API global
      fetch(`${API_URL}/api/categorias`).then((res) => res.json()),
    ])
      .then(([dataProductos, dataCategorias]) => {
        setProductos(dataProductos.map(mapearProducto));
        setCategorias(dataCategorias);
        setCargando(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los datos. ¿Está corriendo el backend?');
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormularioNuevo = () => {
    setProductoEditandoId(null);
    setFormulario({
      ...FORMULARIO_VACIO,
      idCategoria: categorias[0]?.idCategoria || '',
    });
    setModalAbierto(true);
  };

  // 🔑 Punto 6: Al editar un producto, cargamos sus datos básicos y disparamos un GET para traer su ficha técnica
  const abrirFormularioEdicion = (producto) => {
    setProductoEditandoId(producto.id);
    
    // Primero seteamos los datos que ya conocemos del producto
    setFormulario({
      nombre: producto.nombre,
      precio: producto.precio,
      idCategoria: producto.idCategoria,
      imagen: producto.imagenValor,
      modelo: '',
      presentacion: '',
      descripcion: ''
    });

    // 🔑 Punto 6: Consumimos la API para leer la Ficha Técnica asociada al ID de este producto
    fetch(`${API_URL}/api/fichas-tecnicas/producto/${producto.id}`)
      .then(res => {
        if (!res.ok) return null; // Si no tiene ficha aún, no pasa nada
        return res.json();
      })
      .then(ficha => {
        if (ficha) {
          setFormulario(prev => ({
            ...prev,
            modelo: ficha.modelo || '',
            presentacion: ficha.presentacion || '',
            descripcion: ficha.descripcion || ''
          }));
        }
      })
      .catch(err => console.error("No se pudo cargar la ficha técnica:", err));

    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEditandoId(null);
    setFormulario(FORMULARIO_VACIO);
  };

  const manejarCambioFormulario = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const guardarProducto = (e) => {
    e.preventDefault();

    const cuerpo = {
      nombre: formulario.nombre,
      precio: parseInt(formulario.precio, 10) || 0,
      idCategoria: parseInt(formulario.idCategoria, 10),
      imagen: formulario.imagen.trim(),
    };

    const esEdicion = productoEditandoId !== null;
    const url = esEdicion ? `${API_URL}/api/productos/${productoEditandoId}` : `${API_URL}/api/productos`;
    const metodo = esEdicion ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al guardar el producto básico');
        return res.json();
      })
      .then((productoGuardado) => {
        // 🔑 Punto 6: Una vez que el producto se creó o guardó con éxito, enviamos la Ficha Técnica a su propia API
        const idProductoFinal = esEdicion ? productoEditandoId : productoGuardado.idProducto;

        const cuerpoFicha = {
          idProducto: idProductoFinal,
          modelo: formulario.modelo,
          presentacion: formulario.presentacion,
          descripcion: formulario.descripcion
        };

        return fetch(`${API_URL}/api/fichas-tecnicas`, {
          method: 'POST', // Usualmente POST sirve tanto para crear como guardar actualizaciones de ficha
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cuerpoFicha)
        });
      })
      .then(() => {
        cargarDatos();
        cerrarModal();
      })
      .catch(() => {
        alert('No se pudo guardar el producto o su ficha técnica. Revisá los campos.');
      });
  };

  // 🔑 Punto 7: "Eliminar" pasa a ser una mutación del campo 'activo' (Descontinuar o Reactivar)
  const toggleEstadoProducto = (id, nombre, estadoActual) => {
    const palabraAccion = estadoActual ? 'descontinuar' : 'reactivar';
    const confirmar = window.confirm(`¿Seguro que querés ${palabraAccion} el producto "${nombre}"?`);
    if (!confirmar) return;

    // Enviamos una petición PUT para actualizar únicamente la propiedad 'activo' del producto
    fetch(`${API_URL}/api/productos/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !estadoActual })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al cambiar el estado del producto');
        cargarDatos(); // Volvemos a listar todo para actualizar el panel
      })
      .catch(() => {
        alert(`No se pudo ${palabraAccion} el producto.`);
      });
  };

  if (cargando) {
    return <p className="admin-productos-vacio">Cargando productos...</p>;
  }

  if (error) {
    return <p className="admin-productos-vacio">{error}</p>;
  }

  return (
    <div className="admin-productos-contenedor">
      <div className="admin-productos-tarjeta-principal">

        <div className="admin-productos-encabezado">
          <div>
            <h1 className="admin-productos-titulo">Mis Productos Publicados</h1>
            <p className="admin-productos-subtitulo">Gestioná el catálogo de la tienda: editá, descontinuá o sumá nuevos productos.</p>
          </div>
          <button className="btn-admin-agregar" onClick={abrirFormularioNuevo}>
            + Agregar Producto
          </button>
        </div>

        <div className="admin-productos-barra-herramientas">
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            className="admin-productos-input-busqueda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <span className="admin-productos-contador">
            {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto listado' : 'productos listados'}
          </span>
        </div>

        {productosFiltrados.length === 0 ? (
          <div className="admin-productos-vacio">
            <p>{productos.length === 0 ? 'Todavía no tenés productos publicados.' : 'No se encontraron productos con esa búsqueda.'}</p>
            {productos.length === 0 && (
              <button className="btn-admin-agregar" onClick={abrirFormularioNuevo}>+ Agregar tu primer producto</button>
            )}
          </div>
        ) : (
          <div className="admin-productos-grid">
            {productosFiltrados.map((producto) => (
              // 🔑 Punto 7: Si el producto está descontinuado, le aplicamos una clase visual opcional de CSS
              <div key={producto.id} className={`admin-producto-tarjeta ${!producto.activo ? 'producto-descontinuado' : ''}`}>
                <div className="admin-producto-imagen-contenedor">
                  <img src={producto.imagen} alt={producto.nombre} className="admin-producto-imagen" />
                  
                  {/* 🔑 Punto 7: Mostrar etiqueta clara si el producto está descontinuado */}
                  {!producto.activo && (
                    <span style={{
                      position: 'absolute', top: '10px', left: '10px', backgroundColor: '#dc3545', 
                      color: 'white', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px'
                    }}>
                      DESCONTINUADO
                    </span>
                  )}
                </div>

                <span className="admin-producto-categoria-badge">
                  {producto.categoria}
                </span>

                <h3 className="admin-producto-nombre">{producto.nombre}</h3>
                <span className="admin-producto-precio">${producto.precio}</span>

                <div className="admin-producto-acciones">
                  <button className="btn-admin-editar" onClick={() => abrirFormularioEdicion(producto)}>
                    Editar
                  </button>
                  
                  {/* 🔑 Punto 7: El botón de eliminar cambia de color y texto dinámicamente según su estado actual */}
                  <button 
                    className={producto.activo ? "btn-admin-eliminar" : "btn-admin-reactivar"} 
                    style={{ backgroundColor: producto.activo ? '#dc3545' : '#28a745', color: 'white' }}
                    onClick={() => toggleEstadoProducto(producto.id, producto.nombre, producto.activo)}
                  >
                    {producto.activo ? 'Descontinuar' : 'Reactivar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalAbierto && (
        <div className="admin-modal-fondo" onClick={cerrarModal}>
          <div className="admin-modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal-titulo">
              {productoEditandoId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h2>

            <form onSubmit={guardarProducto} className="admin-modal-formulario">
              <div className="admin-form-grupo">
                <label htmlFor="nombre">Nombre del Producto</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formulario.nombre}
                  onChange={manejarCambioFormulario}
                  required
                  className="admin-form-input"
                  placeholder="Ej: Limpiador de Frenos Aerosol"
                />
              </div>

              <div className="admin-form-fila">
                <div className="admin-form-grupo">
                  <label htmlFor="precio">Precio ($)</label>
                  <input
                    id="precio"
                    name="precio"
                    type="number"
                    min="0"
                    step="1"
                    value={formulario.precio}
                    onChange={manejarCambioFormulario}
                    required
                    className="admin-form-input"
                    placeholder="0"
                  />
                </div>

                <div className="admin-form-grupo">
                  <label htmlFor="idCategoria">Categoría</label>
                  <select
                    id="idCategoria"
                    name="idCategoria"
                    value={formulario.idCategoria}
                    onChange={manejarCambioFormulario}
                    required
                    className="admin-form-input"
                  >
                    {categorias.length === 0 && <option value="">No hay categorías cargadas</option>}
                    {categorias.map((c) => (
                      <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 🔑 SECCIÓN PUNTO 6: AGREGADOS NUEVOS CAMPOS DE LA FICHA TÉCNICA */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginTop: '15px' }}>
                <h4 style={{ marginBottom: '10px', color: '#555' }}>Ficha Técnica del Producto</h4>
                
                <div className="admin-form-fila">
                  <div className="admin-form-grupo">
                    <label htmlFor="modelo">Modelo</label>
                    <input
                      id="modelo"
                      name="modelo"
                      type="text"
                      value={formulario.modelo}
                      onChange={manejarCambioFormulario}
                      className="admin-form-input"
                      placeholder="Ej: Premium X-200"
                    />
                  </div>

                  <div className="admin-form-grupo">
                    <label htmlFor="presentacion">Presentación</label>
                    <input
                      id="presentacion"
                      name="presentacion"
                      type="text"
                      value={formulario.presentacion}
                      onChange={manejarCambioFormulario}
                      className="admin-form-input"
                      placeholder="Ej: Aerosol 400ml / Bidón 5L"
                    />
                  </div>
                </div>

                <div className="admin-form-grupo" style={{ marginTop: '10px' }}>
                  <label htmlFor="descripcion">Descripción Técnica</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={manejarCambioFormulario}
                    className="admin-form-input"
                    style={{ minHeight: '60px', resize: 'vertical' }}
                    placeholder="Detalles sobre su uso, propiedades químicas o especificaciones mecánicas..."
                  />
                </div>
              </div>

              <div className="admin-form-grupo" style={{ marginTop: '15px' }}>
                <label htmlFor="imagen">Imagen (nombre de archivo local o URL)</label>
                <input
                  id="imagen"
                  name="imagen"
                  type="text"
                  value={formulario.imagen}
                  onChange={manejarCambioFormulario}
                  className="admin-form-input"
                  placeholder="1DEDO.jpg  o  https://..."
                />
              </div>

              {formulario.imagen && (
                <div className="admin-form-preview">
                  <img src={resolverImagen(formulario.imagen)} alt="Vista previa" />
                </div>
              )}

              <div className="admin-modal-acciones">
                <button type="button" className="btn-admin-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-admin-guardar">
                  {productoEditandoId ? 'Guardar Cambios' : 'Publicar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
