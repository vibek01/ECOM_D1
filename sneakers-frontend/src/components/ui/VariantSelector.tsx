import { clsx } from 'clsx';
import type { ProductVariant } from '../../types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant) => void;
  type: 'size' | 'color';
}

export const VariantSelector = ({ variants, selectedVariant, onVariantSelect, type }: VariantSelectorProps) => {
  // Create a unique, sorted set of values for the given type (e.g., ['M', 'S', 'L'] -> ['L', 'M', 'S'])
  // This ensures a consistent order and no duplicates.
  const uniqueValues = [...new Set(variants.map(v => v[type]))];

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 capitalize">{type}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {uniqueValues.map((value) => {
          // Check if the currently selected variant matches this value (e.g., is the selected size 'M'?)
          const isSelected = selectedVariant ? selectedVariant[type] === value : false;
          
          // An option is disabled if ALL variants with that value (e.g., all 'M' sizes) are out of stock.
          const isDisabled = variants
            .filter(v => v[type] === value)
            .every(v => v.stock === 0);

          return (
            <button
              // Use the value itself as the key, which is guaranteed to be unique in this list.
              key={value}
              onClick={() => {
                // When a size/color is clicked, find the FIRST available variant that matches.
                const firstAvailableVariant = variants.find(v => v[type] === value && v.stock > 0);
                if (firstAvailableVariant) {
                  onVariantSelect(firstAvailableVariant);
                }
              }}
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