import React, { memo, useCallback } from 'react';
import DataLoader from './DataLoader';
import ResultItem from './ResultItem';
import { Link } from 'react-router-dom';

import './Results.css';

const Results = memo(({ currentResults, hwIndex, sgIndex, llIndex, lsIndex, haIndex, queryDisplay, noResults, searchExecuted, loading, rootDefinitionList }) => {

  const wordLinks = useCallback((term) => {
    return {
      hw: DataLoader.findPage(term, 'hw', hwIndex),
      sg: DataLoader.findPage(term, 'sg', sgIndex),
      ll: DataLoader.findPage(term, 'll', llIndex),
      ls: DataLoader.findPage(term, 'ls', lsIndex),
      ha: DataLoader.findPage(term, 'ha', haIndex),
    };
  }, [hwIndex, sgIndex, llIndex, lsIndex, haIndex]);

  const rootLinksResult = wordLinks(queryDisplay);


  if (loading) {
    return <p>Loading...</p>;
  }

  if (noResults && searchExecuted) {
    return (
      <div id="results" className="p10 m-auto">
        <div className='search-result flex'>
          <div className='word-result p10 flex'>
            <div><span className='arabic-font'>{queryDisplay}</span></div>
            <div className='alphabetical-result'>
              <div>
                <a className='result-link p5' href={`https://ejtaal.net/aa/#hw4=${rootLinksResult.hw},sg=${rootLinksResult.sg},ll=${rootLinksResult.ll},ls=${rootLinksResult.ls},ha=${rootLinksResult.ha}`} target="_blank" rel="noopener noreferrer">HW(a)</a>/
                <a className='result-link p5' href={`https://ejtaal.net/aa/#sg=${rootLinksResult.sg},hw4=${rootLinksResult.hw},ll=${rootLinksResult.ll},ls=${rootLinksResult.ls},ha=${rootLinksResult.ha}`} target="_blank" rel="noopener noreferrer">SG(a)</a>/
                <a className='result-link p5' href={`https://ejtaal.net/aa/#ll=${rootLinksResult.ll},ls=${rootLinksResult.ls},hw4=${rootLinksResult.hw},sg=${rootLinksResult.sg},ha=${rootLinksResult.ha}`} target="_blank" rel="noopener noreferrer">LL(a)</a>/
                <a className='result-link p5' href={`https://ejtaal.net/aa/#ha=${rootLinksResult.ha},hw4=${rootLinksResult.hw},sg=${rootLinksResult.sg},ll=${rootLinksResult.ll},ls=${rootLinksResult.ls}`} target="_blank" rel="noopener noreferrer">HA(a)</a>/
                <Link className='result-link' to={`/clexica/${queryDisplay}`}> CL(a)</Link>
              </div>
            </div>
          </div>
          <div className='root-result-list p10 flex'>
            <div className='root-result flex'>
              <p><strong>No Root Found in Quick Lookup.</strong></p>
              <p>Please check the alphabetical lexica look up links to the left.</p>
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
    <>
      <div id="results" className="p10 m-auto">
        {sortedResults.map((result, idx) => (
          <ResultItem key={idx} result={result} hwIndex={hwIndex} sgIndex={sgIndex} llIndex={llIndex} rootDefinitionList={rootDefinitionList} lsIndex={lsIndex} haIndex={haIndex} queryDisplay={queryDisplay} />
        ))}
      </div>
      <div id="results" className="p10 m-auto">
      </div>
    </>

  );
});

export default Results;
