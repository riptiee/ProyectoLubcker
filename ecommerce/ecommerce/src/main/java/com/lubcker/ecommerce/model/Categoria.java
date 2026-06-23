package com.lubcker.ecommerce.model;
import jakarta.persistence.*;

@Entity
@Table(name = "categoria")
public class Categoria{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_categoria;

	private String nombre;

	public Categoria() {
	}

	// CONSTRUCTOR COMPLETO
	public Categoria(int id_categoria, String nombre) {
		this.id_categoria = id_categoria;
		this.nombre = nombre;
	}

	// GETTERS Y SETTERS
	public int getIdCategoria() { return id_categoria; }
	public void setIdCategoria(int id_categoria) { this.id_categoria = id_categoria; }

	public String getNombre() { return nombre; }
	public void setNombre(String nombre) { this.nombre = nombre; }

}