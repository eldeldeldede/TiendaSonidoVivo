// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/ContenidoLogin';
import { App } from '../App';
import { CLAVE_SESION } from '../api/cliente';

const json = (cuerpo: unknown, status = 200) =>
  Promise.resolve(new Response(status === 204 ? null : JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json' } }));

const usuarioApi = (extra = {}) => ({
  id: 7, run: '1-9', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@correo.cl', rolId: 3, rol: 'Cliente',
  bloqueado: false, debeCambiarContrasena: true, token: 'tok-temporal', ...extra,
});

const montar = (ruta: string) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe('Cambio obligatorio de contraseña temporal', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('alert', vi.fn());
    window.alert = vi.fn();
    fetchMock.mockReset();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('con contraseña temporal cualquier ruta lleva a la pantalla de cambio', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ id: 7, run: '1-9', nombre: 'Ana', email: 'ana@correo.cl', rol: 'Cliente', debeCambiarContrasena: true, token: 'tok-temporal' }));
    fetchMock.mockImplementation(() => json([]));
    montar('/mis-pedidos');
    expect(await screen.findByRole('heading', { name: 'Cambiar contraseña' })).toBeInTheDocument();
    expect(screen.getByText(/primer inicio de sesión/i)).toBeInTheDocument();
  });

  it('cambia la contraseña y vuelve a iniciar sesión para obtener un token normal', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ id: 7, run: '1-9', nombre: 'Ana', email: 'ana@correo.cl', rol: 'Cliente', debeCambiarContrasena: true, token: 'tok-temporal' }));
    fetchMock.mockImplementation((url: string) => {
      if (String(url).endsWith('/api/usuarios/7/contrasena')) return json(null, 204);
      if (String(url).endsWith('/api/usuarios/login')) return json(usuarioApi({ debeCambiarContrasena: false, token: 'tok-normal' }));
      return json([]);
    });
    montar('/cambiar-contrasena');
    fireEvent.change(await screen.findByLabelText(/Contraseña temporal/), { target: { value: 'Temp123456' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña nueva/), { target: { value: 'nuevaClave1' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña nueva/), { target: { value: 'nuevaClave1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar contraseña' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('¡Contraseña actualizada!'));
    const put = fetchMock.mock.calls.find(([u]) => String(u).endsWith('/api/usuarios/7/contrasena'))!;
    expect(JSON.parse((put[1] as RequestInit).body as string)).toEqual({ contrasenaActual: 'Temp123456', contrasenaNueva: 'nuevaClave1' });
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION)!).token).toBe('tok-normal');
  });

  it('rechaza una contraseña nueva igual a la actual sin llamar al servidor', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ id: 7, run: '1-9', nombre: 'Ana', email: 'ana@correo.cl', rol: 'Cliente', debeCambiarContrasena: true, token: 't' }));
    fetchMock.mockImplementation(() => json([]));
    montar('/cambiar-contrasena');
    fireEvent.change(await screen.findByLabelText(/Contraseña temporal/), { target: { value: 'Temp123456' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña nueva/), { target: { value: 'Temp123456' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña nueva/), { target: { value: 'Temp123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar contraseña' }));
    expect(window.alert).toHaveBeenCalledWith('La contraseña nueva debe ser distinta de la actual');
    expect(fetchMock.mock.calls.some(([u]) => String(u).endsWith('/contrasena'))).toBe(false);
  });

  it('sin sesión la pantalla redirige al login', async () => {
    fetchMock.mockImplementation(() => json([]));
    montar('/cambiar-contrasena');
    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Cambiar contraseña' })).not.toBeInTheDocument());
  });
});
