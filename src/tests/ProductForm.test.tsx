// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ProductForm } from '../components/organisms/ProductForm';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const escribir = (etiqueta: string, valor: string) =>
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

describe('ProductForm', () => {
  it('muestra una alerta cuando el nombre está vacío', () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const alGuardar = vi.fn();
    render(<ProductForm onSubmit={alGuardar} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

    expect(alerta).toHaveBeenCalledWith('Debe ingresar el nombre del producto');
    expect(alGuardar).not.toHaveBeenCalled();
  });

  it('muestra una alerta cuando el precio no es válido', () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ProductForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    escribir('Nombre', 'Bajo Ibanez');
    escribir('Categoría', 'Guitarras');
    escribir('Precio', '-500');
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

    expect(alerta).toHaveBeenCalledWith('El precio debe ser un número entero mayor a 0');
  });

  it('envía los datos convertidos a número cuando son válidos', () => {
    const alGuardar = vi.fn();
    render(<ProductForm onSubmit={alGuardar} onCancel={vi.fn()} />);

    escribir('Nombre', 'Bajo Ibanez');
    escribir('Categoría', 'Guitarras');
    escribir('Precio', '320000');
    escribir('Stock', '4');
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

    expect(alGuardar).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: 'Bajo Ibanez', categoria: 'Guitarras', precio: 320000, stock: 4 })
    );
  });

  it('en modo edición muestra los datos actuales del producto', () => {
    render(
      <ProductForm
        initialData={{ id: 1, nombre: 'Guitarra X', categoria: 'Guitarras', precio: 1000, stock: 2, img: '' }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Nombre')).toHaveValue('Guitarra X');
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument();
  });
});
