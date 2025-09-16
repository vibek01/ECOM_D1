import type { ReactNode, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface AppContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const AppContainer = ({ children, className, ...props }: AppContainerProps) => {
  return (
    <div
      className={twMerge('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </div>
  );
};