import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Pagination.css';

const Pagination = ({ totalPages, currentPage, setCurrentPage, resultsLength, resultsPerPage }) => {
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, [setCurrentPage]);

    const pagination = useMemo(() => {
        if (resultsLength > resultsPerPage) {
            return (
                <div className="pagination">
                    <div className='pagination-nav-container'>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                    <div>
                    <span className='pages-text'>Pages:</span>

                    {[...Array(totalPages).keys()].map(page => (
                        page + 1 === currentPage ? (
                            <span key={page} className="current-page">{page + 1}</span>
                        ) : (
                            <button key={page} onClick={() => handlePageChange(page + 1)}>{page + 1}</button>
                        )
                    ))}

                    <div>{resultsLength} Results</div>
                    </div>
                </div>
            );
        }
        return null;
    }, [totalPages, currentPage, resultsLength, resultsPerPage, handlePageChange]);

    return pagination;
};

Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    resultsLength: PropTypes.number.isRequired,
    resultsPerPage: PropTypes.number.isRequired,
};

export default Pagination;
