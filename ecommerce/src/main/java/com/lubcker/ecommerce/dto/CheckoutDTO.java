package com.lubcker.ecommerce.dto;

import lombok.*;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutDTO {
    private int idOrden;
    private Date fecha;
    private int total;
    private int idPago;
    private String nombreMetodoPago;
    private boolean pagoConfirmado;
    private int idEnvio;
    private String estadoEnvio;
    private String nombreEmpresa;
    private String direccionEnvio;
    private List<DetalleOrdenDTO> detalles;
}