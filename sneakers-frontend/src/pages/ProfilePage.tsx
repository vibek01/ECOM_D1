import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, ShoppingBag } from 'lucide-react';

import { AppContainer } from '../components/layout/AppContainer';
import type { RootState } from '../store/store';
import { ProfileSidebar } from '../components/ui/ProfileSidebar';
import { DashboardCard } from '../components/ui/DashboardCard';

export const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    // A subtle gradient background adds depth to the entire page
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <AppContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-16 sm:py-24"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl">
              My Account
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Welcome back, {user?.username}! Manage your profile and orders here.
            </p>
          </div>

          {/* Increased gap for more breathing room */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>

            <div className="lg:col-span-3 space-y-8">
              {/* Profile Information Card - Redesigned internal layout */}
              <DashboardCard
                title="Profile Information"
                icon={User}
                actionButton={{ text: "Edit Profile", onClick: () => {} }}
              >
                {/* A more structured and detailed description list */}
                <dl className="space-y-6">
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Username</dt>
                    <dd className="mt-1 text-base font-medium text-slate-900">{user?.username}</dd>
                  </div>
                  <div className="border-t border-slate-200/80 pt-6">
                    <dt className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Email Address</dt>
                    <dd className="mt-1 text-base font-medium text-slate-900">{user?.email}</dd>
                  </div>
                  <div className="border-t border-slate-200/80 pt-6">
                    <dt className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Role</dt>
                    <dd className="mt-1 text-base font-medium text-slate-900 capitalize">{user?.role.toLowerCase()}</dd>
                  </div>
                </dl>
              </DashboardCard>
              
              <DashboardCard title="Order History" icon={ShoppingBag}>
                <div className="text-center text-slate-500 py-12">
                  <p className="font-medium">You have no recent orders.</p>
                  <p className="text-sm mt-1">When you place an order, it will appear here.</p>
                </div>
              </DashboardCard>
            </div>
          </div>
        </motion.div>
      </AppContainer>
    </div>
  );
};