package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.Pago;
import com.lubcker.ecommerce.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    // Obtener todos los productos
    public List<Pago> findAll() {
        return pagoRepository.findAll();
    }

    // Buscar producto por ID
    public Optional<Pago> findById(int id) {
        return pagoRepository.findById(id);
    }

    // Crear o actualizar producto
    public Pago save(Pago pago) {
        return pagoRepository.save(pago);
    }

    // Eliminar producto por ID
    public void deleteById(int id) {
        pagoRepository.deleteById(id);
    }
}