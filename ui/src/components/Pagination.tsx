import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null; // Do not render pagination if there's only one page

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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

            {/* Page Numbers */}
            {pageNumbers.map((page) => (
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
            ))}

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