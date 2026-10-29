import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/ContenidoLogin';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const { currentUser, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = () => setMenuAbierto(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    cerrarMenu();
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary px-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-warning fs-4" to="/">
          Sonido Vivo
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={cerrarMenu}>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros" onClick={cerrarMenu}>
                Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/servicios" onClick={cerrarMenu}>
                Servicios
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/novedades" onClick={cerrarMenu}>
                Novedades
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mapa" onClick={cerrarMenu}>
                Puntos de Retiro
              </Link>
            </li>
            {(currentUser?.rol === 'Administrador' || currentUser?.rol === 'Vendedor') && (
              <li className="nav-item">
                <Link className="nav-link text-info fw-semibold" to="/admin" onClick={cerrarMenu}>
                  Panel Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-warning position-relative"
              onClick={onOpenCart}
            >
              🛒 Carrito
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-light small">
                  {currentUser.nombre} ({currentUser.rol})
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-warning btn-sm fw-semibold">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};