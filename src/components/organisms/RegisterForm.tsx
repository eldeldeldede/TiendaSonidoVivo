import React, { useState } from 'react';
import type { User } from '../../types';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { validarEmail, validarRut } from '../../utils/validaciones';

interface RegisterFormProps {
  onRegister: (nuevoUsuario: User) => void;
}

// Organismo: formulario de registro. Todo usuario nuevo queda como "Cliente".
export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [run, setRun] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmarPass, setConfirmarPass] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (run.trim() === '') {
      window.alert('Debe ingresar su RUN');
      return;
    }
    if (!validarRut(run)) {
      window.alert('El RUN ingresado no es válido');
      return;
    }
    if (nombre.trim() === '') {
      window.alert('Debe ingresar su nombre');
      return;
    }
    if (email.trim() === '') {
      window.alert('Debe ingresar su correo electrónico');
      return;
    }
    if (!validarEmail(email)) {
      window.alert('El correo electrónico no tiene un formato válido');
      return;
    }
    if (pass === '') {
      window.alert('Debe ingresar una contraseña');
      return;
    }
    if (pass.length < 8) {
      window.alert('La contraseña debe tener mínimo 8 caracteres');
      return;
    }
    if (pass !== confirmarPass) {
      window.alert('Las contraseñas no coinciden');
      return;
    }

    onRegister({
      run: run.trim(),
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: email.trim(),
      pass,
      rol: 'Cliente',
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input id="reg-run" label="RUN" placeholder="12345678-5" value={run} onChange={(e) => setRun(e.target.value)} />
      <div className="row">
        <div className="col-md-6">
          <Input id="reg-nombre" label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="col-md-6">
          <Input id="reg-apellidos" label="Apellidos" helperText="opcional" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
        </div>
      </div>
      <Input id="reg-email" label="Correo Electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input id="reg-pass" label="Contraseña" type="password" helperText="mínimo 8 caracteres" value={pass} onChange={(e) => setPass(e.target.value)} />
      <Input id="reg-confirmar" label="Confirmar Contraseña" type="password" value={confirmarPass} onChange={(e) => setConfirmarPass(e.target.value)} />
      <Button type="submit" variant="warning" className="w-100 fw-bold mt-2 py-2">
        Registrar Cuenta
      </Button>
    </form>
  );
};
