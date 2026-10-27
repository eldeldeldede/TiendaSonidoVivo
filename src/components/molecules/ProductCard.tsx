import React from 'react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
    alert(`¡${product.nombre} ha sido agregado al carrito!`);
  };

  return (
    <div className="card h-100 bg-dark text-white border-secondary">
      <img src={product.img} className="card-img-top" alt={product.nombre} style={{ height: '200px', objectFit: 'cover' }} />
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title">{product.nombre}</h5>
          <p className="card-text text-muted">{product.categoria}</p>
        </div>
        <div className="mt-3">
          <div className="fs-5 fw-bold mb-2">${product.precio.toLocaleString()}</div>
          <button className="btn btn-warning w-100" onClick={handleAddToCart}>
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};