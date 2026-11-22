// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { NewsCard } from '../components/molecules/CardNovedades';
import type { NewsArticle } from '../types';

const novedades: NewsArticle[] = [
  {
    id: 1,
    titulo: 'Cómo cuidar tus guitarras en invierno',
    categoria: 'Consejos',
    fecha: '05 de septiembre, 2026',
    autor: 'Equipo Técnico Sonido Vivo',
    imagen: '',
    resumen: 'Los cambios de humedad y temperatura afectan la madera.',
    descripcionCompleta: 'Guarda tu guitarra en su estuche cuando no la uses.',
  },
  {
    id: 2,
    titulo: 'Llegaron los nuevos teclados Roland',
    categoria: 'Lanzamientos',
    fecha: '20 de septiembre, 2026',
    autor: 'Sonido Vivo',
    imagen: '',
    resumen: 'Ya están disponibles en tienda los nuevos modelos de la serie XPS.',
    descripcionCompleta: 'Ven a probarlos a nuestra tienda principal.',
  },
];

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
