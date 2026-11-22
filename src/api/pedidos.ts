import type { CartItem, Order } from '../types';
import { peticion } from './cliente';

interface ItemApi {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  img: string | null;
}

interface PedidoApi {
  codigo: string;
  clienteNombre: string;
  rut: string | null;
  email: string | null;
  direccion: string | null;
  fecha: string;
  estado: Order['estado'];
  neto: number;
  iva: number;
  total: number;
  items: ItemApi[];
}

// El pedido del backend se adapta al tipo Order que ya usan la boleta y el panel
export const desdeApi = (p: PedidoApi): Order => ({
  id: p.codigo,
  cliente: p.clienteNombre,
  fecha: p.fecha,
  total: p.total,
  estado: p.estado,
  rut: p.rut ?? undefined,
  email: p.email ?? undefined,
  direccion: p.direccion ?? undefined,
  neto: p.neto,
  iva: p.iva,
  items: p.items.map(
    (i): CartItem => ({
      id: i.productoId,
      nombre: i.nombre,
      categoria: '',
      precio: i.precio,
      stock: 0,
      img: i.img ?? '',
      quantity: i.cantidad,
    })
  ),
});

export const listarPedidos = async (): Promise<Order[]> =>
  (await peticion<PedidoApi[]>('/api/pedidos')).map(desdeApi);

// Pedidos de la cuenta con sesión iniciada (el Gateway identifica al usuario por su token)
export const listarMisPedidos = async (): Promise<Order[]> =>
  (await peticion<PedidoApi[]>('/api/pedidos/mios')).map(desdeApi);

export const obtenerPedido = async (codigo: string): Promise<Order> =>
  desdeApi(await peticion<PedidoApi>(`/api/pedidos/${codigo}`));

export const cambiarEstadoPedido = async (codigo: string, estado: Order['estado']): Promise<Order> =>
  desdeApi(await peticion<PedidoApi>(`/api/pedidos/${codigo}/estado`, { method: 'PATCH', cuerpo: { estado } }));
