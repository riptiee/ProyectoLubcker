package com.lubcker.ecommerce.model;
import jakarta.persistence.*;

@Entity
@Table(name = "detalle_orden")
public class Detalle_Orden {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_Detalle;

	@OneToOne
	@JoinColumn(name = "id_orden")
	private Orden orden;

	@ManyToOne
	@JoinColumn(name = "id_producto")
	private Producto producto;

	private int cantidad;
	private int subtotal;
	private int precio_unitario;

	// Constructor vacío (Obligatorio para JPA)
	public Detalle_Orden() {}

	// Constructor completo
	public Detalle_Orden(int id_Detalle, Orden orden, Producto producto, int cantidad, int precio_unitario, int subtotal){
		this.id_Detalle = id_Detalle;
		this.orden = orden;
		this.producto = producto;
		this.cantidad = cantidad;
		this.precio_unitario = precio_unitario;
		this.subtotal = subtotal;
	}

	// GETTERS Y SETTERS
	public int getId_Detalle() { return id_Detalle; }
	public void setId_Detalle(int id_Detalle) { this.id_Detalle = id_Detalle; }

	public Orden getOrden() { return orden; }
	public void setOrden(Orden orden) { this.orden = orden; }

	public Producto getProducto() { return producto; }
	public void setProducto(Producto producto) { this.producto = producto; }

	public int getCantidad() { return cantidad; }
	public void setCantidad(int cantidad) { this.cantidad = cantidad; }

	public int getPrecio_unitario() { return precio_unitario; }
	public void setPrecio_unitario(int precio_unitario) { this.precio_unitario = precio_unitario; }

	public int getSubtotal() { return subtotal; }
	public void setSubtotal(int subtotal) { this.subtotal = subtotal; }
}