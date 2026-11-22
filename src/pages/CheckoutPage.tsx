// [CAMBIO] Se importó 'useState' para manejar mensajes de error en pantalla si falta stock
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { StoreTemplate } from '../components/templates/PlantillaTienda';
import { CheckoutForm } from '../components/organisms/FormularioPago';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/ContenidoLogin';
import { calcularTotales, type DatosCliente } from '../data/pedidos';
import { pagarCarrito } from '../api/ventas';
import { obtenerPedido } from '../api/pedidos';
import { actualizarUsuario } from '../api/usuarios';
import { ApiError, mensajeDeError } from '../api/cliente';
import type { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { currentUser, actualizarSesion } = useAuth();
  const navigate = useNavigate();
  
  // [CAMBIO] Nuevo estado para guardar el texto de alerta si algún producto supera el stock
  const [errorStock, setErrorStock] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  const { neto, iva, total } = calcularTotales(cart);

  const datosIniciales: Partial<DatosCliente> | undefined = currentUser
    ? {
        nombre: currentUser.apellidos ? `${currentUser.nombre} ${currentUser.apellidos}` : currentUser.nombre,
        rut: currentUser.run,
        email: currentUser.email,
        direccion: [currentUser.direccion, currentUser.comuna, currentUser.region].filter(Boolean).join(', '),
      }
    : undefined;

  const pagar = async (cliente: DatosCliente, numeroTarjeta: string) => {
    // [CAMBIO] Limpia errores anteriores cada vez que el usuario intenta pagar
    setErrorStock(null);

    // [CAMBIO] Busca si algún ítem del carrito tiene una cantidad mayor a su stock disponible
    const productoSinStock = cart.find((item) => item.quantity > item.stock);
    if (productoSinStock) {
      // [CAMBIO] Muestra el mensaje de error y detiene el proceso de pago con 'return'
      setErrorStock(
        `No hay suficiente stock para "${productoSinStock.nombre}". Máximo disponible: ${productoSinStock.stock}.`
      );
      return;
    }

    // El backend valida stock, procesa el pago (simulado) y crea el pedido.
    // Si la tarjeta es rechazada responde 402.
    setProcesando(true);
    try {
      const venta = await pagarCarrito(
        {
          clienteNombre: cliente.nombre,
          rut: cliente.rut,
          email: cliente.email,
          direccion: cliente.direccion,
          numeroTarjeta,
        },
        cart
      );
      // Si la cuenta aún no tiene dirección, se guarda la de esta compra para autocompletar las próximas
      if (currentUser?.id && !currentUser.direccion && cliente.direccion.trim() !== '') {
        const conDireccion = { ...currentUser, direccion: cliente.direccion.trim() };
        actualizarUsuario(currentUser.id, conDireccion)
          .then(() => actualizarSesion(conDireccion))
          .catch(() => undefined); // no es crítico: la compra ya se hizo
      }
      // El pago ya se realizó: se vacía el carrito aunque falle la consulta de la boleta
      const itemsComprados = cart;
      clearCart();
      const pedido = await obtenerPedido(venta.pedidoCodigo).catch(
        (): Order => ({
          id: venta.pedidoCodigo,
          cliente: cliente.nombre,
          rut: cliente.rut,
          email: cliente.email,
          direccion: cliente.direccion,
          fecha: new Date().toISOString().slice(0, 10),
          estado: 'En Preparación',
          items: itemsComprados,
          ...calcularTotales(itemsComprados),
        })
      );
      navigate('/compra/exitosa', { state: { pedido } });
    } catch (e) {
      if (e instanceof ApiError && e.status === 402) {
        navigate('/compra/error');
        return;
      }
      setErrorStock(mensajeDeError(e));
    } finally {
      setProcesando(false);
    }
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

  // Para pagar hay que iniciar sesión: el carrito se conserva y al volver se retoma el pago
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ desde: '/checkout' }} />;
  }

  return (
    <StoreTemplate>
      <h1 className="fw-bold mb-4">Finalizar compra</h1>

      {/* [CAMBIO] Muestra una alerta roja de Bootstrap en pantalla solo si 'errorStock' tiene un mensaje */}
      {errorStock && (
        <div className="alert alert-danger" role="alert">
          {errorStock}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card bg-dark text-white border-secondary p-4">
            <CheckoutForm datosIniciales={datosIniciales} total={total} onSubmit={pagar} procesando={procesando} />
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
