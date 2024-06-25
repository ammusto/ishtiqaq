import React, { memo } from 'react';
import DataLoader from './DataLoader';
import ResultItem from './ResultItem';
import './Results.css';

const Results = memo(({ currentResults, hwIndex, sgIndex, llIndex, lsIndex, haIndex, queryDisplay, noResults, searchExecuted, loading, rootDefinitionList }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (noResults && searchExecuted) {
    return (
      <div id="results">
        <div className='search-result'>
          <div className='word-result'>
            <div><span className='arabic-font'>{queryDisplay}</span></div>
            <div className='alphabetical-result'>
              <div>
                <a className='result-link' href={`https://ejtaal.net/aa/#hw4=${DataLoader.findPageImage(queryDisplay, 'hw', hwIndex)}`} target="_blank" rel="noopener noreferrer">HW(a)</a>/
                <a className='result-link' href={`https://ejtaal.net/aa/#sg=${DataLoader.findPageImage(queryDisplay, 'sg', sgIndex)}`} target="_blank" rel="noopener noreferrer"> SG(a)</a>
              </div>
            </div>
          </div>
          <div className='root-result-list'>
            <div className='root-result'>
              <strong>No Root Found</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (searchExecuted && currentResults.length === 0) {
    return <p>No matches found</p>;
  }

  const sortedResults = currentResults.sort((a, b) => {
    const aRoots = a.split('#')[1].split(',').length;
    const bRoots = b.split('#')[1].split(',').length;
    return bRoots - aRoots; // Sort in descending order
  });

  return (
    <div id="results">
      {sortedResults.map((result, idx) => (
        <ResultItem key={idx} result={result} hwIndex={hwIndex} sgIndex={sgIndex} llIndex={llIndex} rootDefinitionList={rootDefinitionList} lsIndex={lsIndex} haIndex={haIndex} queryDisplay={queryDisplay} />
      ))}
    </div>
  );
});

export default Results;
