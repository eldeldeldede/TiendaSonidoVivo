import React, { useState } from 'react';
import { StoreTemplate } from '../components/templates/PlantillaTienda';
import { NewsCard } from '../components/molecules/CardNovedades';
import { listarNovedades } from '../api/novedades';
import { useCarga } from '../hooks/useCarga';
import { EstadoCarga } from '../components/molecules/EstadoCarga';
import type { NewsArticle } from '../types';

export const NovedadesPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const { datos, cargando, error, recargar } = useCarga(listarNovedades);
  // El backend ya entrega las más recientes primero
  const novedadesOrdenadas = datos ?? [];

  return (
    <StoreTemplate>
      <div className="text-center my-5">
        <span className="badge bg-warning text-dark mb-3">Blog</span>
        <h1 className="fw-bold">Novedades y consejos de audio</h1>
        <p className="text-white-50">Las últimas noticias, lanzamientos y guías para músicos</p>
      </div>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
        {novedadesOrdenadas.map((art) => (
          <div key={art.id} className="col">
            <NewsCard article={art} onReadMore={setSelectedArticle} />
          </div>
        ))}
      </div>
      </EstadoCarga>

      {/* Modal de detalle */}
      {selectedArticle && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-secondary">
              <img src={selectedArticle.imagen} alt={selectedArticle.titulo} className="object-fit-cover" style={{ height: '260px' }} />
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">{selectedArticle.titulo}</h5>
                <button type="button" className="btn-close btn-close-white" aria-label="Cerrar" onClick={() => setSelectedArticle(null)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="small text-white-50">{selectedArticle.fecha} · {selectedArticle.autor}</p>
                <p className="mb-0">{selectedArticle.descripcionCompleta}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </StoreTemplate>
  );
};
