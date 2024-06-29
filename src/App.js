import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SearchForm from './SearchForm';
import Results from './Results';
import About from './About';
import HowTo from './HowTo';
import Pagination from './Pagination';
import Clexica from './Clexica';

const App = () => {
  const [query, setQuery] = useState('');
  const [queryDisplay, setQueryDisplay] = useState('');
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState([]);
  const [llIndex, setLlIndex] = useState({});
  const [lsIndex, setLsIndex] = useState({});
  const [hwIndex, setHwIndex] = useState({});
  const [sgIndex, setSgIndex] = useState({});
  const [haIndex, setHaIndex] = useState({});
  const [rootDefinitionList, setRootDefinitionList] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = useMemo(() => 4, []);
  const [noResults, setNoResults] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const loadDefinitions = useCallback((filePath, setState) => {
    fetch(filePath)
      .then(response => response.text())
      .then(text => {
        const parsedDefinitions = text.split('\n').reduce((acc, line) => {
          const [rootPart, definitionsPart] = line.split('~', 2);
          const root = rootPart.trim();
          const definitions = definitionsPart.split(';').map(definition => definition.trim());
          acc[root] = definitions;
          return acc;
        }, {});
        setState(parsedDefinitions);
      });
  }, []);
  
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
    loadIndex(`${process.env.PUBLIC_URL}/indices/ll.txt`, setLlIndex);
    loadIndex(`${process.env.PUBLIC_URL}/indices/ls.txt`, setLsIndex);
    loadIndex(`${process.env.PUBLIC_URL}/indices/ha.txt`, setHaIndex);
    loadDefinitions(`${process.env.PUBLIC_URL}/db_files/root_definitions.txt`, setRootDefinitionList);

  }, [loadIndex, loadDefinitions]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = useMemo(() => results.slice(indexOfFirstResult, indexOfLastResult), [results, indexOfFirstResult, indexOfLastResult]);
  const totalPages = useMemo(() => Math.ceil(results.length / resultsPerPage), [results, resultsPerPage]);

  const handleSearchExecuted = useCallback(() => {
    setSearchExecuted(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
      } else if (event.key === 'ArrowRight' && currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentPage, totalPages]);

  return (
    <Router>
      <div className='container'>
        <div className="main">
          <h1><a href="http://ishtiqaq.pages.dev" className='main-link'>Ishtiqāq</a></h1>
          <nav className="navbar">
            <ul className="nav-links flex m0">
              <li><Link to="/">Search</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/howto">How To Use</Link></li>
              <li><a href="https://github.com/ammusto/ishtiqaq" target="_blank" rel="noopener noreferrer">GitHub</a></li>
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
                  queryDisplay={queryDisplay}
                  llIndex={llIndex}
                  lsIndex={lsIndex}
                  hwIndex={hwIndex}
                  sgIndex={sgIndex}
                  haIndex={haIndex}
                  rootDefinitionList={rootDefinitionList}
                  noResults={noResults}
                  searchExecuted={searchExecuted}
                  loading={loading}
                />
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  resultsLength={results.length}
                  resultsPerPage={resultsPerPage}
                />
              </>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/howto" element={<HowTo />} />
            <Route path="/clexica/:dict?/:query" element={<Clexica />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
