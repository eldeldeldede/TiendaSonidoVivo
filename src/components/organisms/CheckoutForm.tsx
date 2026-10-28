import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import type { DatosCliente } from '../../data/pedidos';
import {
  validarEmail,
  validarRut,
  validarNumeroTarjeta,
  validarVencimiento,
  validarCvv,
} from '../../utils/validaciones';

interface CheckoutFormProps {
  datosIniciales?: Partial<DatosCliente>; // si hay sesión iniciada, se autocompletan
  total: number;
  onSubmit: (cliente: DatosCliente, numeroTarjeta: string) => void;
}

// Organismo: datos de envío y pago simulado
export const CheckoutForm: React.FC<CheckoutFormProps> = ({ datosIniciales, total, onSubmit }) => {
  const [nombre, setNombre] = useState(datosIniciales?.nombre ?? '');
  const [rut, setRut] = useState(datosIniciales?.rut ?? '');
  const [email, setEmail] = useState(datosIniciales?.email ?? '');
  const [direccion, setDireccion] = useState(datosIniciales?.direccion ?? '');
  const [tarjeta, setTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nombre.trim() === '') {
      window.alert('Debe ingresar su nombre');
      return;
    }
    if (!validarRut(rut)) {
      window.alert('Debe ingresar un RUT válido');
      return;
    }
    if (!validarEmail(email)) {
      window.alert('Debe ingresar un correo electrónico válido');
      return;
    }
    if (direccion.trim() === '') {
      window.alert('Debe ingresar la dirección de envío');
      return;
    }
    if (!validarNumeroTarjeta(tarjeta)) {
      window.alert('El número de tarjeta debe tener 16 dígitos');
      return;
    }
    if (!validarVencimiento(vencimiento)) {
      window.alert('La fecha de vencimiento no es válida (MM/AA)');
      return;
    }
    if (!validarCvv(cvv)) {
      window.alert('El CVV debe tener 3 dígitos');
      return;
    }

    onSubmit(
      { nombre: nombre.trim(), rut: rut.trim(), email: email.trim(), direccion: direccion.trim() },
      tarjeta
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h5 className="text-warning mb-3">Datos de envío</h5>
      <Input id="co-nombre" label="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <div className="row">
        <div className="col-md-6">
          <Input id="co-rut" label="RUT" placeholder="12345678-5" value={rut} onChange={(e) => setRut(e.target.value)} />
        </div>
        <div className="col-md-6">
          <Input id="co-email" label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <Input id="co-direccion" label="Dirección de envío" placeholder="Calle, número, comuna" value={direccion} onChange={(e) => setDireccion(e.target.value)} />

      <h5 className="text-warning mt-4 mb-3">Pago (simulado)</h5>
      <Input
        id="co-tarjeta"
        label="Número de tarjeta"
        placeholder="1234 5678 9012 3456"
        inputMode="numeric"
        value={tarjeta}
        onChange={(e) => setTarjeta(e.target.value)}
      />
      <div className="row">
        <div className="col-6">
          <Input id="co-vencimiento" label="Vencimiento" placeholder="MM/AA" value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} />
        </div>
        <div className="col-6">
          <Input id="co-cvv" label="CVV" type="password" inputMode="numeric" value={cvv} onChange={(e) => setCvv(e.target.value)} />
        </div>
      </div>
      <p className="small text-white-50">
        Simulación: una tarjeta que termina en <strong>0000</strong> será rechazada.
      </p>

      <Button type="submit" variant="warning" className="w-100 fw-bold py-2">
        Pagar ${total.toLocaleString('es-CL')}
      </Button>
    </form>
  );
};
