import React, { useState } from 'react';
import { StoreTemplate } from '../components/templates/PlantillaTienda';
import { SearchBar } from '../components/molecules/BarraBusqueda';
import { ProductCard } from '../components/molecules/CardProductos';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { obtenerProductos, filtrarProductos, obtenerCategorias } from '../data/productos';

export const HomePage: React.FC = () => {
  const [products] = useState<Product[]>(() => obtenerProductos());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const { addToCart } = useCart();

  const categories = obtenerCategorias(products);

  const filteredProducts = filtrarProductos(products, searchTerm, selectedCategory);

  return (
    <StoreTemplate>
      <div className="container my-5">
        <div className="text-center mb-4">
          <h1 className="fw-bold">Catálogo de Instrumentos</h1>
          <p className="text-muted">Encuentra los mejores equipos de audio e instrumentos musicales</p>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredProducts.map((product) => (
            <div className="col" key={product.id}>
              <ProductCard product={product} onAddToCart={addToCart} />
            </div>
          ))}
        </div>
      </div>
    </StoreTemplate>
  );
};