import { Outlet } from 'react-router-dom'; // <-- Import Outlet
import { Header } from './Header';
import { Footer } from './Footer';

// No more props needed! The router handles the content.
export const PageLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Outlet will render the current matched child route (e.g., HomePage) */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};