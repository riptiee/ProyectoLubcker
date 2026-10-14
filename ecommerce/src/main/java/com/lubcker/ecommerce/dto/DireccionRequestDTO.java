package com.lubcker.ecommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DireccionRequestDTO {
    private int idCliente;
    private String provincia;
    private String ciudad;
    private String calle;
    private int altura;
}