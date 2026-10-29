import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => boolean;
  register: (newUser: User) => boolean;
  logout: () => void;
  users: User[];
}

const defaultUsers: User[] = [
  {
    run: '11111111-1',
    nombre: 'Admin',
    apellidos: 'Sonido Vivo',
    email: 'admin@sonidovivo.cl',
    pass: 'admin123',
    rol: 'Administrador'
  },
  {
    run: '22222222-2',
    nombre: 'Juan',
    apellidos: 'Pérez',
    email: 'cliente@sonidovivo.cl',
    pass: 'user123',
    rol: 'Cliente'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('usuarios_sonidovivo');
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        const hasValidAdmin = parsed.some(
          (u) => u.email === 'admin@sonidovivo.cl' && u.pass === 'admin123'
        );
        if (hasValidAdmin) return parsed;
      } catch (e) {
        console.error('Error al cargar usuarios:', e);
      }
    }
    localStorage.setItem('usuarios_sonidovivo', JSON.stringify(defaultUsers));
    return defaultUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('sesion_sonidovivo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('usuarios_sonidovivo', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sesion_sonidovivo', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sesion_sonidovivo');
    }
  }, [currentUser]);

  const login = (email: string, pass: string): boolean => {
    const found = users.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.pass === pass
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const register = (newUser: User): boolean => {
    const exists = users.some(
      (u) => u.email.trim().toLowerCase() === newUser.email.trim().toLowerCase() || u.run === newUser.run
    );
    if (exists) return false;

    setUsers((prev) => [...prev, newUser]);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, users }}>
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