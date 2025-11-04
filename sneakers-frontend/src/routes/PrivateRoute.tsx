import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { RootState } from '../store/store';
import { FullScreenSpinner } from '../components/common/FullScreenSpinner';

export const PrivateRoute = () => {
  const { user, authStatus } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Show a loading spinner while the initial authentication check is running
  if (authStatus === 'initializing') {
    return <FullScreenSpinner />;
  }

  // If the check is complete and there is a user, render the requested page
  if (user) {
    return <Outlet />;
  }

  // If the check is complete and there's no user, redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};