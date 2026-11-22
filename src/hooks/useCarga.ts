import { useEffect, useState } from 'react';
import { ApiError } from '../api/cliente';

interface Estado<T> {
  datos: T | null;
  cargando: boolean;
  error: ApiError | null;
}

// Ejecuta una llamada al backend al montar la página y entrega { datos, cargando, error, recargar }.
// "cargador" debe ser estable (una función de src/api o un useCallback).
export function useCarga<T>(cargador: () => Promise<T>) {
  const [estado, setEstado] = useState<Estado<T>>({ datos: null, cargando: true, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true;
    cargador()
      .then((datos) => {
        if (activo) setEstado({ datos, cargando: false, error: null });
      })
      .catch((e: unknown) => {
        if (!activo) return;
        const error = e instanceof ApiError ? e : new ApiError(e instanceof Error ? e.message : 'Error inesperado', 0);
        setEstado({ datos: null, cargando: false, error });
      });
    return () => {
      activo = false;
    };
  }, [cargador, version]);

  const recargar = () => setVersion((v) => v + 1);

  return { ...estado, recargar };
}
