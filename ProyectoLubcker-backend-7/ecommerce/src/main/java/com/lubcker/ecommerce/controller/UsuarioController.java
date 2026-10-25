package com.lubcker.ecommerce.controller;

import com.lubcker.ecommerce.dto.UsuarioDTO;
import com.lubcker.ecommerce.dto.UsuarioRequestDTO;
import com.lubcker.ecommerce.dto.LoginRequestDTO;
import com.lubcker.ecommerce.model.Cliente;
import com.lubcker.ecommerce.model.Usuario;
import com.lubcker.ecommerce.repository.ClienteRepository;
import com.lubcker.ecommerce.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    // 🔑 Creamos el codificador BCrypt aquí mismo para no tocar otros archivos de configuración
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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
        if (usuarioRepository.findByEmail(datos.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Cliente cliente = clienteRepository.findById(datos.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + datos.getIdCliente()));

        Usuario usuario = new Usuario();
        usuario.setCliente(cliente);
        usuario.setNombreUsuario(datos.getNombreUsuario());
        usuario.setEmail(datos.getEmail());
        
        usuario.setRol("CLIENTE"); // Requerimiento del Punto 1

        // 🔑 Modificado Punto 2: Se guarda la contraseña encriptada con BCrypt
        usuario.setContrasena(passwordEncoder.encode(datos.getContrasena()));

        Usuario guardado = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(guardado));
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioDTO> login(@RequestBody LoginRequestDTO datos) {
        // Buscamos el usuario por su email primero
        return usuarioRepository.findByEmail(datos.getEmail())
                .map(usuario -> {
                    String passwordGuardada = usuario.getContrasena();
                    boolean esValida = false;

                    // 🔑 Lógica Híbrida: ¿La contraseña existente ya está hasheada con BCrypt?
                    if (passwordGuardada != null && passwordGuardada.startsWith("$2")) {
                        // Sí, usamos el comparador nativo de BCrypt
                        esValida = passwordEncoder.matches(datos.getContrasena(), passwordGuardada);
                    } else {
                        // No está hasheada (cuenta antigua). Comparamos en texto plano
                        if (datos.getContrasena().equals(passwordGuardada)) {
                            esValida = true;
                            // Migración automática: La hasheamos y actualizamos la Base de Datos ahora mismo
                            usuario.setContrasena(passwordEncoder.encode(datos.getContrasena()));
                            usuarioRepository.save(usuario);
                        }
                    }

                    if (esValida) {
                        return ResponseEntity.ok(toDTO(usuario));
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).<UsuarioDTO>build();
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizar(@PathVariable int id, @RequestBody UsuarioRequestDTO datos) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNombreUsuario(datos.getNombreUsuario());
                    usuario.setEmail(datos.getEmail());
                    if (datos.getContrasena() != null && !datos.getContrasena().isBlank()) {
                        // 🔑 Modificado Punto 2: Al actualizar la clave, también se hashea
                        usuario.setContrasena(passwordEncoder.encode(datos.getContrasena()));
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
                u.getEmail(),
                u.getRol() // Requerimiento del Punto 1
        );
    }
}
