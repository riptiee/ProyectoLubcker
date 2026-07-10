package com.lubcker.ecommerce.repository;

import com.lubcker.ecommerce.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    // ¡Listo! No necesitas escribir nada más aquí.
    // Spring ya te da métodos como: save(), findById(), findAll(), deleteById(), etc.
}