import React, { memo } from 'react';
import DataLoader from './DataLoader';
import './Results.css';
console.count("Results")

const ResultItem = memo(({ result, hwIndex, sgIndex, query }) => {
  const [word, roots] = result.split('#');
  const rootList = roots.split(',');
  return (
    <div className='search-result'>
      <div className='word-result'><div>{word}</div>
      <div className='alphabetical-result'>
            <div>
              <a className='result-link' href={DataLoader.findPageImage(word, 'hw', hwIndex)} target="_blank" rel="noopener noreferrer">HW(a)</a>/
              <a className='result-link' href={DataLoader.findPageImage(word, 'sg', sgIndex)} target="_blank" rel="noopener noreferrer">SG(a)</a>
            </div>
          </div>
      </div>
      <div className='root-result-list'>
        {rootList.map((root, rIdx) => (
          <div key={rIdx} className='root-result'>
            <strong>Root:</strong> {root}
            <div className='result-link-container'>
              <a className='result-link' href={DataLoader.findPageImage(root, 'hw', hwIndex)} target="_blank" rel="noopener noreferrer">HW</a>/
              <a className='result-link' href={DataLoader.findPageImage(root, 'sg', sgIndex)} target="_blank" rel="noopener noreferrer">SG</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const Results = memo(({ currentResults, hwIndex, sgIndex, query, noResults, searchExecuted, loading }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (noResults && searchExecuted) {
    return (
      <div className='search-result'>
        <div className='word-result'>
          <div>{query}
          </div>
          <div className='alphabetical-result'>
            <div>
              <a className='result-link' href={DataLoader.findPageImage(query, 'hw', hwIndex)} target="_blank" rel="noopener noreferrer">HW(a)</a>/
              <a className='result-link' href={DataLoader.findPageImage(query, 'sg', sgIndex)} target="_blank" rel="noopener noreferrer"> SG(a)</a>
            </div>
          </div>
        </div>
        <div className='root-result-list'>
          <div className='root-result'>
            <strong>No Root Found</strong>
          </div>
        </div>
      </div>
    );
  }

  if (searchExecuted && currentResults.length === 0) {
    return <p>No matches found</p>;
  }

  return (
    <div id="results">
      {currentResults.map((result, idx) => (
        <ResultItem key={idx} result={result} hwIndex={hwIndex} sgIndex={sgIndex} query={query} />
      ))}
    </div>
  );
});

export default Results;