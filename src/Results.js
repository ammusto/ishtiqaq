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
      <div id="results p10 m-auto">
        <div className='search-result flex'>
          <div className='word-result p10 flex'>
            <div><span className='arabic-font'>{queryDisplay}</span></div>
            <div className='alphabetical-result'>
              <div>
                <a className='result-link p5' href={`https://ejtaal.net/aa/#hw4=${DataLoader.findPage(queryDisplay, 'hw', hwIndex)}`} target="_blank" rel="noopener noreferrer">HW(a)</a>/
                <a className='result-link p5' href={`https://ejtaal.net/aa/#sg=${DataLoader.findPage(queryDisplay, 'sg', sgIndex)}`} target="_blank" rel="noopener noreferrer"> SG(a)</a>
                
              </div>
            </div>
          </div>
          <div className='root-result-list p10 flex'>
            <div className='root-result flex'>
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
    return bRoots - aRoots;
  });

  return (
    <div id="results p10 m-auto">
      {sortedResults.map((result, idx) => (
        <ResultItem key={idx} result={result} hwIndex={hwIndex} sgIndex={sgIndex} llIndex={llIndex} rootDefinitionList={rootDefinitionList} lsIndex={lsIndex} haIndex={haIndex} queryDisplay={queryDisplay} />
      ))}
    </div>
  );
});

export default Results;
