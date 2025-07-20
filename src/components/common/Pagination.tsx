import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import React from 'react';

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

interface PaginationProps {
  pagination: PaginationData | null;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ 
  pagination, 
  onPageChange, 
  className = "" 
}) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (hasPrevPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className={`flex items-center justify-center space-x-1 ${className}`} aria-label="Pagination">
      <button
        onClick={handlePrevious}
        disabled={!hasPrevPage}
        className={`
          p-2 rounded-md transition-colors duration-200
          ${hasPrevPage 
            ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
            : 'text-gray-300 cursor-not-allowed'
          }
        `}
        aria-label="Previous page"
      >
        <RiArrowLeftSLine size={20} />
      </button>

      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => handlePageClick(page)}
                className={`
                  px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                  ${page === currentPage
                    ? 'bg-green-primary text-black'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!hasNextPage}
        className={`
          p-2 rounded-md transition-colors duration-200
          ${hasNextPage 
            ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
            : 'text-gray-300 cursor-not-allowed'
          }
        `}
        aria-label="Next page"
      >
        <RiArrowRightSLine size={20} />
      </button>
    </nav>
  );
};

export default Pagination