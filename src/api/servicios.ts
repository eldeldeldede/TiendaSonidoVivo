import type { Consulta, Servicio } from '../types';
import { peticion } from './cliente';

export const listarServicios = (): Promise<Servicio[]> => peticion<Servicio[]>('/api/servicios');

export const enviarConsulta = (datos: { nombre: string; email: string; mensaje: string }): Promise<Consulta> =>
  peticion<Consulta>('/api/servicios/contacto', { method: 'POST', cuerpo: datos });

export const listarConsultas = (): Promise<Consulta[]> => peticion<Consulta[]>('/api/servicios/contacto');

export const marcarConsultaAtendida = (id: number, atendida: boolean): Promise<Consulta> =>
  peticion<Consulta>(`/api/servicios/contacto/${id}/atendida`, { method: 'PATCH', cuerpo: { atendida } });

export const responderConsulta = (id: number, respuesta: string): Promise<Consulta> =>
  peticion<Consulta>(`/api/servicios/contacto/${id}/respuesta`, { method: 'PUT', cuerpo: { respuesta } });

// Mensajes de la persona con sesión iniciada, con las respuestas que recibió
export const listarMisConsultas = (): Promise<Consulta[]> => peticion<Consulta[]>('/api/servicios/contacto/mias');
