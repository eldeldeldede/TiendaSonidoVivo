import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser || !['Administrador', 'Vendedor'].includes(currentUser.rol)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/novedades" element={<NovedadesPage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/mapa" element={<MapaPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
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
      </CartProvider>
    </AuthProvider>
  );
};

export default App;