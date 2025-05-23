import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ContributionCard from '../components/ContributionCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { Contribution, ContributionsResponse, SearchParams } from '../types';

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContributions, setTotalContributions] = useState<number>(0);

  // Get search params or use defaults
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchTitle = searchParams.get('title') || '';
  const searchOwner = searchParams.get('owner') || '';
  const limit = 14; // Show 14 contributions per page

  useEffect(() => {
    const fetchContributions = async (): Promise<void> => {
      try {
        setLoading(true);

        // Calculate skip for pagination
        const skip = (currentPage - 1) * limit;

        // Build query parameters
        const params: Record<string, string | number> = { skip, limit };
        if (searchTitle) params.title = searchTitle;
        if (searchOwner) params.owner = searchOwner;

        const response = await axios.get<ContributionsResponse>('/contributions', { params });
        setContributions(response.data.contributions);
        setTotalContributions(response.data.total);
        setError(null);
      } catch (err) {
        console.error('Error fetching contributions:', err);
        setError('Failed to fetch contributions. Please try again later.');
        setContributions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [currentPage, searchTitle, searchOwner, limit]);

  // Handle search submission
  const handleSearch = (searchData: SearchParams): void => {
    const newParams: Record<string, string> = { page: '1' };
    if (searchData.title) newParams.title = searchData.title;
    if (searchData.owner) newParams.owner = searchData.owner;
    setSearchParams(newParams);
  };

  // Handle page change
  const handlePageChange = (newPage: number): void => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: newPage.toString()
    });
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalContributions / limit);

  return (
    <div>
      <SearchBar 
        initialTitle={searchTitle}
        initialOwner={searchOwner}
        onSearch={handleSearch}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div data-testid="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mt-4">
          {error}
        </div>
      ) : contributions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No contributions found matching your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {contributions.map(contribution => (
              <ContributionCard key={contribution.id} contribution={contribution} />
            ))}
          </div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;
