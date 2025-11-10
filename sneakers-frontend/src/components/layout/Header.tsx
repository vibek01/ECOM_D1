import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, User, Zap, LogOut } from 'lucide-react';
import { AppContainer } from './AppContainer';
import { Button } from '../common/Button';
import type { RootState, AppDispatch } from '../../store/store';
import { logoutUser } from '../../store/authSlice';
import { SearchBar } from '../ui/SearchBar';

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const cartItemCount = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const activeLinkStyle = {
    color: '#0f172a', // slate-900
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <AppContainer>
        <div className="flex h-16 items-center justify-between">
          {/* Left Side: Logo and Nav */}
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-slate-900" />
              <span className="text-xl font-bold tracking-tight text-slate-900">Sneakers</span>
            </NavLink>
            <nav className="hidden items-center gap-6 text-sm font-medium text-gray-500 md:flex">
              <NavLink
                to="/products"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="transition-colors hover:text-slate-900"
              >
                All Sneakers
              </NavLink>
              {user && user.role === 'ADMIN' && (
                <NavLink
                  to="/admin/dashboard"
                  style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                  className="font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
                >
                  Admin Dashboard
                </NavLink>
              )}
            </nav>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {user ? (
              <>
                <NavLink to="/profile" aria-label="User Profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5 text-gray-600" />
                  </Button>
                </NavLink>
                <Button variant="ghost" size="icon" aria-label="Logout" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 text-gray-600" />
                </Button>
              </>
            ) : (
              <NavLink to="/login">
                <Button variant="ghost">Login</Button>
              </NavLink>
            )}

            <NavLink to="/cart" className="relative" aria-label="Shopping Cart">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5 text-gray-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </NavLink>
          </div>
        </div>
      </AppContainer>
    </header>
  );
};