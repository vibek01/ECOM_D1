import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../common/Button';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterPanel = ({ isOpen, onClose }: FilterPanelProps) => {
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
                <div>
                  <h3 className="font-semibold mb-3 text-slate-800">Category</h3>
                  <div className="space-y-2">
                    {/* Custom styled checkbox with accent color */}
                    <label className="flex items-center text-slate-600">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                      <span className="ml-3">Lifestyle</span>
                    </label>
                    <label className="flex items-center text-slate-600">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                      <span className="ml-3">Running</span>
                    </label>
                    <label className="flex items-center text-slate-600">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                      <span className="ml-3">Basketball</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-slate-800">Price Range</h3>
                  {/* Custom styled range input */}
                  <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                </div>
              </div>

              <div className="p-6 border-t bg-slate-50">
                {/* Apply button uses accent color */}
                <Button className="w-full bg-teal-600 hover:bg-teal-700" size="lg" onClick={onClose}>Apply Filters</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};