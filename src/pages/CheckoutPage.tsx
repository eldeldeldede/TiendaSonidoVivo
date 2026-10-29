import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreTemplate } from '../components/templates/PlantillaTienda';
import { CheckoutForm } from '../components/organisms/FormularioPago';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/ContenidoLogin';
import { calcularTotales, crearPedido, simularPago, type DatosCliente } from '../data/pedidos';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { neto, iva, total } = calcularTotales(cart);

  // Si hay sesión iniciada, los datos se completan automáticamente
  const datosIniciales: Partial<DatosCliente> | undefined = currentUser
    ? {
        nombre: currentUser.apellidos ? `${currentUser.nombre} ${currentUser.apellidos}` : currentUser.nombre,
        rut: currentUser.run,
        email: currentUser.email,
        direccion: currentUser.direccion ?? '',
      }
    : undefined;

  const pagar = (cliente: DatosCliente, numeroTarjeta: string) => {
    if (!simularPago(numeroTarjeta)) {
      navigate('/compra/error');
      return;
    }
    const pedido = crearPedido(cliente, cart);
    clearCart();
    navigate('/compra/exitosa', { state: { pedido } });
  };

  if (cart.length === 0) {
    return (
      <StoreTemplate>
        <div className="text-center my-5">
          <h2 className="fw-bold">Tu carrito está vacío</h2>
          <p className="text-white-50">Agrega productos antes de ir a pagar.</p>
          <Link to="/" className="btn btn-warning">Ir al catálogo</Link>
        </div>
      </StoreTemplate>
    );
  }

  return (
    <StoreTemplate>
      <h1 className="fw-bold mb-4">Finalizar compra</h1>
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card bg-dark text-white border-secondary p-4">
            <CheckoutForm datosIniciales={datosIniciales} total={total} onSubmit={pagar} />
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card bg-dark text-white border-secondary p-4">
            <h5 className="text-warning mb-3">Resumen del pedido</h5>
            <ul className="list-group list-group-flush mb-3">
              {cart.map((item) => (
                <li key={item.id} className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between px-0">
                  <span>{item.nombre} <small className="text-white-50">x{item.quantity}</small></span>
                  <span>${(item.precio * item.quantity).toLocaleString('es-CL')}</span>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between small text-white-50"><span>Neto</span><span>${neto.toLocaleString('es-CL')}</span></div>
            <div className="d-flex justify-content-between small text-white-50"><span>IVA (19%)</span><span>${iva.toLocaleString('es-CL')}</span></div>
            <div className="d-flex justify-content-between fw-bold fs-5 mt-2"><span>Total</span><span>${total.toLocaleString('es-CL')}</span></div>
          </div>
        </div>
      </div>
    </StoreTemplate>
  );
};
