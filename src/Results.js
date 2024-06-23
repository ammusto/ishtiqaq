import React from 'react';
import DataLoader from './DataLoader';
import './Results.css';

const Results = ({ currentResults, hwIndex, sgIndex, query, noResults }) => {
  return (
    <div id="results">
      {noResults ? (
        <div className='search-result'>
          <p>Term Not Found Via Root</p>
          <div><a href={DataLoader.findPageImage(query, 'hw', hwIndex)} target="_blank">HW(a)</a></div>
          <div><a href={DataLoader.findPageImage(query, 'sg', sgIndex)} target="_blank">SG(a)</a></div>
        </div>
      ) : (
        currentResults.length === 0 ? <p>No matches found</p> : currentResults.map((result, idx) => {
          const [word, roots] = result.split('#');
          const rootList = roots.split(',');
          return (
            <div key={idx} className='search-result'>
              <div className='word-result'>
                {word}
                </div>
              <div className='root-result-list'>
              {rootList.map((root, rIdx) => (
                <div key={rIdx} className='root-result'>
                  <strong>Root:</strong> {root}
                  <div className='hw-result'><a href={DataLoader.findPageImage(root, 'hw', hwIndex)} target="_blank" rel="noopener noreferrer">HW</a>/<a href={DataLoader.findPageImage(query, 'hw', hwIndex)} target="_blank">HW(a)</a></div>

                  <div className='sg-result'><a href={DataLoader.findPageImage(root, 'sg', sgIndex)} target="_blank" rel="noopener noreferrer">SG</a>/<a href={DataLoader.findPageImage(query, 'sg', sgIndex)} target="_blank">SG(a)</a></div>
                </div>
              ))}
            </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Results;
