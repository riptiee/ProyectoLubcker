package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.MetodoPago;
import com.lubcker.ecommerce.repository.MetodoPagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MetodoPagoService {

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    // Obtener todos los productos
    public List<MetodoPago> findAll() {
        return metodoPagoRepository.findAll();
    }

    // Buscar producto por ID
    public Optional<MetodoPago> findById(int id) {
        return metodoPagoRepository.findById(id);
    }

    // Crear o actualizar producto
    public MetodoPago save(MetodoPago metodoPago) {
        return metodoPagoRepository.save(metodoPago);
    }

    // Eliminar producto por ID
    public void deleteById(int id) {
        metodoPagoRepository.deleteById(id);
    }
}