import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Páginas que requieren sesión (historial, panel, etc.).
// Si no hay usuario, manda a /login y recuerda a dónde quería ir.
export function SoloConSesion({ children }) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }
  return children;
}

// Páginas solo para quien NO inició sesión (login y registro).
// Si ya hay usuario, no tiene sentido mostrarlas: vuelve al inicio.
export function SoloSinSesion({ children }) {
  const { usuario } = useAuth();

  if (usuario) {
    return <Navigate to="/" replace />;
  }
  return children;
}