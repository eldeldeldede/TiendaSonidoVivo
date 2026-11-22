// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { filtrarProductos, obtenerCategorias } from '../data/productos';
import { listarProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } from '../api/productos';
import { ApiError } from '../api/cliente';
import type { Product } from '../types';

const productos: Product[] = [
  { id: 1, nombre: 'Guitarra Eléctrica Fender Stratocaster', categoria: 'Guitarras', precio: 750000, stock: 5, img: '' },
  { id: 2, nombre: 'Teclado Roland XPS-10', categoria: 'Teclados', precio: 620000, stock: 2, img: '' },
  { id: 3, nombre: 'Batería Acústica Pearl Roadshow', categoria: 'Baterías', precio: 580000, stock: 0, img: '' },
  { id: 4, nombre: 'Pedal de Efectos Boss DS-1', categoria: 'Accesorios', precio: 85000, stock: 12, img: '' },
];

const respuestaJson = (datos: unknown, status = 200) =>
  new Response(JSON.stringify(datos), { status, headers: { 'Content-Type': 'application/json' } });

describe('Filtros de búsqueda', () => {
  it('filtra por texto sin importar mayúsculas', () => {
    const resultado = filtrarProductos(productos, 'ROLAND', 'todas');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(2);
  });

  it('filtra por categoría y combina ambos filtros', () => {
    expect(filtrarProductos(productos, '', 'Accesorios').map((p) => p.id)).toEqual([4]);
    expect(filtrarProductos(productos, 'pedal', 'Guitarras')).toHaveLength(0);
    expect(filtrarProductos(productos, '', 'todas')).toHaveLength(4);
  });

  it('obtiene las categorías sin repetir', () => {
    expect(obtenerCategorias(productos)).toEqual(['Guitarras', 'Teclados', 'Baterías', 'Accesorios']);
  });
});

describe('API de productos (ProductoMicroservicio vía Gateway)', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('Leer: pide la lista a /api/productos y convierte img nula en texto vacío', async () => {
    fetchMock.mockResolvedValue(respuestaJson([{ ...productos[0], img: null }]));

    const lista = await listarProductos();

    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/productos');
    expect(lista[0].img).toBe('');
    expect(lista[0].nombre).toBe('Guitarra Eléctrica Fender Stratocaster');
  });

  it('Leer uno: pide /api/productos/{id}', async () => {
    fetchMock.mockResolvedValue(respuestaJson(productos[1]));

    const producto = await obtenerProducto(2);

    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/productos/2');
    expect(producto.nombre).toBe('Teclado Roland XPS-10');
  });

  it('Crear y Actualizar: envían el producto como JSON con POST y PUT', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(respuestaJson(productos[0], 201)));
    const datos: Omit<Product, "id"> = { nombre: productos[0].nombre, categoria: productos[0].categoria, precio: productos[0].precio, stock: productos[0].stock, img: productos[0].img };

    await crearProducto(datos);
    await actualizarProducto(1, { ...datos, precio: 700000 });

    expect(fetchMock.mock.calls[0][1].method).toBe('POST');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).nombre).toBe(datos.nombre);
    expect(fetchMock.mock.calls[1][0]).toBe('http://localhost:8080/api/productos/1');
    expect(fetchMock.mock.calls[1][1].method).toBe('PUT');
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).precio).toBe(700000);
  });

  it('Eliminar: usa DELETE y acepta la respuesta 204 sin contenido', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(eliminarProducto(3)).resolves.toBeUndefined();
    expect(fetchMock.mock.calls[0][1].method).toBe('DELETE');
  });

  it('Errores: entrega el mensaje del backend y el código de estado', async () => {
    fetchMock.mockResolvedValue(respuestaJson({ message: 'Producto no encontrado' }, 404));

    const error = await obtenerProducto(999).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(404);
    expect((error as ApiError).message).toBe('Producto no encontrado');
  });

  it('Sin conexión: avisa que los microservicios no responden', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    const error = await listarProductos().catch((e: unknown) => e);

    expect((error as ApiError).status).toBe(0);
    expect((error as ApiError).message).toMatch(/No se pudo conectar/);
  });
});
