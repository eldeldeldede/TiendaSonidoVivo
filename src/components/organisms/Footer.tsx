import React from 'react';

// Organismo: Pie de página común a todo el sitio web
export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container text-center text-md-start">
        <div className="row text-center text-md-start">
          <div className="col-md-5 col-lg-5 col-xl-5 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-primary">
              <i className="bi bi-music-note-list me-2"></i>Sonido Vivo
            </h5>
            <p className="text-white small pe-lg-4">
              Tu tienda especializada en instrumentos musicales, equipos de audio e iluminación profesional. Calidad y servicio garantizado.
            </p>
          </div>

          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 fw-bold text-light">Navegación</h6>
            <p className="mb-2"><a href="/" className="text-white text-decoration-none">Catálogo</a></p>
            <p className="mb-2"><a href="/novedades" className="text-white text-decoration-none">Novedades</a></p>
            <p className="mb-2"><a href="/mapa" className="text-white text-decoration-none">Puntos de Retiro</a></p>
            <p className="mb-2"><a href="/nosotros" className="text-white text-decoration-none">Nosotros</a></p>
            <p className="mb-2"><a href="/servicios" className="text-white text-decoration-none">Servicios</a></p>
          </div>

          <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 fw-bold text-light">Contacto</h6>
            <p className="text-white small mb-2"><i className="bi bi-geo-alt-fill me-2 text-primary"></i>Av. Libertad 450, Viña del Mar</p>
            <p className="text-white small mb-2"><i className="bi bi-envelope-fill me-2 text-primary"></i>contacto@sonidovivo.cl</p>
            <p className="text-white small mb-2"><i className="bi bi-telephone-fill me-2 text-primary"></i>+56 9 1234 5678</p>
          </div>
        </div>

        <hr className="mb-4 mt-4 text-secondary" />

        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="text-white small mb-0">
              © 2026 <b className="text-white">Sonido Vivo SpA</b>. Todos los derechos reservados.
            </p>
          </div>
          <div className="col-md-5 col-lg-4 text-center text-md-end">
            <span className="badge bg-secondary opacity-75">Prototipo React v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};