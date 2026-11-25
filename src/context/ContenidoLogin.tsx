import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { iniciarSesion, registrarCliente, renovarToken } from '../api/usuarios';
import { CLAVE_SESION, EVENTO_SESION_EXPIRADA } from '../api/cliente';
import { tokenVencido, vencimientoToken } from '../utils/token';

// El token se renueva 5 minutos antes de vencer, para que la sesión no se corte mientras se usa la tienda
const MARGEN_RENOVACION_MS = 5 * 60 * 1000;

interface AuthContextType {
  currentUser: User | null;
  // Validan contra UsuarioMicroservicio. Lanzan ApiError si las credenciales o los datos no son válidos.
  login: (email: string, pass: string) => Promise<User>;
  register: (newUser: User) => Promise<User>;
  logout: () => void;
  // Actualiza la sesión local (ej. si un administrador cambia su propio rol)
  actualizarSesion: (usuario: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Solo la sesión se recuerda en el navegador; los usuarios viven en el backend
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const guardada = localStorage.getItem(CLAVE_SESION);
    if (!guardada) return null;
    try {
      const usuario = JSON.parse(guardada) as User;
      // Al recargar la página, una sesión con el token ya vencido no se restaura
      return tokenVencido(usuario.token) ? null : usuario;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
  }, [currentUser]);

  // Si el backend rechaza el token (venció), se cierra la sesión
  useEffect(() => {
    const cerrar = () => setCurrentUser(null);
    window.addEventListener(EVENTO_SESION_EXPIRADA, cerrar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, cerrar);
  }, []);

  // Renovación automática del JWT: se programa según el vencimiento del token actual.
  // Cada renovación entrega un token nuevo, lo que vuelve a ejecutar este efecto y programa la siguiente.
  const token = currentUser?.token;
  const debeCambiar = currentUser?.debeCambiarContrasena === true;
  useEffect(() => {
    const vence = vencimientoToken(token);
    // Sin token legible, o con contraseña temporal (el backend no permite renovar en ese caso), no se programa nada
    if (!token || vence === null || debeCambiar) return;

    let cancelado = false;
    let cierre: number | undefined;
    const espera = Math.max(vence - Date.now() - MARGEN_RENOVACION_MS, 0);

    const renovacion = window.setTimeout(async () => {
      try {
        const renovado = await renovarToken();
        if (!cancelado) setCurrentUser(renovado); // trae también el rol actual de la cuenta
      } catch {
        // Si fue un 401 el cliente HTTP ya avisó que la sesión expiró. Si el servidor no respondió,
        // la sesión se cierra cuando el token venza, porque después de eso ya no sirve.
        if (!cancelado) cierre = window.setTimeout(() => setCurrentUser(null), Math.max(vence - Date.now(), 0));
      }
    }, espera);

    return () => {
      cancelado = true;
      window.clearTimeout(renovacion);
      if (cierre !== undefined) window.clearTimeout(cierre);
    };
  }, [token, debeCambiar]);

  const login = async (email: string, pass: string): Promise<User> => {
    const usuario = await iniciarSesion(email, pass);
    setCurrentUser(usuario);
    return usuario;
  };

  const register = (newUser: User): Promise<User> => registrarCliente(newUser);

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, actualizarSesion: setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
