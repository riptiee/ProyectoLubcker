package com.lubcker.ecommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequestDTO {
    private int idCliente;
    private String nombreUsuario;
    private String email;
    private String contrasena;
}