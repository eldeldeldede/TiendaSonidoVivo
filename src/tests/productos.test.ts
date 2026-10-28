// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  filtrarProductos,
  obtenerCategorias,
  reiniciarProductos,
  productosIniciales,
} from '../data/productos';

beforeEach(() => {
  localStorage.clear();
  reiniciarProductos();
});

describe('Módulo de datos de productos (CRUD)', () => {
  it('Leer: obtiene todos los productos iniciales y uno por su id', () => {
    expect(obtenerProductos()).toHaveLength(productosIniciales.length);
    expect(obtenerProductoPorId(2)?.nombre).toBe('Teclado Roland XPS-10');
    expect(obtenerProductoPorId(999)).toBeUndefined();
  });

  it('Crear: agrega un producto con el siguiente id y lo guarda', () => {
    const nuevo = crearProducto({ nombre: 'Bajo Ibanez GSR200', categoria: 'Guitarras', precio: 320000, stock: 4, img: '' });

    expect(nuevo.id).toBe(5);
    expect(obtenerProductos()).toHaveLength(5);
    expect(obtenerProductoPorId(5)?.nombre).toBe('Bajo Ibanez GSR200');
  });

  it('Actualizar: modifica solo los campos enviados', () => {
    const actualizado = actualizarProducto(1, { precio: 700000, stock: 10 });

    expect(actualizado?.precio).toBe(700000);
    expect(obtenerProductoPorId(1)?.stock).toBe(10);
    expect(obtenerProductoPorId(1)?.nombre).toBe('Guitarra Eléctrica Fender Stratocaster');
    expect(actualizarProducto(999, { precio: 1 })).toBeUndefined();
  });

  it('Eliminar: quita el producto y devuelve false si no existe', () => {
    expect(eliminarProducto(3)).toBe(true);
    expect(obtenerProductoPorId(3)).toBeUndefined();
    expect(obtenerProductos()).toHaveLength(3);
    expect(eliminarProducto(3)).toBe(false);
  });
});

describe('Filtros de búsqueda', () => {
  it('filtra por texto sin importar mayúsculas', () => {
    const resultado = filtrarProductos(productosIniciales, 'ROLAND', 'todas');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(2);
  });

  it('filtra por categoría y combina ambos filtros', () => {
    expect(filtrarProductos(productosIniciales, '', 'Accesorios').map((p) => p.id)).toEqual([4]);
    expect(filtrarProductos(productosIniciales, 'pedal', 'Guitarras')).toHaveLength(0);
    expect(filtrarProductos(productosIniciales, '', 'todas')).toHaveLength(4);
  });

  it('obtiene las categorías sin repetir', () => {
    expect(obtenerCategorias(productosIniciales)).toEqual(['Guitarras', 'Teclados', 'Baterías', 'Accesorios']);
  });
});
