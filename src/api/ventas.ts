import type { CartItem } from '../types';
import { peticion } from './cliente';

export interface DatosCheckout {
  clienteNombre: string;
  rut: string;
  email: string;
  direccion: string;
  puntoRetiroId?: number;
  numeroTarjeta: string;
}

export interface VentaRealizada {
  id: number;
  numeroBoleta: string;
  pedidoCodigo: string;
  total: number;
}

// Valida stock, procesa el pago (simulado) y crea el pedido en el backend.
// Si el banco rechaza la tarjeta responde 402 (ApiError.status === 402).
export const pagarCarrito = (datos: DatosCheckout, carrito: CartItem[]): Promise<VentaRealizada> =>
  peticion<VentaRealizada>('/api/ventas/checkout', {
    method: 'POST',
    cuerpo: {
      ...datos,
      items: carrito.map((i) => ({ productoId: i.id, cantidad: i.quantity })),
    },
  });
