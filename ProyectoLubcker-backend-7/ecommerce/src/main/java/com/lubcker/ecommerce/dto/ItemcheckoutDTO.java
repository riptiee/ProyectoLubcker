package com.lubcker.ecommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemCheckoutDTO {
    private int idProducto;
    private int cantidad;
}