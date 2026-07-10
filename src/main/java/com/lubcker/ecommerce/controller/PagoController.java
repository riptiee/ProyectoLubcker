package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.PagoDTO;
import com.lubcker.ecommerce.dto.PagoRequestDTO;
import com.lubcker.ecommerce.model.MetodoPago;
import com.lubcker.ecommerce.model.Orden;
import com.lubcker.ecommerce.model.Pago;
import com.lubcker.ecommerce.repository.MetodoPagoRepository;
import com.lubcker.ecommerce.repository.OrdenRepository;
import com.lubcker.ecommerce.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @GetMapping
    public List<PagoDTO> listar() {
        return pagoRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PagoDTO> obtener(@PathVariable int id) {
        return pagoRepository.findById(id)
                .map(p -> ResponseEntity.ok(toDTO(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/pagos/orden/{idOrden} -> pagos hechos sobre una orden (soporta pagos parciales)
    @GetMapping("/orden/{idOrden}")
    public List<PagoDTO> listarPorOrden(@PathVariable int idOrden) {
        return pagoRepository.findAll().stream()
                .filter(p -> p.getOrden() != null && p.getOrden().getIdOrden() == idOrden)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<PagoDTO> crear(@RequestBody PagoRequestDTO datos) {
        Orden orden = ordenRepository.findById(datos.getIdOrden())
                .orElseThrow(() -> new RuntimeException("Orden no encontrada: " + datos.getIdOrden()));
        MetodoPago metodoPago = metodoPagoRepository.findById(datos.getIdMetodoPago())
                .orElseThrow(() -> new RuntimeException("Metodo de pago no encontrado: " + datos.getIdMetodoPago()));

        Pago pago = new Pago();
        pago.setOrden(orden);
        pago.setMetodoPago(metodoPago);
        pago.setMonto(datos.getMonto());
        pago.setEstado(false); // se crea pendiente, se confirma aparte

        Pago guardado = pagoRepository.save(pago);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardado));
    }

    // PUT /api/pagos/{id}/confirmar -> marca el pago como aprobado (estado = true)
    @PutMapping("/{id}/confirmar")
    public ResponseEntity<PagoDTO> confirmar(@PathVariable int id) {
        return pagoRepository.findById(id)
                .map(pago -> {
                    pago.setEstado(true);
                    return ResponseEntity.ok(toDTO(pagoRepository.save(pago)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!pagoRepository.existsById(id)) return ResponseEntity.notFound().build();
        pagoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private PagoDTO toDTO(Pago p) {
        return new PagoDTO(
                p.getIdPago(),
                p.getOrden() != null ? p.getOrden().getIdOrden() : 0,
                p.getMetodoPago() != null ? p.getMetodoPago().getIdMetodo() : 0,
                p.getMetodoPago() != null ? p.getMetodoPago().getNombre() : null,
                p.isEstado(),
                p.getMonto()
        );
    }
}