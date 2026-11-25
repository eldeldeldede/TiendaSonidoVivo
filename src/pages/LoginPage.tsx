import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { StoreTemplate } from '../components/templates/PlantillaTienda';
import { LoginForm } from '../components/organisms/FormularioLogin';
import { RegisterForm } from '../components/organisms/FormularioRegistro';
import { useAuth } from '../context/ContenidoLogin';
import type { User } from '../types';
import { mensajeDeError } from '../api/cliente';

export const LoginPage: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register, currentUser } = useAuth();
  const navigate = useNavigate();
  // Si llegó desde el pago, después de iniciar sesión vuelve ahí (el carrito se conserva)
  const desde = (useLocation().state as { desde?: string } | null)?.desde;

  // Con la sesión ya iniciada no tiene sentido volver a mostrar el formulario:
  // para entrar con otra cuenta primero hay que cerrar sesión
  if (currentUser && !currentUser.debeCambiarContrasena) {
    return <Navigate to={desde ?? '/'} replace />;
  }

  const handleLogin = async (email: string, pass: string) => {
    try {
      const usuario = await login(email, pass);
      if (usuario.debeCambiarContrasena) {
        // Primera vez con la contraseña temporal: debe cambiarla antes de usar la tienda
        window.alert('Es tu primer inicio de sesión: debes cambiar la contraseña temporal por una propia.');
        navigate('/cambiar-contrasena', { replace: true, state: { desde } });
        return;
      }
      window.alert('¡Inicio de sesión exitoso!');
      navigate(desde ?? '/', { replace: true });
    } catch (e) {
      window.alert(mensajeDeError(e));
    }
  };

  const handleRegister = async (nuevoUsuario: User) => {
    try {
      await register(nuevoUsuario);
      window.alert(`¡Registro exitoso, ${nuevoUsuario.nombre}! Te enviamos una contraseña temporal a ${nuevoUsuario.email}. Úsala para iniciar sesión.`);
      setIsRegisterMode(false);
    } catch (e) {
      window.alert(mensajeDeError(e));
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
            {desde === '/checkout' && (
              <div className="alert alert-warning py-2 small" role="alert">
                Inicia sesión o crea una cuenta para finalizar tu compra. Tu carrito se mantiene.
              </div>
            )}
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
