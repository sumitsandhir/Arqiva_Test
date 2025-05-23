import React, { useState, useEffect } from 'react';
import { Contribution } from '../types';
import Pagination from './Pagination';
import axios from 'axios';

const ContributionsList: React.FC = () => {
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
    const [itemsPerPage] = useState(14); // Number of items per page
    const [totalItems, setTotalItems] = useState(0); // Total number of contributions

    const fetchContributions = async () => {
        const skip = (currentPage - 1) * itemsPerPage;
        const limit = itemsPerPage;

        try {
            const response = await axios.get('http://127.0.0.1:8000/contributions/', {
                params: { skip, limit },
            });

            setContributions(response.data.contributions);
            setTotalItems(response.data.total);
        } catch (error) {
            console.error('Error fetching contributions:', error);
        }
    };

    // Re-fetch contributions whenever the current page changes
    useEffect(() => {
        fetchContributions();
    }, [currentPage]);

    const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages

    return (
        <div>
            <div className="contributions-grid">
                {contributions.map((contribution) => (
                    <div key={contribution.id} className="contribution-card">
                        <h3>{contribution.title}</h3>
                        {/* Display other contribution details */}
                    </div>
                ))}
            </div>

            {/* Render Pagination */}
            <Pagination
                currentPage={currentPage} // Pass current page
                totalPages={totalPages} // Pass total number of pages
                onPageChange={(page: number) => {
                    console.log('Changing to page:', page); // Debugging log
                    setCurrentPage(page); // Update current page
                }}
            />
        </div>
    );
};

export default ContributionsList;