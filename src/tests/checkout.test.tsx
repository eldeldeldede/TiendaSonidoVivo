// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/ContenidoLogin';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { CLAVE_SESION } from '../api/cliente';

const producto = { id: 1, nombre: 'Teclado Roland XPS-10', precio: 620000, categoria: 'Teclados', stock: 5, img: '', quantity: 2 };

const montar = () =>
  render(
    <MemoryRouter initialEntries={['/checkout']}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe('Pago exige iniciar sesión', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('carrito_sonidovivo', JSON.stringify([producto]));
  });
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('sin sesión redirige al login y avisa que el carrito se mantiene', () => {
    montar();
    expect(screen.getByText(/Acceso a Sonido Vivo/i)).toBeInTheDocument();
    expect(screen.getByText(/Tu carrito se mantiene/i)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('carrito_sonidovivo') ?? '[]')).toHaveLength(1);
  });

  it('con sesión muestra el formulario de pago con los datos de la cuenta', () => {
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({ id: 3, run: '22222222-2', nombre: 'Juan', apellidos: 'Pérez', email: 'cliente@sonidovivo.cl', rol: 'Cliente', token: 'abc' })
    );
    montar();
    expect(screen.getByText('Finalizar compra')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('cliente@sonidovivo.cl')).toBeInTheDocument();
  });
});
