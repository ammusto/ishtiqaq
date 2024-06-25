import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SearchForm from './SearchForm';
import Results from './Results';
import About from './About';
import './Main.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [queryDisplay, setQueryDisplay] = useState('');
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState([]);
  const [hwIndex, setHwIndex] = useState({});
  const [sgIndex, setSgIndex] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = useMemo(() => 5, []);
  const [noResults, setNoResults] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/db_files/index.txt`)
      .then(response => response.text())
      .then(text => {
        const parsedIndex = text.trim().split('\n').map(line => {
          const [file, firstWord, lastWord] = line.split(',');
          return { file, firstWord, lastWord };
        });
        setIndex(parsedIndex);
      });

    loadIndex(`${process.env.PUBLIC_URL}/indices/hw.txt`, setHwIndex);
    loadIndex(`${process.env.PUBLIC_URL}/indices/sg.txt`, setSgIndex);
  }, [loadIndex]);

  const loadIndex = useCallback((filePath, setState) => {
    fetch(filePath)
      .then(response => response.text())
      .then(text => {
        const parsedIndex = text.split('\n').reduce((acc, line) => {
          const [page, root] = line.split('=');
          if (!acc[root]) {
            acc[root] = parseInt(page, 10);
          }
          return acc;
        }, {});
        setState(parsedIndex);
      });
  }, []);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = useMemo(() => results.slice(indexOfFirstResult, indexOfLastResult), [results, indexOfFirstResult, indexOfLastResult]);
  const totalPages = useMemo(() => Math.ceil(results.length / resultsPerPage), [results, resultsPerPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSearchExecuted = useCallback(() => {
    setSearchExecuted(true);
    setLoading(false);
  }, []);

  const pagination = useMemo(() => {
    if (results.length > resultsPerPage) {
      return (
        <div className="pagination">
          <span className='pages-text'>Pages:</span>
          {[...Array(totalPages).keys()].map(page => (
            page + 1 === currentPage ? (
              <span key={page} className="current-page">{page + 1}</span>
            ) : (
              <button key={page} onClick={() => handlePageChange(page + 1)}>{page + 1}</button>
            )
          ))}
          <div>{results.length} Results</div>
        </div>
      );
    }
  }, [totalPages, currentPage, results.length, resultsPerPage, handlePageChange]);

  return (
    <Router>
      <div className='container'>
        <div className="main">
          <h1>Ishtiqāq</h1>
          <nav className="navbar">
            <ul className="nav-links">
              <li><Link to="/">Search</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={
              <>
                <SearchForm
                  query={query}
                  setQuery={setQuery}
                  setQueryDisplay={setQueryDisplay}
                  setResults={setResults}
                  setCurrentPage={setCurrentPage}
                  index={index}
                  setNoResults={setNoResults}
                  handleSearchExecuted={handleSearchExecuted}
                  setLoading={setLoading}
                />
                <Results
                  currentResults={currentResults}
                  hwIndex={hwIndex}
                  sgIndex={sgIndex}
                  queryDisplay={queryDisplay}
                  noResults={noResults}
                  searchExecuted={searchExecuted}
                  loading={loading}
                />
                {pagination}
              </>
            } />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
