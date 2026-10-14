package com.lubcker.ecommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResenasDTO {
    private int idResenas;
    private int idCliente;
    private String nombreCliente;
    private int idProducto;
    private String nombreProducto;
    private int valoracion;
    private String descripcion;
}