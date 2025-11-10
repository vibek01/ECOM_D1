import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { RootState } from '../store/store';
import { FullScreenSpinner } from '../components/common/FullScreenSpinner';

export const PrivateRoute = () => {
  const { user, authStatus } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // 1. If authStatus is 'initializing', we show a loading screen.
  // This prevents the redirect flicker while we check for a valid session cookie.
  if (authStatus === 'initializing') {
    return <FullScreenSpinner />;
  }

  // 2. If the check is complete and we have a user, show the protected content.
  if (user) {
    return <Outlet />;
  }

  // 3. If the check is complete and there's no user, redirect to the login page.
  return <Navigate to="/login" state={{ from: location }} replace />;
};