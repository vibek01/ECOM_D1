import { User, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { logoutUser } from '../../store/authSlice';
import type { AppDispatch } from '../../store/store';

interface ProfileSidebarProps {
  activeView: string;
  onViewChange: (view: 'profile' | 'orderHistory' | 'settings') => void;
}

const navItems = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'orderHistory', name: 'Order History', icon: ShoppingBag },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export const ProfileSidebar = ({ activeView, onViewChange }: ProfileSidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-xl shadow-slate-900/10">
      <nav className="flex flex-col">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as any)}
              className={`relative flex items-center px-4 py-3.5 mb-1 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-tab"
                  className="absolute inset-0 bg-teal-600 rounded-lg z-0"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className="h-5 w-5 mr-3 relative z-10" />
              <span className="font-semibold relative z-10">{item.name}</span>
            </button>
          );
        })}
        
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