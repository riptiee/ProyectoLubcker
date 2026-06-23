package com.lubcker.ecommerce.model;
import jakarta.persistence.*;

@Entity
@Table(name="Resenas")
public class Resenas {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_resenas;

	@ManyToOne
	@JoinColumn(name="id_cliente")
	private Cliente cliente;

	@ManyToOne
	@JoinColumn(name="id_producto")
	private Producto producto;

	private int valoracion;
	private String descripcion;

	public Resenas() {}

	public Resenas(int id_resenas, Cliente cliente, Producto producto, int valoracion, String descripcion) {
		this.id_resenas = id_resenas;
		this.cliente = cliente;
		this.producto = producto;
		this.valoracion = valoracion;
		this.descripcion = descripcion;
	}

	//GETTERS Y SETTERS
	public int getId_resenas() {return id_resenas;}
	public void setId_resenas(int id_resenas) {this.id_resenas = id_resenas;}

	public Cliente getCliente() {return cliente;}
	public void setCliente(Cliente cliente) {this.cliente = cliente;}

	public Producto getProducto() {return producto;}
	public void setProducto(Producto producto) {this.producto = producto;}

	public int getValoracion() {return valoracion;}
	public void setValoracion(int valoracion) {this.valoracion = valoracion;}

	public String getDescripcion() {return descripcion;}
	public void setDescripcion(String descripcion) {this.descripcion = descripcion;}
}
