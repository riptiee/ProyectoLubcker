package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.model.Resenas;
import com.lubcker.ecommerce.repository.ResenasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResenasService {

    @Autowired
    private ResenasRepository resenasRepository;

    public List<Resenas> findAll() {
        return resenasRepository.findAll();
    }

    public Optional<Resenas> findById(int id) {
        return resenasRepository.findById(id);
    }

    public Resenas save(Resenas resenas) {
        return resenasRepository.save(resenas);
    }

    public void deleteById(int id) {
        resenasRepository.deleteById(id);
    }
}