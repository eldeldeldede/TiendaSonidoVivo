// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatearFecha, listarNovedades } from '../api/novedades';
import { iniciarSesion, desdeApi } from '../api/usuarios';
import { listarServicios, enviarConsulta } from '../api/servicios';
import { listarPuntosRetiro } from '../api/puntosRetiro';
import { peticion, CLAVE_SESION, EVENTO_SESION_EXPIRADA } from '../api/cliente';

const respuestaJson = (datos: unknown, status = 200) =>
  new Response(JSON.stringify(datos), { status, headers: { 'Content-Type': 'application/json' } });

describe('API de novedades, usuarios, servicios y puntos de retiro', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('formatea la fecha ISO como la muestra la página de novedades', () => {
    expect(formatearFecha('2026-09-05')).toBe('05 de septiembre, 2026');
    expect(formatearFecha('2026-11-17')).toBe('17 de noviembre, 2026');
  });

  it('las novedades llegan con la fecha ya formateada', async () => {
    fetchMock.mockResolvedValue(
      respuestaJson([{ id: 1, titulo: 'T', categoria: 'C', fecha: '2026-10-02', autor: 'A', imagen: null, resumen: 'R', descripcionCompleta: 'D' }])
    );

    const [novedad] = await listarNovedades();

    expect(novedad.fecha).toBe('02 de octubre, 2026');
    expect(novedad.imagen).toBe('');
  });

  it('el login envía correo y contraseña y adapta el usuario al tipo del front', async () => {
    fetchMock.mockResolvedValue(
      respuestaJson({ id: 1, run: '11111111-1', nombre: 'Admin', apellidos: 'Sonido Vivo', correo: 'admin@sonidovivo.cl', rolId: 1, rol: 'Administrador', region: null, comuna: null, direccion: null, bloqueado: false })
    );

    const usuario = await iniciarSesion('admin@sonidovivo.cl', 'admin123');

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ correo: 'admin@sonidovivo.cl', contrasena: 'admin123' });
    expect(usuario).toMatchObject({ id: 1, email: 'admin@sonidovivo.cl', rol: 'Administrador' });
    expect(usuario).not.toHaveProperty('pass');
  });

  it('desdeApi deja vacíos los datos opcionales que vienen nulos', () => {
    const usuario = desdeApi({ id: 2, run: '22222222-2', nombre: 'Juan', apellidos: null, correo: 'j@x.cl', rolId: 3, rol: 'Cliente', region: null, comuna: null, direccion: null });
    expect(usuario.apellidos).toBeUndefined();
    expect(usuario.comuna).toBeUndefined();
  });

  it('lista servicios y puntos de retiro, y envía consultas por POST', async () => {
    fetchMock.mockResolvedValueOnce(respuestaJson([{ id: 1, icono: 'tools', titulo: 'Reparación', texto: 'Texto' }]));
    expect((await listarServicios())[0].titulo).toBe('Reparación');

    fetchMock.mockResolvedValueOnce(respuestaJson([{ id: 1, nombre: 'Tienda', tipo: 'Tienda', direccion: 'Av. 1', horario: '10-19', lat: -33.01, lng: -71.55, principal: true }]));
    expect((await listarPuntosRetiro())[0].principal).toBe(true);

    fetchMock.mockResolvedValueOnce(respuestaJson({ id: 1, nombre: 'Ana', email: 'a@a.cl', mensaje: 'Hola, quiero cotizar', fecha: '2026-11-19T17:00:00', atendida: false }, 201));
    await enviarConsulta({ nombre: 'Ana', email: 'a@a.cl', mensaje: 'Hola, quiero cotizar' });
    expect(fetchMock.mock.calls[2][0]).toBe('http://localhost:8080/api/servicios/contacto');
    expect(fetchMock.mock.calls[2][1].method).toBe('POST');
  });
});

describe('Token de sesión (JWT)', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    localStorage.clear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('envía Authorization: Bearer cuando hay sesión guardada', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: 'Admin', token: 'abc.def.ghi' }));
    fetchMock.mockImplementation(() => Promise.resolve(respuestaJson([])));
    await peticion('/api/usuarios');
    const encabezados = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(encabezados.Authorization).toBe('Bearer abc.def.ghi');
  });

  it('no envía Authorization sin sesión', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(respuestaJson([])));
    await peticion('/api/productos');
    const encabezados = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(encabezados.Authorization).toBeUndefined();
  });

  it('avisa que la sesión expiró si el backend responde 401 con token', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ token: 'vencido' }));
    fetchMock.mockImplementation(() => Promise.resolve(respuestaJson({ message: 'Tu sesión expiró' }, 401)));
    const aviso = vi.fn();
    window.addEventListener(EVENTO_SESION_EXPIRADA, aviso);
    await expect(peticion('/api/usuarios')).rejects.toThrow('Tu sesión expiró');
    window.removeEventListener(EVENTO_SESION_EXPIRADA, aviso);
    expect(aviso).toHaveBeenCalledTimes(1);
  });
});

describe('Actualizar cuenta', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('envía un PUT a /api/usuarios/{id} con la dirección y sin contraseña', async () => {
    const { actualizarUsuario } = await import('../api/usuarios');
    fetchMock.mockImplementation(() =>
      Promise.resolve(respuestaJson({ id: 3, run: '22222222-2', nombre: 'Juan', apellidos: null, correo: 'c@c.cl', rolId: 3, rol: 'Cliente', region: null, comuna: null, direccion: 'Calle 1' }))
    );
    const r = await actualizarUsuario(3, { id: 3, run: '22222222-2', nombre: 'Juan', email: 'c@c.cl', rol: 'Cliente', direccion: 'Calle 1' });
    const [url, op] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/api/usuarios/3');
    expect(op.method).toBe('PUT');
    const cuerpo = JSON.parse(op.body as string);
    expect(cuerpo.direccion).toBe('Calle 1');
    expect(cuerpo.correo).toBe('c@c.cl');
    expect(cuerpo.contrasena).toBeUndefined();
    expect(r.direccion).toBe('Calle 1');
  });
});
