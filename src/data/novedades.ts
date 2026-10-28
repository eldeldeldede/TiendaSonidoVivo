import type { NewsArticle } from '../types';

// Artículos de la sección Novedades
export const novedades: NewsArticle[] = [
  {
    id: 1,
    titulo: 'Cómo cuidar tus guitarras en invierno',
    categoria: 'Consejos',
    fecha: '05 de septiembre, 2026',
    autor: 'Equipo Técnico Sonido Vivo',
    imagen: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    resumen: 'Los cambios de humedad y temperatura afectan la madera. Te contamos cómo protegerla.',
    descripcionCompleta: 'Guarda tu guitarra en su estuche cuando no la uses, evita dejarla cerca de estufas y usa un humidificador de estuche. Revisa la afinación con más frecuencia y limpia el diapasón con aceite de limón una vez al mes.'
  },
  {
    id: 2,
    titulo: 'Llegaron los nuevos teclados Roland',
    categoria: 'Lanzamientos',
    fecha: '20 de septiembre, 2026',
    autor: 'Sonido Vivo',
    imagen: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80',
    resumen: 'Ya están disponibles en tienda los nuevos modelos de la serie XPS.',
    descripcionCompleta: 'Los nuevos teclados incorporan más sonidos, conexión USB para grabar en el computador y un diseño más liviano, ideal para músicos que tocan en vivo. Ven a probarlos a nuestra tienda principal.'
  },
  {
    id: 3,
    titulo: '5 pedales esenciales para empezar',
    categoria: 'Guías',
    fecha: '02 de octubre, 2026',
    autor: 'Equipo Técnico Sonido Vivo',
    imagen: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=800&q=80',
    resumen: 'Distorsión, delay, chorus, afinador y compresor: qué hace cada uno.',
    descripcionCompleta: 'Si estás armando tu primer pedalboard, parte por un afinador y una distorsión. Luego suma un delay para dar profundidad, un chorus para texturas limpias y un compresor para emparejar la dinámica.'
  },
  {
    id: 4,
    titulo: 'Taller gratuito de mantención de baterías',
    categoria: 'Eventos',
    fecha: '15 de octubre, 2026',
    autor: 'Sonido Vivo',
    imagen: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80',
    resumen: 'Aprende a cambiar parches y afinar tu batería en nuestro taller de noviembre.',
    descripcionCompleta: 'El taller será el primer sábado de noviembre en nuestra tienda principal de Viña del Mar. Los cupos son limitados; inscríbete escribiéndonos desde la página de Servicios.'
  }
];
