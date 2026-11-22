import type { Product } from '../types';

// Los productos viven en ProductoMicroservicio (ver src/api/productos.ts).
// Aquí quedan solo las funciones puras de filtrado que usa el catálogo.

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
