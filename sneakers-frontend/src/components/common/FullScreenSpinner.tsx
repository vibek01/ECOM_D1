import { Spinner } from './Spinner';

export const FullScreenSpinner = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};