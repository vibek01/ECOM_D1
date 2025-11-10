import { User, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { logoutUser } from '../../store/authSlice';
import type { AppDispatch } from '../../store/store';

const navItems = [
  { name: 'Profile', icon: User, href: '#', active: true },
  { name: 'Order History', icon: ShoppingBag, href: '#', active: false },
  { name: 'Settings', icon: Settings, href: '#', active: false },
];

export const ProfileSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    // Enhanced shadow for more depth
    <div className="p-4 bg-white rounded-2xl shadow-xl shadow-slate-900/10">
      <nav className="flex flex-col">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            // Increased padding and added margin-bottom for better spacing
            className={`relative flex items-center px-4 py-3.5 mb-1 rounded-lg transition-colors duration-200 ${
              item.active
                ? 'text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.active && (
              <motion.div
                layoutId="active-sidebar-tab"
                className="absolute inset-0 bg-teal-600 rounded-lg z-0"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon className="h-5 w-5 mr-3 relative z-10" />
            <span className="font-semibold relative z-10">{item.name}</span>
          </a>
        ))}
        
        {/* Visual separator and more space for the logout button */}
        <div className="mt-4 pt-4 border-t border-slate-200/80">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};