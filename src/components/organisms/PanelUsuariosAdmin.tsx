import React from 'react';
import type { User, UserRole } from '../../types';
import { Badge } from '../atoms/Etiqueta';

interface UserTableProps {
  users: User[];
  onRoleChange: (index: number, newRole: UserRole) => void;
}

// Organismo: Tabla de gestión de usuarios del sistema
export const UserTable: React.FC<UserTableProps> = ({ users, onRoleChange }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-secondary">
          <tr>
            <th>RUN</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Ubicación</th>
            <th>Rol</th>
            <th>Cambiar Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => {
            let variant: 'danger' | 'warning' | 'info' = 'info';
            if (u.rol === 'Administrador') variant = 'danger';
            if (u.rol === 'Vendedor') variant = 'warning';

            return (
              <tr key={u.run || index}>
                <td className="fw-bold">{u.run}</td>
                <td>{u.apellidos ? `${u.nombre} ${u.apellidos}` : u.nombre}</td>
                <td>{u.email}</td>
                <td><small className="text-muted">{u.comuna && u.region ? `${u.comuna}, ${u.region}` : 'No registrada'}</small></td>
                <td><Badge variant={variant}>{u.rol}</Badge></td>
                <td>
                  <select
                    className="form-select form-select-sm d-inline-block w-auto"
                    value={u.rol}
                    onChange={(e) => onRoleChange(index, e.target.value as UserRole)}
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Cliente">Cliente</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};