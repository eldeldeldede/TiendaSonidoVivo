import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { StoreTemplate } from '../components/templates/PlantillaTienda';
import { EstadoCarga } from '../components/molecules/EstadoCarga';
import { useAuth } from '../context/ContenidoLogin';
import { useCarga } from '../hooks/useCarga';
import { listarMisConsultas } from '../api/servicios';

const formatearFechaHora = (iso: string) =>
  new Date(iso).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });

const Contenido: React.FC = () => {
  const { datos: consultas, cargando, error, recargar } = useCarga(listarMisConsultas);

  return (
    <StoreTemplate>
      <h1 className="fw-bold mb-4">Mis consultas</h1>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {consultas && consultas.length === 0 && (
          <div className="text-center my-5">
            <p className="text-white-50">Aún no has enviado consultas.</p>
            <Link to="/servicios" className="btn btn-warning">Escribir una consulta</Link>
          </div>
        )}

        {consultas?.map((c) => (
          <div key={c.id} className="card bg-dark text-white border-secondary mb-3">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <small className="text-white-50">Enviada el {formatearFechaHora(c.fecha)}</small>
                <span className={`badge text-bg-${c.respuesta ? 'success' : 'warning'}`}>
                  {c.respuesta ? 'Respondida' : 'En espera de respuesta'}
                </span>
              </div>
              <p className="mb-0"><strong>Tu mensaje:</strong> {c.mensaje}</p>

              {c.respuesta && (
                <div className="border-start border-3 border-success ps-3 mt-3">
                  <small className="text-white-50">
                    Respuesta de Sonido Vivo{c.fechaRespuesta ? ` · ${formatearFechaHora(c.fechaRespuesta)}` : ''}
                  </small>
                  <p className="mb-0 mt-1">{c.respuesta}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </EstadoCarga>
    </StoreTemplate>
  );
};

export const MisConsultasPage: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace state={{ desde: '/mis-consultas' }} />;
  return <Contenido />;
};
