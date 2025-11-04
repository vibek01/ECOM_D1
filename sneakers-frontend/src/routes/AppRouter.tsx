import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants';
import { PageLayout } from '../components/layout/PageLayout';

// --- Import Pages ---
import { HomePage } from '../pages/HomePage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage'; // <-- Import
import { RegisterPage } from '../pages/RegisterPage'; // <-- Import
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'; // <-- Import
import { ProfilePage } from '../pages/ProfilePage'; // <-- Import a new placeholder page

// --- Import Route Protectors ---
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with standard Header and Footer */}
        <Route element={<PageLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductListingPage />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailsPage />} />
          <Route path={ROUTES.CART} element={<CartPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Route>

        {/* Full-page routes without standard layout */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* 404 Not Found Route would go here */}
      </Routes>
    </BrowserRouter>
  );
};