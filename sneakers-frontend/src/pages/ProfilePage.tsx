import { useSelector } from 'react-redux';
import { AppContainer } from '../components/layout/AppContainer';
import type { RootState } from '../store/store';

export const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <AppContainer>
      <div className="py-24">
        <h1 className="text-4xl font-bold">User Profile</h1>
        <div className="mt-8 space-y-2 text-lg">
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>
      </div>
    </AppContainer>
  );
};;