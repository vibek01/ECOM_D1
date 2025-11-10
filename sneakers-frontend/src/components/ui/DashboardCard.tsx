import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
  children: React.ReactNode;
}

export const DashboardCard = ({ title, icon: Icon, actionButton, children }: DashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      // A more pronounced shadow gives the card more depth
      className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 overflow-hidden"
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-200/80 bg-slate-50/50">
        <div className="flex items-center">
          <Icon className="h-6 w-6 text-teal-600" />
          <h3 className="ml-3 text-lg font-bold text-slate-900">{title}</h3>
        </div>
        {actionButton && (
          // A more subtle ghost button for the action
          <Button variant="ghost" className="text-sm font-semibold hover:bg-slate-200" onClick={actionButton.onClick}>
            {actionButton.text}
          </Button>
        )}
      </div>

      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
};