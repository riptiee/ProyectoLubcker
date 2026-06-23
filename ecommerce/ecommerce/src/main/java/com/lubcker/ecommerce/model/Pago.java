package com.lubcker.ecommerce.model;
import jakarta.persistence.*;
import org.aspectj.weaver.ast.Or;

@Entity
@Table(name="pago")
public class Pago {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_pago;

	@ManyToOne
	@JoinColumn(name = "id_orden")
	private Orden orden;

	@ManyToOne
	@JoinColumn(name = "metodo_pago")
	private MetodoPago metodoPago;

	private boolean estado;
	private int monto;

	public Pago(){}

	public Pago(int id_pago, Orden orden, MetodoPago metodoPago, boolean estado, int monto){
		this.id_pago = id_pago;
		this.orden = orden;
		this.metodoPago = metodoPago;
		this.estado = estado;
		this.monto = monto;
	}

	//GETTERS Y SETTERS
	public int getId_pago() {return id_pago;}
	public void setId_pago(int id_pago) {this.id_pago = id_pago;}

	public Orden getOrden() {return orden;}
	public void setOrden(Orden orden) {this.orden = orden;}

	public MetodoPago getMetodoPago() {return metodoPago;}
	public void setMetodoPago(MetodoPago metodoPago) {this.metodoPago = metodoPago;}

	public boolean isEstado() {return estado;}
	public void setEstado(boolean estado) {this.estado = estado;}

	public int getMonto() {return monto;}
	public void setMonto(int monto) {this.monto = monto;}
}
