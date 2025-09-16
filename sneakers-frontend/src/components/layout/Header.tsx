import { NavLink } from 'react-router-dom';
import { ShoppingBag, User, Search, Zap } from 'lucide-react';
import { AppContainer } from './AppContainer';
import { Button } from '../common/Button';

export const Header = () => {
  // Hardcoded for now. Will come from Redux store.
  const cartItemCount = 2;

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
              <NavLink
                to="/products"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="transition-colors hover:text-slate-950"
              >
                All Sneakers
              </NavLink>
              <NavLink
                to="/new-releases"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="transition-colors hover:text-slate-950"
              >
                New Releases
              </NavLink>
              <NavLink
                to="/sale"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="transition-colors hover:text-slate-950"
              >
                Sale
              </NavLink>
            </nav>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5 text-slate-600" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="User Profile">
              <User className="h-5 w-5 text-slate-600" />
            </Button>
            <NavLink to="/cart" className="relative" aria-label="Shopping Cart">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5 text-slate-600" />
                {cartItemCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
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