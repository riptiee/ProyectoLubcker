package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.Detalle_Orden;
import com.lubcker.ecommerce.repository.Detalle_OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Detalle_OrdenService {

    @Autowired
    private Detalle_OrdenRepository detalle_ordenRepository;

    // Obtener todos los productos
    public List<Detalle_Orden> findAll() {
        return detalle_ordenRepository.findAll();
    }

    // Buscar producto por ID
    public Optional<Detalle_Orden> findById(int id) {
        return detalle_ordenRepository.findById(id);
    }

    // Crear o actualizar producto
    public Detalle_Orden save(Detalle_Orden detalle_orden) {
        return detalle_ordenRepository.save(detalle_orden);
    }

    // Eliminar producto por ID
    public void deleteById(int id) {
        detalle_ordenRepository.deleteById(id);
    }
}