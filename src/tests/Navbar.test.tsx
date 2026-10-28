// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Navbar } from '../components/organisms/Navbar';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe('Navbar', () => {
  it('abre y cierra el menú móvil al presionar el botón', () => {
    const { container } = renderNavbar();
    const menu = container.querySelector('#navbarNav');
    const boton = screen.getByRole('button', { name: 'Abrir menú' });

    expect(menu).not.toHaveClass('show');
    fireEvent.click(boton);
    expect(menu).toHaveClass('show');
    fireEvent.click(boton);
    expect(menu).not.toHaveClass('show');
  });

  it('muestra "Iniciar Sesión" y no el Panel Admin cuando no hay sesión', () => {
    renderNavbar();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.queryByText('Panel Admin')).not.toBeInTheDocument();
  });
});
