// Define los roles de acceso
export type UserRole = 'Administrador' | 'Vendedor' | 'Cliente';

// Representa a un usuario registrado
export interface User {
  run: string;
  nombre: string;
  apellidos?: string;
  email: string;
  pass?: string;
  rol: UserRole;
  region?: string;
  comuna?: string;
  direccion?: string;
}

// Representa un producto del inventario
export interface Product {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  img: string;
}

// Representa un producto dentro del carrito de compras
export interface CartItem extends Product {
  quantity: number;
}

// Representa una compra realizada
export interface Order {
  id: string;
  cliente: string;
  fecha: string;
  total: number;
  estado: 'En Preparación' | 'Despachado' | 'Entregado';
  // Campos opcionales que se llenan al comprar desde el checkout (boleta)
  rut?: string;
  email?: string;
  direccion?: string;
  items?: CartItem[];
  neto?: number;
  iva?: number;
}

// Representa un artículo de la sección "Novedades"
export interface NewsArticle {
  id: number;
  titulo: string;
  categoria: string;
  fecha: string;
  autor: string;
  imagen: string;
  resumen: string;
  descripcionCompleta: string;
}

// Representa un punto de retiro físico
export interface PickupPoint {
  id: number;
  nombre: string;
  tipo: string;
  direccion: string;
  horario: string;
  lat: number;
  lng: number;
  principal: boolean;
}