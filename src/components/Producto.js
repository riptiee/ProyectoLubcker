import './Producto.css';

const Producto = ({ producto, agregarAlCarrito }) => {
  return (
    <div className="producto-tarjeta">
      <h3>{producto.nombre}</h3>
      <p>Precio: ${producto.precio}</p>
      {/* Al hacer clic, ejecuta la función pasando este producto específico */}
      <button onClick={() => agregarAlCarrito(producto)}>
        Agregar al carritoao
      </button>
      <hr />
    </div>
  );
} 

export default Producto;