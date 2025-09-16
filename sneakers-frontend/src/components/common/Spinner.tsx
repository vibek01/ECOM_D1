import { cva, type VariantProps } from 'class-variance-authority'; // <-- Fix: Added 'type' keyword
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const spinnerVariants = cva('animate-spin rounded-full border-4 border-solid border-t-transparent', {
  variants: {
    color: {
      primary: 'border-slate-900',
      light: 'border-white',
    },
    size: {
      sm: 'h-6 w-6 border-2',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export const Spinner = ({ color, size, className }: SpinnerProps) => {
  return <div className={twMerge(clsx(spinnerVariants({ color, size, className })))} />;
};