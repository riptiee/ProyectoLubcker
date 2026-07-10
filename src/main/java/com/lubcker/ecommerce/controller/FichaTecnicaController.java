package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.FichaTecnicaDTO;
import com.lubcker.ecommerce.dto.FichaTecnicaRequestDTO;
import com.lubcker.ecommerce.model.Ficha_Tecnica;
import com.lubcker.ecommerce.model.Producto;
import com.lubcker.ecommerce.repository.Ficha_TecnicaRepository;
import com.lubcker.ecommerce.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/fichas-tecnicas")
public class FichaTecnicaController {

    @Autowired
    private Ficha_TecnicaRepository fichaTecnicaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<FichaTecnicaDTO> listar() {
        return fichaTecnicaRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FichaTecnicaDTO> obtener(@PathVariable int id) {
        return fichaTecnicaRepository.findById(id)
                .map(f -> ResponseEntity.ok(toDTO(f)))
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/fichas-tecnicas/producto/{idProducto} -> ficha tecnica de un producto puntual
    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<FichaTecnicaDTO> obtenerPorProducto(@PathVariable int idProducto) {
        return fichaTecnicaRepository.findAll().stream()
                .filter(f -> f.getProducto() != null && f.getProducto().getIdProducto() == idProducto)
                .findFirst()
                .map(f -> ResponseEntity.ok(toDTO(f)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FichaTecnicaDTO> crear(@RequestBody FichaTecnicaRequestDTO datos) {
        Producto producto = productoRepository.findById(datos.getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + datos.getIdProducto()));

        Ficha_Tecnica ficha = new Ficha_Tecnica();
        ficha.setProducto(producto);
        ficha.setModelo(datos.getModelo());
        ficha.setPresentacion(datos.getPresentacion());
        ficha.setDescripcion(datos.getDescripcion());

        Ficha_Tecnica guardada = fichaTecnicaRepository.save(ficha);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardada));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FichaTecnicaDTO> actualizar(@PathVariable int id, @RequestBody FichaTecnicaRequestDTO datos) {
        return fichaTecnicaRepository.findById(id)
                .map(ficha -> {
                    ficha.setModelo(datos.getModelo());
                    ficha.setPresentacion(datos.getPresentacion());
                    ficha.setDescripcion(datos.getDescripcion());
                    return ResponseEntity.ok(toDTO(fichaTecnicaRepository.save(ficha)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!fichaTecnicaRepository.existsById(id)) return ResponseEntity.notFound().build();
        fichaTecnicaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private FichaTecnicaDTO toDTO(Ficha_Tecnica f) {
        return new FichaTecnicaDTO(
                f.getIdFicha(),
                f.getProducto() != null ? f.getProducto().getIdProducto() : 0,
                f.getModelo(),
                f.getPresentacion(),
                f.getDescripcion()
        );
    }
}