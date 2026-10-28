import React from 'react';
import type { Order } from '../types';

interface BoletaProps {
  pedido: Order;
}

const formatear = (monto: number) => `$${monto.toLocaleString('es-CL')}`;

// Organismo: boleta electrónica simulada de una compra
export const Boleta: React.FC<BoletaProps> = ({ pedido }) => {
  const items = pedido.items ?? [];

  return (
    <div className="card bg-white text-dark border-0 shadow p-4" id="boleta">
      <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
        <div>
          <h4 className="fw-bold mb-0">Sonido Vivo SpA</h4>
          <small className="text-muted">RUT 76.123.456-7 · Av. Libertad 450, Viña del Mar</small>
        </div>
        <div className="border border-danger text-danger text-center px-3 py-2 fw-bold">
          <div>BOLETA ELECTRÓNICA</div>
          <div>N° {pedido.id}</div>
        </div>
      </div>

      <div className="row small mb-3">
        <div className="col-sm-6">
          <div><strong>Cliente:</strong> {pedido.cliente}</div>
          {pedido.rut && <div><strong>RUT:</strong> {pedido.rut}</div>}
          {pedido.email && <div><strong>Correo:</strong> {pedido.email}</div>}
        </div>
        <div className="col-sm-6 text-sm-end">
          <div><strong>Fecha:</strong> {pedido.fecha}</div>
          {pedido.direccion && <div><strong>Despacho:</strong> {pedido.direccion}</div>}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Producto</th>
              <th className="text-center">Cant.</th>
              <th className="text-end">Precio unit.</th>
              <th className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-end">{formatear(item.precio)}</td>
                <td className="text-end">{formatear(item.precio * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ms-auto" style={{ maxWidth: '260px', width: '100%' }}>
        {pedido.neto !== undefined && (
          <div className="d-flex justify-content-between"><span>Neto</span><span>{formatear(pedido.neto)}</span></div>
        )}
        {pedido.iva !== undefined && (
          <div className="d-flex justify-content-between"><span>IVA (19%)</span><span>{formatear(pedido.iva)}</span></div>
        )}
        <div className="d-flex justify-content-between fw-bold fs-5 border-top mt-2 pt-2">
          <span>Total</span><span>{formatear(pedido.total)}</span>
        </div>
      </div>
    </div>
  );
};
