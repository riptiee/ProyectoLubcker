package com.lubcker.ecommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private int idProducto;
    private String nombre;
    private int precio;
    private int idCategoria;
    private String nombreCategoria;
}