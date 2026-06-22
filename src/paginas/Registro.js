import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Registro.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Limpia el error general al escribir
  };

  // Validaciones de seguridad de la contraseña
  const tieneMinimoCaracteres = formData.password.length >= 8;
  const tieneNumero = /\d/.test(formData.password);
  const contraseñasCoinciden = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const manejarEnvio = (e) => {
    e.preventDefault();

    // Validaciones estrictas antes de enviar
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

    console.log('Registro exitoso para Lubcker:', formData);
    // Aquí conectarías con tu backend/API de Firebase o Node
    navigate('/login'); 
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
              placeholder="Nombre completo" 
              value={formData.nombre}
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

          {/* Indicadores visuales de requisitos en tiempo real */}
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
            disabled={!tieneMinimoCaracteres || !tieneNumero || !contraseñasCoinciden}
          >
            Registrarse
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
