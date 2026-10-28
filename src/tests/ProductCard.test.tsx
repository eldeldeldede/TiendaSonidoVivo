// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from '../components/molecules/ProductCard';
import type { Product } from '../types';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const producto: Product = { id: 7, nombre: 'Guitarra de prueba', categoria: 'Guitarras', precio: 150000, stock: 3, img: '' };

const renderCard = (p: Product, alAgregar = vi.fn()) =>
  render(
    <MemoryRouter>
      <ProductCard product={p} onAddToCart={alAgregar} />
    </MemoryRouter>
  );

describe('ProductCard', () => {
  it('muestra nombre, categoría, precio y enlace al detalle', () => {
    renderCard(producto);
    expect(screen.getByText('Guitarra de prueba')).toBeInTheDocument();
    expect(screen.getByText('Guitarras')).toBeInTheDocument();
    expect(screen.getByText('$150.000')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver producto' })).toHaveAttribute('href', '/producto/7');
  });

  it('llama a onAddToCart con el producto al presionar el botón', () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    const alAgregar = vi.fn();
    renderCard(producto, alAgregar);

    fireEvent.click(screen.getByRole('button', { name: 'Añadir al Carrito' }));

    expect(alAgregar).toHaveBeenCalledWith(producto);
  });

  it('deshabilita el botón cuando no hay stock', () => {
    renderCard({ ...producto, stock: 0 });
    expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled();
  });
});
