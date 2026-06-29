package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.Cliente;
import com.lubcker.ecommerce.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    // Obtener todos los clientes
    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    // Buscar cliente por ID
    public Optional<Cliente> findById(int id) {
        return clienteRepository.findById(id);
    }

    // Crear o actualizar cliente
    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    // Eliminar cliente por ID
    public void deleteById(int id) {
        clienteRepository.deleteById(id);
    }
}