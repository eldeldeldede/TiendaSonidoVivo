import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { validarEmail } from '../../utils/validaciones';

interface LoginFormProps {
  onLogin: (email: string, pass: string) => void;
}

// Organismo: formulario de inicio de sesión con validación por alertas
export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim() === '') {
      window.alert('Debe ingresar su correo electrónico');
      return;
    }
    if (!validarEmail(email)) {
      window.alert('El correo electrónico no tiene un formato válido');
      return;
    }
    if (pass === '') {
      window.alert('Debe ingresar su contraseña');
      return;
    }

    onLogin(email.trim(), pass);
  };

  // Autocompleta las cuentas de prueba
  const completarDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPass(demoPass);
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="login-email"
          label="Correo Electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="login-pass"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <Button type="submit" variant="warning" className="w-100 fw-bold mt-2 py-2">
          Ingresar
        </Button>
      </form>

      <div className="mt-4 pt-3 border-top border-secondary text-center">
        <p className="text-white-50 small mb-2">Cuentas de prueba:</p>
        <div className="d-flex justify-content-center gap-2">
          <Button type="button" size="sm" variant="outline-light" onClick={() => completarDemo('admin@sonidovivo.cl', 'admin123')}>
            Admin Demo
          </Button>
          <Button type="button" size="sm" variant="outline-light" onClick={() => completarDemo('cliente@sonidovivo.cl', 'user123')}>
            Cliente Demo
          </Button>
        </div>
      </div>
    </>
  );
};
