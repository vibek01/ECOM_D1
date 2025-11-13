import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Package, Users, LogOut, Zap, ShoppingCart } from 'lucide-react';
import { Button } from '../common/Button';
import { logoutUser } from '../../store/authSlice';
import type { AppDispatch, RootState } from '../../store/store';

const AdminSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/');
    });
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/users', icon: Users, label: 'Users' },
  ];

  const activeStyle = {
    backgroundColor: '#e2e8f0', // slate-200
    color: '#0f172a', // slate-900
  };

  return (
    <aside className="flex w-64 flex-col border-r bg-slate-50">
      <div className="flex h-16 items-center border-b px-6">
        <NavLink to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <Zap className="h-6 w-6 text-slate-900" />
          <span>Sneakers Admin</span>
        </NavLink>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            style={({ isActive }) => (isActive ? activeStyle : {})}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900"
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200" />
          <div>
            <p className="text-sm font-medium text-slate-900">{user?.username}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};