// Cliente HTTP base: todas las llamadas pasan por el Gateway de los microservicios.
// La URL se puede cambiar con la variable VITE_API_URL (ver .env.example).

export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// La sesión (usuario + token JWT) se guarda en el navegador; el token se envía en cada petición.
export const CLAVE_SESION = 'sesion_sonidovivo';
export const EVENTO_SESION_EXPIRADA = 'sesion-expirada';

function obtenerToken(): string | null {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION);
    return guardada ? ((JSON.parse(guardada) as { token?: string }).token ?? null) : null;
  } catch {
    return null;
  }
}

interface OpcionesPeticion {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  cuerpo?: unknown;
  headers?: Record<string, string>;
}

// Extrae el mensaje que devuelven los microservicios ({ message: "..." })
async function leerMensaje(respuesta: Response): Promise<string> {
  try {
    const datos = await respuesta.json();
    if (datos && typeof datos.message === 'string' && datos.message !== '') return datos.message;
  } catch {
    // la respuesta no traía JSON
  }
  return `Error ${respuesta.status} al comunicarse con el servidor`;
}

export async function peticion<T>(ruta: string, opciones: OpcionesPeticion = {}): Promise<T> {
  let respuesta: Response;
  const token = obtenerToken();
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: opciones.method ?? 'GET',
      headers: {
        ...(opciones.cuerpo !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opciones.headers,
      },
      body: opciones.cuerpo !== undefined ? JSON.stringify(opciones.cuerpo) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Verifica que los microservicios estén encendidos.', 0);
  }

  if (!respuesta.ok) {
    // Token vencido o inválido: se avisa para cerrar la sesión (el login con clave mala también da 401, pero ahí no hay token)
    if (respuesta.status === 401 && token) window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
    throw new ApiError(await leerMensaje(respuesta), respuesta.status);
  }
  if (respuesta.status === 204) return undefined as T;
  return (await respuesta.json()) as T;
}

// Convierte cualquier error en un texto para mostrar al usuario
export function mensajeDeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado';
}
