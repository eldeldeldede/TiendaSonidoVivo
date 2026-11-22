// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calcularTotales } from '../data/pedidos';
import { pagarCarrito } from '../api/ventas';
import { obtenerPedido, listarPedidos, cambiarEstadoPedido } from '../api/pedidos';
import { ApiError } from '../api/cliente';
import type { CartItem } from '../types';

const items: CartItem[] = [
  { id: 1, nombre: 'Guitarra de prueba', categoria: 'Guitarras', precio: 119000, stock: 5, img: '', quantity: 2 },
];

const pedidoApi = {
  codigo: 'PED-103',
  clienteNombre: 'Ana Rojas',
  rut: '11111111-1',
  email: 'ana@correo.cl',
  direccion: 'Av. Libertad 450',
  fecha: '2026-10-28',
  estado: 'En Preparación',
  neto: 200000,
  iva: 38000,
  total: 238000,
  items: [{ productoId: 1, nombre: 'Guitarra de prueba', precio: 119000, cantidad: 2, img: null }],
};

const respuestaJson = (datos: unknown, status = 200) =>
  new Response(JSON.stringify(datos), { status, headers: { 'Content-Type': 'application/json' } });

describe('Cálculo de totales', () => {
  it('calcula neto, IVA y total a partir del carrito', () => {
    expect(calcularTotales(items)).toEqual({ neto: 200000, iva: 38000, total: 238000 });
  });
});

describe('API de pedidos y ventas (vía Gateway)', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('adapta el pedido del backend al tipo Order que usa la boleta', async () => {
    fetchMock.mockResolvedValue(respuestaJson(pedidoApi));

    const pedido = await obtenerPedido('PED-103');

    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/pedidos/PED-103');
    expect(pedido.id).toBe('PED-103');
    expect(pedido.cliente).toBe('Ana Rojas');
    expect(pedido.total).toBe(238000);
    expect(pedido.items?.[0]).toMatchObject({ id: 1, nombre: 'Guitarra de prueba', quantity: 2, img: '' });
  });

  it('lista los pedidos y cambia el estado con PATCH', async () => {
    fetchMock.mockResolvedValueOnce(respuestaJson([pedidoApi]));
    expect((await listarPedidos()).map((p) => p.id)).toEqual(['PED-103']);

    fetchMock.mockResolvedValueOnce(respuestaJson({ ...pedidoApi, estado: 'Despachado' }));
    const actualizado = await cambiarEstadoPedido('PED-103', 'Despachado');

    expect(fetchMock.mock.calls[1][0]).toBe('http://localhost:8080/api/pedidos/PED-103/estado');
    expect(fetchMock.mock.calls[1][1].method).toBe('PATCH');
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ estado: 'Despachado' });
    expect(actualizado.estado).toBe('Despachado');
  });

  it('el checkout envía solo ids y cantidades (el precio lo calcula el servidor)', async () => {
    fetchMock.mockResolvedValue(respuestaJson({ id: 3, numeroBoleta: 'B-000003', pedidoCodigo: 'PED-103', total: 238000 }, 201));

    const venta = await pagarCarrito(
      { clienteNombre: 'Ana Rojas', rut: '11111111-1', email: 'ana@correo.cl', direccion: 'Av. Libertad 450', numeroTarjeta: '4111 1111 1111 1111' },
      items
    );

    const cuerpo = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/ventas/checkout');
    expect(cuerpo.items).toEqual([{ productoId: 1, cantidad: 2 }]);
    expect(venta.pedidoCodigo).toBe('PED-103');
  });

  it('una tarjeta rechazada llega como ApiError con estado 402', async () => {
    fetchMock.mockResolvedValue(respuestaJson({ message: 'Pago rechazado por el banco emisor' }, 402));

    const error = await pagarCarrito(
      { clienteNombre: 'Ana', rut: '11111111-1', email: 'a@a.cl', direccion: 'x', numeroTarjeta: '4111 1111 1111 0000' },
      items
    ).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(402);
  });
});
