package com.lubcker.ecommerce.repository;

import com.lubcker.ecommerce.model.Detalle_Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Detalle_OrdenRepository extends JpaRepository<Detalle_Orden, Integer> {
    // ¡Listo! No necesitas escribir nada más aquí.
    // Spring ya te da métodos como: save(), findById(), findAll(), deleteById(), etc.
}