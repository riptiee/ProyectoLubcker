package com.lubcker.ecommerce.model;
import jakarta.persistence.*;

@Entity
@Table(name="ficha_tecnica")
public class Ficha_Tecnica {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_ficha;

	@OneToOne
	@JoinColumn(name="id_producto")
	private Producto producto;

	private String modelo;
	private String presentacion;
	private String descripcion;

	public Ficha_Tecnica() {}

	public Ficha_Tecnica(int id_ficha, Producto producto, String modelo, String presentacion, String descripcion) {
		this.id_ficha = id_ficha;
		this.producto = producto;
		this.modelo = modelo;
		this.presentacion = presentacion;
		this.descripcion = descripcion;
	}

	//GETTERS Y SETTERS
	public int getId_ficha() {return id_ficha;}
	public void setId_ficha(int id_ficha) {this.id_ficha = id_ficha;}

	public Producto getProducto() {return producto;}
	public void setProducto(Producto producto) {this.producto = producto;}

	public String getModelo() {return modelo;}
	public void setModelo(String modelo) {this.modelo = modelo;}

	public String getPresentacion() {return presentacion;}
	public void setPresentacion(String presentacion) {this.presentacion = presentacion;}

	public String getDescripcion() {return descripcion;}
	public void setDescripcion(String descripcion) {this.descripcion = descripcion;}
}
