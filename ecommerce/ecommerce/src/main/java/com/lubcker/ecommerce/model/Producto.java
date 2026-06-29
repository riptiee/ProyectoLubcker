package com.lubcker.ecommerce.model;
import jakarta.persistence.*;

@Entity
@Table(name="producto")
public class Producto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_producto;

	@OneToOne
	@JoinColumn(name="id_categoria")
	private Categoria categoria;

	@OneToMany
	@JoinColumn(name="id_resenas")
	private Resenas resenas;

	@OneToMany
	@JoinColumn(name="id_orden")
	private Orden orden;

	@OneToOne
	@JoinColumn(name="id_ficha")
	private Ficha_Tecnica ficha_tecnica;

	private String nombre;
	private int precio;

	public Producto(){}

	public Producto(int id_producto, Categoria categoria, Resenas resenas, Orden orden, Ficha_Tecnica ficha_tecnica, String nombre, int precio){
		this.id_producto =  id_producto;
		this.categoria =  categoria;
		this.resenas =  resenas;
		this.orden =  orden;
		this.ficha_tecnica =  ficha_tecnica;
		this.nombre =  nombre;
		this.precio =  precio;
	}

	//GETTERS Y SETTERS
	public int getId_producto() {return id_producto;}
	public void setId_producto(int id_producto) {this.id_producto = id_producto;}

	public Categoria getCategoria() {return categoria;}
	public void setCategoria(Categoria categoria) {this.categoria = categoria;}

	public Resenas getResenas() {return resenas;}
	public void setResenas(Resenas resenas) {this.resenas = resenas;}

	public Orden getOrden() {return orden;}
	public void setOrden(Orden orden) {this.orden = orden;}

	public Ficha_Tecnica getFicha_tecnica() {return ficha_tecnica;}
	public void setFicha_tecnica(Ficha_Tecnica ficha_tecnica) {this.ficha_tecnica = ficha_tecnica;}

	public String getNombre() {return nombre;}
	public void setNombre(String nombre) {this.nombre = nombre;}

	public int getPrecio() {return precio;}
	public void setPrecio(int precio) {this.precio = precio;}
}
