package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.Direccion;
import com.lubcker.ecommerce.repository.DireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DireccionService {

    @Autowired
    private DireccionRepository direccionRepository;

    // Obtener todos los productos
    public List<Direccion> findAll() {
        return direccionRepository.findAll();
    }

    // Buscar producto por ID
    public Optional<Direccion> findById(int id) {
        return direccionRepository.findById(id);
    }

    // Crear o actualizar producto
    public Direccion save(Direccion direccion) {
        return direccionRepository.save(direccion);
    }

    // Eliminar producto por ID
    public void deleteById(int id) {
        direccionRepository.deleteById(id);
    }
}