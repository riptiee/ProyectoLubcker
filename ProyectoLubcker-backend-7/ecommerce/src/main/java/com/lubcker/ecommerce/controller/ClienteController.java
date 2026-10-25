package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.ClienteDTO;
import com.lubcker.ecommerce.dto.ClienteRequestDTO;
import com.lubcker.ecommerce.model.Cliente;
import com.lubcker.ecommerce.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping
    public List<ClienteDTO> listar() {
        return clienteRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> obtener(@PathVariable int id) {
        return clienteRepository.findById(id)
                .map(cliente -> ResponseEntity.ok(toDTO(cliente)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClienteDTO> crear(@RequestBody ClienteRequestDTO datos) {
        Cliente cliente = new Cliente();
        cliente.setNombre(datos.getNombre());
        cliente.setApellido(datos.getApellido());

        Cliente guardado = clienteRepository.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> actualizar(@PathVariable int id, @RequestBody ClienteRequestDTO datos) {
        return clienteRepository.findById(id)
                .map(cliente -> {
                    cliente.setNombre(datos.getNombre());
                    cliente.setApellido(datos.getApellido());
                    Cliente actualizado = clienteRepository.save(cliente);
                    return ResponseEntity.ok(toDTO(actualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!clienteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        clienteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ClienteDTO toDTO(Cliente cliente) {
        return new ClienteDTO(
                cliente.getIdCliente(),
                cliente.getNombre(),
                cliente.getApellido()
        );
    }
}