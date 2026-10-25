import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const CLAVE_STORAGE = 'lubcker_usuario';

export function AuthProvider({ children }) {
  // Se lee de localStorage al arrancar para que la sesión sobreviva a recargar la página.
  const [usuario, setUsuario] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario);
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datosUsuario));
    } catch {}
  };

  const cerrarSesion = () => {
    setUsuario(null);
    try {
      localStorage.removeItem(CLAVE_STORAGE);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);