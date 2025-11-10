import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Button } from '../common/Button';
import { motion } from 'framer-motion';

interface ProductToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  sort: string;
  onSortChange: (sort: string) => void;
  onFilterClick: () => void;
}

export const ProductToolbar = ({
  query, onQueryChange, view, onViewChange, sort, onSortChange, onFilterClick
}: ProductToolbarProps) => {
  return (
    <div className="sticky top-20 z-30 mt-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white/60 p-4 shadow-lg backdrop-blur-md">
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search sneakers..."
            // Accent color on focus ring
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Primary filter button now uses the accent color */}
          <Button 
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700" 
            onClick={onFilterClick}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>

          {/* View Toggle */}
          <div className="flex rounded-lg bg-slate-100 p-0.5">
            <button onClick={() => onViewChange('grid')} className="relative p-2 transition-colors">
              {/* Active state uses accent color */}
              <LayoutGrid className={`h-5 w-5 ${view === 'grid' ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'}`} />
              {view === 'grid' && <motion.div className="absolute inset-0 z-0 rounded-md bg-white shadow" layoutId="view-toggle" />}
            </button>
            <button onClick={() => onViewChange('list')} className="relative p-2 transition-colors">
              {/* Active state uses accent color */}
              <List className={`h-5 w-5 ${view === 'list' ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'}`} />
              {view === 'list' && <motion.div className="absolute inset-0 z-0 rounded-md bg-white shadow" layoutId="view-toggle" />}
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            // Accent color on focus ring
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="relevance">Relevance</option>
            <option value="priceAsc">Price: Low-High</option>
            <option value="priceDesc">Price: High-Low</option>
            <option value="nameAsc">Name: A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
};