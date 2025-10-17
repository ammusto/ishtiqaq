import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchForm from './SearchForm';
import Results from './Results';
import About from './About';
import HowTo from './HowTo';
import Pagination from './Pagination';
import Clexica from './Clexica';
import Layout from './Layout';

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

  const loadIndex = useCallback((filePath, setState, indexName) => {
    console.log(`Starting to load ${indexName} from ${filePath}`);
    
    fetch(filePath)
      .then(response => {
        console.log(`${indexName} fetch response status: ${response.status}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${indexName}: ${response.statusText}`);
        }
        return response.text();
      })
      .then(text => {
        console.log(`${indexName} raw text length: ${text.length}`);
        console.log(`${indexName} first 200 chars:`, text.substring(0, 200));
        
        const parsedIndex = text.split('\n').reduce((acc, line) => {
          if (line.trim()) { // Only process non-empty lines
            const [page, root] = line.split('=');
            if (page && root && !acc[root.trim()]) {
              acc[root.trim()] = parseInt(page, 10);
            }
          }
          return acc;
        }, {});
        
        console.log(`${indexName} parsed entries: ${Object.keys(parsedIndex).length}`);
        console.log(`${indexName} sample entries:`, Object.entries(parsedIndex).slice(0, 5));
        
        setState(parsedIndex);
      })
      .catch(error => {
        console.error(`Error loading ${indexName}:`, error);
      });
  }, []);

  const loadDefinitions = useCallback((filePath, setState) => {
    console.log(`Starting to load definitions from ${filePath}`);
    fetch(filePath)
      .then(response => {
        console.log(`Definitions fetch response status: ${response.status}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch definitions: ${response.statusText}`);
        }
        return response.text();
      })
      .then(text => {
        console.log(`Definitions raw text length: ${text.length}`);
        const parsedDefinitions = text.split('\n').reduce((acc, line) => {
          if (line.trim()) {
            const [rootPart, definitionsPart] = line.split('~', 2);
            if (rootPart && definitionsPart) {
              const root = rootPart.trim();
              const definitions = definitionsPart.split(';').map(definition => definition.trim());
              acc[root] = definitions;
            }
          }
          return acc;
        }, {});
        console.log(`Definitions parsed entries: ${Object.keys(parsedDefinitions).length}`);
        setState(parsedDefinitions);
      })
      .catch(error => {
        console.error(`Error loading definitions:`, error);
      });
  }, []);

  useEffect(() => {
    console.log("Starting to load all indices...");
    
    fetch(`${process.env.PUBLIC_URL}/db_files/index.txt`)
      .then(response => response.text())
      .then(text => {
        const parsedIndex = text.trim().split('\n').map(line => {
          const [file, firstWord, lastWord] = line.split(',');
          return { file, firstWord, lastWord };
        });
        setIndex(parsedIndex);
      });

    loadIndex(`${process.env.PUBLIC_URL}/indices/hw.txt`, setHwIndex, 'hw');
    loadIndex(`${process.env.PUBLIC_URL}/indices/sg.txt`, setSgIndex, 'sg');
    loadIndex(`${process.env.PUBLIC_URL}/indices/ll.txt`, setLlIndex, 'll');
    loadIndex(`${process.env.PUBLIC_URL}/indices/ls.txt`, setLsIndex, 'ls');
    loadIndex(`${process.env.PUBLIC_URL}/indices/ha.txt`, setHaIndex, 'ha');
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
      <Layout>
        <div className='container'>
          <div className="main">
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
      </Layout>
    </Router>
  );
};

export default App;