import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StoreTemplate } from '../components/templates/StoreTemplate';
import { Boleta } from '../components/organisms/Boleta';
import type { Order } from '../types';

export const CompraExitosaPage: React.FC = () => {
  const location = useLocation();
  const pedido = (location.state as { pedido?: Order } | null)?.pedido;

  // Si se entra directo a la URL sin haber comprado
  if (!pedido) {
    return (
      <StoreTemplate>
        <div className="text-center my-5">
          <h2 className="fw-bold">No hay una compra para mostrar</h2>
          <Link to="/" className="btn btn-warning mt-3">Volver al catálogo</Link>
        </div>
      </StoreTemplate>
    );
  }

  return (
    <StoreTemplate>
      <div className="text-center my-4">
        <i className="bi bi-check-circle-fill text-success display-3"></i>
        <h1 className="fw-bold mt-2">¡Compra realizada con éxito!</h1>
        <p className="text-white-50">
          Enviamos el comprobante a {pedido.email ?? 'tu correo'}. Tu pedido ya está en preparación.
        </p>
      </div>

      <div className="mx-auto mb-4" style={{ maxWidth: '760px' }}>
        <Boleta pedido={pedido} />
        <div className="d-flex gap-2 justify-content-center mt-4">
          <button type="button" className="btn btn-outline-light" onClick={() => window.print()}>
            <i className="bi bi-printer me-1"></i>Imprimir boleta
          </button>
          <Link to="/" className="btn btn-warning fw-bold">Seguir comprando</Link>
        </div>
      </div>
    </StoreTemplate>
  );
};
