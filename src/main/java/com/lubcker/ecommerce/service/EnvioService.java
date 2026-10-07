package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.Envio;
import com.lubcker.ecommerce.repository.EnvioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnvioService {

    @Autowired
    private EnvioRepository envioRepository;

    // Obtener todos los productos
    public List<Envio> findAll() {
        return envioRepository.findAll();
    }

    // Buscar producto por ID
    public Optional<Envio> findById(int id) {
        return envioRepository.findById(id);
    }

    // Crear o actualizar producto
    public Envio save(Envio envio) {
        return envioRepository.save(envio);
    }

    // Eliminar producto por ID
    public void deleteById(int id) {
        envioRepository.deleteById(id);
    }
}