import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, User, Search, Zap, LogOut } from 'lucide-react';
import { AppContainer } from './AppContainer';
import { Button } from '../common/Button';
import type { RootState, AppDispatch } from '../../store/store';
import { logoutUser } from '../../store/authSlice';

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
    color: '#020617', // slate-950
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <AppContainer>
        <div className="flex h-16 items-center justify-between">
          {/* Left Side: Logo and Nav */}
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-slate-900" />
              <span className="text-lg font-bold tracking-tight">Sneakers</span>
            </NavLink>
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              {/* ... nav links ... */}
            </nav>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5 text-slate-600" />
            </Button>

            {user ? (
              <>
                <Button variant="ghost" size="icon" aria-label="User Profile">
                  <User className="h-5 w-5 text-slate-600" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Logout" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 text-slate-600" />
                </Button>
              </>
            ) : (
              <NavLink to="/login">
                <Button variant="ghost">Login</Button>
              </NavLink>
            )}

            <NavLink to="/cart" className="relative" aria-label="Shopping Cart">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5 text-slate-600" />
                {cartItemCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-5 w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
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