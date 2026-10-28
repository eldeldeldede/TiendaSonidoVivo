import React, { useState } from 'react';
import type { Product } from '../../types';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';

// Datos que entrega el formulario (el id lo asigna el módulo de datos)
export type ProductFormData = Omit<Product, 'id'>;

interface ProductFormProps {
  initialData?: Product; // si viene, el formulario está en modo edición
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

const CATEGORIAS = ['Guitarras', 'Teclados', 'Baterías', 'Accesorios', 'Audio'];
const IMAGEN_POR_DEFECTO = 'https://placehold.co/400x200?text=Sonido+Vivo';

// Organismo: formulario para crear o editar un producto
export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState(initialData?.nombre ?? '');
  const [categoria, setCategoria] = useState(initialData?.categoria ?? '');
  const [precio, setPrecio] = useState(initialData ? String(initialData.precio) : '');
  const [stock, setStock] = useState(initialData ? String(initialData.stock) : '');
  const [img, setImg] = useState(initialData?.img ?? '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nombre.trim() === '') {
      window.alert('Debe ingresar el nombre del producto');
      return;
    }
    if (categoria === '') {
      window.alert('Debe seleccionar una categoría');
      return;
    }
    if (precio.trim() === '') {
      window.alert('Debe ingresar el precio');
      return;
    }
    const precioNumero = Number(precio);
    if (!Number.isInteger(precioNumero) || precioNumero <= 0) {
      window.alert('El precio debe ser un número entero mayor a 0');
      return;
    }
    if (stock.trim() === '') {
      window.alert('Debe ingresar el stock');
      return;
    }
    const stockNumero = Number(stock);
    if (!Number.isInteger(stockNumero) || stockNumero < 0) {
      window.alert('El stock debe ser un número entero igual o mayor a 0');
      return;
    }

    onSubmit({
      nombre: nombre.trim(),
      categoria,
      precio: precioNumero,
      stock: stockNumero,
      img: img.trim() || IMAGEN_POR_DEFECTO,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h5 className="mb-3">{initialData ? `Editar: ${initialData.nombre}` : 'Nuevo producto'}</h5>

      <Input id="prod-nombre" label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <Select
        id="prod-categoria"
        label="Categoría"
        placeholder="Seleccione una categoría"
        options={CATEGORIAS.map((c) => ({ value: c, label: c }))}
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />

      <div className="row">
        <div className="col-sm-6">
          <Input id="prod-precio" label="Precio" type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        </div>
        <div className="col-sm-6">
          <Input id="prod-stock" label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
      </div>

      <Input
        id="prod-img"
        label="URL de la imagen"
        helperText="opcional"
        value={img}
        onChange={(e) => setImg(e.target.value)}
      />

      <div className="d-flex gap-2">
        <Button type="submit" variant="success">
          {initialData ? 'Guardar cambios' : 'Crear producto'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
