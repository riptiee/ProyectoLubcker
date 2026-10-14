package com.lubcker.ecommerce.service;

import com.lubcker.ecommerce.dto.CheckoutRequestDTO;
import com.lubcker.ecommerce.dto.CheckoutResponseDTO;
import com.lubcker.ecommerce.dto.DetalleOrdenDTO;
import com.lubcker.ecommerce.dto.ItemCheckoutDTO;
import com.lubcker.ecommerce.model.Cliente;
import com.lubcker.ecommerce.model.Detalle_Orden;
import com.lubcker.ecommerce.model.Direccion;
import com.lubcker.ecommerce.model.Empresa_Logistica;
import com.lubcker.ecommerce.model.Envio;
import com.lubcker.ecommerce.model.MetodoPago;
import com.lubcker.ecommerce.model.Orden;
import com.lubcker.ecommerce.model.Pago;
import com.lubcker.ecommerce.model.Producto;
import com.lubcker.ecommerce.repository.ClienteRepository;
import com.lubcker.ecommerce.repository.Detalle_OrdenRepository;
import com.lubcker.ecommerce.repository.DireccionRepository;
import com.lubcker.ecommerce.repository.Empresa_LogisticaRepository;
import com.lubcker.ecommerce.repository.EnvioRepository;
import com.lubcker.ecommerce.repository.MetodoPagoRepository;
import com.lubcker.ecommerce.repository.OrdenRepository;
import com.lubcker.ecommerce.repository.PagoRepository;
import com.lubcker.ecommerce.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class CheckoutService {

    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private OrdenRepository ordenRepository;
    @Autowired
    private Detalle_OrdenRepository detalleOrdenRepository;
    @Autowired
    private DireccionRepository direccionRepository;
    @Autowired
    private MetodoPagoRepository metodoPagoRepository;
    @Autowired
    private PagoRepository pagoRepository;
    @Autowired
    private EnvioRepository envioRepository;
    @Autowired
    private Empresa_LogisticaRepository empresaLogisticaRepository;

    // Todo el metodo corre en UNA transaccion: si algo falla, no queda nada guardado a medias.
    @Transactional
    public CheckoutResponseDTO procesar(CheckoutRequestDTO datos) {

        // 1. Validaciones
        if (datos.getItems() == null || datos.getItems().isEmpty()) {
            throw new CheckoutException("El carrito está vacío.");
        }
        if (estaVacio(datos.getProvincia()) || estaVacio(datos.getCiudad())
                || estaVacio(datos.getCalle()) || datos.getAltura() <= 0) {
            throw new CheckoutException("Completá provincia, ciudad, calle y altura de la dirección de envío.");
        }

        Cliente cliente = clienteRepository.findById(datos.getIdCliente())
                .orElseThrow(() -> new CheckoutException("Cliente no encontrado."));
        MetodoPago metodo = metodoPagoRepository.findById(datos.getIdMetodoPago())
                .orElseThrow(() -> new CheckoutException("El método de pago elegido no es válido."));
        Empresa_Logistica empresa = empresaLogisticaRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new CheckoutException("No hay una empresa de logística configurada."));

        // 2. Unificar productos repetidos y validar cantidades
        Map<Integer, Integer> cantidades = new LinkedHashMap<>();
        for (ItemCheckoutDTO item : datos.getItems()) {
            if (item.getCantidad() <= 0) {
                throw new CheckoutException("La cantidad de cada producto debe ser mayor a 0.");
            }
            cantidades.merge(item.getIdProducto(), item.getCantidad(), Integer::sum);
        }

        // 3. Orden
        Orden nuevaOrden = new Orden();
        nuevaOrden.setCliente(cliente);
        nuevaOrden.setFecha(new Date());
        final Orden orden = ordenRepository.save(nuevaOrden);

        // 4. Detalles: el precio sale de la base de datos, nunca del frontend
        List<DetalleOrdenDTO> detallesDTO = new ArrayList<>();
        int total = 0;
        for (Map.Entry<Integer, Integer> entrada : cantidades.entrySet()) {
            final int idProducto = entrada.getKey();
            final int cantidad = entrada.getValue();

            Producto producto = productoRepository.findById(idProducto)
                    .orElseThrow(() -> new CheckoutException("Producto no encontrado: " + idProducto));

            int precioUnitario = producto.getPrecio();
            int subtotal = precioUnitario * cantidad;

            Detalle_Orden detalle = new Detalle_Orden();
            detalle.setOrden(orden);
            detalle.setProducto(producto);
            detalle.setCantidad(cantidad);
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubtotal(subtotal);
            Detalle_Orden guardado = detalleOrdenRepository.save(detalle);

            total += subtotal;
            detallesDTO.add(new DetalleOrdenDTO(
                    guardado.getIdDetalle(),
                    orden.getIdOrden(),
                    producto.getIdProducto(),
                    producto.getNombre(),
                    cantidad,
                    precioUnitario,
                    subtotal
            ));
        }

        // 5. Direccion: se reutiliza si el cliente ya tiene una igual
        Direccion direccion = direccionRepository.findAll().stream()
                .filter(d -> d.getCliente() != null
                        && d.getCliente().getIdCliente() == cliente.getIdCliente()
                        && coincide(d.getProvincia(), datos.getProvincia())
                        && coincide(d.getCiudad(), datos.getCiudad())
                        && coincide(d.getCalle(), datos.getCalle())
                        && d.getAltura() == datos.getAltura())
                .findFirst()
                .orElseGet(() -> {
                    Direccion nueva = new Direccion();
                    nueva.setCliente(cliente);
                    nueva.setProvincia(datos.getProvincia().trim());
                    nueva.setCiudad(datos.getCiudad().trim());
                    nueva.setCalle(datos.getCalle().trim());
                    nueva.setAltura(datos.getAltura());
                    return direccionRepository.save(nueva);
                });

        // 6. Pago: queda PENDIENTE (estado=false) hasta que se confirme
        Pago pago = new Pago();
        pago.setOrden(orden);
        pago.setMetodoPago(metodo);
        pago.setEstado(false);
        pago.setMonto(total);
        Pago pagoGuardado = pagoRepository.save(pago);

        // 7. Envio
        Envio envio = new Envio();
        envio.setOrden(orden);
        envio.setDireccion(direccion);
        envio.setEmpresaLogistica(empresa);
        envio.setEstado("Pendiente");
        Envio envioGuardado = envioRepository.save(envio);

        String textoDireccion = direccion.getCalle() + " " + direccion.getAltura()
                + ", " + direccion.getCiudad() + ", " + direccion.getProvincia();

        return new CheckoutResponseDTO(
                orden.getIdOrden(),
                orden.getFecha(),
                total,
                pagoGuardado.getIdPago(),
                metodo.getNombre(),
                pagoGuardado.isEstado(),
                envioGuardado.getIdEnvio(),
                envioGuardado.getEstado(),
                empresa.getNombre(),
                textoDireccion,
                detallesDTO
        );
    }

    private boolean estaVacio(String texto) {
        return texto == null || texto.trim().isEmpty();
    }

    private boolean coincide(String a, String b) {
        return a != null && b != null && a.trim().equalsIgnoreCase(b.trim());
    }
}