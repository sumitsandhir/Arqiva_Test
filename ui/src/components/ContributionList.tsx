/**
 * ContributionsList Component
 * 
 * Alternative implementation of the contributions list that directly fetches data from the API.
 * Provides a paginated list of contributions with error handling.
 * This component is used in the /contributions route as an alternative to HomePage.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Contribution } from '../types';
import Pagination from './Pagination';
import axios from 'axios';

const ContributionsList: React.FC = () => {
    /**
     * State management for the component
     * - contributions: Array of contribution objects to display
     * - currentPage: Current page number for pagination
     * - itemsPerPage: Number of items to display per page (fixed at 14)
     * - totalItems: Total number of contributions available from the API
     */
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
    const [itemsPerPage] = useState(14); // Number of items per page
    const [totalItems, setTotalItems] = useState(0); // Total number of contributions

    /**
     * Calculate total pages for pagination
     * Based on total items and items per page
     */
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    /**
     * Fetch contributions from the API
     * Memoized with useCallback to prevent unnecessary re-renders
     * Includes error handling for API failures
     */
    const fetchContributions = useCallback(async () => {
        try {
            // Make API request with pagination parameters
            const response = await axios.get('http://127.0.0.1:8000/contributions/', {
                params: {
                    page: currentPage,
                    limit: itemsPerPage, // Ensure the backend accepts a `limit`
                },
            });

            // Update state with response data
            setContributions(response.data.contributions); // Update contributions
            setTotalItems(response.data.totalItems || response.data.total); // Use totalItems or fall back to total
        } catch (error) {
            console.error('Error fetching contributions:', error);
        }
    }, [currentPage, itemsPerPage]);

    /**
     * Effect hook to fetch contributions when component mounts or dependencies change
     * Re-fetches data when currentPage changes or fetchContributions function changes
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchContributions(); // Await the promise here
            } catch (error) {
                console.error("Error fetching contributions:", error); // Handle errors
            }
        };

        fetchData(); // Call the async function
    }, [currentPage, fetchContributions]);
    return (
        <div>
            {/* Contributions Grid */}
            <div className="contributions-grid">
                {contributions.map((contribution) => (
                    <div key={contribution.id} className="contribution-card">
                        <h3>{contribution.title}</h3>
                        {/* Add additional contribution details here */}
                    </div>
                ))}
            </div>

            {/* Pagination Component */}
            <Pagination
                currentPage={currentPage} // Pass current page state
                totalPages={totalPages} // Pass calculated total pages
                onPageChange={(page: number) => setCurrentPage(page)} // Update current page
            />
        </div>
    );
};

export default ContributionsList;
