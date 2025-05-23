/**
 * Pagination Component
 * 
 * Provides navigation controls for paginated content.
 * Displays numbered buttons for each page and previous/next buttons.
 * Handles disabled states for previous/next buttons when at first/last page.
 * Doesn't render anything if there's only one page.
 */
import React from 'react';

/**
 * Props for the Pagination component
 */
interface PaginationProps {
    currentPage: number;       // Current active page
    totalPages: number;        // Total number of pages
    onPageChange: (page: number) => void;  // Callback when page is changed
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // Don't render pagination if there's only one page
    if (totalPages <= 1) return null;

    /**
     * Generate page numbers with ellipsis for large number of pages
     * - For small page counts (≤ 7), show all pages
     * - For large page counts, show first, last, and pages around current with ellipsis
     * 
     * Ellipsis are added in two places:
     * 1. Before the current page group (if current page > 3)
     * 2. After the current page group (if current page < totalPages - 2)
     * 
     * This creates a pattern like: 1 ... 7 8 9 ... 15
     */
    const renderPageNumbers = () => {
        // For small number of pages, show all page numbers without ellipsis
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 text-sm font-medium border rounded-md ${
                        page === currentPage
                            ? 'text-white bg-blue-500 border-blue-500'
                            : 'text-gray-900 bg-white hover:bg-gray-100'
                    }`}
                >
                    {page}
                </button>
            ));
        }

        // For large number of pages, show ellipsis
        const pageItems = [];

        // Always show first page
        pageItems.push(
            <button
                key={1}
                onClick={() => onPageChange(1)}
                className={`px-3 py-2 text-sm font-medium border rounded-md ${
                    1 === currentPage
                        ? 'text-white bg-blue-500 border-blue-500'
                        : 'text-gray-900 bg-white hover:bg-gray-100'
                }`}
            >
                1
            </button>
        );

        // Add ellipsis if needed
        if (currentPage > 3) {
            pageItems.push(
                <span key="ellipsis-1" className="px-3 py-2">...</span>
            );
        }

        // Add pages around current page
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            // Skip if this would create duplicate with first/last page
            if (i === 1 || i === totalPages) continue;

            pageItems.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-3 py-2 text-sm font-medium border rounded-md ${
                        i === currentPage
                            ? 'text-white bg-blue-500 border-blue-500'
                            : 'text-gray-900 bg-white hover:bg-gray-100'
                    }`}
                >
                    {i}
                </button>
            );
        }

        // Add ellipsis if needed
        if (currentPage < totalPages - 2) {
            pageItems.push(
                <span key="ellipsis-2" className="px-3 py-2">...</span>
            );
        }

        // Always show last page if there is more than one page
        pageItems.push(
            <button
                key={totalPages}
                onClick={() => onPageChange(totalPages)}
                className={`px-3 py-2 text-sm font-medium border rounded-md ${
                    totalPages === currentPage
                        ? 'text-white bg-blue-500 border-blue-500'
                        : 'text-gray-900 bg-white hover:bg-gray-100'
                }`}
            >
                {totalPages}
            </button>
        );

        return pageItems;
    };

    return (
        <div className="flex items-center justify-center mt-6 space-x-2">
            {/* Previous Button */}
            <button
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm font-medium border rounded-md ${
                    currentPage === 1
                        ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                        : 'text-gray-900 bg-white hover:bg-gray-100'
                }`}
            >
                Previous
            </button>

            {/* Page Numbers with Ellipsis */}
            {renderPageNumbers()}

            {/* Next Button */}
            <button
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm font-medium border rounded-md ${
                    currentPage === totalPages
                        ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                        : 'text-gray-900 bg-white hover:bg-gray-100'
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
