package com.lubcker.ecommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResenasRequestDTO {
    private int idCliente;
    private int idProducto;
    private int valoracion;
    private String descripcion;
}