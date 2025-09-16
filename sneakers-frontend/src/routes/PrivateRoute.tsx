import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

// For now, this component just renders its children.
// Later, we will add logic to check for authentication.
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = true; // Placeholder

  return isAuthenticated ? <>{children}</> : <div>Redirecting to login...</div>;
};