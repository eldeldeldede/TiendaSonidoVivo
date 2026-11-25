// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/ContenidoLogin';
import { App } from '../App';
import { CLAVE_SESION } from '../api/cliente';

const json = (cuerpo: unknown) =>
  Promise.resolve(new Response(JSON.stringify(cuerpo), { status: 200, headers: { 'Content-Type': 'application/json' } }));

const iniciarSesionComo = (rol: string) =>
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ id: 7, run: '1-9', nombre: 'Ana', email: 'ana@correo.cl', rol, token: 'tok' }));

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

describe('Redirecciones según la sesión', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn(() => json([])));
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('sin sesión, /admin lleva al formulario de inicio de sesión', async () => {
    montar('/admin');
    expect(await screen.findByRole('heading', { name: 'Acceso a Sonido Vivo' })).toBeInTheDocument();
  });

  it('un Cliente con sesión que entra a /admin vuelve al inicio, no al login', async () => {
    iniciarSesionComo('Cliente');
    montar('/admin');
    expect(await screen.findByRole('heading', { name: 'Catálogo de Instrumentos' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Acceso a Sonido Vivo' })).not.toBeInTheDocument();
  });

  it('con la sesión iniciada, /login redirige al inicio en vez de mostrar el formulario', async () => {
    iniciarSesionComo('Cliente');
    montar('/login');
    expect(await screen.findByRole('heading', { name: 'Catálogo de Instrumentos' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Acceso a Sonido Vivo' })).not.toBeInTheDocument();
  });
});
