import React, { useState, useEffect } from 'react';
import './AdminProductos.css';

const API_URL = 'http://localhost:8080/api';

function resolverImagen(valor) {
  if (!valor) return 'https://picsum.photos/300';
  if (valor.startsWith('http')) return valor;
  try {
    return require(`../assets/productos/${valor}`);
  } catch {
    return 'https://picsum.photos/300';
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
  };
}

const FORMULARIO_VACIO = { nombre: '', precio: '', idCategoria: '', imagen: '' };

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
      fetch(`${API_URL}/productos`).then((res) => res.json()),
      fetch(`${API_URL}/categorias`).then((res) => res.json()),
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

  const abrirFormularioEdicion = (producto) => {
    setProductoEditandoId(producto.id);
    setFormulario({
      nombre: producto.nombre,
      precio: producto.precio,
      idCategoria: producto.idCategoria,
      imagen: producto.imagenValor,
    });
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
    const url = esEdicion ? `${API_URL}/productos/${productoEditandoId}` : `${API_URL}/productos`;
    const metodo = esEdicion ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al guardar');
        cargarDatos();
        cerrarModal();
      })
      .catch(() => {
        alert('No se pudo guardar el producto. Revisá que todos los campos sean válidos.');
      });
  };

  const eliminarProducto = (id, nombre) => {
    const confirmar = window.confirm(`¿Seguro que querés eliminar "${nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Error al eliminar');
        setProductos(prev => prev.filter(p => p.id !== id));
      })
      .catch(() => {
        alert('No se pudo eliminar el producto.');
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
            <p className="admin-productos-subtitulo">Gestioná el catálogo de la tienda: editá, eliminá o sumá nuevos productos.</p>
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
            {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto publicado' : 'productos publicados'}
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
              <div key={producto.id} className="admin-producto-tarjeta">
                <div className="admin-producto-imagen-contenedor">
                  <img src={producto.imagen} alt={producto.nombre} className="admin-producto-imagen" />
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
                  <button className="btn-admin-eliminar" onClick={() => eliminarProducto(producto.id, producto.nombre)}>
                    Eliminar
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

              <div className="admin-form-grupo">
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