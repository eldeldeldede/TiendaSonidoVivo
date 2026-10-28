import type { Product } from '../types';

// Módulo de datos: actúa como una base de datos simulada de productos.
// Los datos se guardan en localStorage para que los cambios hechos desde
// el panel de administración se mantengan al recargar la página.

const CLAVE_STORAGE = 'productos_sonidovivo';

export const productosIniciales: Product[] = [
  { id: 1, nombre: 'Guitarra Eléctrica Fender Stratocaster', categoria: 'Guitarras', precio: 750000, stock: 5, img: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&w=400&q=80' },
  { id: 2, nombre: 'Teclado Roland XPS-10', categoria: 'Teclados', precio: 620000, stock: 2, img: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=400&q=80' },
  { id: 3, nombre: 'Batería Acústica Pearl Roadshow', categoria: 'Baterías', precio: 580000, stock: 0, img: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=400&q=80' },
  { id: 4, nombre: 'Pedal de Efectos Boss DS-1', categoria: 'Accesorios', precio: 85000, stock: 12, img: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=400&q=80' }
];

// ---------- Funciones internas ----------

function guardar(productos: Product[]): void {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
}

function leer(): Product[] {
  const guardados = localStorage.getItem(CLAVE_STORAGE);
  if (!guardados) {
    guardar(productosIniciales);
    return [...productosIniciales];
  }
  try {
    return JSON.parse(guardados) as Product[];
  } catch {
    guardar(productosIniciales);
    return [...productosIniciales];
  }
}

// ---------- CRUD ----------

// Leer: todos los productos
export function obtenerProductos(): Product[] {
  return leer();
}

// Leer: un producto por su id (undefined si no existe)
export function obtenerProductoPorId(id: number): Product | undefined {
  return leer().find((p) => p.id === id);
}

// Crear: recibe los datos sin id, le asigna el siguiente id disponible
export function crearProducto(datos: Omit<Product, 'id'>): Product {
  const productos = leer();
  const siguienteId = productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
  const nuevo: Product = { id: siguienteId, ...datos };
  guardar([...productos, nuevo]);
  return nuevo;
}

// Actualizar: modifica solo los campos enviados. Devuelve undefined si no existe.
export function actualizarProducto(id: number, cambios: Partial<Omit<Product, 'id'>>): Product | undefined {
  const productos = leer();
  const existente = productos.find((p) => p.id === id);
  if (!existente) return undefined;

  const actualizado: Product = { ...existente, ...cambios };
  guardar(productos.map((p) => (p.id === id ? actualizado : p)));
  return actualizado;
}

// Eliminar: devuelve true si se eliminó, false si no existía
export function eliminarProducto(id: number): boolean {
  const productos = leer();
  const restantes = productos.filter((p) => p.id !== id);
  if (restantes.length === productos.length) return false;
  guardar(restantes);
  return true;
}

// ---------- Filtros ----------

// Lista de categorías sin repetir
export function obtenerCategorias(productos: Product[]): string[] {
  return Array.from(new Set(productos.map((p) => p.categoria)));
}

// Filtra por texto en el nombre y por categoría ('todas' = sin filtro de categoría)
export function filtrarProductos(productos: Product[], texto: string, categoria: string): Product[] {
  const busqueda = texto.trim().toLowerCase();
  return productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda);
    const coincideCategoria = categoria === 'todas' || p.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });
}

// Vuelve a los productos iniciales (útil para las pruebas)
export function reiniciarProductos(): void {
  guardar(productosIniciales);
}
