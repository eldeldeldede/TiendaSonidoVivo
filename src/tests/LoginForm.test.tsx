// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { LoginForm } from '../components/organisms/LoginForm';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('LoginForm', () => {
  it('muestra una alerta cuando el correo está vacío', () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const alIngresar = vi.fn();
    render(<LoginForm onLogin={alIngresar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(alerta).toHaveBeenCalledWith('Debe ingresar su correo electrónico');
    expect(alIngresar).not.toHaveBeenCalled();
  });

  it('el botón Admin Demo completa los campos (cambio de estado)', () => {
    render(<LoginForm onLogin={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Admin Demo' }));

    expect(screen.getByLabelText('Correo Electrónico')).toHaveValue('admin@sonidovivo.cl');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('admin123');
  });

  it('llama a onLogin con el correo y la contraseña cuando son válidos', () => {
    const alIngresar = vi.fn();
    render(<LoginForm onLogin={alIngresar} />);

    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'cliente@sonidovivo.cl' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'user123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(alIngresar).toHaveBeenCalledWith('cliente@sonidovivo.cl', 'user123');
  });
});
