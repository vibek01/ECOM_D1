import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants';
import { PageLayout } from '../components/layout/PageLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// --- Import Pages ---
import { HomePage } from '../pages/HomePage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ProductManagementPage } from '../pages/admin/ProductManagementPage';
import { AddProductPage } from '../pages/admin/AddProductPage';
import { EditProductPage } from '../pages/admin/EditProductPage'; // <-- Import
import { ProfilePage } from '../pages/ProfilePage';

// --- Import Route Protectors ---
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Customer Facing Routes --- */}
        <Route element={<PageLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductListingPage />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailsPage />} />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* --- Admin Routes --- */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<ProductManagementPage />} />
            <Route path="/admin/products/add" element={<AddProductPage />} />
            <Route path="/admin/products/edit/:id" element={<EditProductPage />} /> {/* <-- Add */}
          </Route>
        </Route>

        {/* --- Full-page Auth Routes --- */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};