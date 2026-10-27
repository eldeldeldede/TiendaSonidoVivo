import React from 'react';
import { StoreTemplate } from '../components/templates/StoreTemplate';

export const NosotrosPage: React.FC = () => {
  return (
    <StoreTemplate>
      <div className="container my-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold text-white">Quiénes Somos</h1>
          <p className="text-light">Conoce la historia y pasión detrás de Sonido Vivo</p>
        </div>

        <div className="row justify-content-center mb-5">
          <div className="col-lg-9">
            <div className="card bg-dark text-white border-secondary shadow p-4 rounded-4">
              <h3 className="fw-bold text-warning mb-3">Nuestra Historia</h3>
              <p className="text-light fs-5" style={{ lineHeight: '1.7' }}>
                Sonido Vivo nació en Viña del Mar con una misión simple: acercar instrumentos y equipos de audio
                de calidad a músicos de todos los niveles, ofreciendo asesoría cercana y personalizada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StoreTemplate>
  );
};