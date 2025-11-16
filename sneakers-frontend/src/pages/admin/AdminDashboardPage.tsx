import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DollarSign, Users, Package, ShoppingCart } from 'lucide-react';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchDashboardStats } from '../../store/adminSlice';
import type { Order } from '../../types';

// A reusable component for dashboard stat cards (unchanged)
const StatCard = ({ title, value, icon: Icon }: any) => (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <Icon className="h-5 w-5 text-slate-400" />
        </div>
        <div className="mt-2">
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
    </div>
);

// A skeleton loader component for the stat cards
const StatCardSkeleton = () => (
    <div className="rounded-lg border bg-white p-6 shadow-sm animate-pulse">
        <div className="h-4 w-2/3 rounded bg-slate-200"></div>
        <div className="mt-4 h-8 w-1/2 rounded bg-slate-200"></div>
    </div>
);

// A component to render the list of recent orders
const RecentOrders = ({ orders }: { orders: Order[] }) => {
    if (orders.length === 0) {
        return <p className="text-slate-500 text-center py-8">No recent orders found.</p>;
    }

    return (
        <div className="flow-root">
            <ul className="divide-y divide-slate-200">
                {orders.map(order => (
                    <li key={order.id} className="py-3 flex items-center justify-between">
                        <div className="text-sm">
                            <p className="font-medium text-slate-900">Order #{order.id.substring(0, 8)}...</p>
                            <p className="text-slate-500">by {(order.user as any)?.username || 'N/A'}</p>
                        </div>
                        <div className="text-right text-sm">
                            <p className="font-bold text-slate-900">${order.totalAmount.toFixed(2)}</p>
                            <p className="text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const AdminDashboardPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { dashboardStats: stats, status, error } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        // Fetch stats only if they haven't been fetched yet
        if (status === 'idle') {
            dispatch(fetchDashboardStats());
        }
    }, [status, dispatch]);

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="mt-1 text-slate-600">
                        Welcome back! Here's a summary of your store's performance.
                    </p>
                </div>
            </div>

            {error && <p className="mt-4 text-red-600">Error: {error}</p>}

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {status === 'loading' || !stats ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    <>
                        <StatCard
                            title="Total Revenue"
                            value={`$${stats.totalRevenue.toFixed(2)}`}
                            icon={DollarSign}
                        />
                        <StatCard
                            title="New Customers (30d)"
                            value={`+${stats.newCustomers}`}
                            icon={Users}
                        />
                        <StatCard
                            title="Products in Stock"
                            value={stats.totalProducts}
                            icon={Package}
                        />
                        <StatCard
                            title="Pending Orders"
                            value={stats.pendingOrders}
                            icon={ShoppingCart}
                        />
                    </>
                )}
            </div>

            <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900">Recent Activity</h2>
                    <Link to="/admin/orders" className="text-sm font-medium text-teal-600 hover:text-teal-800">
                        View all orders
                    </Link>
                </div>
                <div className="mt-4">
                    {status === 'loading' || !stats ? (
                        <div className="space-y-4">
                            <div className="h-10 rounded bg-slate-200 animate-pulse"></div>
                            <div className="h-10 rounded bg-slate-200 animate-pulse"></div>
                            <div className="h-10 rounded bg-slate-200 animate-pulse"></div>
                        </div>
                    ) : (
                        <RecentOrders orders={stats.recentOrders} />
                    )}
                </div>
            </div>
        </div>
    );
};