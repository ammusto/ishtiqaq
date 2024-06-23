import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import Results from './Results';
import './Main.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState([]);
  const [hwIndex, setHwIndex] = useState({});
  const [sgIndex, setSgIndex] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(25);
  const [noResults, setNoResults] = useState(false); // Add noResults state

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

  return (
    <div className='container'>
      <div className="main">
        <h1>Ishtiqāq</h1>
        <SearchForm
          query={query}
          setQuery={setQuery}
          setResults={setResults}
          setCurrentPage={setCurrentPage}
          index={index}
          setNoResults={setNoResults} // Pass setNoResults to SearchForm
        />
        <Results
          currentResults={currentResults}
          hwIndex={hwIndex}
          sgIndex={sgIndex}
          query={query} // Pass the query term to Results
          noResults={noResults} // Pass noResults state to Results
        />
        {results.length > resultsPerPage && (
          <div className="pagination">
            {[...Array(totalPages).keys()].map(page => (
              <button key={page} onClick={() => handlePageChange(page + 1)}>
                {page + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
