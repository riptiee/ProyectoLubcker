package com.lubcker.ecommerce.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "envio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Envio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idEnvio;

	@OneToOne
	@JoinColumn(name = "id_orden")
	private Orden orden;

	@ManyToOne
	@JoinColumn(name = "id_direccion")
	private Direccion direccion;

	@ManyToOne
	@JoinColumn(name = "id_empresa")
	private Empresa_Logistica empresaLogistica;

	private String estado;
}