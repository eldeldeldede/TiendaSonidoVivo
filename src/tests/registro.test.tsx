// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { RegisterForm } from '../components/organisms/FormularioRegistro';

afterEach(cleanup);

const completarBase = () => {
  fireEvent.change(screen.getByLabelText(/RUN/), { target: { value: '12345678-5' } });
  fireEvent.change(screen.getByLabelText(/^Nombre/), { target: { value: 'Ana' } });
  fireEvent.change(screen.getByLabelText(/Correo/), { target: { value: 'ana@test.cl' } });
};

describe('Formulario de registro: dirección opcional', () => {
  it('envía dirección, comuna y región cuando se completan', () => {
    const onRegister = vi.fn();
    render(<RegisterForm onRegister={onRegister} />);
    completarBase();
    fireEvent.change(screen.getByLabelText(/Dirección/), { target: { value: 'Calle 1 #123' } });
    fireEvent.change(screen.getByLabelText(/Comuna/), { target: { value: 'Viña del Mar' } });
    fireEvent.change(screen.getByLabelText(/Región/), { target: { value: 'Valparaíso' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar Cuenta' }));
    expect(onRegister).toHaveBeenCalledWith(
      expect.objectContaining({ direccion: 'Calle 1 #123', comuna: 'Viña del Mar', region: 'Valparaíso' })
    );
  });

  it('permite registrarse sin esos datos', () => {
    const onRegister = vi.fn();
    render(<RegisterForm onRegister={onRegister} />);
    completarBase();
    fireEvent.click(screen.getByRole('button', { name: 'Registrar Cuenta' }));
    const enviado = onRegister.mock.calls[0][0];
    expect(enviado.direccion).toBeUndefined();
    expect(enviado.comuna).toBeUndefined();
    expect(enviado.region).toBeUndefined();
  });
});

describe('Formulario de registro: contraseña generada por el sistema', () => {
  it('no pide contraseña y avisa que llegará por correo', () => {
    render(<RegisterForm onRegister={vi.fn()} />);
    expect(screen.queryByLabelText(/Contraseña/)).not.toBeInTheDocument();
    expect(screen.getByText(/contraseña temporal a este correo/i)).toBeInTheDocument();
  });

  it('no envía contraseña al registrar', () => {
    const onRegister = vi.fn();
    render(<RegisterForm onRegister={onRegister} />);
    completarBase();
    fireEvent.click(screen.getByRole('button', { name: 'Registrar Cuenta' }));
    expect(onRegister.mock.calls[0][0]).not.toHaveProperty('pass');
  });
});
