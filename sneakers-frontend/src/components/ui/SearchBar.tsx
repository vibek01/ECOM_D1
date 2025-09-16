import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to a search results page, passing the query as a URL parameter
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xs">
      <Input
        type="search"
        placeholder="Search for sneakers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-12" // Add padding to the right for the button
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute inset-y-0 right-0"
        aria-label="Submit search"
      >
        <Search className="h-5 w-5 text-slate-500" />
      </Button>
    </form>
  );
};