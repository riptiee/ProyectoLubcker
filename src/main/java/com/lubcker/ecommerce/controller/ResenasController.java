package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.ResenasDTO;
import com.lubcker.ecommerce.dto.ResenasRequestDTO;
import com.lubcker.ecommerce.model.Cliente;
import com.lubcker.ecommerce.model.Producto;
import com.lubcker.ecommerce.model.Resenas;
import com.lubcker.ecommerce.repository.ClienteRepository;
import com.lubcker.ecommerce.repository.ProductoRepository;
import com.lubcker.ecommerce.repository.ResenasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resenas")
public class ResenasController {

    @Autowired
    private ResenasRepository resenasRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<ResenasDTO> listar() {
        return resenasRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResenasDTO> obtener(@PathVariable int id) {
        return resenasRepository.findById(id)
                .map(r -> ResponseEntity.ok(toDTO(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/resenas/producto/{idProducto} -> resenas de un producto (para su pagina de detalle)
    @GetMapping("/producto/{idProducto}")
    public List<ResenasDTO> listarPorProducto(@PathVariable int idProducto) {
        return resenasRepository.findAll().stream()
                .filter(r -> r.getProducto() != null && r.getProducto().getIdProducto() == idProducto)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<ResenasDTO> crear(@RequestBody ResenasRequestDTO datos) {
        Cliente cliente = clienteRepository.findById(datos.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + datos.getIdCliente()));
        Producto producto = productoRepository.findById(datos.getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + datos.getIdProducto()));

        Resenas resena = new Resenas();
        resena.setCliente(cliente);
        resena.setProducto(producto);
        resena.setValoracion(datos.getValoracion());
        resena.setDescripcion(datos.getDescripcion());

        Resenas guardada = resenasRepository.save(resena);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardada));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResenasDTO> actualizar(@PathVariable int id, @RequestBody ResenasRequestDTO datos) {
        return resenasRepository.findById(id)
                .map(resena -> {
                    resena.setValoracion(datos.getValoracion());
                    resena.setDescripcion(datos.getDescripcion());
                    return ResponseEntity.ok(toDTO(resenasRepository.save(resena)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!resenasRepository.existsById(id)) return ResponseEntity.notFound().build();
        resenasRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ResenasDTO toDTO(Resenas r) {
        return new ResenasDTO(
                r.getIdResenas(),
                r.getCliente() != null ? r.getCliente().getIdCliente() : 0,
                r.getCliente() != null ? r.getCliente().getNombre() + " " + r.getCliente().getApellido() : null,
                r.getProducto() != null ? r.getProducto().getIdProducto() : 0,
                r.getProducto() != null ? r.getProducto().getNombre() : null,
                r.getValoracion(),
                r.getDescripcion()
        );
    }
}