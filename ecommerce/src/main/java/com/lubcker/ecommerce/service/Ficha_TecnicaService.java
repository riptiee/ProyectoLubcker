package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.Ficha_Tecnica;
import com.lubcker.ecommerce.repository.Ficha_TecnicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Ficha_TecnicaService {

    @Autowired
    private Ficha_TecnicaRepository ficha_tecnicaRepository;

    // Obtener todos los productos
    public List<Ficha_Tecnica> findAll() {
        return ficha_tecnicaRepository.findAll();
    }

    // Buscar producto por ID
    public Optional<Ficha_Tecnica> findById(int id) {
        return ficha_tecnicaRepository.findById(id);
    }

    // Crear o actualizar producto
    public Ficha_Tecnica save(Ficha_Tecnica ficha_tecnica) {
        return ficha_tecnicaRepository.save(ficha_tecnica);
    }

    // Eliminar producto por ID
    public void deleteById(int id) {
        ficha_tecnicaRepository.deleteById(id);
    }
}