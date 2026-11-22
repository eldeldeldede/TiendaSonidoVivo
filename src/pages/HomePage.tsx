import React, { useState } from 'react';
import { StoreTemplate } from '../components/templates/PlantillaTienda';
import { SearchBar } from '../components/molecules/BarraBusqueda';
import { ProductCard } from '../components/molecules/CardProductos';
import { useCart } from '../context/CartContext';
import { filtrarProductos, obtenerCategorias } from '../data/productos';
import { listarProductos } from '../api/productos';
import { useCarga } from '../hooks/useCarga';
import { EstadoCarga } from '../components/molecules/EstadoCarga';

export const HomePage: React.FC = () => {
  const { datos, cargando, error, recargar } = useCarga(listarProductos);
  const products = datos ?? [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  
  // [CAMBIO] Obtenemos 'cart' para pasarle a cada tarjeta cuántas unidades lleva el usuario
  const { cart, addToCart } = useCart();

  const categories = obtenerCategorias(products);
  const filteredProducts = filtrarProductos(products, searchTerm, selectedCategory);

  return (
    <StoreTemplate>
      <div className="container my-5">
        <div className="text-center mb-4">
          <h1 className="fw-bold">Catálogo de Instrumentos</h1>
          <p className="text-muted">Encuentra los mejores equipos de audio e instrumentos musicales</p>
        </div>

        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredProducts.map((product) => {
            // [CAMBIO] Buscamos si este producto ya está en el carrito para saber su cantidad actual
            const itemEnCarrito = cart.find((item) => item.id === product.id);
            const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.quantity : 0;

            return (
              <div className="col" key={product.id}>
                {/* [CAMBIO] Le pasamos 'cantidadEnCarrito' a la tarjeta para que controle el límite visualmente */}
                <ProductCard 
                  product={product} 
                  onAddToCart={addToCart} 
                  cantidadEnCarrito={cantidadEnCarrito} 
                />
              </div>
            );
          })}
        </div>
        </EstadoCarga>
      </div>
    </StoreTemplate>
  );
};
