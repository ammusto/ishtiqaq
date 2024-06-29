import React, { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

import DataLoader from './DataLoader';
import './Results.css';

const ResultItem = memo(({ result, hwIndex, sgIndex, llIndex, lsIndex, haIndex, rootDefinitionList }) => {
  const [word, roots] = result.split('#');
  const rootList = roots.split(',');

  const wordLinks = useCallback((term) => ({
    hw: DataLoader.findPage(term, 'hw', hwIndex),
    sg: DataLoader.findPage(term, 'sg', sgIndex),
    ll: DataLoader.findPage(term, 'll', llIndex),
    ls: DataLoader.findPage(term, 'ls', lsIndex),
    ha: DataLoader.findPage(term, 'ha', haIndex),
  }), [hwIndex, sgIndex, llIndex, lsIndex, haIndex]);

  const wordLinksResult = useMemo(() => wordLinks(word), [word, wordLinks]);

  const renderRootResult = useCallback((root, rIdx) => {
    const definitions = DataLoader.findDefinition(root, rootDefinitionList);
    const rootLinksResult = wordLinks(root);

    return (
      <div key={rIdx} className='root-result flex'>
         <span className='arabic-font large-font root-display'>{root}</span>
        <div className='m0 p5'>
          <ul>
            {definitions.map((definition, dIdx) => (
              <li key={dIdx}>{definition}</li>
            ))}
          </ul>
        </div>
        <div className='result-link-container'>
          <a className='result-link p5' href={`https://ejtaal.net/aa/#hw4=${rootLinksResult.hw},sg=${rootLinksResult.sg},ll=${rootLinksResult.ll},ls=${rootLinksResult.ls},ha=${rootLinksResult.ha}`} target="_blank" rel="noopener noreferrer">HW</a>/
          <a className='result-link p5' href={`https://ejtaal.net/aa/#sg=${rootLinksResult.sg},hw4=${rootLinksResult.hw},ll=${rootLinksResult.ll},ls=${rootLinksResult.ls},ha=${rootLinksResult.ha}`} target="_blank" rel="noopener noreferrer">SG</a>/
          <a className='result-link p5' href={`https://ejtaal.net/aa/#ll=${rootLinksResult.ll},ls=${rootLinksResult.ls},hw4=${rootLinksResult.hw},sg=${rootLinksResult.sg},ha=${rootLinksResult.ha}`} target="_blank" rel="noopener noreferrer">LL</a>/
          <a className='result-link p5' href={`https://ejtaal.net/aa/#ha=${rootLinksResult.ha},hw4=${rootLinksResult.hw},sg=${rootLinksResult.sg},ll=${rootLinksResult.ll},ls=${rootLinksResult.ls}`} target="_blank" rel="noopener noreferrer">HA</a>/
          <Link className='result-link' to={`/clexica/${root}`}> CL</Link>
        </div>
      </div>
    );
  }, [wordLinks, rootDefinitionList]);

  return (
    <div className='search-result flex'>
      <div className='word-result p10 flex'>
        <div><span className='arabic-font'>{word}</span></div>
        <div className='alphabetical-result'>
          <div>
            <a className='result-link p5' href={`https://ejtaal.net/aa/#hw4=${wordLinksResult.hw},sg=${wordLinksResult.sg},ll=${wordLinksResult.ll},ls=${wordLinksResult.ls},ha=${wordLinksResult.ha}`} target="_blank" rel="noopener noreferrer">HW(a)</a>/
            <a className='result-link p5' href={`https://ejtaal.net/aa/#sg=${wordLinksResult.sg},hw4=${wordLinksResult.hw},ll=${wordLinksResult.ll},ls=${wordLinksResult.ls},ha=${wordLinksResult.ha}`} target="_blank" rel="noopener noreferrer">SG(a)</a> /
            <Link className='result-link' to={`/clexica/${word}`}> CL(a)</Link>
          </div>
        </div>
      </div>
      <div className='root-result-list p10 flex'>
        {rootList.map(renderRootResult)}
      </div>
    </div>
  );
});

export default ResultItem;