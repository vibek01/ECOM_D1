import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants';
import { PageLayout } from '../components/layout/PageLayout';

// --- Import Pages ---
import { HomePage } from '../pages/HomePage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage'; // <-- Import the new page
// import { LoginPage } from '../pages/LoginPage';
// import { NotFoundPage } from '../pages/_404Page';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with Header and Footer */}
        <Route element={<PageLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductListingPage />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailsPage />} />
          <Route path={ROUTES.CART} element={<CartPage />} /> {/* <-- Add this route */}
        </Route>

        {/* Full-page routes without standard layout (e.g., Login) */}
        {/* <Route path={ROUTES.LOGIN} element={<LoginPage />} /> */}

        {/* 404 Not Found Route */}
        {/* <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};