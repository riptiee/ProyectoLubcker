package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.ProductoDTO;
import com.lubcker.ecommerce.dto.ProductoRequestDTO;
import com.lubcker.ecommerce.model.Categoria;
import com.lubcker.ecommerce.model.Producto;
import com.lubcker.ecommerce.repository.CategoriaRepository;
import com.lubcker.ecommerce.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    public List<ProductoDTO> listar() {
        return productoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtener(@PathVariable int id) {
        return productoRepository.findById(id)
                .map(p -> ResponseEntity.ok(toDTO(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{idCategoria}")
    public List<ProductoDTO> listarPorCategoria(@PathVariable int idCategoria) {
        return productoRepository.findAll()
                .stream()
                .filter(p -> p.getCategoria() != null && p.getCategoria().getIdCategoria() == idCategoria)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> crear(@RequestBody ProductoRequestDTO datos) {
        Categoria categoria = categoriaRepository.findById(datos.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada: " + datos.getIdCategoria()));

        Producto producto = new Producto();
        producto.setNombre(datos.getNombre());
        producto.setPrecio(datos.getPrecio());
        producto.setCategoria(categoria);

        Producto guardado = productoRepository.save(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> actualizar(@PathVariable int id, @RequestBody ProductoRequestDTO datos) {
        return productoRepository.findById(id)
                .map(producto -> {
                    Categoria categoria = categoriaRepository.findById(datos.getIdCategoria())
                            .orElseThrow(() -> new RuntimeException("Categoria no encontrada: " + datos.getIdCategoria()));
                    producto.setNombre(datos.getNombre());
                    producto.setPrecio(datos.getPrecio());
                    producto.setCategoria(categoria);
                    Producto actualizado = productoRepository.save(producto);
                    return ResponseEntity.ok(toDTO(actualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!productoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ProductoDTO toDTO(Producto p) {
        return new ProductoDTO(
                p.getIdProducto(),
                p.getNombre(),
                p.getPrecio(),
                p.getCategoria() != null ? p.getCategoria().getIdCategoria() : 0,
                p.getCategoria() != null ? p.getCategoria().getNombre() : null
        );
    }
}