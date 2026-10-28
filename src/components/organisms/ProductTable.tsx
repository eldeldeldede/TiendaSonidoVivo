import React from 'react';
import type { Product } from '../../types';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// Organismo: tabla de inventario con acciones de editar y eliminar
export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-secondary">
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted py-3">
                No hay productos en inventario
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td className="fw-semibold">{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${p.precio.toLocaleString('es-CL')}</td>
                <td>
                  <Badge variant={p.stock > 0 ? 'info' : 'danger'}>
                    {p.stock > 0 ? `${p.stock} unidades` : 'Sin stock'}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-primary" onClick={() => onEdit(p)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => onDelete(p)}>
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
