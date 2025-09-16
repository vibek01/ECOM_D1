import { clsx } from 'clsx';
import type { ProductVariant } from '../../types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onVariantSelect: (variantId: string) => void;
  type: 'color' | 'size';
}

export const VariantSelector = ({ variants, selectedVariantId, onVariantSelect, type }: VariantSelectorProps) => {
  // We will add more logic here later to handle disabled states based on stock
  
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 capitalize">{type}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onVariantSelect(variant.id)}
            className={clsx(
              'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-25',
              {
                'border-slate-900 bg-slate-900 text-white': selectedVariantId === variant.id,
                'border-gray-300 bg-white text-gray-900 hover:bg-gray-50': selectedVariantId !== variant.id,
              }
            )}
            // disabled={variant.stock === 0} // Example of future logic
          >
            {variant.value}
          </button>
        ))}
      </div>
    </div>
  );
};