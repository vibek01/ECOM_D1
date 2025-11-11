import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../common/Button';

// Define the structure of the filters this component will manage
interface ActiveFilters {
  brand?: string[];
  color?: string[];
  // Add other filters like size, price here
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  availableBrands: string[];
  availableColors: string[];
  activeFilters: ActiveFilters;
  onApplyFilters: (filters: ActiveFilters) => void;
}

export const FilterPanel = ({ 
  isOpen, 
  onClose,
  availableBrands,
  availableColors,
  activeFilters,
  onApplyFilters,
}: FilterPanelProps) => {
  // Local state to track changes before applying them
  const [localFilters, setLocalFilters] = useState<ActiveFilters>(activeFilters);

  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const handleCheckboxChange = (type: 'brand' | 'color', value: string) => {
    setLocalFilters(prev => {
      const currentValues = prev[type] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [type]: newValues };
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
              </div>

              <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                {/* Brand Filter */}
                <div>
                  <h3 className="font-semibold mb-3 text-slate-800">Brand</h3>
                  <div className="space-y-2">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center text-slate-600">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          checked={localFilters.brand?.includes(brand) || false}
                          onChange={() => handleCheckboxChange('brand', brand)}
                        />
                        <span className="ml-3">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Color Filter */}
                <div>
                  <h3 className="font-semibold mb-3 text-slate-800">Color</h3>
                  <div className="space-y-2">
                    {availableColors.map(color => (
                      <label key={color} className="flex items-center text-slate-600">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          checked={localFilters.color?.includes(color) || false}
                          onChange={() => handleCheckboxChange('color', color)}
                        />
                        <span className="ml-3">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-slate-50">
                <Button className="w-full bg-teal-600 hover:bg-teal-700" size="lg" onClick={handleApply}>Apply Filters</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};