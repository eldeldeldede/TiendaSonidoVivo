import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/ContenidoLogin';
import { UserTable } from '../components/organisms/PanelUsuariosAdmin';
import { ProductTable } from '../components/organisms/InventarioProductos';
import { ProductForm, type ProductFormData } from '../components/organisms/FormularioNewProducto';
import { Button } from '../components/atoms/Button';
import { EstadoCarga } from '../components/molecules/EstadoCarga';
import { RegisterForm } from '../components/organisms/FormularioRegistro';
import { useCarga } from '../hooks/useCarga';
import { mensajeDeError } from '../api/cliente';
import { listarProductos, crearProducto, actualizarProducto, eliminarProducto } from '../api/productos';
import { listarPedidos, cambiarEstadoPedido } from '../api/pedidos';
import { listarUsuarios, listarRoles, crearUsuario as crearUsuarioApi, cambiarRolUsuario } from '../api/usuarios';
import { listarConsultas, marcarConsultaAtendida, responderConsulta } from '../api/servicios';
import type { Consulta, Order, Product, User, UserRole } from '../types';

type Pestana = 'pedidos' | 'stock' | 'consultas' | 'usuarios';

// Muestra el error del backend en una alerta (los servicios devuelven mensajes claros)
const avisarError = (e: unknown) => window.alert(mensajeDeError(e));

