package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.MetodoPagoDTO;
import com.lubcker.ecommerce.dto.MetodoPagoRequestDTO;
import com.lubcker.ecommerce.model.MetodoPago;
import com.lubcker.ecommerce.repository.MetodoPagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/metodos-pago")
public class MetodoPagoController {

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @GetMapping
    public List<MetodoPagoDTO> listar() {
        return metodoPagoRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetodoPagoDTO> obtener(@PathVariable int id) {
        return metodoPagoRepository.findById(id)
                .map(m -> ResponseEntity.ok(toDTO(m)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MetodoPagoDTO> crear(@RequestBody MetodoPagoRequestDTO datos) {
        MetodoPago metodo = new MetodoPago();
        metodo.setNombre(datos.getNombre());
        MetodoPago guardado = metodoPagoRepository.save(metodo);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MetodoPagoDTO> actualizar(@PathVariable int id, @RequestBody MetodoPagoRequestDTO datos) {
        return metodoPagoRepository.findById(id)
                .map(metodo -> {
                    metodo.setNombre(datos.getNombre());
                    return ResponseEntity.ok(toDTO(metodoPagoRepository.save(metodo)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!metodoPagoRepository.existsById(id)) return ResponseEntity.notFound().build();
        metodoPagoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private MetodoPagoDTO toDTO(MetodoPago m) {
        return new MetodoPagoDTO(m.getIdMetodo(), m.getNombre());
    }
}