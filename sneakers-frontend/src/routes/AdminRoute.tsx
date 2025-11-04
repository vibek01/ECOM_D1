import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../store/store';

export const AdminRoute = () => {
const { user } = useSelector((state: RootState) => state.auth);
    // If there is a user and their role is ADMIN, render the child route.
    // Otherwise, redirect to the homepage.
    return user && user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
};