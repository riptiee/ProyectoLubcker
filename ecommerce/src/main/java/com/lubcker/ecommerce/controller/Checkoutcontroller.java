package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.CheckoutRequestDTO;
import com.lubcker.ecommerce.dto.CheckoutResponseDTO;
import com.lubcker.ecommerce.service.CheckoutException;
import com.lubcker.ecommerce.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;

    // POST /api/checkout -> crea orden + detalles + pago + envio en una sola operacion
    @PostMapping
    public ResponseEntity<CheckoutResponseDTO> procesar(@RequestBody CheckoutRequestDTO datos) {
        CheckoutResponseDTO respuesta = checkoutService.procesar(datos);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    // Errores de negocio -> 400 con un mensaje legible para mostrar en el frontend
    @ExceptionHandler(CheckoutException.class)
    public ResponseEntity<Map<String, String>> manejarError(CheckoutException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje", e.getMessage()));
    }
}