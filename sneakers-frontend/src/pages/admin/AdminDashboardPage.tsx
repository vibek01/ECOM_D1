import { AppContainer } from '../../components/layout/AppContainer';

export const AdminDashboardPage = () => {
  return (
    <AppContainer>
      <div className="py-24 text-center">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="mt-4 text-lg text-slate-600">
          Welcome, Admin! This is a protected area for managing the store.
        </p>
      </div>
    </AppContainer>
  );
};