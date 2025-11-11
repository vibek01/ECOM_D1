import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Button } from '../common/Button';
import { motion } from 'framer-motion';

// Define the specific types the component will use. This is the key to the fix.
type ViewMode = 'grid' | 'list';
type SortKey = 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';

interface ProductToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  // FIX: These props now use the specific 'SortKey' type instead of 'string'.
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  onFilterClick: () => void;
}

export const ProductToolbar = ({
  query, onQueryChange, view, onViewChange, sort, onSortChange, onFilterClick
}: ProductToolbarProps) => {
  return (
    <div className="sticky top-20 z-30 mt-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white/60 p-4 shadow-lg backdrop-blur-md">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search sneakers..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button 
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700" 
            onClick={onFilterClick}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>

          <div className="flex rounded-lg bg-slate-100 p-0.5">
            <button onClick={() => onViewChange('grid')} className="relative p-2 transition-colors">
              <LayoutGrid className={`h-5 w-5 ${view === 'grid' ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'}`} />
              {view === 'grid' && <motion.div className="absolute inset-0 z-0 rounded-md bg-white shadow" layoutId="view-toggle" />}
            </button>
            <button onClick={() => onViewChange('list')} className="relative p-2 transition-colors">
              <List className={`h-5 w-5 ${view === 'list' ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'}`} />
              {view === 'list' && <motion.div className="absolute inset-0 z-0 rounded-md bg-white shadow" layoutId="view-toggle" />}
            </button>
          </div>

          <select
            value={sort}
            // FIX: We cast the event value to 'SortKey' because we know our <option> values are valid.
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="relevance">Relevance</option>
            <option value="priceAsc">Price: Low-High</option>
            <option value="priceDesc">Price: High-Low</option>
            <option value="nameAsc">Name: A-Z</option>
            <option value="nameDesc">Name: Z-A</option> {/* Added missing option */}
          </select>
        </div>
      </div>
    </div>
  );
};