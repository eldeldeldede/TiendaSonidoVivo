import React from 'react';
import type { NewsArticle } from '../../types';
import { Badge } from '../atoms/Etiqueta';
import { Button } from '../atoms/Button';

interface NewsCardProps {
  article: NewsArticle;
  onReadMore: (article: NewsArticle) => void;
}

// Molécula: tarjeta de artículo para la sección Novedades
export const NewsCard: React.FC<NewsCardProps> = ({ article, onReadMore }) => {
  return (
    <div className="card h-100 bg-dark text-white border-secondary shadow overflow-hidden">
      <div className="position-relative">
        <img
          src={article.imagen}
          className="card-img-top object-fit-cover"
          alt={article.titulo}
          style={{ height: '200px' }}
        />
        <Badge variant="warning" className="position-absolute top-0 start-0 m-3 text-dark">
          {article.categoria}
        </Badge>
      </div>
      <div className="card-body d-flex flex-column p-4">
        <small className="text-white-50 mb-2">
          <i className="bi bi-calendar-event me-1"></i>
          {article.fecha}
        </small>
        <h5 className="card-title fw-bold mb-2">{article.titulo}</h5>
        <p className="card-text text-white-50 small flex-grow-1 mb-4">{article.resumen}</p>
        <Button variant="outline-light" className="fw-bold w-100 mt-auto" icon="eye-fill" onClick={() => onReadMore(article)}>
          Leer más
        </Button>
      </div>
    </div>
  );
};
