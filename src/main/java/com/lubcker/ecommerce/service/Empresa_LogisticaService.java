package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.Empresa_Logistica;
import com.lubcker.ecommerce.repository.Empresa_LogisticaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Empresa_LogisticaService {

    @Autowired
    private Empresa_LogisticaRepository empresa_logisticaRepository;

    // Obtener todos los productos
    public List<Empresa_Logistica> findAll() {
        return empresa_logisticaRepository.findAll();
    }

    // Buscar producto por ID
    public Optional<Empresa_Logistica> findById(int id) {
        return empresa_logisticaRepository.findById(id);
    }

    // Crear o actualizar producto
    public Empresa_Logistica save(Empresa_Logistica empresa_logistica) {
        return empresa_logisticaRepository.save(empresa_logistica);
    }

    // Eliminar producto por ID
    public void deleteById(int id) {
        empresa_logisticaRepository.deleteById(id);
    }
}