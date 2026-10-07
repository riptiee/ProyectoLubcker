import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Registro.css';

const API_URL = 'http://localhost:8080/api';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const tieneMinimoCaracteres = formData.password.length >= 8;
  const tieneNumero = /\d/.test(formData.password);
  const contraseñasCoinciden = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!tieneMinimoCaracteres) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (!tieneNumero) {
      setError('La contraseña debe incluir al menos un número.');
      return;
    }
    if (!contraseñasCoinciden) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    let idClienteCreado = null;

    // Paso 1: crear el cliente. Paso 2: crear el usuario ligado a ese cliente.
    fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: formData.nombre.trim(), apellido: formData.apellido.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('cliente');
        return res.json();
      })
      .then((cliente) => {
        idClienteCreado = cliente.idCliente;
        return fetch(`${API_URL}/usuarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idCliente: cliente.idCliente,
            nombreUsuario: formData.nombre.trim(),
            email: formData.email.trim(),
            contrasena: formData.password,
          }),
        });
      })
      .then((res) => {
        if (res.status === 409) throw new Error('email');
        if (!res.ok) throw new Error('usuario');
        navigate('/login');
      })
      .catch((err) => {
        // Si el cliente se creó pero el usuario falló, borramos el cliente para no dejar basura.
        if (idClienteCreado !== null) {
          fetch(`${API_URL}/clientes/${idClienteCreado}`, { method: 'DELETE' }).catch(() => {});
        }
        setError(
          err.message === 'email'
            ? 'Ya existe una cuenta con ese correo electrónico.'
            : 'No se pudo crear la cuenta. Revisá los datos o si el backend está corriendo.'
        );
        setCargando(false);
      });
  };

  return (
    <div className="registro-contenedor">
      <div className="registro-tarjeta">
        <h2>Crear Cuenta</h2>
        <p className="registro-subtitulo">Regístrate para gestionar tus compras en Lubcker</p>

        {error && <div className="registro-alerta-error">{error}</div>}

        <form onSubmit={manejarEnvio} className="registro-formulario">
          <div className="grupo-input">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="grupo-input">
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="grupo-input">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="grupo-input">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="grupo-input">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="registro-requisitos">
            <p className={tieneMinimoCaracteres ? "cumplido" : "pendiente"}>
              {tieneMinimoCaracteres ? "✓" : "○"} Mínimo 8 caracteres
            </p>
            <p className={tieneNumero ? "cumplido" : "pendiente"}>
              {tieneNumero ? "✓" : "○"} Incluye al menos un número
            </p>
            {formData.confirmPassword && (
              <p className={contraseñasCoinciden ? "cumplido" : "error-coincidencia"}>
                {contraseñasCoinciden ? "✓ Las contraseñas coinciden" : "✕ Las contraseñas no coinciden"}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-registro-primario"
            disabled={!tieneMinimoCaracteres || !tieneNumero || !contraseñasCoinciden || cargando}
          >
            {cargando ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="registro-pie">
          ¿Ya tienes cuenta? <Link to="/login" className="link-lubcker">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;