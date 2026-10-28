// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ContactForm } from '../components/organisms/ContactForm';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const escribir = (etiqueta: string, valor: string) =>
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

describe('ContactForm', () => {
  it('muestra una alerta cuando el nombre está vacío', () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const alEnviar = vi.fn();
    render(<ContactForm onSubmit={alEnviar} />);

    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    expect(alerta).toHaveBeenCalledWith('Debe ingresar su nombre');
    expect(alEnviar).not.toHaveBeenCalled();
  });

  it('muestra una alerta cuando el correo no tiene formato válido', () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ContactForm onSubmit={vi.fn()} />);

    escribir('Nombre Completo', 'Ana Rojas');
    escribir('Correo Electrónico', 'ana@correo');
    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    expect(alerta).toHaveBeenCalledWith('El correo electrónico no tiene un formato válido');
  });

  it('envía los datos y limpia el formulario cuando todo es válido', () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const alEnviar = vi.fn();
    render(<ContactForm onSubmit={alEnviar} />);

    escribir('Nombre Completo', 'Ana Rojas');
    escribir('Correo Electrónico', 'ana@correo.cl');
    escribir('Mensaje', 'Quiero cotizar una guitarra');
    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    expect(alerta).not.toHaveBeenCalled();
    expect(alEnviar).toHaveBeenCalledWith({
      nombre: 'Ana Rojas',
      email: 'ana@correo.cl',
      mensaje: 'Quiero cotizar una guitarra',
    });
    expect(screen.getByLabelText('Nombre Completo')).toHaveValue('');
  });
});
