import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserTable } from '../components/organisms/UserTable';
import type { Order, UserRole } from '../types';

export const AdminPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'pedidos' | 'stock' | 'usuarios'>('pedidos');

  const [orders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pedidos_sonidovivo');
    return saved ? JSON.parse(saved) : [
      { id: 'PED-101', cliente: 'Carlos Pérez', fecha: '2026-09-07', total: 750000, estado: 'En Preparación' },
      { id: 'PED-102', cliente: 'María González', fecha: '2026-09-06', total: 85000, estado: 'Despachado' }
    ];
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('usuarios_sonidovivo');
    return saved ? JSON.parse(saved) : [];
  });

  const handleRoleChange = (index: number, newRole: UserRole) => {
    const updatedUsers = [...users];
    updatedUsers[index].rol = newRole;
    setUsers(updatedUsers);
    localStorage.setItem('usuarios_sonidovivo', JSON.stringify(updatedUsers));
  };

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark sticky-top px-4">
        <a className="navbar-brand fw-bold" href="/">Sonido Vivo - Panel</a>
        <div className="d-flex align-items-center gap-3">
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
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>N° Pedido</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.cliente}</td>
                    <td>${o.total.toLocaleString('es-CL')}</td>
                    <td><span className="badge bg-warning text-dark">{o.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'usuarios' && currentUser?.rol === 'Administrador' && (
          <div className="card border-0 shadow-sm p-3 border-top border-danger border-3">
            <h5 className="text-danger mb-3">Gestión de Usuarios del Sistema</h5>
            <UserTable users={users} onRoleChange={handleRoleChange} />
          </div>
        )}
      </div>
    </div>
  );
};