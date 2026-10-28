// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Boleta } from '../components/organisms/Boleta';
import type { Order } from '../types';

afterEach(() => cleanup());

const pedido: Order = {
  id: 'PED-103',
  cliente: 'Ana Rojas',
  rut: '11111111-1',
  email: 'ana@correo.cl',
  direccion: 'Av. Libertad 450',
  fecha: '2026-10-28',
  estado: 'En Preparación',
  items: [
    { id: 1, nombre: 'Guitarra de prueba', categoria: 'Guitarras', precio: 100000, stock: 3, img: '', quantity: 1 },
    { id: 2, nombre: 'Pedal de prueba', categoria: 'Accesorios', precio: 19000, stock: 5, img: '', quantity: 1 },
  ],
  neto: 100000,
  iva: 19000,
  total: 119000,
};

describe('Boleta', () => {
  it('muestra el número de boleta y los datos del cliente', () => {
    render(<Boleta pedido={pedido} />);
    expect(screen.getByText('N° PED-103')).toBeInTheDocument();
    expect(screen.getByText('Ana Rojas')).toBeInTheDocument();
  });

  it('lista todos los productos comprados', () => {
    render(<Boleta pedido={pedido} />);
    // 1 fila de encabezado + 2 productos
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('Guitarra de prueba')).toBeInTheDocument();
    expect(screen.getByText('Pedal de prueba')).toBeInTheDocument();
  });

  it('muestra neto, IVA y total', () => {
    render(<Boleta pedido={pedido} />);
    expect(screen.getByText('IVA (19%)').nextSibling).toHaveTextContent('$19.000');
    expect(screen.getByText('Total').nextSibling).toHaveTextContent('$119.000');
  });
});
