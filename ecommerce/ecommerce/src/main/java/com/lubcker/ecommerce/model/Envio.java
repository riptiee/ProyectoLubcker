package com.lubcker.ecommerce.model;
import jakarta.persistence.*;

@Entity
@Table(name = "envio")
public class Envio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_envio;

	@OneToOne
	@JoinColumn(name="id_orden")
	private Orden orden;

	@OneToOne
	@JoinColumn(name="id_direccion")
	private Direccion direccion;

	@OneToOne
	@JoinColumn(name="id_empresa")
	private Empresa_Logistica empresa_logistica;

	private String estado;

	public Envio(){}

	public Envio(int id_envio, Orden orden, Direccion direccion, Empresa_Logistica empresa_logistica, String estado){
		this.id_envio = id_envio;
		this.orden = orden;
		this.direccion = direccion;
		this.empresa_logistica = empresa_logistica;
		this.estado = estado;
	}

	// GETTERS Y SETTERS

	public int getId_envio() {return id_envio;}
	public void setId_envio(int id_envio) {this.id_envio = id_envio;}

	public Orden getOrden() {return orden;}
	public void setOrden(Orden orden) {this.orden = orden;}

	public Direccion getDireccion() {return direccion;}
	public void setDireccion(Direccion direccion) {this.direccion = direccion;}

	public Empresa_Logistica getEmpresa_logistica() {return empresa_logistica;}
	public void setEmpresa_logistica(Empresa_Logistica empresa_logistica) {this.empresa_logistica = empresa_logistica;}

	public String getEstado() {return estado;}
	public void setEstado(String estado) {this.estado = estado;}
}
