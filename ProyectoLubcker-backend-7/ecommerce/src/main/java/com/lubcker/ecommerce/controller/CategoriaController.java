package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.CategoriaDTO;
import com.lubcker.ecommerce.dto.CategoriaRequestDTO;
import com.lubcker.ecommerce.model.Categoria;
import com.lubcker.ecommerce.repository.CategoriaRepository;
import com.lubcker.ecommerce.repository.ProductoRepository; // 🔑 Importamos el repositorio de productos
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository; // 🔑 Inyectamos para validar dependencias

    @GetMapping
    public List<CategoriaDTO> listar() {
        return categoriaRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> obtener(@PathVariable int id) {
        return categoriaRepository.findById(id)
                .map(c -> ResponseEntity.ok(toDTO(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoriaDTO> crear(@RequestBody CategoriaRequestDTO datos) {
        Categoria categoria = new Categoria();
        categoria.setNombre(datos.getNombre());
        Categoria guardada = categoriaRepository.save(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardada));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> actualizar(@PathVariable int id, @RequestBody CategoriaRequestDTO datos) {
        return categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNombre(datos.getNombre());
                    return ResponseEntity.ok(toDTO(categoriaRepository.save(categoria)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable int id) { // 🔑 Cambiado a ResponseEntity<?> para permitir retornar texto
        if (!categoriaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // 🔑 REGLA DE NEGOCIO: Validamos si algún producto existente pertenece a esta categoría
        boolean tieneProductosAsociados = productoRepository.findAll().stream()
                .anyMatch(p -> p.getCategoria() != null && p.getCategoria().getIdCategoria() == id);

        if (tieneProductosAsociados) {
            // Retorna un error Bad Request (400) con el mensaje aclaratorio exigido
            return ResponseEntity.badRequest()
                    .body("No se puede eliminar la categoría porque contiene productos asociados.");
        }

        categoriaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private CategoriaDTO toDTO(Categoria c) {
        return new CategoriaDTO(c.getIdCategoria(), c.getNombre());
    }
}