export const AdminPage: React.FC = () => {
  const { currentUser, logout, actualizarSesion } = useAuth();
  const esAdmin = currentUser?.rol === 'Administrador';
  const [activeTab, setActiveTab] = useState<Pestana>('pedidos');

  // ---------- Pedidos ----------
  const pedidos = useCarga(listarPedidos);

  const cambiarEstado = async (codigo: string, estado: Order['estado']) => {
    try {
      await cambiarEstadoPedido(codigo, estado);
      pedidos.recargar();
    } catch (e) {
      avisarError(e);
    }
  };

  const colorEstado = (estado: Order['estado']) =>
    estado === 'Entregado' ? 'bg-success' : estado === 'Despachado' ? 'bg-primary' : 'bg-warning text-dark';

  // ---------- Productos (CRUD) ----------
  const productos = useCarga(listarProductos);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Product | null>(null);

  const abrirNuevo = () => {
    setProductoEditando(null);
    setMostrarFormulario(true);
  };

  const abrirEdicion = (producto: Product) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setProductoEditando(null);
    setMostrarFormulario(false);
  };

  const guardarProducto = async (datos: ProductFormData) => {
    try {
      if (productoEditando) {
        await actualizarProducto(productoEditando.id, datos);
        window.alert('Producto actualizado correctamente');
      } else {
        await crearProducto(datos);
        window.alert('Producto creado correctamente');
      }
      productos.recargar();
      cerrarFormulario();
    } catch (e) {
      avisarError(e);
    }
  };

  const borrarProducto = async (producto: Product) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar "${producto.nombre}"?`)) return;
    try {
      await eliminarProducto(producto.id);
      productos.recargar();
    } catch (e) {
      avisarError(e);
    }
  };

  // ---------- Consultas de contacto ----------
  const consultas = useCarga(listarConsultas);

  const alternarAtendida = async (id: number, atendida: boolean) => {
    try {
      await marcarConsultaAtendida(id, atendida);
      consultas.recargar();
    } catch (e) {
      avisarError(e);
    }
  };

  // Respuesta a una consulta: se abre un cuadro de texto debajo de la fila
  const [respondiendoId, setRespondiendoId] = useState<number | null>(null);
  const [textoRespuesta, setTextoRespuesta] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);

  const abrirRespuesta = (c: Consulta) => {
    setRespondiendoId(c.id);
    setTextoRespuesta(c.respuesta ?? '');
  };

  const enviarRespuesta = async (id: number) => {
    if (!textoRespuesta.trim()) {
      window.alert('Debe escribir una respuesta');
      return;
    }
    setEnviandoRespuesta(true);
    try {
      await responderConsulta(id, textoRespuesta.trim());
      setRespondiendoId(null);
      setTextoRespuesta('');
      consultas.recargar();
    } catch (e) {
      avisarError(e);
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  // ---------- Usuarios (solo Administrador) ----------
  const cargarUsuarios = useCallback(
    async () => (esAdmin ? { usuarios: await listarUsuarios(), roles: await listarRoles() } : { usuarios: [], roles: [] }),
    [esAdmin]
  );
  const usuarios = useCarga(cargarUsuarios);
  const listaUsuarios = usuarios.datos?.usuarios ?? [];
  const roles = usuarios.datos?.roles ?? [];
  const [mostrarFormUsuario, setMostrarFormUsuario] = useState(false);

  const idDeRol = (nombre: UserRole) => roles.find((r) => r.nombre === nombre)?.id;

  const handleRoleChange = async (index: number, newRole: UserRole) => {
    const usuario = listaUsuarios[index];
    const rolId = idDeRol(newRole);
    if (usuario?.id === undefined || rolId === undefined) return;
    try {
      const actualizado = await cambiarRolUsuario(usuario.id, rolId);
      if (currentUser && currentUser.id === actualizado.id) actualizarSesion({ ...currentUser, rol: actualizado.rol });
      usuarios.recargar();
    } catch (e) {
      avisarError(e);
      usuarios.recargar(); // vuelve a mostrar el rol real
    }
  };

  const crearUsuario = async (nuevoUsuario: User) => {
    if (!esAdmin) return; // solo el admin puede crear usuarios
    const rolId = idDeRol(nuevoUsuario.rol);
    if (rolId === undefined) {
      window.alert('No se pudo determinar el rol seleccionado');
      return;
    }
    try {
      await crearUsuarioApi(nuevoUsuario, rolId);
      window.alert(`Usuario ${nuevoUsuario.nombre} creado como ${nuevoUsuario.rol}. Se envió una contraseña temporal a ${nuevoUsuario.email}.`);
      setMostrarFormUsuario(false);
      usuarios.recargar();
    } catch (e) {
      avisarError(e);
    }
  };

  const formatearFechaHora = (iso: string) =>
    new Date(iso).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark sticky-top px-4">
        <Link className="navbar-brand fw-bold" to="/">Sonido Vivo - Panel</Link>
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="btn btn-outline-light btn-sm">
            Volver a la tienda
          </Link>
          <span className="text-white small">Sesión: {currentUser?.nombre} ({currentUser?.rol})</span>
          <button className="btn btn-outline-danger btn-sm" onClick={logout}>Cerrar Sesión</button>
        </div>
      </nav>

      <div className="container-fluid my-4 px-4">
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'pedidos' ? 'active fw-bold' : ''}`} onClick={() => setActiveTab('pedidos')}>
              Gestión de Pedidos
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'stock' ? 'active fw-bold' : ''}`} onClick={() => setActiveTab('stock')}>
              Gestión de Productos
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'consultas' ? 'active fw-bold' : ''}`} onClick={() => setActiveTab('consultas')}>
              Consultas de Contacto
            </button>
          </li>
          {esAdmin && (
            <li className="nav-item">
              <button className={`nav-link text-danger ${activeTab === 'usuarios' ? 'active fw-bold' : ''}`} onClick={() => setActiveTab('usuarios')}>
                Usuarios (Solo Admin)
              </button>
            </li>
          )}
        </ul>

        {activeTab === 'pedidos' && (
          <div className="card border-0 shadow-sm p-3">
            <h5>Pedidos de Clientes</h5>
            <EstadoCarga cargando={pedidos.cargando && !pedidos.datos} error={pedidos.error} onReintentar={pedidos.recargar}>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>N° Pedido</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Cambiar estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(pedidos.datos ?? []).map((o) => (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.cliente}</td>
                        <td>${o.total.toLocaleString('es-CL')}</td>
                        <td><span className={`badge ${colorEstado(o.estado)}`}>{o.estado}</span></td>
                        <td>
                          <select
                            className="form-select form-select-sm w-auto"
                            value={o.estado}
                            onChange={(e) => cambiarEstado(o.id, e.target.value as Order['estado'])}
                          >
                            <option value="En Preparación">En Preparación</option>
                            <option value="Despachado">Despachado</option>
                            <option value="Entregado">Entregado</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </EstadoCarga>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Inventario de Productos</h5>
              {esAdmin && !mostrarFormulario && (
                <Button variant="primary" onClick={abrirNuevo}>
                  + Nuevo producto
                </Button>
              )}
            </div>

            {esAdmin && mostrarFormulario && (
              <div className="border rounded p-3 mb-4 bg-white">
                {/* key: reinicia el formulario al cambiar entre "nuevo" y "editar" */}
                <ProductForm
                  key={productoEditando?.id ?? 'nuevo'}
                  initialData={productoEditando ?? undefined}
                  onSubmit={guardarProducto}
                  onCancel={cerrarFormulario}
                />
              </div>
            )}

            <EstadoCarga cargando={productos.cargando && !productos.datos} error={productos.error} onReintentar={productos.recargar}>
              <ProductTable products={productos.datos ?? []} onEdit={esAdmin ? abrirEdicion : undefined} onDelete={esAdmin ? borrarProducto : undefined} />
            </EstadoCarga>
          </div>
        )}

        {activeTab === 'consultas' && (
          <div className="card border-0 shadow-sm p-3">
            <h5>Mensajes del formulario de contacto</h5>
            <EstadoCarga cargando={consultas.cargando && !consultas.datos} error={consultas.error} onReintentar={consultas.recargar}>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Mensaje</th>
                      <th>Estado</th>
                      <th>Respuesta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(consultas.datos ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-3">No hay consultas registradas</td>
                      </tr>
                    ) : (
                      (consultas.datos ?? []).map((c) => (
                        <React.Fragment key={c.id}>
                          <tr>
                            <td className="text-nowrap">{formatearFechaHora(c.fecha)}</td>
                            <td>{c.nombre}</td>
                            <td>{c.email}</td>
                            <td style={{ maxWidth: '360px' }}>
                              {c.mensaje}
                              {c.respuesta && (
                                <div className="small text-success mt-2">
                                  <i className="bi bi-reply-fill me-1"></i>
                                  <strong>Respondida{c.fechaRespuesta ? ` (${formatearFechaHora(c.fechaRespuesta)})` : ''}:</strong>{' '}
                                  {c.respuesta}
                                </div>
                              )}
                            </td>
                            <td>
                              <Button
                                size="sm"
                                variant={c.atendida ? 'outline-secondary' : 'success'}
                                onClick={() => alternarAtendida(c.id, !c.atendida)}
                              >
                                {c.atendida ? 'Atendida (reabrir)' : 'Marcar atendida'}
                              </Button>
                            </td>
                            <td>
                              <Button size="sm" variant="primary" icon="reply" onClick={() => abrirRespuesta(c)}>
                                {c.respuesta ? 'Editar respuesta' : 'Responder'}
                              </Button>
                            </td>
                          </tr>
                          {respondiendoId === c.id && (
                            <tr>
                              <td colSpan={6} className="bg-light">
                                <label htmlFor={`respuesta-${c.id}`} className="form-label fw-semibold">
                                  Respuesta para {c.nombre}
                                </label>
                                <textarea
                                  id={`respuesta-${c.id}`}
                                  className="form-control mb-2"
                                  rows={3}
                                  maxLength={1000}
                                  value={textoRespuesta}
                                  onChange={(e) => setTextoRespuesta(e.target.value)}
                                />
                                <div className="d-flex gap-2 align-items-center">
                                  <Button size="sm" variant="success" disabled={enviandoRespuesta} onClick={() => enviarRespuesta(c.id)}>
                                    {enviandoRespuesta ? 'Enviando...' : 'Enviar respuesta'}
                                  </Button>
                                  <Button size="sm" variant="secondary" onClick={() => setRespondiendoId(null)}>
                                    Cancelar
                                  </Button>
                                  <small className="text-muted ms-auto">
                                    La verá en "Mis consultas" si tiene una cuenta con ese correo.
                                  </small>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </EstadoCarga>
          </div>
        )}

        {activeTab === 'usuarios' && esAdmin && (
          <div className="card border-0 shadow-sm p-3 border-top border-danger border-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-danger mb-0">Gestión de Usuarios del Sistema</h5>
              <Button variant="danger" onClick={() => setMostrarFormUsuario(true)}>
                + Nuevo usuario
              </Button>
            </div>

            <EstadoCarga cargando={usuarios.cargando && !usuarios.datos} error={usuarios.error} onReintentar={usuarios.recargar}>
              <UserTable users={listaUsuarios} onRoleChange={handleRoleChange} />
            </EstadoCarga>
          </div>
        )}

        {/* Modal para crear usuario: se muestra según el estado mostrarFormUsuario */}
        {mostrarFormUsuario && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={() => setMostrarFormUsuario(false)}
          >
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Nuevo usuario</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setMostrarFormUsuario(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <RegisterForm onRegister={crearUsuario} permitirElegirRol textoBoton="Crear usuario" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
