package com.lubcker.ecommerce.model;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name="orden")
public class Orden {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_orden;

	@ManyToOne
	@JoinColumn(name="id_cliente")
	private Cliente cliente;

	private Date fecha;

	public Orden(){}

	public Orden(int id_orden, Cliente cliente, Date fecha){
		this.id_orden = id_orden;
		this.cliente = cliente ;
		this.fecha = fecha;
	}

	//GETTERS Y SETTERS
	public int getId_orden() {return id_orden;}
	public void setId_orden(int id_orden) {this.id_orden = id_orden;}

	public Cliente getCliente() {return cliente;}
	public void setCliente(Cliente cliente) {this.cliente = cliente;}

	public Date getFecha() {return fecha;}
	public void setFecha(Date fecha) {this.fecha = fecha;}
}
