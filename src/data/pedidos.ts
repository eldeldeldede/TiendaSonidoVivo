import type { CartItem } from '../types';

// Los pedidos se crean y consultan en PedidoMicroservicio / VentaMicroservicio
// (ver src/api/pedidos.ts y src/api/ventas.ts). Aquí quedan los cálculos que
// el checkout muestra antes de pagar.

const TASA_IVA = 0.19;

export interface DatosCliente {
  nombre: string;
  rut: string;
  email: string;
  direccion: string;
}

// Los precios incluyen IVA: se separa el neto y el IVA para mostrar el resumen
export function calcularTotales(items: CartItem[]): { neto: number; iva: number; total: number } {
  const total = items.reduce((suma, item) => suma + item.precio * item.quantity, 0);
  const neto = Math.round(total / (1 + TASA_IVA));
  return { neto, iva: total - neto, total };
}
