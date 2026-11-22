import React, { useState } from 'react';
import type { User, UserRole } from '../../types';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { validarEmail, validarRut } from '../../utils/validaciones';

interface RegisterFormProps {
  onRegister: (nuevoUsuario: User) => void;
  permitirElegirRol?: boolean; // true solo en el panel admin
  textoBoton?: string;
}

const ROLES: UserRole[] = ['Cliente', 'Vendedor', 'Administrador'];

const REGIONES = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso',
  'Metropolitana de Santiago', "O'Higgins", 'Maule', 'Ñuble', 'Biobío', 'La Araucanía',
  'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
];

// Organismo: formulario de registro. En el login todo usuario nuevo queda como "Cliente";
// en el panel admin se reutiliza con permitirElegirRol para crear usuarios con cualquier rol.
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  permitirElegirRol = false,
  textoBoton = 'Registrar Cuenta',
}) => {
  const [run, setRun] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState<UserRole>('Cliente');
  const [direccion, setDireccion] = useState('');
  const [comuna, setComuna] = useState('');
  const [region, setRegion] = useState('');

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

    onRegister({
      run: run.trim(),
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: email.trim(),
      rol,
      // Opcionales: si los completa, el pago se rellena solo con estos datos
      direccion: direccion.trim() || undefined,
      comuna: comuna.trim() || undefined,
      region: region || undefined,
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
      <Input id="reg-direccion" label="Dirección" helperText="opcional, para autocompletar tus compras" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
      <div className="row">
        <div className="col-md-6">
          <Input id="reg-comuna" label="Comuna" helperText="opcional" value={comuna} onChange={(e) => setComuna(e.target.value)} />
        </div>
        <div className="col-md-6">
          <Select
            id="reg-region"
            label="Región"
            options={[{ value: '', label: 'Seleccionar (opcional)' }, ...REGIONES.map((r) => ({ value: r, label: r }))]}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>
      </div>
      <div className="alert alert-info py-2 small" role="note">
        <i className="bi bi-envelope-check me-1"></i>
        Te enviaremos una contraseña temporal a este correo. La cambiarás cuando inicies sesión por primera vez.
      </div>
      {permitirElegirRol && (
        <Select
          id="reg-rol"
          label="Rol"
          options={ROLES.map((r) => ({ value: r, label: r }))}
          value={rol}
          onChange={(e) => setRol(e.target.value as UserRole)}
        />
      )}
      <Button type="submit" variant="warning" className="w-100 fw-bold mt-2 py-2">
        {textoBoton}
      </Button>
    </form>
  );
};