import React, { useState } from 'react';
import { SearchParams } from '../types';

interface SearchBarProps {
  initialTitle?: string;
  initialOwner?: string;
  onSearch: (params: SearchParams) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialTitle = '', 
  initialOwner = '', 
  onSearch 
}) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [owner, setOwner] = useState<string>(initialOwner);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSearch({ title, owner });
  };

  const handleClear = (): void => {
    setTitle('');
    setOwner('');
    onSearch({ title: '', owner: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <div className="md:flex md:space-x-4">
          <div className="mb-4 md:mb-0 md:flex-1">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Search by title..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4 md:mb-0 md:flex-1">
            <label htmlFor="owner" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Producer
            </label>
            <input
              type="text"
              id="owner"
              value={owner}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOwner(e.target.value)}
              placeholder="Search by producer..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Search
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;