import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppRouter } from './routes/AppRouter';
import { verifyAuth } from './store/authSlice';
import type { AppDispatch } from './store/store';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  // On initial application load, dispatch verifyAuth to check for an active session
  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);

  return <AppRouter />;
}

export default App;