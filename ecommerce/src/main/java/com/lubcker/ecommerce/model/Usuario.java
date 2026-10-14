package com.lubcker.ecommerce.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idUsuario;

	@OneToOne
	@JoinColumn(name = "id_cliente")
	private Cliente cliente;

	private String nombreUsuario;
	private String email;
	private String contrasena;
}