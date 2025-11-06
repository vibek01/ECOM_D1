import { clsx } from 'clsx';
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
      <h3 className="text-sm font-medium text-gray-900 capitalize">{type}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {uniqueValues.map((value) => {
          const isSelected = selectedValue === value;

          // --- DEFINITIVE FIX: SIMPLIFIED DISABLED LOGIC ---
          // An option is disabled only if ALL variants containing that option are out of stock.
          // This ensures that if a "Size 9" exists in any color with stock, it remains enabled.
          const isDisabled = variants
            .filter(variant => variant[type] === value)
            .every(variant => variant.stock === 0);

          return (
            <button
              key={value}
              onClick={() => onValueSelect(value)}
              className={clsx(
                'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-25',
                {
                  'border-slate-900 bg-slate-900 text-white': isSelected,
                  'border-gray-300 bg-white text-gray-900 hover:bg-gray-50': !isSelected,
                }
              )}
              disabled={isDisabled}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
};