// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { NewsCard } from '../components/molecules/CardNovedades';
import { novedades } from '../data/novedades';

afterEach(() => cleanup());

describe('NewsCard', () => {
  it('muestra el título, la categoría y el resumen del artículo', () => {
    const articulo = novedades[0];
    render(<NewsCard article={articulo} onReadMore={vi.fn()} />);

    expect(screen.getByText(articulo.titulo)).toBeInTheDocument();
    expect(screen.getByText(articulo.categoria)).toBeInTheDocument();
    expect(screen.getByText(articulo.resumen)).toBeInTheDocument();
  });

  it('llama a onReadMore con el artículo al presionar "Leer más"', () => {
    const alLeer = vi.fn();
    render(<NewsCard article={novedades[1]} onReadMore={alLeer} />);

    fireEvent.click(screen.getByRole('button', { name: /leer más/i }));

    expect(alLeer).toHaveBeenCalledTimes(1);
    expect(alLeer).toHaveBeenCalledWith(novedades[1]);
  });
});
