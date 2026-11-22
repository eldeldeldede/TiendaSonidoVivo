// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/ContenidoLogin';
import { MisConsultasPage } from '../pages/MisConsultasPage';
import { AdminPage } from '../pages/AdminPage';
import { LoginPage } from '../pages/LoginPage';
import { CLAVE_SESION } from '../api/cliente';

const json = (cuerpo: unknown) =>
  Promise.resolve(new Response(JSON.stringify(cuerpo), { status: 200, headers: { 'Content-Type': 'application/json' } }));

const consulta = (extra = {}) => ({
  id: 5, nombre: 'Juan', email: 'cliente@sonidovivo.cl', mensaje: '¿Tienen stock del Roland XPS-10?',
  fecha: '2026-11-19T20:01:00', atendida: false, ...extra,
});

const montar = (ruta: string) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/mis-consultas" element={<MisConsultasPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe('Consultas de contacto', () => {
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

  it('Mis consultas sin sesión redirige al login', () => {
    montar('/mis-consultas');
    expect(screen.getByText(/Acceso a Sonido Vivo/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('Mis consultas muestra el mensaje y la respuesta recibida', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ id: 3, run: '1', nombre: 'Juan', email: 'cliente@sonidovivo.cl', rol: 'Cliente', token: 'tok' }));
    fetchMock.mockImplementation(() =>
      json([
        consulta({ id: 6, respuesta: 'Sí, quedan 3 unidades.', fechaRespuesta: '2026-11-19T21:00:00', atendida: true }),
        consulta({ id: 5, mensaje: 'Consulta sin responder aún' }),
      ])
    );
    montar('/mis-consultas');
    expect(await screen.findByText('Sí, quedan 3 unidades.')).toBeInTheDocument();
    expect(screen.getByText('Respondida')).toBeInTheDocument();
    expect(screen.getByText('En espera de respuesta')).toBeInTheDocument();
    const [url, opciones] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/api/servicios/contacto/mias');
    expect((opciones.headers as Record<string, string>).Authorization).toBe('Bearer tok');
  });

  it('el panel permite responder una consulta y la envía por PUT', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ id: 1, run: '1', nombre: 'Admin', email: 'admin@sonidovivo.cl', rol: 'Administrador', token: 'tokadmin' }));
    fetchMock.mockImplementation((url: string) => {
      if (String(url).includes('/respuesta')) return json(consulta({ respuesta: 'Claro que sí', atendida: true }));
      if (String(url).includes('/contacto')) return json([consulta()]);
      return json([]);
    });
    montar('/admin');
    fireEvent.click(await screen.findByText('Consultas de Contacto'));
    fireEvent.click(await screen.findByText('Responder'));
    fireEvent.change(screen.getByLabelText(/Respuesta para Juan/), { target: { value: 'Claro que sí' } });
    fireEvent.click(screen.getByText('Enviar respuesta'));

    await waitFor(() => {
      const llamada = fetchMock.mock.calls.find(([u]) => String(u).includes('/respuesta'));
      expect(llamada).toBeTruthy();
      expect(llamada![1].method).toBe('PUT');
      expect(JSON.parse(llamada![1].body)).toEqual({ respuesta: 'Claro que sí' });
    });
  });
});
