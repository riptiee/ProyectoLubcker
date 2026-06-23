package com.lubcker.ecommerce.model;
import jakarta.persistence.*;

@Entity
@Table(name = "direccion")
public class Direccion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_direccion;

	@ManyToOne
	@JoinColumn(name = "id_cliente")
	private Cliente cliente;

	private String provincia;
	private String ciudad;
	private String calle;
	private int altura;

	public Direccion(){}

	public Direccion(int id_direccion, Cliente cliente, String provincia, String ciudad, String calle, int altura ){
		this.id_direccion = id_direccion;
		this.cliente = cliente;
		this.provincia = provincia;
		this.ciudad = ciudad;
		this.calle = calle;
		this.altura = altura;
	}

	/* GETTERS Y SETTERS */

	public int getId_direccion() {return id_direccion;}
	public void setId_direccion(int id_direccion) {this.id_direccion = id_direccion;}

	public Cliente getCliente() {return cliente;}
	public void setCliente(Cliente cliente) {this.cliente = cliente;}

	public String getProvicia() {return provincia;}
	public void setProvicia(String provincia) {this.provincia = provincia;}

	public String getCiudad() {return ciudad;}
	public void setCiudad(String ciudad) {this.ciudad = ciudad;}

	public String getCalle() {return calle;}
	public void setCalle(String calle) {this.calle = calle;}

	public int getAltura() {return altura;}
	public void setAltura(int altura) {this.altura = altura;}
}
