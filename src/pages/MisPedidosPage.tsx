import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { StoreTemplate } from '../components/templates/PlantillaTienda';
import { EstadoCarga } from '../components/molecules/EstadoCarga';
import { Boleta } from '../components/organisms/Boleta';
import { useAuth } from '../context/ContenidoLogin';
import { useCarga } from '../hooks/useCarga';
import { listarMisPedidos } from '../api/pedidos';
import type { Order } from '../types';

const colorEstado: Record<Order['estado'], string> = {
  'En Preparación': 'warning',
  Despachado: 'info',
  Entregado: 'success',
};

const Contenido: React.FC = () => {
  const { datos: pedidos, cargando, error, recargar } = useCarga(listarMisPedidos);
  const [abierto, setAbierto] = useState<string | null>(null);

  return (
    <StoreTemplate>
      <h1 className="fw-bold mb-4">Mis pedidos</h1>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {pedidos && pedidos.length === 0 && (
          <div className="text-center my-5">
            <p className="text-white-50">Aún no tienes pedidos.</p>
            <Link to="/" className="btn btn-warning">Ir al catálogo</Link>
          </div>
        )}

        {pedidos?.map((pedido) => (
          <div key={pedido.id} className="card bg-dark text-white border-secondary mb-3">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <h5 className="mb-0">{pedido.id}</h5>
                  <small className="text-white-50">{pedido.fecha}</small>
                </div>
                <span className={`badge text-bg-${colorEstado[pedido.estado]}`}>{pedido.estado}</span>
                <strong>${pedido.total.toLocaleString('es-CL')}</strong>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  onClick={() => setAbierto(abierto === pedido.id ? null : pedido.id)}
                >
                  {abierto === pedido.id ? 'Ocultar boleta' : 'Ver boleta'}
                </button>
              </div>

              <ul className="list-unstyled small text-white-50 mt-3 mb-0">
                {pedido.items?.map((item) => (
                  <li key={item.id}>{item.nombre} x{item.quantity}</li>
                ))}
              </ul>

              {abierto === pedido.id && (
                <div className="mt-3">
                  <Boleta pedido={pedido} />
                </div>
              )}
            </div>
          </div>
        ))}
      </EstadoCarga>
    </StoreTemplate>
  );
};

export const MisPedidosPage: React.FC = () => {
  const { currentUser } = useAuth();
  // Los pedidos se piden al backend, por eso solo se carga el contenido si hay sesión
  if (!currentUser) return <Navigate to="/login" replace state={{ desde: '/mis-pedidos' }} />;
  return <Contenido />;
};
