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
      
      {/* [CAMBIO] Se agregaron clases 'd-flex flex-column' para empujar el total y botones hacia abajo */}
      <div className="offcanvas-body d-flex flex-column">
        {cart.length === 0 ? (
          <p className="text-center text-muted my-4">El carrito está vacío.</p>
        ) : (
          <>
            <ul className="list-group list-group-flush mb-3">
              {cart.map((item: CartItem) => (
                <li key={item.id} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center border-secondary">
                  <div>
                    <h6 className="my-0">{item.nombre}</h6>
                    <small className="text-white-50 d-block">${item.precio.toLocaleString('es-CL')} c/u</small>
                    
                    {/* [CAMBIO] Se agregó esta etiqueta para que el usuario vea cuántas unidades quedan en stock */}
                    <small className="text-warning" style={{ fontSize: '0.75rem' }}>
                      Stock disponible: {item.stock}
                    </small>
                  </div>
                  
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    
                    {/* [CAMBIO] Botón '+' con la propiedad 'disabled' para bloquear clics al llegar al límite de stock */}
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                    
                    {/* [CAMBIO] Se completó el cierre del componente que estaba cortado (botón eliminar, total y botones finales) */}
                    <button
                      className="btn btn-sm btn-outline-danger ms-1"
                      onClick={() => removeFromCart(item.id)}
                      title="Eliminar producto"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-auto border-top border-secondary pt-3">
              <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>Total:</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-warning fw-bold" onClick={irAPagar}>
                  Ir a pagar
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={clearCart}>
                  Vaciar carrito
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
