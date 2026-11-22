import type { NewsArticle } from '../types';
import { peticion } from './cliente';

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// "2026-09-05" -> "05 de septiembre, 2026" (sin pasar por Date para evitar desfases de zona horaria)
export function formatearFecha(iso: string): string {
  const [anio, mes, dia] = iso.split('-');
  const nombreMes = MESES[Number(mes) - 1];
  if (!anio || !dia || !nombreMes) return iso;
  return `${dia} de ${nombreMes}, ${anio}`;
}

interface NovedadApi extends Omit<NewsArticle, 'imagen'> {
  imagen: string | null;
}

export const listarNovedades = async (): Promise<NewsArticle[]> =>
  (await peticion<NovedadApi[]>('/api/novedades')).map((n) => ({
    ...n,
    imagen: n.imagen ?? '',
    fecha: formatearFecha(n.fecha),
  }));
