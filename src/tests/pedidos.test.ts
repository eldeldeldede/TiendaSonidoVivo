// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { calcularTotales, simularPago, crearPedido, obtenerPedidos } from '../data/pedidos';
import type { CartItem } from '../types';

const items: CartItem[] = [
  { id: 1, nombre: 'Guitarra de prueba', categoria: 'Guitarras', precio: 119000, stock: 5, img: '', quantity: 2 },
];

beforeEach(() => {
  localStorage.clear();
});

describe('Módulo de pedidos', () => {
  it('calcula neto, IVA y total a partir del carrito', () => {
    expect(calcularTotales(items)).toEqual({ neto: 200000, iva: 38000, total: 238000 });
  });

  it('rechaza el pago con una tarjeta terminada en 0000 y aprueba las demás', () => {
    expect(simularPago('4111 1111 1111 0000')).toBe(false);
    expect(simularPago('4111 1111 1111 1111')).toBe(true);
  });

  it('crea el pedido con número correlativo y lo guarda', () => {
    const pedido = crearPedido(
      { nombre: 'Ana Rojas', rut: '11111111-1', email: 'ana@correo.cl', direccion: 'Av. Libertad 450' },
      items
    );

    expect(pedido.id).toBe('PED-103'); // los pedidos iniciales llegan hasta PED-102
    expect(pedido.total).toBe(238000);
    expect(pedido.estado).toBe('En Preparación');
    expect(obtenerPedidos().map((p) => p.id)).toContain('PED-103');
  });
});
