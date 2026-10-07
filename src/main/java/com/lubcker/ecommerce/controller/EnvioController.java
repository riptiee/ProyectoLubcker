package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.EnvioDTO;
import com.lubcker.ecommerce.dto.EnvioRequestDTO;
import com.lubcker.ecommerce.model.Direccion;
import com.lubcker.ecommerce.model.Empresa_Logistica;
import com.lubcker.ecommerce.model.Envio;
import com.lubcker.ecommerce.model.Orden;
import com.lubcker.ecommerce.repository.DireccionRepository;
import com.lubcker.ecommerce.repository.Empresa_LogisticaRepository;
import com.lubcker.ecommerce.repository.EnvioRepository;
import com.lubcker.ecommerce.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/envios")
public class EnvioController {

    @Autowired
    private EnvioRepository envioRepository;

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private Empresa_LogisticaRepository empresaLogisticaRepository;

    @GetMapping
    public List<EnvioDTO> listar() {
        return envioRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnvioDTO> obtener(@PathVariable int id) {
        return envioRepository.findById(id)
                .map(e -> ResponseEntity.ok(toDTO(e)))
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/envios/orden/{idOrden} -> seguimiento del envio de una orden puntual
    @GetMapping("/orden/{idOrden}")
    public ResponseEntity<EnvioDTO> obtenerPorOrden(@PathVariable int idOrden) {
        return envioRepository.findAll().stream()
                .filter(e -> e.getOrden() != null && e.getOrden().getIdOrden() == idOrden)
                .findFirst()
                .map(e -> ResponseEntity.ok(toDTO(e)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EnvioDTO> crear(@RequestBody EnvioRequestDTO datos) {
        Orden orden = ordenRepository.findById(datos.getIdOrden())
                .orElseThrow(() -> new RuntimeException("Orden no encontrada: " + datos.getIdOrden()));
        Direccion direccion = direccionRepository.findById(datos.getIdDireccion())
                .orElseThrow(() -> new RuntimeException("Direccion no encontrada: " + datos.getIdDireccion()));
        Empresa_Logistica empresa = empresaLogisticaRepository.findById(datos.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("Empresa logistica no encontrada: " + datos.getIdEmpresa()));

        Envio envio = new Envio();
        envio.setOrden(orden);
        envio.setDireccion(direccion);
        envio.setEmpresaLogistica(empresa);
        envio.setEstado(datos.getEstado() != null ? datos.getEstado() : "pendiente");

        Envio guardado = envioRepository.save(envio);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardado));
    }

    // PUT /api/envios/{id}/estado -> el uso mas comun: actualizar el estado del envio
    @PutMapping("/{id}/estado")
    public ResponseEntity<EnvioDTO> actualizarEstado(@PathVariable int id, @RequestBody String estado) {
        return envioRepository.findById(id)
                .map(envio -> {
                    envio.setEstado(estado);
                    return ResponseEntity.ok(toDTO(envioRepository.save(envio)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!envioRepository.existsById(id)) return ResponseEntity.notFound().build();
        envioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private EnvioDTO toDTO(Envio e) {
        return new EnvioDTO(
                e.getIdEnvio(),
                e.getOrden() != null ? e.getOrden().getIdOrden() : 0,
                e.getDireccion() != null ? e.getDireccion().getIdDireccion() : 0,
                e.getEmpresaLogistica() != null ? e.getEmpresaLogistica().getIdEmpresa() : 0,
                e.getEmpresaLogistica() != null ? e.getEmpresaLogistica().getNombre() : null,
                e.getEstado()
        );
    }
}