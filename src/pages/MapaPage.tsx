import React, { useState } from 'react';
import { StoreTemplate } from '../components/templates/PlantillaTienda';

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  horario: string;
  lat: number;
  lng: number;
  mapaUrl: string;
}

const sucursales: Sucursal[] = [
  {
    id: 1,
    nombre: 'Tienda Principal Sonido Vivo',
    direccion: 'Av. Libertad 450, Viña del Mar',
    horario: '10:00 - 19:00 hrs',
    lat: -33.0183,
    lng: -71.5511,
    mapaUrl: 'https://maps.google.com/maps?q=-33.0183,-71.5511&z=15&output=embed'
  },
  {
    id: 2,
    nombre: 'Punto de Retiro Centro Viña',
    direccion: 'Calle Valparaíso 680, Viña del Mar',
    horario: '11:00 - 18:00 hrs',
    lat: -33.0245,
    lng: -71.5522,
    mapaUrl: 'https://maps.google.com/maps?q=-33.0245,-71.5522&z=15&output=embed'
  }
];

export const MapaPage: React.FC = () => {
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal>(sucursales[0]);

  return (
    <StoreTemplate>
      <div className="container my-4">
        <h2 className="text-white mb-4">Puntos de Retiro y Sucursales</h2>
        
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
                      onClick={() => setSelectedSucursal(sucursal)}
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
                  src={selectedSucursal.mapaUrl}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreTemplate>
  );
};