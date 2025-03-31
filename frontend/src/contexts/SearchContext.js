import React, { createContext, useContext, useState, useCallback } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    category: '',
    sortBy: 'relevance',
    dateRange: 'all'
  });

  const performSearch = useCallback(async (query, filters = searchFilters) => {
    try {
      setIsSearching(true);
      setSearchQuery(query);
      
      // Here you would typically make an API call to search
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate search results
      const results = [
        { id: 1, title: 'Result 1', description: 'Description 1' },
        { id: 2, title: 'Result 2', description: 'Description 2' },
        // Add more mock results as needed
      ];
      
      setSearchResults(results);
      
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchFilters]);

  const updateFilters = useCallback((newFilters) => {
    setSearchFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    // Re-run search with new filters if there's an active query
    if (searchQuery) {
      performSearch(searchQuery, {
        ...searchFilters,
        ...newFilters
      });
    }
  }, [searchQuery, searchFilters, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchFilters({
      category: '',
      sortBy: 'relevance',
      dateRange: 'all'
    });
    setIsSearching(false);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        isSearching,
        searchFilters,
        performSearch,
        updateFilters,
        clearSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}; 