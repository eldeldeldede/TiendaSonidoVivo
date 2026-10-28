import React from 'react';
import { Link } from 'react-router-dom';
import { StoreTemplate } from '../components/templates/StoreTemplate';

const cifras = [
  { valor: '+10', texto: 'años de experiencia' },
  { valor: '+3.000', texto: 'clientes atendidos' },
  { valor: '2', texto: 'puntos de retiro en Viña del Mar' },
  { valor: '+40', texto: 'marcas disponibles' },
];

const valores = [
  { icono: 'heart-fill', titulo: 'Pasión por la música', texto: 'Somos músicos atendiendo a músicos: entendemos lo que buscas.' },
  { icono: 'shield-check', titulo: 'Calidad garantizada', texto: 'Trabajamos solo con marcas reconocidas y garantía oficial.' },
  { icono: 'people-fill', titulo: 'Asesoría cercana', texto: 'Te orientamos según tu nivel, estilo y presupuesto.' },
];

const equipo = [
  { nombre: 'Camila Torres', cargo: 'Fundadora y guitarrista', inicial: 'C' },
  { nombre: 'Andrés Muñoz', cargo: 'Técnico luthier', inicial: 'A' },
  { nombre: 'Valentina Soto', cargo: 'Asesora de audio profesional', inicial: 'V' },
];

export const NosotrosPage: React.FC = () => {
  return (
    <StoreTemplate>
      {/* Encabezado con imagen */}
      <section className="row align-items-center g-5 py-4">
        <div className="col-lg-6">
          <span className="badge bg-warning text-dark mb-3">Quiénes Somos</span>
          <h1 className="fw-bold display-5">La música se vive mejor con el equipo correcto</h1>
          <p className="text-white-50 fs-5">
            Sonido Vivo nació en Viña del Mar con una misión simple: acercar instrumentos y equipos de
            audio de calidad a músicos de todos los niveles, con asesoría cercana y personalizada.
          </p>
          <Link to="/" className="btn btn-warning fw-bold me-2">Ver catálogo</Link>
          <Link to="/servicios" className="btn btn-outline-light">Contáctanos</Link>
        </div>
        <div className="col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80"
            alt="Instrumentos musicales en la tienda"
            className="img-fluid rounded-4 shadow"
          />
        </div>
      </section>

      {/* Cifras */}
      <section className="row row-cols-2 row-cols-md-4 g-3 text-center my-5">
        {cifras.map((c) => (
          <div className="col" key={c.texto}>
            <div className="border border-secondary rounded-3 py-4 h-100">
              <div className="display-6 fw-bold text-warning">{c.valor}</div>
              <div className="small text-white-50">{c.texto}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Misión y visión */}
      <section className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card h-100 bg-dark text-white border-secondary p-4">
            <h3 className="fw-bold text-warning"><i className="bi bi-bullseye me-2"></i>Misión</h3>
            <p className="mb-0 text-white-50">
              Entregar instrumentos, equipos de audio e iluminación de calidad, junto con un servicio
              técnico y una asesoría que ayuden a cada músico a sonar mejor.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 bg-dark text-white border-secondary p-4">
            <h3 className="fw-bold text-warning"><i className="bi bi-eye-fill me-2"></i>Visión</h3>
            <p className="mb-0 text-white-50">
              Ser la tienda musical de referencia de la Quinta Región, reconocida por su cercanía,
              conocimiento y compromiso con la escena musical local.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="mb-5">
        <h2 className="fw-bold text-center mb-4">Nuestros valores</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {valores.map((v) => (
            <div className="col" key={v.titulo}>
              <div className="text-center px-3">
                <i className={`bi bi-${v.icono} text-warning fs-1`}></i>
                <h5 className="fw-bold mt-2">{v.titulo}</h5>
                <p className="text-white-50 small">{v.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo */}
      <section className="mb-5">
        <h2 className="fw-bold text-center mb-4">Nuestro equipo</h2>
        <div className="row row-cols-1 row-cols-sm-3 g-4">
          {equipo.map((p) => (
            <div className="col" key={p.nombre}>
              <div className="card h-100 bg-dark text-white border-secondary text-center p-4">
                <div
                  className="rounded-circle bg-warning text-dark fw-bold fs-2 d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '80px', height: '80px' }}
                >
                  {p.inicial}
                </div>
                <h5 className="fw-bold mb-1">{p.nombre}</h5>
                <p className="small text-white-50 mb-0">{p.cargo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </StoreTemplate>
  );
};
