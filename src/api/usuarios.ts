import type { User, UserRole } from '../types';
import { peticion } from './cliente';

interface UsuarioApi {
  id: number;
  run: string;
  nombre: string;
  apellidos: string | null;
  correo: string;
  rolId: number;
  rol: UserRole;
  region: string | null;
  comuna: string | null;
  direccion: string | null;
  debeCambiarContrasena?: boolean;
  token?: string;
}

export interface RolApi {
  id: number;
  nombre: UserRole;
}

// El backend usa "correo"; el front usa "email". Nunca viaja la contraseña de vuelta ni se envía al crear cuentas:
// al crear un perfil el sistema genera una contraseña temporal y la manda al correo.
export const desdeApi = (u: UsuarioApi): User => ({
  id: u.id,
  run: u.run,
  nombre: u.nombre,
  apellidos: u.apellidos ?? undefined,
  email: u.correo,
  rol: u.rol,
  region: u.region ?? undefined,
  comuna: u.comuna ?? undefined,
  direccion: u.direccion ?? undefined,
  debeCambiarContrasena: u.debeCambiarContrasena,
  token: u.token,
});

const aSolicitud = (u: User, rolId?: number) => ({
  run: u.run,
  nombre: u.nombre,
  apellidos: u.apellidos,
  correo: u.email,
  rolId,
  region: u.region,
  comuna: u.comuna,
  direccion: u.direccion,
});

export const iniciarSesion = async (email: string, pass: string): Promise<User> =>
  desdeApi(await peticion<UsuarioApi>('/api/usuarios/login', { method: 'POST', cuerpo: { correo: email, contrasena: pass } }));

// Renovación del JWT: con el token vigente (lo agrega el cliente HTTP) el backend entrega uno nuevo
// con el vencimiento renovado y el rol actual de la cuenta
export const renovarToken = async (): Promise<User> =>
  desdeApi(await peticion<UsuarioApi>('/api/usuarios/renovar-token', { method: 'POST' }));

// Registro público: el backend siempre crea el usuario con rol Cliente y le envía la contraseña por correo
export const registrarCliente = async (usuario: User): Promise<User> =>
  desdeApi(await peticion<UsuarioApi>('/api/usuarios/registro', { method: 'POST', cuerpo: aSolicitud(usuario) }));

// Alta desde el panel de administración, con el rol elegido
export const crearUsuario = async (usuario: User, rolId: number): Promise<User> =>
  desdeApi(await peticion<UsuarioApi>('/api/usuarios', { method: 'POST', cuerpo: aSolicitud(usuario, rolId) }));

// Actualiza los datos de una cuenta (cada persona puede editar la suya; el rol no se cambia por aquí)
export const actualizarUsuario = async (id: number, usuario: User): Promise<User> =>
  desdeApi(await peticion<UsuarioApi>(`/api/usuarios/${id}`, { method: 'PUT', cuerpo: aSolicitud(usuario) }));

export const listarUsuarios = async (): Promise<User[]> =>
  (await peticion<UsuarioApi[]>('/api/usuarios')).map(desdeApi);

export const listarRoles = (): Promise<RolApi[]> => peticion<RolApi[]>('/api/roles');

export const cambiarRolUsuario = async (id: number, rolId: number): Promise<User> =>
  desdeApi(await peticion<UsuarioApi>(`/api/usuarios/${id}/rol`, { method: 'PATCH', cuerpo: { rolId } }));

// Cambio de contraseña propia (obligatorio la primera vez, cuando se usa la contraseña temporal)
export const cambiarContrasena = (id: number, contrasenaActual: string, contrasenaNueva: string): Promise<void> =>
  peticion<void>(`/api/usuarios/${id}/contrasena`, { method: 'PUT', cuerpo: { contrasenaActual, contrasenaNueva } });
