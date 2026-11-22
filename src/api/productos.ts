import type { Product } from '../types';
import { peticion } from './cliente';

type ProductoApi = Omit<Product, 'img'> & { img: string | null };

const desdeApi = (p: ProductoApi): Product => ({ ...p, img: p.img ?? '' });

export const listarProductos = async (): Promise<Product[]> =>
  (await peticion<ProductoApi[]>('/api/productos')).map(desdeApi);

export const obtenerProducto = async (id: number): Promise<Product> =>
  desdeApi(await peticion<ProductoApi>(`/api/productos/${id}`));

export const crearProducto = async (datos: Omit<Product, 'id'>): Promise<Product> =>
  desdeApi(await peticion<ProductoApi>('/api/productos', { method: 'POST', cuerpo: datos }));

export const actualizarProducto = async (id: number, datos: Omit<Product, 'id'>): Promise<Product> =>
  desdeApi(await peticion<ProductoApi>(`/api/productos/${id}`, { method: 'PUT', cuerpo: datos }));

export const eliminarProducto = (id: number): Promise<void> =>
  peticion<void>(`/api/productos/${id}`, { method: 'DELETE' });
