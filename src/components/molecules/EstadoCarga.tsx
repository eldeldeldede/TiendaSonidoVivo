import React from 'react';

interface EstadoCargaProps {
  cargando: boolean;
  error: Error | null;
  onReintentar?: () => void;
  children: React.ReactNode;
}

// Molécula: muestra "cargando", el error con botón de reintento, o el contenido
export const EstadoCarga: React.FC<EstadoCargaProps> = ({ cargando, error, onReintentar, children }) => {
  if (cargando) {
    return (
      <div className="text-center my-5" role="status">
        <div className="spinner-border text-warning" aria-hidden="true"></div>
        <p className="mt-2 mb-0 text-white-50">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-4" role="alert">
        <p className="mb-2">{error.message}</p>
        {onReintentar && (
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={onReintentar}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
