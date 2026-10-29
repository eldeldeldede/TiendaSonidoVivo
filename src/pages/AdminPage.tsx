import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/ContenidoLogin';
import { UserTable } from '../components/organisms/PanelUsuariosAdmin';
import { ProductTable } from '../components/organisms/InventarioProductos';
import { ProductForm, type ProductFormData } from '../components/organisms/FormularioNewProducto';
import { Button } from '../components/atoms/Button';
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../data/productos';
import { obtenerPedidos, actualizarEstadoPedido } from '../data/pedidos';
import { RegisterForm } from '../components/organisms/FormularioRegistro';
import type { Order, Product, User, UserRole } from '../types';

export const AdminPage: React.FC = () => {
  const { currentUser, logout, users, cambiarRol, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'pedidos' | 'stock' | 'usuarios'>('pedidos');

  const [orders, setOrders] = useState<Order[]>(() => obtenerPedidos());

  const cambiarEstado = (id: string, estado: Order['estado']) => {
    actualizarEstadoPedido(id, estado);
    setOrders(obtenerPedidos());
  };

  const colorEstado = (estado: Order['estado']) =>
    estado === 'Entregado' ? 'bg-success' : estado === 'Despachado' ? 'bg-primary' : 'bg-warning text-dark';

  // ---------- Productos (CRUD) ----------
  const [productos, setProductos] = useState<Product[]>(() => obtenerProductos());
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

  const guardarProducto = (datos: ProductFormData) => {
    if (productoEditando) {
      actualizarProducto(productoEditando.id, datos);
      window.alert('Producto actualizado correctamente');
    } else {
      crearProducto(datos);
      window.alert('Producto creado correctamente');
    }
    setProductos(obtenerProductos());
    cerrarFormulario();
  };

  const borrarProducto = (producto: Product) => {
    if (window.confirm(`¿Está seguro de que desea eliminar "${producto.nombre}"?`)) {
      eliminarProducto(producto.id);
      setProductos(obtenerProductos());
    }
  };

  // ---------- Usuarios ----------
  const [mostrarFormUsuario, setMostrarFormUsuario] = useState(false);

  const handleRoleChange = (index: number, newRole: UserRole) => {
    cambiarRol(users[index].run, newRole);
  };

  const crearUsuario = (nuevoUsuario: User) => {
    if (currentUser?.rol !== 'Administrador') return; // solo el admin puede crear usuarios
    if (register(nuevoUsuario)) {
      window.alert(`Usuario ${nuevoUsuario.nombre} creado como ${nuevoUsuario.rol}`);
      setMostrarFormUsuario(false);
    } else {
      window.alert('Ya existe un usuario con ese RUN o correo electrónico');
    }
  };

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
          {currentUser?.rol === 'Administrador' && (
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
                  {orders.map((o) => (
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
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Inventario de Productos</h5>
              {!mostrarFormulario && (
                <Button variant="primary" onClick={abrirNuevo}>
                  + Nuevo producto
                </Button>
              )}
            </div>

            {mostrarFormulario && (
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

            <ProductTable products={productos} onEdit={abrirEdicion} onDelete={borrarProducto} />
          </div>
        )}

        {activeTab === 'usuarios' && currentUser?.rol === 'Administrador' && (
          <div className="card border-0 shadow-sm p-3 border-top border-danger border-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-danger mb-0">Gestión de Usuarios del Sistema</h5>
              <Button variant="danger" onClick={() => setMostrarFormUsuario(true)}>
                + Nuevo usuario
              </Button>
            </div>

            <UserTable users={users} onRoleChange={handleRoleChange} />
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
