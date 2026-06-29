package com.lubcker.ecommerce.model;
import jakarta.persistence.*;

@Entity
@Table(name="empresa_logistica")

public class Empresa_Logistica {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_empresa;

	private String nombre;
	private String sucursal;

	public Empresa_Logistica(){}

	// CONSTRUCTOR COMPLETO
	public Empresa_Logistica(int id_empresa, String nombre, String sucursal) {
		this.id_empresa = id_empresa;
		this.nombre = nombre;
		this.sucursal = sucursal;
	}

	// GETTERS Y SETTERS
	public int getIdEmpresa() { return id_empresa; }
	public void setIdEmpresa(int id_empresa) { this.id_empresa = id_empresa; }

	public String getNombre() { return nombre; }
	public void setNombre(String nombre) { this.nombre = nombre; }

	public String getSucursal() { return sucursal; }
	public void setSucursal(String sucursal) { this.sucursal = sucursal; }

}
