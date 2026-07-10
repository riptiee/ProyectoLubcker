package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.UsuarioDTO;
import com.lubcker.ecommerce.dto.UsuarioRequestDTO;
import com.lubcker.ecommerce.model.Cliente;
import com.lubcker.ecommerce.model.Usuario;
import com.lubcker.ecommerce.repository.ClienteRepository;
import com.lubcker.ecommerce.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    // Nunca devolvemos la contrasena: UsuarioDTO no tiene ese campo a proposito.
    @GetMapping
    public List<UsuarioDTO> listar() {
        return usuarioRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtener(@PathVariable int id) {
        return usuarioRepository.findById(id)
                .map(u -> ResponseEntity.ok(toDTO(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> crear(@RequestBody UsuarioRequestDTO datos) {
        Cliente cliente = clienteRepository.findById(datos.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + datos.getIdCliente()));

        Usuario usuario = new Usuario();
        usuario.setCliente(cliente);
        usuario.setNombreUsuario(datos.getNombreUsuario());
        usuario.setEmail(datos.getEmail());
        // TODO: hashear con BCrypt antes de guardar. Por ahora se guarda en texto
        // plano, algo que NO deberia llegar a produccion.
        usuario.setContrasena(datos.getContrasena());

        Usuario guardado = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizar(@PathVariable int id, @RequestBody UsuarioRequestDTO datos) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNombreUsuario(datos.getNombreUsuario());
                    usuario.setEmail(datos.getEmail());
                    if (datos.getContrasena() != null && !datos.getContrasena().isBlank()) {
                        usuario.setContrasena(datos.getContrasena()); // TODO: hashear
                    }
                    return ResponseEntity.ok(toDTO(usuarioRepository.save(usuario)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!usuarioRepository.existsById(id)) return ResponseEntity.notFound().build();
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private UsuarioDTO toDTO(Usuario u) {
        return new UsuarioDTO(
                u.getIdUsuario(),
                u.getCliente() != null ? u.getCliente().getIdCliente() : 0,
                u.getNombreUsuario(),
                u.getEmail()
        );
    }
}