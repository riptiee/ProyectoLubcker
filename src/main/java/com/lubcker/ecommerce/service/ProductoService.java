package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.Producto;
import com.lubcker.ecommerce.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Obtener todos los productos
    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    // Buscar producto por ID
    public Optional<Producto> findById(int id) {
        return productoRepository.findById(id);
    }

    // Crear o actualizar producto
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    // Eliminar producto por ID
    public void deleteById(int id) {
        productoRepository.deleteById(id);
    }
}