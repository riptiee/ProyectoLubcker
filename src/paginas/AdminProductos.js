import React, { useState, useEffect } from 'react';
import './AdminProductos.css';

const CLAVE_ALMACENAMIENTO = 'lubcker_admin_productos';

const PRODUCTOS_INICIALES = [
  {
    id: 1,
    nombre: "1DEDO",
    precio: 40000,
    imagen: require('../assets/productos/1DEDO.jpg'),
    categoria: 'limpieza'
  },
  {
    id: 2,
    nombre: "Limpiador de Frenos Aerosol",
    precio: 10.00,
    imagen: "https://picsum.photos/seed/frenos/300/300",
    categoria: 'limpieza'
  },
  {
    id: 3,
    nombre: "Filtro de Aceite Universal",
    precio: 22.00,
    imagen: "https://picsum.photos/seed/filtro/300/300",
    categoria: 'mantenimiento'
  },
  {
    id: 4,
    nombre: "Líquido de Frenos Premium",
    precio: 18.00,
    imagen: "https://picsum.photos/seed/liquido/300/300",
    categoria: 'seguridad'
  }
];

const FORMULARIO_VACIO = { nombre: '', precio: '', categoria: 'limpieza', imagen: '' };

export default function AdminProductos() {
  // No hay backend todavía: persistimos en localStorage para simular altas/bajas/ediciones reales
  const [productos, setProductos] = useState(() => {
    try {
      const guardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);
      return guardados ? JSON.parse(guardados) : PRODUCTOS_INICIALES;
    } catch {
      return PRODUCTOS_INICIALES;
    }
  });

  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditandoId, setProductoEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);

  useEffect(() => {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(productos));
  }, [productos]);

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormularioNuevo = () => {
    setProductoEditandoId(null);
    setFormulario(FORMULARIO_VACIO);
    setModalAbierto(true);
  };

  const abrirFormularioEdicion = (producto) => {
    setProductoEditandoId(producto.id);
    setFormulario({
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
      imagen: producto.imagen
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
    const imagenFinal = formulario.imagen.trim() || 'https://picsum.photos/300/300';
    const precioFinal = parseFloat(formulario.precio) || 0;

    if (productoEditandoId) {
      setProductos(prev => prev.map(p =>
        p.id === productoEditandoId
          ? { ...p, nombre: formulario.nombre, precio: precioFinal, categoria: formulario.categoria, imagen: imagenFinal }
          : p
      ));
    } else {
      const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
      setProductos(prev => [
        ...prev,
        { id: nuevoId, nombre: formulario.nombre, precio: precioFinal, categoria: formulario.categoria, imagen: imagenFinal }
      ]);
    }
    cerrarModal();
  };

  const eliminarProducto = (id, nombre) => {
    const confirmar = window.confirm(`¿Seguro que querés eliminar "${nombre}"? Esta acción no se puede deshacer.`);
    if (confirmar) {
      setProductos(prev => prev.filter(p => p.id !== id));
    }
  };

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

                <span className={`admin-producto-categoria-badge categoria-${producto.categoria}`}>
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
                    step="0.01"
                    value={formulario.precio}
                    onChange={manejarCambioFormulario}
                    required
                    className="admin-form-input"
                    placeholder="0.00"
                  />
                </div>

                <div className="admin-form-grupo">
                  <label htmlFor="categoria">Categoría</label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formulario.categoria}
                    onChange={manejarCambioFormulario}
                    className="admin-form-input"
                  >
                    <option value="limpieza">Limpieza</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="seguridad">Seguridad</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-grupo">
                <label htmlFor="imagen">URL de la Imagen</label>
                <input
                  id="imagen"
                  name="imagen"
                  type="text"
                  value={formulario.imagen}
                  onChange={manejarCambioFormulario}
                  className="admin-form-input"
                  placeholder="https://..."
                />
              </div>

              {formulario.imagen && (
                <div className="admin-form-preview">
                  <img src={formulario.imagen} alt="Vista previa" />
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
