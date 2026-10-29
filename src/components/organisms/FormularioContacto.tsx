import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { validarEmail } from '../../utils/validaciones';

export interface DatosContacto {
  nombre: string;
  email: string;
  mensaje: string;
}

interface ContactFormProps {
  onSubmit: (datos: DatosContacto) => void;
}

// Organismo: formulario de contacto con validación por alertas
export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    if (mensaje.trim() === '') {
      window.alert('Debe ingresar un mensaje');
      return;
    }
    if (mensaje.trim().length < 10) {
      window.alert('El mensaje debe tener al menos 10 caracteres');
      return;
    }

    onSubmit({ nombre: nombre.trim(), email: email.trim(), mensaje: mensaje.trim() });
    setNombre('');
    setEmail('');
    setMensaje('');
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input id="contacto-nombre" label="Nombre Completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <Input id="contacto-email" label="Correo Electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="mb-3">
        <label htmlFor="contacto-mensaje" className="form-label fw-semibold">Mensaje</label>
        <textarea
          id="contacto-mensaje"
          className="form-control"
          rows={4}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />
      </div>
      <Button type="submit" variant="warning" className="w-100 fw-bold" icon="send-fill">
        Enviar Consulta
      </Button>
    </form>
  );
};
