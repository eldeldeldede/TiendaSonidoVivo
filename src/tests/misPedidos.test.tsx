// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/ContenidoLogin';
import { MisPedidosPage } from '../pages/MisPedidosPage';
import { LoginPage } from '../pages/LoginPage';
import { CLAVE_SESION } from '../api/cliente';

const pedidoApi = {
  codigo: 'PED-104', clienteNombre: 'Juan Pérez', rut: '22222222-2', email: 'cliente@sonidovivo.cl', direccion: 'Calle 1',
  fecha: '2026-11-19', estado: 'Despachado', neto: 1042017, iva: 197983, total: 1240000,
  items: [{ productoId: 1, nombre: 'Teclado Roland XPS-10', precio: 620000, cantidad: 2, img: null }],
};

const montar = () =>
  render(
    <MemoryRouter initialEntries={['/mis-pedidos']}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/mis-pedidos" element={<MisPedidosPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe('Mis pedidos', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('sin sesión redirige al login', () => {
    montar();
    expect(screen.getByText(/Acceso a Sonido Vivo/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('con sesión pide /api/pedidos/mios con el token y muestra los pedidos', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ id: 3, run: '22222222-2', nombre: 'Juan', email: 'cliente@sonidovivo.cl', rol: 'Cliente', token: 'tok123' }));
    fetchMock.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify([pedidoApi]), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    );
    montar();
    expect(await screen.findByText('PED-104')).toBeInTheDocument();
    expect(screen.getByText('Despachado')).toBeInTheDocument();
    expect(screen.getByText(/Teclado Roland XPS-10 x2/)).toBeInTheDocument();

    const [url, opciones] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/api/pedidos/mios');
    expect((opciones.headers as Record<string, string>).Authorization).toBe('Bearer tok123');

    fireEvent.click(screen.getByText('Ver boleta'));
    await waitFor(() => expect(screen.getByText('Ocultar boleta')).toBeInTheDocument());
  });

  it('si no tiene pedidos lo indica', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ id: 3, run: '1', nombre: 'Juan', email: 'a@a.cl', rol: 'Cliente', token: 't' }));
    fetchMock.mockImplementation(() => Promise.resolve(new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } })));
    montar();
    expect(await screen.findByText(/Aún no tienes pedidos/)).toBeInTheDocument();
  });
});
