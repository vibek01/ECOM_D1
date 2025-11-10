import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import type { ProductVariant } from '../../types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  type: 'size' | 'color';
  selectedValue: string | null;
  onValueSelect: (value: string) => void;
}

export const VariantSelector = ({
  variants,
  type,
  selectedValue,
  onValueSelect,
}: VariantSelectorProps) => {
  const uniqueValues = [...new Set(variants.map(v => v[type]))];

  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 capitalize">{type}</h3>
      <div className="mt-3 flex flex-wrap gap-3">
        {uniqueValues.map((value) => {
          const isSelected = selectedValue === value;
          const isDisabled = variants
            .filter(variant => variant[type] === value)
            .every(variant => variant.stock === 0);

          return (
            <motion.button
              key={value}
              whileTap={{ scale: 0.95 }}
              onClick={() => onValueSelect(value)}
              className={clsx(
                'min-w-[4rem] rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-30 disabled:bg-slate-100 disabled:line-through',
                {
                  // Selected State
                  'border-teal-600 bg-teal-600 text-white shadow-md': isSelected,
                  // Default State
                  'border-slate-300 bg-white text-slate-800 hover:border-slate-400': !isSelected,
                }
              )}
              disabled={isDisabled}
            >
              {value}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};