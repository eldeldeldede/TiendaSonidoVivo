import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

// Molécula: tarjeta de producto del catálogo
export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const sinStock = product.stock <= 0;

  const handleAddToCart = () => {
    onAddToCart(product);
    alert(`¡${product.nombre} ha sido agregado al carrito!`);
  };

  return (
    <div className="card h-100 bg-dark text-white border-secondary">
      <Link to={`/producto/${product.id}`}>
        <img src={product.img} className="card-img-top" alt={product.nombre} style={{ height: '200px', objectFit: 'cover' }} />
      </Link>
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title">{product.nombre}</h5>
          <p className="card-text text-white-50">{product.categoria}</p>
        </div>
        <div className="mt-3">
          <div className="fs-5 fw-bold mb-2">${product.precio.toLocaleString('es-CL')}</div>
          <Link to={`/producto/${product.id}`} className="btn btn-outline-light w-100 mb-2">
            Ver producto
          </Link>
          <button className="btn btn-warning w-100" onClick={handleAddToCart} disabled={sinStock}>
            {sinStock ? 'Sin stock' : 'Añadir al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};
