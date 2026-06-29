package com.lubcker.ecommerce.model;
import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id_usuario;

	@ManyToOne
	@JoinColumn(name = "id_cliente") // Nombre de la columna en la BD
	private Cliente cliente;

	private String nombre_usuario;
	private String email;
	private String contrasena;

	public Usuario() {
	}

	// CONSTRUCTOR COMPLETO
	public Usuario(int id_usuario,Cliente cliente, String nombre_usuario, String email, String contrasena) {
		this.id_usuario = id_usuario;
		this.cliente = cliente;
		this.nombre_usuario = nombre_usuario;
		this.email = email;
		this.contrasena = contrasena;
	}

	// GETTERS Y SETTERS
	public int getIdUsuario() { return id_usuario; }
	public void setIdUsuario(int id_usuario) { this.id_usuario = id_usuario; }

	public Cliente getCliente() {return cliente;}
	public void setCliente(Cliente cliente) {this.cliente = cliente;}

	public String getNombre_usuario() { return nombre_usuario; }
	public void setNombre_usuario(String nombre_usuario) { this.nombre_usuario = nombre_usuario  ; }

	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }

	public String getContrasena() {return contrasena;}
	public void setContrasena(String contrasena) {this.contrasena = contrasena;}
}
