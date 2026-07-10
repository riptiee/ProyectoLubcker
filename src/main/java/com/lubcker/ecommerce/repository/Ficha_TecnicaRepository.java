package com.lubcker.ecommerce.repository;

import com.lubcker.ecommerce.model.Ficha_Tecnica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Ficha_TecnicaRepository extends JpaRepository<Ficha_Tecnica, Integer> {
    // ¡Listo! No necesitas escribir nada más aquí.
    // Spring ya te da métodos como: save(), findById(), findAll(), deleteById(), etc.
}