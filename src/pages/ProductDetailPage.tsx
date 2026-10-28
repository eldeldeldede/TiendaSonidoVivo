import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { StoreTemplate } from '../components/templates/StoreTemplate';
import { Badge } from '../components/atoms/Badge';
import { Button } from '../components/atoms/Button';
import { useCart } from '../context/CartContext';
import { obtenerProductoPorId } from '../data/productos';

// Página de detalle: lee el id desde la URL (/producto/:id)
export const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const producto = obtenerProductoPorId(Number(id));

  if (!producto) {
    return (
      <StoreTemplate>
        <div className="text-center my-5">
          <h2 className="fw-bold">Producto no encontrado</h2>
          <p className="text-white-50">El producto que buscas no existe o fue eliminado.</p>
          <Link to="/" className="btn btn-warning">Volver al catálogo</Link>
        </div>
      </StoreTemplate>
    );
  }

  const sinStock = producto.stock <= 0;

  const agregar = () => {
    addToCart(producto);
    window.alert(`¡${producto.nombre} ha sido agregado al carrito!`);
  };

  return (
    <StoreTemplate>
      <nav className="mb-4 small">
        <Link to="/" className="text-white-50 text-decoration-none">Catálogo</Link>
        <span className="text-white-50"> / {producto.categoria} / </span>
        <span>{producto.nombre}</span>
      </nav>

      <div className="row g-5 align-items-center mb-5">
        <div className="col-md-6">
          <img src={producto.img} alt={producto.nombre} className="img-fluid rounded-4 shadow w-100" style={{ maxHeight: '420px', objectFit: 'cover' }} />
        </div>
        <div className="col-md-6">
          <Badge variant="warning" className="text-dark mb-2">{producto.categoria}</Badge>
          <h1 className="fw-bold">{producto.nombre}</h1>
          <p className="display-6 fw-bold text-warning my-3">${producto.precio.toLocaleString('es-CL')}</p>
          <p className={sinStock ? 'text-danger fw-semibold' : 'text-success fw-semibold'}>
            {sinStock ? 'Sin stock disponible' : `${producto.stock} unidades disponibles`}
          </p>
          <div className="d-flex gap-2 mt-4">
            <Button variant="warning" className="fw-bold" icon="cart-plus" onClick={agregar} disabled={sinStock}>
              Añadir al Carrito
            </Button>
            <Link to="/" className="btn btn-outline-light">Volver al catálogo</Link>
          </div>
        </div>
      </div>
    </StoreTemplate>
  );
};
