package com.lubcker.ecommerce.dto;

import lombok.*;

// Lo que el cliente (frontend) manda en el body al crear/editar un producto.
// Solo pide el id de la categoria, no el objeto completo.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductoRequestDTO {
    private String nombre;
    private int precio;
    private int idCategoria;
}