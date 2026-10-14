package com.lubcker.ecommerce.config;

import com.lubcker.ecommerce.model.Empresa_Logistica;
import com.lubcker.ecommerce.model.MetodoPago;
import com.lubcker.ecommerce.repository.Empresa_LogisticaRepository;
import com.lubcker.ecommerce.repository.MetodoPagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Carga los datos que el checkout necesita si todavia no existen.
// Se ejecuta en cada arranque, pero no duplica nada.
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @Autowired
    private Empresa_LogisticaRepository empresaLogisticaRepository;

    @Override
    public void run(String... args) {
        crearMetodoSiNoExiste("Transferencia bancaria");
        crearMetodoSiNoExiste("Mercado Pago");

        if (empresaLogisticaRepository.count() == 0) {
            Empresa_Logistica empresa = new Empresa_Logistica();
            empresa.setNombre("Correo Argentino");
            empresa.setSucursal("Envío a domicilio");
            empresaLogisticaRepository.save(empresa);
        }
    }

    private void crearMetodoSiNoExiste(String nombre) {
        boolean existe = metodoPagoRepository.findAll().stream()
                .anyMatch(m -> nombre.equalsIgnoreCase(m.getNombre()));
        if (!existe) {
            MetodoPago metodo = new MetodoPago();
            metodo.setNombre(nombre);
            metodoPagoRepository.save(metodo);
        }
    }
}