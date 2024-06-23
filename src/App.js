// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SearchForm from './SearchForm';
import Results from './Results';
import About from './About';
import './Main.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState([]);
  const [hwIndex, setHwIndex] = useState({});
  const [sgIndex, setSgIndex] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);
  const [noResults, setNoResults] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [loading, setLoading] = useState(false);
  console.count("App");

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
  }, []);

  const loadIndex = (filePath, setState) => {
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
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(results.length / resultsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchExecuted = () => {
    setSearchExecuted(true);
    setLoading(false);
  };

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
                  query={query}
                  noResults={noResults}
                  searchExecuted={searchExecuted}
                  loading={loading}
                />
                {results.length > resultsPerPage && (
                  <div className="pagination">
                    <span className='pages-text'>
                      Pages:
                    </span>
                    {[...Array(totalPages).keys()].map(page => (
                      page + 1 === currentPage ? (
                        <span key={page} className="current-page">
                          {page + 1}
                        </span>
                      ) : (
                        <button key={page} onClick={() => handlePageChange(page + 1)}>
                          {page + 1}
                        </button>
                      )
                    ))}
                    <div>
                      {results.length} Results
                    </div>
                  </div>
                )}
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
