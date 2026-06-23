package com.lubcker.ecommerce.model;
import jakarta.persistence.*;

@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_cliente;

    private String nombre;
    private String apellido;

    public Cliente() {}

    // CONSTRUCTOR COMPLETO
    public Cliente(int id_cliente, String nombre, String apellido) {
        this.id_cliente = id_cliente;
        this.nombre = nombre;
        this.apellido = apellido;
    }

    // GETTERS Y SETTERS
    public int getIdCliente() { return id_cliente; }
    public void setIdCliente(int id_cliente) { this.id_cliente = id_cliente; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
}