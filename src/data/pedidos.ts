import type { CartItem, Order } from '../types';

// Módulo de datos de pedidos: simula la base de datos de compras.

const CLAVE_STORAGE = 'pedidos_sonidovivo';
const TASA_IVA = 0.19;

export const pedidosIniciales: Order[] = [
  { id: 'PED-101', cliente: 'Carlos Pérez', fecha: '2026-09-07', total: 750000, estado: 'En Preparación' },
  { id: 'PED-102', cliente: 'María González', fecha: '2026-09-06', total: 85000, estado: 'Despachado' }
];

export interface DatosCliente {
  nombre: string;
  rut: string;
  email: string;
  direccion: string;
}

function guardar(pedidos: Order[]): void {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidos));
}

function leer(): Order[] {
  const guardados = localStorage.getItem(CLAVE_STORAGE);
  if (!guardados) return [...pedidosIniciales];
  try {
    return JSON.parse(guardados) as Order[];
  } catch {
    return [...pedidosIniciales];
  }
}

export function obtenerPedidos(): Order[] {
  return leer();
}

export function obtenerPedidoPorId(id: string): Order | undefined {
  return leer().find((p) => p.id === id);
}

// Los precios incluyen IVA: se separa el neto y el IVA para la boleta
export function calcularTotales(items: CartItem[]): { neto: number; iva: number; total: number } {
  const total = items.reduce((suma, item) => suma + item.precio * item.quantity, 0);
  const neto = Math.round(total / (1 + TASA_IVA));
  return { neto, iva: total - neto, total };
}

// Simulación de pago: una tarjeta que termina en 0000 es rechazada
export function simularPago(numeroTarjeta: string): boolean {
  return !numeroTarjeta.replace(/\s/g, '').endsWith('0000');
}

// Crea el pedido, lo guarda y lo devuelve (para mostrarlo en la boleta)
export function crearPedido(cliente: DatosCliente, items: CartItem[]): Order {
  const pedidos = leer();
  const ultimoNumero = pedidos.reduce((max, p) => {
    const numero = Number(p.id.replace('PED-', ''));
    return Number.isNaN(numero) ? max : Math.max(max, numero);
  }, 100);

  const { neto, iva, total } = calcularTotales(items);

  const nuevo: Order = {
    id: `PED-${ultimoNumero + 1}`,
    cliente: cliente.nombre,
    rut: cliente.rut,
    email: cliente.email,
    direccion: cliente.direccion,
    fecha: new Date().toISOString().slice(0, 10),
    items,
    neto,
    iva,
    total,
    estado: 'En Preparación',
  };

  guardar([...pedidos, nuevo]);
  return nuevo;
}

// Actualizar: cambia el estado de un pedido (lo usan Administrador y Vendedor)
export function actualizarEstadoPedido(id: string, estado: Order['estado']): Order | undefined {
  const pedidos = leer();
  const existente = pedidos.find((p) => p.id === id);
  if (!existente) return undefined;

  const actualizado: Order = { ...existente, estado };
  guardar(pedidos.map((p) => (p.id === id ? actualizado : p)));
  return actualizado;
}