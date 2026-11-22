import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { StoreTemplate } from '../components/templates/PlantillaTienda';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { useAuth } from '../context/ContenidoLogin';
import { cambiarContrasena } from '../api/usuarios';
import { mensajeDeError } from '../api/cliente';

const LARGO_MINIMO = 8;

// Pantalla para cambiar la contraseña. Es obligatoria la primera vez que se entra con la contraseña temporal.
export const CambiarContrasenaPage: React.FC = () => {
  const { currentUser, login, logout } = useAuth();
  const navigate = useNavigate();
  const desde = (useLocation().state as { desde?: string } | null)?.desde;
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!currentUser || currentUser.id === undefined) return <Navigate to="/login" replace />;
  const obligatorio = currentUser.debeCambiarContrasena === true;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (actual === '') {
      window.alert('Debe ingresar su contraseña actual');
      return;
    }
    if (nueva.length < LARGO_MINIMO) {
      window.alert(`La contraseña nueva debe tener mínimo ${LARGO_MINIMO} caracteres`);
      return;
    }
    if (nueva === actual) {
      window.alert('La contraseña nueva debe ser distinta de la actual');
      return;
    }
    if (nueva !== confirmar) {
      window.alert('Las contraseñas no coinciden');
      return;
    }
    setEnviando(true);
    try {
      await cambiarContrasena(currentUser.id!, actual, nueva);
      // El token anterior todavía lleva la marca de "contraseña temporal": se inicia sesión de nuevo para obtener uno normal
      await login(currentUser.email, nueva);
      window.alert('¡Contraseña actualizada!');
      navigate(desde ?? '/', { replace: true });
    } catch (e) {
      window.alert(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <StoreTemplate>
      <div className="container my-5 d-flex justify-content-center">
        <div className="card bg-dark text-white border-secondary shadow-lg" style={{ maxWidth: '480px', width: '100%' }}>
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-3 text-warning">Cambiar contraseña</h3>
            {obligatorio && (
              <div className="alert alert-warning py-2 small" role="alert">
                Es tu primer inicio de sesión. Reemplaza la contraseña temporal que te enviamos por correo por una propia
                para poder seguir usando la tienda.
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
              <Input id="cp-actual" label={obligatorio ? 'Contraseña temporal' : 'Contraseña actual'} type="password"
                autoComplete="current-password" value={actual} onChange={(e) => setActual(e.target.value)} />
              <Input id="cp-nueva" label="Contraseña nueva" type="password" helperText={`mínimo ${LARGO_MINIMO} caracteres`}
                autoComplete="new-password" value={nueva} onChange={(e) => setNueva(e.target.value)} />
              <Input id="cp-confirmar" label="Confirmar contraseña nueva" type="password"
                autoComplete="new-password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
              <Button type="submit" variant="warning" className="w-100 fw-bold mt-2 py-2" disabled={enviando}>
                {enviando ? 'Guardando...' : 'Guardar contraseña'}
              </Button>
            </form>
            {obligatorio && (
              <button type="button" className="btn btn-link text-white-50 w-100 mt-2" onClick={logout}>
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </StoreTemplate>
  );
};
