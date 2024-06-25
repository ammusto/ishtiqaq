import React, { memo } from 'react';
import DataLoader from './DataLoader';
import './Results.css';

const ResultItem = memo(({ result, hwIndex, sgIndex, llIndex, lsIndex, haIndex }) => {
  const [word, roots] = result.split('#');
  const rootList = roots.split(',');

  return (
    <div className='search-result'>
      <div className='word-result'><div><span className='arabic-font'>{word}</span></div>
        <div className='alphabetical-result'>
          <div>
            <a className='result-link' href={`https://ejtaal.net/aa/#hw4=${DataLoader.findPageImage(word, 'hw', hwIndex)}`} target="_blank" rel="noopener noreferrer">HW(a)</a>/
            <a className='result-link' href={`https://ejtaal.net/aa/#sg=${DataLoader.findPageImage(word, 'sg', sgIndex)}`} target="_blank" rel="noopener noreferrer">SG(a)</a>
          </div>
        </div>
      </div>
      <div className='root-result-list'>
        {rootList.map((root, rIdx) => (
          <div key={rIdx} className='root-result'>
            <strong>Root:</strong> <span className='arabic-font'>{root}</span>
            <div className='result-link-container'>
              <a className='result-link' href={`https://ejtaal.net/aa/#hw4=${DataLoader.findPageImage(root, 'hw', hwIndex)}`} target="_blank" rel="noopener noreferrer">HW</a>/
              <a className='result-link' href={`https://ejtaal.net/aa/#sg=${DataLoader.findPageImage(root, 'sg', sgIndex)}`} target="_blank" rel="noopener noreferrer">SG</a>/
              <a className='result-link' href={`https://ejtaal.net/aa/#ll=${DataLoader.findPageImage(root, 'll', llIndex)},ls=${DataLoader.findPageImage(root, 'ls', lsIndex)}`} target="_blank" rel="noopener noreferrer">LL</a>/
              <a className='result-link' href={`https://ejtaal.net/aa/#ha=${DataLoader.findPageImage(root, 'ha', haIndex)}`} target="_blank" rel="noopener noreferrer">HA</a>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const Results = memo(({ currentResults, hwIndex, sgIndex, llIndex, lsIndex, haIndex, queryDisplay, noResults, searchExecuted, loading }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (noResults && searchExecuted) {
    return (
      <div id="results">

        <div className='search-result'>
          <div className='word-result'>
            <div><span className='arabic-font'>{queryDisplay}</span>
            </div>
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

  return (
    <div id="results">
      {currentResults.map((result, idx) => (
        <ResultItem key={idx} result={result} hwIndex={hwIndex} sgIndex={sgIndex} llIndex={llIndex} lsIndex={lsIndex} haIndex={haIndex} queryDisplay={queryDisplay} />
      ))}
    </div>
  );
});

export default Results;