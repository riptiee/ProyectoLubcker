package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.DetalleOrdenDTO;
import com.lubcker.ecommerce.dto.OrdenDTO;
import com.lubcker.ecommerce.dto.OrdenRequestDTO;
import com.lubcker.ecommerce.model.Cliente;
import com.lubcker.ecommerce.model.Detalle_Orden;
import com.lubcker.ecommerce.model.Orden;
import com.lubcker.ecommerce.repository.ClienteRepository;
import com.lubcker.ecommerce.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping
    public List<OrdenDTO> listar() {
        return ordenRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenDTO> obtener(@PathVariable int id) {
        return ordenRepository.findById(id)
                .map(orden -> ResponseEntity.ok(toDTO(orden)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{idCliente}")
    public List<OrdenDTO> listarPorCliente(@PathVariable int idCliente) {
        return ordenRepository.findAll()
                .stream()
                .filter(o -> o.getCliente() != null && o.getCliente().getIdCliente() == idCliente)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // POST /api/ordenes -> crea la orden vacia (sin productos todavia).
    // Los productos se agregan despues via POST /api/detalles-orden
    @PostMapping
    public ResponseEntity<OrdenDTO> crear(@RequestBody OrdenRequestDTO datos) {
        Cliente cliente = clienteRepository.findById(datos.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + datos.getIdCliente()));

        Orden orden = new Orden();
        orden.setCliente(cliente);
        orden.setFecha(new Date());

        Orden guardada = ordenRepository.save(orden);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!ordenRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ordenRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private OrdenDTO toDTO(Orden orden) {
        List<DetalleOrdenDTO> detalles = orden.getDetalles() == null
                ? Collections.emptyList()
                : orden.getDetalles().stream()
                  .map(this::detalleToDTO)
                  .collect(Collectors.toList());

        return new OrdenDTO(
                orden.getIdOrden(),
                orden.getCliente() != null ? orden.getCliente().getIdCliente() : 0,
                orden.getCliente() != null ? orden.getCliente().getNombre() + " " + orden.getCliente().getApellido() : null,
                orden.getFecha(),
                detalles
        );
    }

    private DetalleOrdenDTO detalleToDTO(Detalle_Orden d) {
        return new DetalleOrdenDTO(
                d.getIdDetalle(),
                d.getOrden().getIdOrden(),
                d.getProducto().getIdProducto(),
                d.getProducto().getNombre(),
                d.getCantidad(),
                d.getPrecioUnitario(),
                d.getSubtotal()
        );
    }
}