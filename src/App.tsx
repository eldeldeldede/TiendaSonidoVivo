import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/ContenidoLogin';
import { CartProvider } from './context/CartContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NovedadesPage } from './pages/NovedadesPage';
import { NosotrosPage } from './pages/NosotrosPage';
import { ServiciosPage } from './pages/ServiciosPage';
import { MapaPage } from './pages/MapaPage';
import { AdminPage } from './pages/AdminPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CompraExitosaPage } from './pages/CompraExitosaPage';
import { CompraErrorPage } from './pages/CompraErrorPage';
import { MisPedidosPage } from './pages/MisPedidosPage';
import { MisConsultasPage } from './pages/MisConsultasPage';
import { CambiarContrasenaPage } from './pages/CambiarContrasenaPage';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  // Sin sesión: al login, y después de entrar vuelve al panel
  if (!currentUser) return <Navigate to="/login" replace state={{ desde: '/admin' }} />;
  // Con sesión pero sin un rol permitido (Cliente): vuelve al inicio, sin pasar por el login
  if (!['Administrador', 'Vendedor'].includes(currentUser.rol)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// Mientras la persona use la contraseña temporal solo puede ver la pantalla para cambiarla
const ExigirCambioContrasena: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();
  if (currentUser?.debeCambiarContrasena && pathname !== '/cambiar-contrasena') {
    return <Navigate to="/cambiar-contrasena" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <ExigirCambioContrasena>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/novedades" element={<NovedadesPage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/mapa" element={<MapaPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/mis-pedidos" element={<MisPedidosPage />} />
          <Route path="/mis-consultas" element={<MisConsultasPage />} />
          <Route path="/cambiar-contrasena" element={<CambiarContrasenaPage />} />
          <Route path="/compra/exitosa" element={<CompraExitosaPage />} />
          <Route path="/compra/error" element={<CompraErrorPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
        </ExigirCambioContrasena>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;