// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/ContenidoLogin';
import { CLAVE_SESION } from '../api/cliente';
import { tokenVencido, vencimientoToken } from '../utils/token';

// Arma un JWT de prueba con el vencimiento indicado (en segundos desde 1970). La firma no importa:
// el frontend solo lee el vencimiento, la firma la verifica el backend.
const base64url = (texto: string) => btoa(texto).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const jwt = (expSegundos: number) =>
  `${base64url('{"alg":"HS256","typ":"JWT"}')}.${base64url(JSON.stringify({ sub: '3', rol: 'Cliente', exp: expSegundos }))}.firma`;
const enSegundos = (msDesdeAhora: number) => Math.floor((Date.now() + msDesdeAhora) / 1000);

const json = (cuerpo: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json' } }));

const usuarioApi = (token: string) => ({
  id: 3, run: '22222222-2', nombre: 'Juan', apellidos: 'Pérez', correo: 'cliente@sonidovivo.cl',
  rolId: 3, rol: 'Cliente', bloqueado: false, debeCambiarContrasena: false, token,
});

const guardarSesion = (token: string, extra = {}) =>
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ id: 3, run: '22222222-2', nombre: 'Juan', email: 'cliente@sonidovivo.cl', rol: 'Cliente', token, ...extra }));

// Muestra quién tiene la sesión, para poder comprobarlo en pantalla
const QuienSoy = () => {
  const { currentUser } = useAuth();
  return <p>{currentUser ? `Sesión de ${currentUser.nombre}` : 'Sin sesión'}</p>;
};
const montar = () => render(<AuthProvider><QuienSoy /></AuthProvider>);

describe('Lectura del vencimiento del token', () => {
  it('obtiene el vencimiento de un JWT y detecta si ya pasó', () => {
    const exp = enSegundos(60_000);
    expect(vencimientoToken(jwt(exp))).toBe(exp * 1000);
    expect(tokenVencido(jwt(enSegundos(-1000)))).toBe(true);
    expect(tokenVencido(jwt(enSegundos(60_000)))).toBe(false);
  });

  it('un texto que no es JWT no tiene vencimiento y no se da por vencido', () => {
    expect(vencimientoToken('abc')).toBeNull();
    expect(vencimientoToken(undefined)).toBeNull();
    expect(tokenVencido('abc')).toBe(false);
  });
});

describe('Sesión persistente y renovación del token', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('al recargar, mantiene la sesión si el token sigue vigente', () => {
    guardarSesion(jwt(enSegundos(8 * 3600 * 1000)));
    montar();
    expect(screen.getByText('Sesión de Juan')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled(); // faltan horas para renovar
  });

  it('al recargar, no restaura una sesión con el token vencido y la borra del navegador', () => {
    guardarSesion(jwt(enSegundos(-60_000)));
    montar();
    expect(screen.getByText('Sin sesión')).toBeInTheDocument();
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
  });

  it('renueva el token cuando está por vencer y guarda el nuevo', async () => {
    const porVencer = jwt(enSegundos(60_000)); // vence en 1 minuto (menos que el margen de 5)
    const nuevo = jwt(enSegundos(8 * 3600 * 1000));
    guardarSesion(porVencer);
    fetchMock.mockImplementation(() => json(usuarioApi(nuevo)));

    montar();

    await waitFor(() => expect(JSON.parse(localStorage.getItem(CLAVE_SESION)!).token).toBe(nuevo));
    const [url, opciones] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/api/usuarios/renovar-token');
    expect(opciones.method).toBe('POST');
    expect(opciones.headers.Authorization).toBe(`Bearer ${porVencer}`); // se renueva con el token vigente
    expect(screen.getByText('Sesión de Juan')).toBeInTheDocument();
  });

  it('si el backend rechaza la renovación (401), cierra la sesión', async () => {
    guardarSesion(jwt(enSegundos(60_000)));
    fetchMock.mockImplementation(() => json({ message: 'Tu sesión expiró o no es válida' }, 401));

    montar();

    await waitFor(() => expect(screen.getByText('Sin sesión')).toBeInTheDocument());
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
  });

  it('con contraseña temporal no intenta renovar (debe cambiarla primero)', () => {
    guardarSesion(jwt(enSegundos(60_000)), { debeCambiarContrasena: true });
    montar();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
