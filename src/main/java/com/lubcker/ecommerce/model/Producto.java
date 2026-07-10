package com.lubcker.ecommerce.model;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "producto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idProducto;

	@ManyToOne
	@JoinColumn(name = "id_categoria")
	private Categoria categoria;

	@OneToMany(mappedBy = "producto")
	private List<Resenas> resenas;

	@OneToOne(mappedBy = "producto")
	private Ficha_Tecnica fichaTecnica;

	@OneToMany(mappedBy = "producto")
	private List<Detalle_Orden> detalles;

	private String nombre;
	private int precio;
}