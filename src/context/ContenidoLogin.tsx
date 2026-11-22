import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { iniciarSesion, registrarCliente } from '../api/usuarios';
import { CLAVE_SESION, EVENTO_SESION_EXPIRADA } from '../api/cliente';

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
      return JSON.parse(guardada) as User;
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
