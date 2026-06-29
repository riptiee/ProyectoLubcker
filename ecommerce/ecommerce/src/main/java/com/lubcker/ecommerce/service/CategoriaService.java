package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.Categoria;
import com.lubcker.ecommerce.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Obtener todos los productos
    public List<Categoria> findAll() {
        return categoriaRepository.findAll();
    }

    // Buscar producto por ID
    public Optional<Categoria> findById(int id) {
        return categoriaRepository.findById(id);
    }

    // Crear o actualizar producto
    public Categoria save(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    // Eliminar producto por ID
    public void deleteById(int id) {
        categoriaRepository.deleteById(id);
    }
}