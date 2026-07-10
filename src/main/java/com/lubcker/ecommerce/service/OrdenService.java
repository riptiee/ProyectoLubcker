package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.Orden;
import com.lubcker.ecommerce.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    // Obtener todos los productos
    public List<Orden> findAll() {
        return ordenRepository.findAll();
    }

    // Buscar producto por ID
    public Optional<Orden> findById(int id) {
        return ordenRepository.findById(id);
    }

    // Crear o actualizar producto
    public Orden save(Orden orden) {
        return ordenRepository.save(orden);
    }

    // Eliminar producto por ID
    public void deleteById(int id) {
        ordenRepository.deleteById(id);
    }
}