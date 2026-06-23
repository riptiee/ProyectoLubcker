package com.lubcker.ecommerce.model;
import jakarta.persistence.*;

@Entity
@Table(name="metodo_pago")
public class MetodoPago {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_metodo;

	private String nombre;

	public MetodoPago(){}

	public MetodoPago(int id_metodo, String nombre){
		this.id_metodo = id_metodo;
		this.nombre = nombre;
	}
	public int getIdMetodoPago() {
		return id_metodo;
	}
	public void setIdMetodoPago(int id_metodo) {
		this.id_metodo = id_metodo;
	}

	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

}