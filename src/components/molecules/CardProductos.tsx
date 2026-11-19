import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  // [CAMBIO] Nueva prop opcional para recibir cuántas unidades de este producto ya están en el carrito
  cantidadEnCarrito?: number;
}

// Molécula: tarjeta de producto del catálogo
export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  cantidadEnCarrito = 0 // [CAMBIO] Si no se pasa, asume 0 para no romper otras páginas que usen ProductCard
}) => {
  const sinStock = product.stock <= 0;
  // [CAMBIO] Verifica si las unidades en el carrito ya alcanzaron el stock total del producto
  const limiteAlcanzado = cantidadEnCarrito >= product.stock;
  // [CAMBIO] El botón se bloquea si no hay stock O si ya metiste el máximo al carrito
  const botonDeshabilitado = sinStock || limiteAlcanzado;

  const handleAddToCart = () => {
    // [CAMBIO] Doble seguridad: si está bloqueado, no hace nada ni muestra alerta
    if (botonDeshabilitado) return;
    
    onAddToCart(product);
    alert(`¡${product.nombre} ha sido agregado al carrito!`);
  };

  // [CAMBIO] Define el texto del botón según el estado real del stock y del carrito
  let textoBoton = 'Añadir al Carrito';
  if (sinStock) textoBoton = 'Sin stock';
  else if (limiteAlcanzado) textoBoton = 'Stock máximo en carrito';

  return (
    <div className="card h-100 bg-dark text-white border-secondary">
      <Link to={`/producto/${product.id}`}>
        <img src={product.img} className="card-img-top" alt={product.nombre} style={{ height: '200px', objectFit: 'cover' }} />
      </Link>
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title">{product.nombre}</h5>
          <p className="card-text text-white-50 mb-1">{product.categoria}</p>
          
          {/* [CAMBIO] Muestra el stock disponible directamente dentro de la tarjeta */}
          <small className={sinStock ? 'text-danger fw-semibold' : 'text-warning'}>
            {sinStock ? 'Agotado' : `Stock disponible: ${product.stock}`}
            {cantidadEnCarrito > 0 && !sinStock ? ` (${cantidadEnCarrito} en carrito)` : ''}
          </small>
        </div>
        <div className="mt-3">
          <div className="fs-5 fw-bold mb-2">${product.precio.toLocaleString('es-CL')}</div>
          <Link to={`/producto/${product.id}`} className="btn btn-outline-light w-100 mb-2">
            Ver producto
          </Link>
          
          {/* [CAMBIO] Usa 'botonDeshabilitado' y 'textoBoton' dinámicos */}
          <button 
            className="btn btn-warning w-100" 
            onClick={handleAddToCart} 
            disabled={botonDeshabilitado}
          >
            {textoBoton}
          </button>
        </div>
      </div>
    </div>
  );
};
