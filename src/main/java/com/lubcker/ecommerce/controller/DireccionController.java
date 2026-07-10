package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.DireccionDTO;
import com.lubcker.ecommerce.dto.DireccionRequestDTO;
import com.lubcker.ecommerce.model.Cliente;
import com.lubcker.ecommerce.model.Direccion;
import com.lubcker.ecommerce.repository.ClienteRepository;
import com.lubcker.ecommerce.repository.DireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/direcciones")
public class DireccionController {

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping
    public List<DireccionDTO> listar() {
        return direccionRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DireccionDTO> obtener(@PathVariable int id) {
        return direccionRepository.findById(id)
                .map(d -> ResponseEntity.ok(toDTO(d)))
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/direcciones/cliente/{idCliente} -> direcciones guardadas de un cliente
    @GetMapping("/cliente/{idCliente}")
    public List<DireccionDTO> listarPorCliente(@PathVariable int idCliente) {
        return direccionRepository.findAll().stream()
                .filter(d -> d.getCliente() != null && d.getCliente().getIdCliente() == idCliente)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<DireccionDTO> crear(@RequestBody DireccionRequestDTO datos) {
        Cliente cliente = clienteRepository.findById(datos.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + datos.getIdCliente()));

        Direccion direccion = new Direccion();
        direccion.setCliente(cliente);
        direccion.setProvincia(datos.getProvincia());
        direccion.setCiudad(datos.getCiudad());
        direccion.setCalle(datos.getCalle());
        direccion.setAltura(datos.getAltura());

        Direccion guardada = direccionRepository.save(direccion);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardada));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DireccionDTO> actualizar(@PathVariable int id, @RequestBody DireccionRequestDTO datos) {
        return direccionRepository.findById(id)
                .map(direccion -> {
                    direccion.setProvincia(datos.getProvincia());
                    direccion.setCiudad(datos.getCiudad());
                    direccion.setCalle(datos.getCalle());
                    direccion.setAltura(datos.getAltura());
                    return ResponseEntity.ok(toDTO(direccionRepository.save(direccion)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!direccionRepository.existsById(id)) return ResponseEntity.notFound().build();
        direccionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private DireccionDTO toDTO(Direccion d) {
        return new DireccionDTO(
                d.getIdDireccion(),
                d.getCliente() != null ? d.getCliente().getIdCliente() : 0,
                d.getProvincia(),
                d.getCiudad(),
                d.getCalle(),
                d.getAltura()
        );
    }
}