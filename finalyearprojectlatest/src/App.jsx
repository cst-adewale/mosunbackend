import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import JumiaLayout from './components/jumia/JumiaLayout';
import AdminLayout from './components/admin/AdminLayout';
import JumiaHome from './pages/jumia/JumiaHome';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductDetail from './pages/jumia/ProductDetail';
import LoginPage from './pages/jumia/LoginPage';
import RegisterPage from './pages/jumia/RegisterPage';
import PrivacyCenter from './pages/jumia/PrivacyCenter';
import Checkout from './pages/jumia/Checkout';

import { PrivacyProvider } from './context/PrivacyContext';
import { CartProvider } from './context/CartContext';
import CookieConsent from './components/jumia/CookieConsent';

function App() {
  return (
    <PrivacyProvider>
      <CartProvider>
        <CookieConsent />
        <Router>
          <Routes>
            {/* Jumia Storefront Routes */}
            <Route path="/" element={<JumiaLayout />}>
              <Route index element={<JumiaHome />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="privacy-center" element={<PrivacyCenter />} />
              <Route path="checkout" element={<Checkout />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>

            {/* Redirect unknown routes to Jumia Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </CartProvider>
    </PrivacyProvider>
  );
}

export default App;
