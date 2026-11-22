import React, { useState } from 'react';
import { StoreTemplate } from '../components/templates/PlantillaTienda';
import { EstadoCarga } from '../components/molecules/EstadoCarga';
import { listarPuntosRetiro } from '../api/puntosRetiro';
import { useCarga } from '../hooks/useCarga';

const urlMapa = (lat: number, lng: number) => `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

export const MapaPage: React.FC = () => {
  const { datos, cargando, error, recargar } = useCarga(listarPuntosRetiro);
  const sucursales = datos ?? [];
  const [seleccionadaId, setSeleccionadaId] = useState<number | null>(null);
  // Mientras no se elija una, se muestra la primera (el backend entrega la principal primero)
  const selectedSucursal = sucursales.find((s) => s.id === seleccionadaId) ?? sucursales[0];

  return (
    <StoreTemplate>
      <div className="container my-4">
        <h2 className="text-white mb-4">Puntos de Retiro y Sucursales</h2>
        
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {selectedSucursal ? (
        <div className="row g-4">
          {/* Lista de Sucursales */}
          <div className="col-md-5">
            <div className="card bg-dark text-white border-secondary">
              <div className="card-header border-secondary">
                <h4 className="card-title text-warning my-1">Nuestras Sucursales</h4>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {sucursales.map((sucursal) => (
                    <button
                      key={sucursal.id}
                      type="button"
                      className={`list-group-item list-group-item-action bg-dark text-white border-secondary p-3 ${
                        selectedSucursal.id === sucursal.id ? 'active bg-secondary' : ''
                      }`}
                      onClick={() => setSeleccionadaId(sucursal.id)}
                    >
                      <h5 className="mb-1 text-warning">{sucursal.nombre}</h5>
                      <p className="mb-1 text-light small">{sucursal.direccion}</p>
                      <small className="text-info">{sucursal.horario}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visor interactivo del Mapa */}
          <div className="col-md-7">
            <div className="card bg-dark text-white border-secondary h-100">
              <div className="card-header border-secondary d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{selectedSucursal.nombre}</h5>
                <span className="badge bg-success">Punto Activo</span>
              </div>
              <div className="card-body p-0" style={{ minHeight: '380px' }}>
                <iframe
                  title={`Mapa de ${selectedSucursal.nombre}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '380px', borderRadius: '0 0 0.375rem 0.375rem' }}
                  loading="lazy"
                  allowFullScreen
                  src={urlMapa(selectedSucursal.lat, selectedSucursal.lng)}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        ) : (
          <p className="text-white-50">Aún no hay puntos de retiro registrados.</p>
        )}
        </EstadoCarga>
      </div>
    </StoreTemplate>
  );
};