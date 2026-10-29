import React from 'react';
import { Link } from 'react-router-dom';
import { StoreTemplate } from '../components/templates/PlantillaTienda';

export const CompraErrorPage: React.FC = () => {
  return (
    <StoreTemplate>
      <div className="text-center my-5 mx-auto" style={{ maxWidth: '560px' }}>
        <i className="bi bi-x-circle-fill text-danger display-3"></i>
        <h1 className="fw-bold mt-2">No se pudo realizar el pago</h1>
        <p className="text-white-50">
          Tu tarjeta fue rechazada por el banco. No se realizó ningún cargo y los productos siguen en
          tu carrito.
        </p>
        <div className="d-flex gap-2 justify-content-center mt-4">
          <Link to="/checkout" className="btn btn-warning fw-bold">Intentar nuevamente</Link>
          <Link to="/" className="btn btn-outline-light">Volver al catálogo</Link>
        </div>
      </div>
    </StoreTemplate>
  );
};
