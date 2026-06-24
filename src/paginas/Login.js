import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login con:", email, password);
    navigate('/'); 
  };

  return (
    <div className="login-container">
      <div className="login-content-wrapper">
        <h2 className="login-title">Iniciar Sesión</h2>
        <p className="login-subtitle">Ingresa tus e para acceder a tu cuenta</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input 
              id="email"
              type="email" 
              placeholder="ejemplo@lubcker.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="login-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-wrapper">
              <input 
                id="password"
                type={mostrarPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="login-input password-field"
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarPassword ? (
                  <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="eye-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="eye-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            {/* LINK RECUERDO: ¿Olvidaste tu contraseña? */}
            <div className="login-forgot-wrapper">
              <Link to="/recuperar-password" className="login-link">¿Olvidaste tu contraseña?</Link>
            </div>
          </div>

          <button type="submit" className="login-btn-submit">
            Ingresar
          </button>
        </form>

        {/* LINK REGISTRO: ¿Aún no tienes cuenta? */}
        <div className="login-footer-links">
          <p>¿Aún no tienes cuenta? <Link to="/registro" className="login-link-highlight">Regístrate</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
