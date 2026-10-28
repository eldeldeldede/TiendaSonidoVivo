import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreTemplate } from '../components/templates/StoreTemplate';
import { LoginForm } from '../components/organisms/LoginForm';
import { RegisterForm } from '../components/organisms/RegisterForm';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';

export const LoginPage: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (email: string, pass: string) => {
    if (login(email, pass)) {
      window.alert('¡Inicio de sesión exitoso!');
      navigate('/');
    } else {
      window.alert('Credenciales incorrectas. Verifique su correo y contraseña.');
    }
  };

  const handleRegister = (nuevoUsuario: User) => {
    if (register(nuevoUsuario)) {
      window.alert(`¡Registro exitoso, ${nuevoUsuario.nombre}! Ahora puede iniciar sesión.`);
      setIsRegisterMode(false);
    } else {
      window.alert('Ya existe un usuario registrado con este RUN o correo electrónico.');
    }
  };

  return (
    <StoreTemplate>
      <div className="container my-5 d-flex justify-content-center">
        <div className="card bg-dark text-white border-secondary shadow-lg" style={{ maxWidth: '520px', width: '100%' }}>
          {/* Pestañas */}
          <div className="card-header border-secondary p-0">
            <div className="row g-0 text-center fw-bold">
              <button
                type="button"
                className={`col py-3 border-0 ${!isRegisterMode ? 'bg-warning text-dark' : 'bg-dark text-white'}`}
                onClick={() => setIsRegisterMode(false)}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                className={`col py-3 border-0 ${isRegisterMode ? 'bg-warning text-dark' : 'bg-dark text-white'}`}
                onClick={() => setIsRegisterMode(true)}
              >
                Registrarse
              </button>
            </div>
          </div>

          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4 text-warning">
              {isRegisterMode ? 'Crear Nueva Cuenta' : 'Acceso a Sonido Vivo'}
            </h3>

            {isRegisterMode ? (
              <RegisterForm onRegister={handleRegister} />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )}
          </div>
        </div>
      </div>
    </StoreTemplate>
  );
};
