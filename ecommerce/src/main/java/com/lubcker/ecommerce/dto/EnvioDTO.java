package com.lubcker.ecommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnvioDTO {
    private int idEnvio;
    private int idOrden;
    private int idDireccion;
    private int idEmpresa;
    private String nombreEmpresa;
    private String estado;
}