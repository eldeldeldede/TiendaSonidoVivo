// Utilidades para leer el JWT en el navegador.
// Solo se lee el vencimiento (claim "exp") para saber cuándo renovarlo; la firma la verifica el backend
// (Gateway y UsuarioMicroservicio), nunca el frontend.

/** Devuelve el vencimiento del token en milisegundos, o null si no es un JWT legible. */
export function vencimientoToken(token?: string | null): number | null {
  if (!token) return null;
  const partes = token.split('.');
  if (partes.length !== 3) return null;
  try {
    // El JWT usa base64url: se pasa a base64 normal y se completa el relleno para poder decodificarlo
    const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
    const conRelleno = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const datos = JSON.parse(atob(conRelleno)) as { exp?: unknown };
    return typeof datos.exp === 'number' ? datos.exp * 1000 : null;
  } catch {
    return null;
  }
}

/** true si el token trae vencimiento y ya pasó. Un token sin vencimiento legible no se da por vencido. */
export function tokenVencido(token?: string | null, ahora: number = Date.now()): boolean {
  const vence = vencimientoToken(token);
  return vence !== null && vence <= ahora;
}
