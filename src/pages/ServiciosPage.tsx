import React from 'react';
import { StoreTemplate } from '../components/templates/PlantillaTienda';
import { ContactForm, type DatosContacto } from '../components/organisms/FormularioContacto';

const servicios = [
  { icono: 'tools', titulo: 'Reparación y mantención', texto: 'Calibración de guitarras y bajos, cambio de cuerdas, ajuste de alma y reparación de equipos de audio.' },
  { icono: 'speaker-fill', titulo: 'Arriendo de equipos', texto: 'Amplificación, consolas e iluminación para tocatas, eventos y ensayos.' },
  { icono: 'music-note-beamed', titulo: 'Clases', texto: 'Clases de guitarra, teclado y batería para todos los niveles con profesores de la zona.' },
  { icono: 'headset', titulo: 'Asesoría personalizada', texto: 'Te ayudamos a elegir el instrumento o equipo ideal según tu estilo y presupuesto.' },
];

export const ServiciosPage: React.FC = () => {
  const guardarConsulta = (datos: DatosContacto) => {
    const consultas = JSON.parse(localStorage.getItem('consultas_contacto') || '[]');
    consultas.push({ ...datos, fecha: new Date().toLocaleString('es-CL') });
    localStorage.setItem('consultas_contacto', JSON.stringify(consultas));
    window.alert('¡Mensaje enviado con éxito! Te responderemos a la brevedad.');
  };

  return (
    <StoreTemplate>
      {/* Encabezado */}
      <section className="text-center py-5">
        <span className="badge bg-warning text-dark mb-3">Servicios Sonido Vivo</span>
        <h1 className="fw-bold display-5">Más que una tienda de instrumentos</h1>
        <p className="text-white-50 col-lg-8 mx-auto">
          Acompañamos a músicos de todos los niveles: desde la compra de su primer instrumento
          hasta la mantención de su equipo de escenario.
        </p>
      </section>

      {/* Tarjetas de servicios */}
      <section className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mb-5">
        {servicios.map((s) => (
          <div className="col" key={s.titulo}>
            <div className="card h-100 bg-dark text-white border-secondary text-center p-3">
              <i className={`bi bi-${s.icono} text-warning fs-1 mb-2`}></i>
              <h5 className="fw-bold">{s.titulo}</h5>
              <p className="small text-white-50 mb-0">{s.texto}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Contacto */}
      <section className="row g-4 align-items-stretch mb-5">
        <div className="col-lg-5">
          <div className="card h-100 bg-warning text-dark border-0 p-4">
            <h3 className="fw-bold mb-3">Conversemos</h3>
            <p>¿Tienes dudas sobre un producto o quieres cotizar un servicio? Escríbenos y te respondemos en menos de 24 horas.</p>
            <ul className="list-unstyled mt-3 mb-0">
              <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>Av. Libertad 450, Viña del Mar</li>
              <li className="mb-2"><i className="bi bi-envelope-fill me-2"></i>contacto@sonidovivo.cl</li>
              <li className="mb-2"><i className="bi bi-telephone-fill me-2"></i>+56 9 1234 5678</li>
              <li><i className="bi bi-clock-fill me-2"></i>Lunes a sábado, 10:00 a 19:00</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card h-100 bg-dark text-white border-secondary p-4">
            <h3 className="fw-bold mb-3">Formulario de contacto</h3>
            <ContactForm onSubmit={guardarConsulta} />
          </div>
        </div>
      </section>
    </StoreTemplate>
  );
};
