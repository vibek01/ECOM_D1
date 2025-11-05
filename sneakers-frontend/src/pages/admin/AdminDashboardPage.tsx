import { DollarSign, Users, Package, CreditCard } from 'lucide-react';
// A reusable component for dashboard stat cards
const StatCard = ({ title, value, icon: Icon, change }: any) => (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <Icon className="h-5 w-5 text-slate-400" />
        </div>
        <div className="mt-2">
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            <p className="mt-1 text-xs text-slate-500">{change}</p>
        </div>
    </div>
);

export const AdminDashboardPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="mt-1 text-slate-600">
            Welcome back, Admin! Here's a summary of your store's performance.
            </p>
            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                title="Total Revenue"
                value="$45,231.89"
                icon={DollarSign}
                change="+20.1% from last month"
                />
                <StatCard
                title="New Customers"
                value="+2,350"
                icon={Users}
                change="+180.1% from last month"
                />
                <StatCard
                title="Products in Stock"
                value="1,204"
                icon={Package}
                change="201 active"
                />
                <StatCard
                title="Pending Orders"
                value="32"
                icon={CreditCard}
                change="12 since yesterday"
                />
            </div>

            {/* Placeholder for future charts or tables */}
            <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-slate-900">Recent Activity</h2>
                <div className="mt-4 h-64 rounded-md bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500">Graphs and recent orders will be displayed here.</p>
                </div>
            </div>
        </div>
    );
};