import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../types';

interface CartOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartOffcanvas: React.FC<CartOffcanvasProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();

  const irAPagar = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="offcanvas offcanvas-end show d-block" tabIndex={-1} style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
      <div className="offcanvas-header border-bottom border-secondary">
        <h5 className="offcanvas-title">Carrito de Compras</h5>
        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body">
        {cart.length === 0 ? (
          <p className="text-center text-muted my-4">El carrito está vacío.</p>
        ) : (
          <ul className="list-group list-group-flush mb-3">
            {cart.map((item: CartItem) => (
              <li key={item.id} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center border-secondary">
                <div>
                  <h6 className="my-0">{item.nombre}</h6>
                  <small className="text-muted">${item.precio.toLocaleString()} c/u</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-sm btn-outline-light" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="btn btn-sm btn-outline-light" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button className="btn btn-sm btn-danger ms-2" onClick={() => removeFromCart(item.id)}>×</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {cart.length > 0 && (
        <div className="offcanvas-footer p-3 border-top border-secondary">
          <div className="d-flex justify-content-between mb-3 fw-bold">
            <span>Total:</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <button className="btn btn-warning w-100 mb-2" onClick={irAPagar}>Proceder al Pago</button>
          <button className="btn btn-outline-danger w-100" onClick={clearCart}>Vaciar Carrito</button>
        </div>
      )}
    </div>
  );
};